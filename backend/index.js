const express = require('express');
const cors    = require('cors');
const session = require('express-session');
const { Pool } = require('pg');

const app  = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(cors({ origin: ['http://localhost', 'http://localhost:8080'], credentials: true }));
app.use(express.json());
app.use(session({
  secret:            process.env.SESSION_SECRET,
  resave:            false,
  saveUninitialized: false,
  cookie:            { secure: false, maxAge: 1000 * 60 * 60 * 8 }
}));

app.set('db', pool);

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/productos',  require('./routes/productos'));
app.use('/api/clientes',   require('./routes/clientes'));
app.use('/api/proveedores',require('./routes/proveedores'));
app.use('/api/empleados',  require('./routes/empleados'));
app.use('/api/ventas',     require('./routes/ventas'));
app.use('/api/reportes',   require('./routes/reportes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});