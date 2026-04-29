const express = require('express');
const router  = express.Router();

// GET /api/categorias — listar todas
router.get('/', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      'SELECT * FROM categorias ORDER BY id_categoria'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/categorias/:id — obtener una
router.get('/:id', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      'SELECT * FROM categorias WHERE id_categoria = $1',
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/categorias — crear
router.post('/', async (req, res) => {
  const db = req.app.get('db');
  const { nombre, descripcion } = req.body;
  if (!nombre)
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  try {
    const result = await db.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/categorias/:id — actualizar
router.put('/:id', async (req, res) => {
  const db = req.app.get('db');
  const { nombre, descripcion } = req.body;
  if (!nombre)
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  try {
    const result = await db.query(
      `UPDATE categorias
       SET nombre = $1, descripcion = $2
       WHERE id_categoria = $3
       RETURNING *`,
      [nombre, descripcion || null, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/categorias/:id — eliminar
router.delete('/:id', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      'DELETE FROM categorias WHERE id_categoria = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ mensaje: 'Categoría eliminada', categoria: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;