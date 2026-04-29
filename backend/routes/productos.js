const express = require('express');
const router  = express.Router();

// GET /api/productos — listar todos con JOIN a categorias y proveedores
router.get('/', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      `SELECT p.id_producto, p.nombre, p.descripcion,
              p.precio_unitario, p.stock,
              c.nombre AS categoria,
              pr.nombre AS proveedor
       FROM productos p
       JOIN categorias  c  ON p.id_categoria  = c.id_categoria
       JOIN proveedores pr ON p.id_proveedor  = pr.id_proveedor
       ORDER BY p.id_producto`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/productos/stock-bajo — productos con stock menor a 20 (subquery con IN)
router.get('/stock-bajo', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      `SELECT p.nombre, p.stock, c.nombre AS categoria
       FROM productos p
       JOIN categorias c ON p.id_categoria = c.id_categoria
       WHERE p.id_producto IN (
         SELECT id_producto FROM productos WHERE stock < 20
       )
       ORDER BY p.stock ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/productos/:id — obtener uno
router.get('/:id', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      `SELECT p.*, c.nombre AS categoria, pr.nombre AS proveedor
       FROM productos p
       JOIN categorias  c  ON p.id_categoria = c.id_categoria
       JOIN proveedores pr ON p.id_proveedor  = pr.id_proveedor
       WHERE p.id_producto = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/productos — crear
router.post('/', async (req, res) => {
  const db = req.app.get('db');
  const { nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor } = req.body;
  if (!nombre || !precio_unitario || !id_categoria || !id_proveedor)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  try {
    const result = await db.query(
      `INSERT INTO productos
         (nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nombre, descripcion || null, precio_unitario, stock || 0, id_categoria, id_proveedor]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/productos/:id — actualizar
router.put('/:id', async (req, res) => {
  const db = req.app.get('db');
  const { nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor } = req.body;
  if (!nombre || !precio_unitario || !id_categoria || !id_proveedor)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  try {
    const result = await db.query(
      `UPDATE productos
       SET nombre=$1, descripcion=$2, precio_unitario=$3,
           stock=$4, id_categoria=$5, id_proveedor=$6
       WHERE id_producto = $7
       RETURNING *`,
      [nombre, descripcion || null, precio_unitario, stock, id_categoria, id_proveedor, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/productos/:id — eliminar
router.delete('/:id', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      'DELETE FROM productos WHERE id_producto = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado', producto: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;