const express = require('express');
const router  = express.Router();

router.get('/', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query('SELECT * FROM proveedores ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      'SELECT * FROM proveedores WHERE id_proveedor = $1', [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const db = req.app.get('db');
  const { nombre, contacto, telefono, email, direccion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
  try {
    const result = await db.query(
      `INSERT INTO proveedores (nombre, contacto, telefono, email, direccion)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nombre, contacto||null, telefono||null, email||null, direccion||null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const db = req.app.get('db');
  const { nombre, contacto, telefono, email, direccion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
  try {
    const result = await db.query(
      `UPDATE proveedores SET nombre=$1,contacto=$2,telefono=$3,email=$4,direccion=$5
       WHERE id_proveedor=$6 RETURNING *`,
      [nombre, contacto||null, telefono||null, email||null, direccion||null, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      'DELETE FROM proveedores WHERE id_proveedor=$1 RETURNING *', [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json({ mensaje: 'Proveedor eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;