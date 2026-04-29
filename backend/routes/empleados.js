const express = require('express');
const router  = express.Router();

router.get('/', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query('SELECT * FROM empleados ORDER BY apellido, nombre');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const db = req.app.get('db');
  try {
    const result = await db.query(
      'SELECT * FROM empleados WHERE id_empleado = $1', [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;