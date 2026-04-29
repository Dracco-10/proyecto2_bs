-- ============================================================
--  Proyecto 2 - Bases de Datos 1, CC3088
--  Tienda: inventario y ventas
--  DBMS: PostgreSQL 16
--  Usuario: proy2 / secret  (creado via docker-compose env)
-- ============================================================

-- ============================================================
--  TABLAS
-- ============================================================

CREATE TABLE IF NOT EXISTS categorias (
    id_categoria  SERIAL       PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL,
    descripcion   TEXT
);

CREATE TABLE IF NOT EXISTS proveedores (
    id_proveedor  SERIAL       PRIMARY KEY,
    nombre        VARCHAR(150) NOT NULL,
    contacto      VARCHAR(100),
    telefono      VARCHAR(20),
    email         VARCHAR(150),
    direccion     TEXT
);

CREATE TABLE IF NOT EXISTS productos (
    id_producto     SERIAL         PRIMARY KEY,
    nombre          VARCHAR(150)   NOT NULL,
    descripcion     TEXT,
    precio_unitario NUMERIC(10,2)  NOT NULL CHECK (precio_unitario >= 0),
    stock           INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
    id_categoria    INTEGER        NOT NULL REFERENCES categorias(id_categoria),
    id_proveedor    INTEGER        NOT NULL REFERENCES proveedores(id_proveedor)
);

CREATE TABLE IF NOT EXISTS empleados (
    id_empleado       SERIAL       PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    apellido          VARCHAR(100) NOT NULL,
    cargo             VARCHAR(100) NOT NULL,
    telefono          VARCHAR(20),
    email             VARCHAR(150),
    fecha_contratacion DATE
);

CREATE TABLE IF NOT EXISTS clientes (
    id_cliente  SERIAL       PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    apellido    VARCHAR(100) NOT NULL,
    telefono    VARCHAR(20),
    email       VARCHAR(150),
    direccion   TEXT
);

CREATE TABLE IF NOT EXISTS ventas (
    id_venta    SERIAL          PRIMARY KEY,
    fecha       TIMESTAMP       NOT NULL DEFAULT NOW(),
    total       NUMERIC(12,2)   NOT NULL CHECK (total >= 0),
    id_cliente  INTEGER         NOT NULL REFERENCES clientes(id_cliente),
    id_empleado INTEGER         NOT NULL REFERENCES empleados(id_empleado)
);

CREATE TABLE IF NOT EXISTS detalle_venta (
    id_detalle      SERIAL        PRIMARY KEY,
    id_venta        INTEGER       NOT NULL REFERENCES ventas(id_venta) ON DELETE CASCADE,
    id_producto     INTEGER       NOT NULL REFERENCES productos(id_producto),
    cantidad        INTEGER       NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario    SERIAL       PRIMARY KEY,
    username      VARCHAR(80)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol           VARCHAR(50)  NOT NULL DEFAULT 'vendedor' CHECK (rol IN ('admin','vendedor')),
    id_empleado   INTEGER      UNIQUE REFERENCES empleados(id_empleado)
);

-- ============================================================
--  ÍNDICES
--  Justificación:
--    1. productos(id_categoria)  → consultas frecuentes de
--       productos por categoría (reportes, filtros en UI).
--    2. ventas(fecha)            → reportes de ventas por rango
--       de fechas; sin índice hace seq-scan sobre tabla grande.
--    3. detalle_venta(id_venta)  → al cargar el detalle de una
--       venta se filtra siempre por id_venta; acelera JOINs.
--    4. productos(nombre)        → búsquedas de productos por
--       nombre desde la UI (ILIKE / =).
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_productos_categoria
    ON productos(id_categoria);

CREATE INDEX IF NOT EXISTS idx_ventas_fecha
    ON ventas(fecha);

CREATE INDEX IF NOT EXISTS idx_detalle_venta_id_venta
    ON detalle_venta(id_venta);

CREATE INDEX IF NOT EXISTS idx_productos_nombre
    ON productos(nombre);

-- ============================================================
--  VIEW
--  Vista utilizada por el backend para el reporte de ventas.
--  Muestra cada línea de venta con datos desnormalizados
--  listos para la UI, sin que el frontend tenga que hacer JOINs.
-- ============================================================

CREATE OR REPLACE VIEW vista_detalle_ventas AS
SELECT
    v.id_venta,
    v.fecha,
    c.nombre    || ' ' || c.apellido   AS cliente,
    e.nombre    || ' ' || e.apellido   AS empleado,
    p.nombre                           AS producto,
    cat.nombre                         AS categoria,
    dv.cantidad,
    dv.precio_unitario,
    (dv.cantidad * dv.precio_unitario) AS subtotal,
    v.total
FROM ventas v
JOIN clientes      c   ON v.id_cliente  = c.id_cliente
JOIN empleados     e   ON v.id_empleado = e.id_empleado
JOIN detalle_venta dv  ON v.id_venta    = dv.id_venta
JOIN productos     p   ON dv.id_producto = p.id_producto
JOIN categorias    cat ON p.id_categoria = cat.id_categoria;
