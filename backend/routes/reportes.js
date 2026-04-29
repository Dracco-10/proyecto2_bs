const express = require('express');
const router  = express.Router();

// GET /api/reportes/ventas-detalle — usa la VIEW vista_detalle_ventas
router.get('/ventas-detalle', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      `SELECT * FROM vista_detalle_ventas ORDER BY fecha DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reportes/ventas-por-empleado
// GROUP BY + HAVING + funciones de agregación
router.get('/ventas-por-empleado', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      `SELECT e.nombre || ' ' || e.apellido AS empleado,
              COUNT(v.id_venta)             AS total_ventas,
              SUM(v.total)                  AS monto_total,
              AVG(v.total)                  AS promedio_venta,
              MAX(v.total)                  AS venta_mayor
       FROM ventas v
       JOIN empleados e ON v.id_empleado = e.id_empleado
       GROUP BY e.id_empleado, e.nombre, e.apellido
       HAVING COUNT(v.id_venta) > 0
       ORDER BY monto_total DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reportes/top-productos
// CTE (WITH) — top 10 productos más vendidos
router.get('/top-productos', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      `WITH resumen_productos AS (
         SELECT p.id_producto,
                p.nombre                      AS producto,
                c.nombre                      AS categoria,
                SUM(dv.cantidad)              AS unidades_vendidas,
                SUM(dv.cantidad * dv.precio_unitario) AS ingresos_totales
         FROM detalle_venta dv
         JOIN productos   p ON dv.id_producto  = p.id_producto
         JOIN categorias  c ON p.id_categoria  = c.id_categoria
         GROUP BY p.id_producto, p.nombre, c.nombre
       )
       SELECT * FROM resumen_productos
       ORDER BY unidades_vendidas DESC
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reportes/clientes-activos
// Subquery con EXISTS — clientes que tienen al menos 1 venta
router.get('/clientes-activos', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      `SELECT c.id_cliente,
              c.nombre || ' ' || c.apellido AS cliente,
              c.email, c.telefono
       FROM clientes c
       WHERE EXISTS (
         SELECT 1 FROM ventas v WHERE v.id_cliente = c.id_cliente
       )
       ORDER BY c.apellido`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reportes/ventas-por-categoria
// GROUP BY con JOIN a 3 tablas
router.get('/ventas-por-categoria', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      `SELECT cat.nombre                            AS categoria,
              COUNT(DISTINCT v.id_venta)            AS num_ventas,
              SUM(dv.cantidad)                      AS unidades,
              SUM(dv.cantidad * dv.precio_unitario) AS ingresos
       FROM detalle_venta dv
       JOIN productos  p   ON dv.id_producto  = p.id_producto
       JOIN categorias cat ON p.id_categoria  = cat.id_categoria
       JOIN ventas     v   ON dv.id_venta     = v.id_venta
       GROUP BY cat.id_categoria, cat.nombre
       ORDER BY ingresos DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;