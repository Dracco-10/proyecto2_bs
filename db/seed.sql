-- ============================================================
--  Proyecto 2 - Datos de prueba
--  Tienda "Distribuidora El Progreso"
--  Contexto: abarrotería / distribuidora guatemalteca
-- ============================================================

-- ============================================================
--  CATEGORIAS  (10 registros)
-- ============================================================
INSERT INTO categorias (nombre, descripcion) VALUES
('Lácteos',         'Leches, quesos, cremas y yogures'),
('Bebidas',         'Aguas, jugos, gaseosas y bebidas energéticas'),
('Granos y cereales','Frijoles, arroz, maíz y avena'),
('Abarrotes secos', 'Pastas, harinas, azúcar y sal'),
('Enlatados',       'Conservas, atunes y vegetales en lata'),
('Carnes frías',    'Embutidos, jamones y salchichas'),
('Higiene personal','Jabones, champús y desodorantes'),
('Limpieza hogar',  'Detergentes, desinfectantes y esponjas'),
('Snacks y dulces', 'Galletas, frituras, chocolates y caramelos'),
('Panadería',       'Pan blanco, pan dulce y tortillas de harina');

-- ============================================================
--  PROVEEDORES  (10 registros)
-- ============================================================
INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
('Distribuidora Lácteos del Sur',   'Marco Salazar',    '2222-0101', 'ventas@lacteossur.com.gt',    'Zona 12, Guatemala City'),
('Bebidas Guatemala S.A.',          'Luisa Portillo',   '2233-1122', 'lportillo@bebidasgt.com',     'Zona 1, Guatemala City'),
('Granos del Altiplano',            'Pedro Caal',       '7755-3344', 'pedrocaal@granosalt.gt',      'Totonicapán, Guatemala'),
('Molinos El Quetzal',              'Ana Bethancourt',  '2244-5566', 'abethancourt@molinoseq.com',  'Villa Nueva, Guatemala'),
('Conservas del Pacífico',          'Carlos Morejón',   '2255-7788', 'cmorejo@conspacifico.com.gt', 'Escuintla, Guatemala'),
('Embutidos San Jorge',             'Diana Recinos',    '2266-9900', 'drecinos@sanjorge.com.gt',    'Mixco, Guatemala'),
('Distribuidora Higiene Total',     'Rodrigo Cifuentes','2277-1234', 'rcifuentes@higietotal.gt',    'Zona 7, Guatemala City'),
('Limpieza Express GT',             'Marta Nájera',     '2288-5678', 'mnajera@limpiezaexpress.gt',  'Zona 11, Guatemala City'),
('Snacks y Más S.A.',               'Felipe Monterroso','2299-9012', 'fmonterroso@snacksymas.gt',   'Zona 18, Guatemala City'),
('Panificadora San Antonio',        'Rosa Pineda',      '4411-3456', 'rpineda@pansanantonio.gt',    'Chimaltenango, Guatemala');

-- ============================================================
--  EMPLEADOS  (10 registros)
-- ============================================================
INSERT INTO empleados (nombre, apellido, cargo, telefono, email, fecha_contratacion) VALUES
('Jorge',    'Ramírez',    'Administrador',       '5501-1111', 'jramirez@tienda.gt',    '2021-03-15'),
('Andrea',   'López',      'Vendedor',            '5502-2222', 'alopez@tienda.gt',      '2022-01-10'),
('Carlos',   'Ajú',        'Vendedor',            '5503-3333', 'caju@tienda.gt',        '2022-04-20'),
('Sofía',    'Coyoy',      'Cajera',              '5504-4444', 'scoyoy@tienda.gt',      '2023-02-01'),
('Mario',    'Xocop',      'Bodeguero',           '5505-5555', 'mxocop@tienda.gt',      '2021-11-05'),
('Valeria',  'Hernández',  'Vendedor',            '5506-6666', 'vhernandez@tienda.gt',  '2023-06-15'),
('Diego',    'Tahual',     'Cajero',              '5507-7777', 'dtahual@tienda.gt',     '2022-09-01'),
('Patricia', 'Morales',    'Supervisora',         '5508-8888', 'pmorales@tienda.gt',    '2020-08-12'),
('Héctor',   'Samayoa',    'Vendedor',            '5509-9999', 'hsamayoa@tienda.gt',    '2024-01-20'),
('Luisa',    'Chitay',     'Vendedor',            '5510-0000', 'lchitay@tienda.gt',     '2024-03-10');

-- ============================================================
--  CLIENTES  (30 registros)
-- ============================================================
INSERT INTO clientes (nombre, apellido, telefono, email, direccion) VALUES
('Juan',      'Pérez',       '5520-0001', 'jperez@mail.com',       'Zona 3, Guatemala City'),
('María',     'González',    '5520-0002', 'mgonzalez@mail.com',    'Zona 6, Guatemala City'),
('Roberto',   'Chiriz',      '5520-0003', 'rchiriz@mail.com',      'Mixco, Guatemala'),
('Elena',     'Cuxum',       '5520-0004', 'ecuxum@mail.com',       'Villa Nueva, Guatemala'),
('Fernando',  'Batz',        '5520-0005', 'fbatz@mail.com',        'Zona 12, Guatemala City'),
('Carmen',    'Ajanel',      '5520-0006', 'cajanel@mail.com',      'San Lucas, Guatemala'),
('Adrián',    'Xitumul',     '5520-0007', 'axitumul@mail.com',     'Zona 5, Guatemala City'),
('Lorena',    'Tuj',         '5520-0008', 'ltuj@mail.com',         'Chimaltenango, Guatemala'),
('Oscar',     'Chox',        '5520-0009', 'ochox@mail.com',        'Zona 1, Guatemala City'),
('Beatriz',   'Ixcoy',       '5520-0010', 'bixcoy@mail.com',       'Zona 15, Guatemala City'),
('Samuel',    'Pérez',       '5520-0011', 'sperez2@mail.com',      'Zona 7, Guatemala City'),
('Diana',     'Caal',        '5520-0012', 'dcaal@mail.com',        'Cobán, Guatemala'),
('Emilio',    'Raxón',       '5520-0013', 'eraxon@mail.com',       'Zona 11, Guatemala City'),
('Paola',     'Tum',         '5520-0014', 'ptum@mail.com',         'Petén, Guatemala'),
('Gustavo',   'Quiché',      '5520-0015', 'gquiche@mail.com',      'Quetzaltenango, Guatemala'),
('Rosa',      'Cholotío',    '5520-0016', 'rcholotio@mail.com',    'Zona 18, Guatemala City'),
('Miguel',    'Mux',         '5520-0017', 'mmux@mail.com',         'Amatitlán, Guatemala'),
('Katia',     'Sajquim',     '5520-0018', 'ksajquim@mail.com',     'Zona 2, Guatemala City'),
('Jesús',     'Canil',       '5520-0019', 'jcanil@mail.com',       'Escuintla, Guatemala'),
('Claudia',   'Bixcul',      '5520-0020', 'cbixcul@mail.com',      'Zona 10, Guatemala City'),
('Andrés',    'Cux',         '5520-0021', 'acux@mail.com',         'Zona 4, Guatemala City'),
('Miriam',    'Bocel',       '5520-0022', 'mbocel@mail.com',       'Totonicapán, Guatemala'),
('Rodrigo',   'Tox',         '5520-0023', 'rtox@mail.com',         'Villa Canales, Guatemala'),
('Sandra',    'Ixcotoyac',   '5520-0024', 'sixcotoyac@mail.com',   'Zona 9, Guatemala City'),
('Pablo',     'Chajón',      '5520-0025', 'pchajon@mail.com',      'Zona 13, Guatemala City'),
('Nora',      'Baquiax',     '5520-0026', 'nbaquiax@mail.com',     'Sololá, Guatemala'),
('Tomás',     'Sunun',       '5520-0027', 'tsunun@mail.com',       'Zona 8, Guatemala City'),
('Gloria',    'Chitay',      '5520-0028', 'gchitay@mail.com',      'San Marcos, Guatemala'),
('Rubén',     'Panjoj',      '5520-0029', 'rpanjoj@mail.com',      'Zona 6, Guatemala City'),
('Verónica',  'Maldonado',   '5520-0030', 'vmaldonado@mail.com',   'Zona 16, Guatemala City');

-- ============================================================
--  PRODUCTOS  (30 registros)
-- ============================================================
INSERT INTO productos (nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor) VALUES
-- Lácteos (cat 1, prov 1)
('Leche entera 1L',         'Leche pasteurizada entera', 11.50,  120, 1, 1),
('Queso fresco 500g',       'Queso blanco fresco',       22.00,   80, 1, 1),
('Crema fresca 250ml',      'Crema de vaca pasteurizada',9.50,    95, 1, 1),
-- Bebidas (cat 2, prov 2)
('Agua pura 600ml',         'Agua purificada sin gas',   3.50,   200, 2, 2),
('Jugo de naranja 1L',      'Jugo natural de naranja',   14.00,   75, 2, 2),
('Gaseosa cola 355ml',      'Bebida gaseosa sabor cola', 5.50,   150, 2, 2),
-- Granos (cat 3, prov 3)
('Frijoles negros 1lb',     'Frijoles negros secos',     7.00,   180, 3, 3),
('Arroz blanco 5lb',        'Arroz blanco extra',        25.00,  110, 3, 3),
('Maíz amarillo 2lb',       'Maíz amarillo seco',        8.50,   140, 3, 3),
-- Abarrotes secos (cat 4, prov 4)
('Azúcar blanca 2lb',       'Azúcar refinada',           10.00,  130, 4, 4),
('Harina de trigo 2lb',     'Harina de trigo todo uso',  12.00,   90, 4, 4),
('Sal yodada 1lb',          'Sal de mesa yodada',        3.00,   200, 4, 4),
-- Enlatados (cat 5, prov 5)
('Atún en agua 170g',       'Atún en agua sin sodio',    9.00,   160, 5, 5),
('Vegetales mixtos 400g',   'Mix de vegetales enlatados',8.50,   100, 5, 5),
('Frijoles negros lata 400g','Frijoles cocidos en lata', 9.50,    85, 5, 5),
-- Carnes frías (cat 6, prov 6)
('Salchichas de pollo 454g','Salchichas de pollo ahumado',22.00,  70, 6, 6),
('Jamón de pierna 250g',    'Jamón cocido de pierna',    18.50,   65, 6, 6),
('Mortadela 250g',          'Mortadela con aceitunas',   15.00,   80, 6, 6),
-- Higiene personal (cat 7, prov 7)
('Jabón de baño 3pack',     'Pack de 3 jabones de baño', 14.00,  110, 7, 7),
('Champú 400ml',            'Champú para todo tipo cabello',28.00,90, 7, 7),
('Desodorante barra 50g',   'Desodorante antitranspirante',19.50,100, 7, 7),
-- Limpieza (cat 8, prov 8)
('Detergente en polvo 1kg', 'Detergente multiusos',      24.00,   85, 8, 8),
('Cloro 1L',                'Cloro desinfectante',        9.00,  120, 8, 8),
('Esponjas x3',             'Esponjas doble cara',        6.50,  150, 8, 8),
-- Snacks (cat 9, prov 9)
('Papas fritas 90g',        'Papas fritas clásicas',      7.00,  200, 9, 9),
('Galletas surtidas 350g',  'Surtido de galletas dulces',18.00,  140, 9, 9),
('Chocolate 100g',          'Chocolate de leche',        12.00,  120, 9, 9),
-- Panadería (cat 10, prov 10)
('Pan blanco de molde',     'Pan blanco rebanado 680g',  18.00,   60, 10, 10),
('Pan dulce 12 unidades',   'Surtido de pan dulce',      15.00,   50, 10, 10),
('Tortillas de harina x10', 'Tortillas de harina 30cm',  12.00,   70, 10, 10);

-- ============================================================
--  USUARIOS  (para los 10 empleados)
--  Contraseñas hasheadas con bcrypt (cost 10)
--  Texto plano: admin123 para admin, vendedor123 para vendedores
-- ============================================================
INSERT INTO usuarios (username, password_hash, rol, id_empleado) VALUES
('jramirez',   '$2b$10$YgEpE9qJxlvGAp2C8O.hTOJeVaAWPyMevYPJUwhuEsHJCOzpPihqm', 'admin',    1),
('alopez',     '$2b$10$YgEpE9qJxlvGAp2C8O.hTOJeVaAWPyMevYPJUwhuEsHJCOzpPihqm', 'vendedor', 2),
('caju',       '$2b$10$YgEpE9qJxlvGAp2C8O.hTOJeVaAWPyMevYPJUwhuEsHJCOzpPihqm', 'vendedor', 3),
('scoyoy',     '$2b$10$YgEpE9qJxlvGAp2C8O.hTOJeVaAWPyMevYPJUwhuEsHJCOzpPihqm', 'vendedor', 4),
('mxocop',     '$2b$10$YgEpE9qJxlvGAp2C8O.hTOJeVaAWPyMevYPJUwhuEsHJCOzpPihqm', 'vendedor', 5),
('vhernandez', '$2b$10$YgEpE9qJxlvGAp2C8O.hTOJeVaAWPyMevYPJUwhuEsHJCOzpPihqm', 'vendedor', 6),
('dtahual',    '$2b$10$YgEpE9qJxlvGAp2C8O.hTOJeVaAWPyMevYPJUwhuEsHJCOzpPihqm', 'vendedor', 7),
('pmorales',   '$2b$10$YgEpE9qJxlvGAp2C8O.hTOJeVaAWPyMevYPJUwhuEsHJCOzpPihqm', 'admin',    8),
('hsamayoa',   '$2b$10$YgEpE9qJxlvGAp2C8O.hTOJeVaAWPyMevYPJUwhuEsHJCOzpPihqm', 'vendedor', 9),
('lchitay',    '$2b$10$YgEpE9qJxlvGAp2C8O.hTOJeVaAWPyMevYPJUwhuEsHJCOzpPihqm', 'vendedor',10);

-- ============================================================
--  VENTAS y DETALLE_VENTA  (30 ventas con múltiples detalles)
-- ============================================================
INSERT INTO ventas (fecha, total, id_cliente, id_empleado) VALUES
('2026-01-05 08:30:00',  67.50,  1,  2),
('2026-01-06 09:15:00',  43.00,  2,  3),
('2026-01-07 10:00:00',  88.00,  3,  4),
('2026-01-08 11:20:00',  55.50,  4,  2),
('2026-01-09 13:45:00',  72.00,  5,  6),
('2026-01-10 14:30:00',  39.00,  6,  3),
('2026-01-11 09:00:00',  95.00,  7,  9),
('2026-01-12 10:30:00',  61.00,  8,  2),
('2026-01-13 11:00:00',  48.50,  9,  4),
('2026-01-14 15:00:00', 120.00, 10,  6),
('2026-01-15 08:00:00',  33.50, 11,  3),
('2026-01-16 12:30:00',  77.00, 12,  9),
('2026-01-17 09:45:00',  52.00, 13,  2),
('2026-01-18 14:00:00',  64.00, 14,  4),
('2026-01-19 10:15:00',  89.50, 15,  6),
('2026-02-01 08:30:00',  41.00, 16,  2),
('2026-02-03 11:00:00',  58.00, 17,  3),
('2026-02-05 13:00:00',  73.50, 18,  9),
('2026-02-07 09:30:00',  46.00, 19,  4),
('2026-02-09 14:45:00',  99.00, 20,  6),
('2026-02-11 10:00:00',  37.00, 21,  2),
('2026-02-13 12:00:00',  82.00, 22,  3),
('2026-02-15 08:45:00',  55.00, 23,  9),
('2026-02-17 11:30:00',  68.50, 24,  4),
('2026-02-19 15:30:00', 110.00, 25,  6),
('2026-03-01 09:00:00',  45.00, 26,  2),
('2026-03-03 10:30:00',  63.50, 27,  3),
('2026-03-05 14:00:00',  79.00, 28,  9),
('2026-03-07 09:15:00',  50.00, 29,  4),
('2026-03-09 11:45:00',  92.00, 30,  6);

-- detalle de ventas (múltiples líneas por venta)
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES
(1,  1, 2, 11.50),(1,  7, 3,  7.00),(1, 25, 2,  7.00),(1, 12, 2,  3.00),
(2,  4, 4,  3.50),(2, 10, 2, 10.00),(2,  9, 1,  8.50),
(3,  2, 1, 22.00),(3, 16, 2, 22.00),(3,  8, 1, 25.00),(3, 22, 1, 24.00),
(4,  5, 1, 14.00),(4, 13, 3,  9.00),(4, 24, 2,  6.50),
(5,  6, 4,  5.50),(5, 19, 1, 14.00),(5, 20, 1, 28.00),(5, 11, 1, 12.00),
(6,  4, 6,  3.50),(6, 12, 4,  3.00),(6,  7, 2,  7.00),
(7,  2, 2, 22.00),(7,  3, 2,  9.50),(7, 17, 1, 18.50),(7, 27, 1, 12.00),
(8,  8, 1, 25.00),(8,  1, 2, 11.50),(8, 26, 1, 18.00),
(9, 13, 2,  9.00),(9, 14, 1,  8.50),(9, 15, 2,  9.50),(9, 12, 2,  3.00),
(10, 20, 1, 28.00),(10, 21, 2, 19.50),(10, 19, 3, 14.00),
(11, 25, 2,  7.00),(11,  9, 2,  8.50),(11,  4, 2,  3.50),
(12, 22, 1, 24.00),(12, 16, 2, 22.00),(12,  5, 1, 14.00),
(13, 11, 2, 12.00),(13, 10, 2, 10.00),(13, 23, 3,  9.00),
(14, 18, 2, 15.00),(14,  3, 2,  9.50),(14,  7, 3,  7.00),
(15,  2, 1, 22.00),(15,  8, 1, 25.00),(15, 28, 1, 18.00),(15, 20, 1, 28.00),
(16, 24, 4,  6.50),(16, 12, 3,  3.00),(16,  4, 3,  3.50),
(17, 29, 1, 15.00),(17,  1, 2, 11.50),(17, 13, 2,  9.00),(17, 25, 1,  7.00),
(18, 17, 1, 18.50),(18, 16, 2, 22.00),(18,  5, 1, 14.00),
(19, 12, 4,  3.00),(19,  7, 4,  7.00),(19,  9, 2,  8.50),
(20, 20, 1, 28.00),(20, 21, 2, 19.50),(20, 22, 1, 24.00),(20, 19, 1, 14.00),
(21, 25, 2,  7.00),(21,  6, 2,  5.50),(21, 10, 2, 10.00),
(22, 15, 2,  9.50),(22,  2, 2, 22.00),(22, 26, 1, 18.00),(22, 11, 2, 12.00),
(23, 13, 3,  9.00),(23, 14, 2,  8.50),(23,  4, 3,  3.50),
(24, 17, 1, 18.50),(24, 18, 1, 15.00),(24, 27, 1, 12.00),(24,  8, 1, 25.00),
(25, 19, 2, 14.00),(25, 20, 2, 19.50),(25, 22, 2, 24.00),(25, 21, 1, 19.50),
(26, 30, 1, 12.00),(26, 29, 1, 15.00),(26, 12, 3,  3.00),(26,  7, 2,  7.00),
(27, 28, 1, 18.00),(27,  5, 1, 14.00),(27, 13, 2,  9.00),(27,  1, 2, 11.50),
(28, 16, 2, 22.00),(28, 17, 1, 18.50),(28, 18, 1, 15.00),(28, 25, 2,  7.00),
(29, 10, 2, 10.00),(29, 11, 1, 12.00),(29, 23, 2,  9.00),(29,  4, 3,  3.50),
(30, 20, 1, 28.00),(30, 22, 1, 24.00),(30, 21, 2, 19.50),(30, 27, 1, 12.00);
