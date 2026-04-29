const express = require('express');
const router  = express.Router();

// GET /api/ventas — listar todas con JOIN
router.get('/', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      `SELECT v.id_venta, v.fecha, v.total,
              c.nombre || ' ' || c.apellido AS cliente,
              e.nombre || ' ' || e.apellido AS empleado
       FROM ventas v
       JOIN clientes  c ON v.id_cliente  = c.id_cliente
       JOIN empleados e ON v.id_empleado = e.id_empleado
       ORDER BY v.fecha DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ventas/:id — detalle de una venta con JOIN
router.get('/:id', async (req, res) => {
  const db = req.app.get('db');
  try {
    const venta = await db.query(
      `SELECT v.*, c.nombre || ' ' || c.apellido AS cliente,
              e.nombre || ' ' || e.apellido AS empleado
       FROM ventas v
       JOIN clientes  c ON v.id_cliente  = c.id_cliente
       JOIN empleados e ON v.id_empleado = e.id_empleado
       WHERE v.id_venta = $1`,
      [req.params.id]
    );
    if (venta.rows.length === 0)
      return res.status(404).json({ error: 'Venta no encontrada' });

    const detalle = await db.query(
      `SELECT dv.cantidad, dv.precio_unitario,
              (dv.cantidad * dv.precio_unitario) AS subtotal,
              p.nombre AS producto
       FROM detalle_venta dv
       JOIN productos p ON dv.id_producto = p.id_producto
       WHERE dv.id_venta = $1`,
      [req.params.id]
    );
    res.json({ ...venta.rows[0], detalle: detalle.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ventas — registrar venta con transacción explícita + ROLLBACK
router.post('/', async (req, res) => {
  const db     = req.app.get('db');
  const client = await db.connect();
  const { id_cliente, id_empleado, items } = req.body;
  // items: [{ id_producto, cantidad }]

  if (!id_cliente || !id_empleado || !items || items.length === 0)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });

  try {
    await client.query('BEGIN');

    let total = 0;
    const detalles = [];

    for (const item of items) {
      // Verificar stock con SELECT FOR UPDATE (bloquea la fila)
      const prod = await client.query(
        'SELECT precio_unitario, stock FROM productos WHERE id_producto = $1 FOR UPDATE',
        [item.id_producto]
      );

      if (prod.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: `Producto ${item.id_producto} no existe` });
      }

      const { precio_unitario, stock } = prod.rows[0];

      if (stock < item.cantidad) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Stock insuficiente para producto ${item.id_producto}. Stock actual: ${stock}`
        });
      }

      const subtotal = precio_unitario * item.cantidad;
      total += subtotal;
      detalles.push({ id_producto: item.id_producto, cantidad: item.cantidad, precio_unitario, subtotal });
    }

    // Insertar cabecera de venta
    const ventaResult = await client.query(
      `INSERT INTO ventas (fecha, total, id_cliente, id_empleado)
       VALUES (NOW(), $1, $2, $3) RETURNING *`,
      [total, id_cliente, id_empleado]
    );
    const id_venta = ventaResult.rows[0].id_venta;

    // Insertar detalle y descontar stock
    for (const d of detalles) {
      await client.query(
        `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [id_venta, d.id_producto, d.cantidad, d.precio_unitario]
      );

      await client.query(
        'UPDATE productos SET stock = stock - $1 WHERE id_producto = $2',
        [d.cantidad, d.id_producto]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ mensaje: 'Venta registrada', id_venta, total });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Error al registrar venta: ' + err.message });
  } finally {
    client.release();
  }
});

module.exports = router;