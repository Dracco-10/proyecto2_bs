const express = require('express');
const bcrypt  = require('bcrypt');
const router  = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const db = req.app.get('db');
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });

  try {
    const result = await db.query(
      `SELECT u.*, e.nombre || ' ' || e.apellido AS nombre_completo
       FROM usuarios u
       JOIN empleados e ON u.id_empleado = e.id_empleado
       WHERE u.username = $1`,
      [username]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const usuario = result.rows[0];
    const valido  = await bcrypt.compare(password, usuario.password_hash);

    if (!valido)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    req.session.usuario = {
      id_usuario:     usuario.id_usuario,
      username:       usuario.username,
      rol:            usuario.rol,
      nombre_completo: usuario.nombre_completo
    };

    res.json({
      mensaje: 'Login exitoso',
      usuario: req.session.usuario
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
    res.json({ mensaje: 'Sesión cerrada' });
  });
});

// GET /api/auth/me — verificar sesión activa
router.get('/me', (req, res) => {
  if (!req.session.usuario)
    return res.status(401).json({ error: 'No hay sesión activa' });
  res.json(req.session.usuario);
});

module.exports = router;