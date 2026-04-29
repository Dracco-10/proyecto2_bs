const express = require('express');
const router  = express.Router();

// GET /api/clientes — listar todos
router.get('/', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      'SELECT * FROM clientes ORDER BY apellido, nombre'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/clientes/:id — obtener uno
router.get('/:id', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      'SELECT * FROM clientes WHERE id_cliente = $1',
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clientes — crear
router.post('/', async (req, res) => {
  const db = req.app.get('db');
  const { nombre, apellido, telefono, email, direccion } = req.body;
  if (!nombre || !apellido)
    return res.status(400).json({ error: 'Nombre y apellido son obligatorios' });
  try {
    const result = await db.query(
      `INSERT INTO clientes (nombre, apellido, telefono, email, direccion)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, apellido, telefono || null, email || null, direccion || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/clientes/:id — actualizar
router.put('/:id', async (req, res) => {
  const db = req.app.get('db');
  const { nombre, apellido, telefono, email, direccion } = req.body;
  if (!nombre || !apellido)
    return res.status(400).json({ error: 'Nombre y apellido son obligatorios' });
  try {
    const result = await db.query(
      `UPDATE clientes
       SET nombre=$1, apellido=$2, telefono=$3, email=$4, direccion=$5
       WHERE id_cliente = $6 RETURNING *`,
      [nombre, apellido, telefono || null, email || null, direccion || null, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/clientes/:id — eliminar
router.delete('/:id', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      'DELETE FROM clientes WHERE id_cliente = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente eliminado', cliente: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;