const API = '/api';

async function apiFetch(url, opts = {}) {
  const res = await fetch(API + url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
  return data;
}

function toast(msg, tipo = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast toast-${tipo}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}

function q(sel) { return document.querySelector(sel); }
function formatQ(n) { return 'Q ' + parseFloat(n).toFixed(2); }
function formatFecha(f) { return new Date(f).toLocaleDateString('es-GT', { day:'2-digit', month:'short', year:'numeric' }); }

const Modal = {
  abrir(titulo, html) {
    q('#modal-titulo').textContent = titulo;
    q('#modal-cuerpo').innerHTML = html;
    q('#modal').classList.remove('hidden');
  },
  cerrar() {
    q('#modal').classList.add('hidden');
    q('#modal-cuerpo').innerHTML = '';
  }
};

function mostrarSeccion(nombre) {
  document.querySelectorAll('.section').forEach(s => {
    s.style.display = 'none';
    s.classList.add('hidden');
  });
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const sec = document.getElementById('section-' + nombre);
  if (sec) {
    sec.classList.remove('hidden');
    sec.style.display = 'block';
  }

  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.dataset.section === nombre) n.classList.add('active');
  });

  if (nombre === 'dashboard') Dashboard.cargar();
  if (nombre === 'productos') Productos.cargar();
  if (nombre === 'clientes')  Clientes.cargar();
  if (nombre === 'ventas')    Ventas.cargar();
  if (nombre === 'reportes')  Reportes.cargar('top-productos', q('.tab'));
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    mostrarSeccion(item.dataset.section);
  });
});

const Auth = {
  async login() {
    const username = q('#login-username').value.trim();
    const password = q('#login-password').value;
    const errEl   = q('#login-error');
    errEl.classList.add('hidden');
    try {
      const data = await apiFetch('/auth/login', { method: 'POST', body: { username, password } });
      q('#user-name').textContent   = data.usuario.nombre_completo;
      q('#user-avatar').textContent = data.usuario.nombre_completo[0].toUpperCase();
      q('#login-page').classList.add('hidden');
      q('#app').classList.remove('hidden');
      mostrarSeccion('dashboard');
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
    }
  },

  async logout() {
    await apiFetch('/auth/logout', { method: 'POST' });
    q('#app').classList.add('hidden');
    q('#login-page').classList.remove('hidden');
    q('#login-username').value = '';
    q('#login-password').value = '';
  },

  async verificar() {
    try {
      const u = await apiFetch('/auth/me');
      q('#user-name').textContent   = u.nombre_completo;
      q('#user-avatar').textContent = u.nombre_completo[0].toUpperCase();
      q('#login-page').classList.add('hidden');
      q('#app').classList.remove('hidden');
      mostrarSeccion('dashboard');
    } catch {
      // no hay sesión, mostrar login
    }
  }
};

q('#login-form').addEventListener('submit', e => { e.preventDefault(); Auth.login(); });
q('#btn-logout').addEventListener('click', () => Auth.logout());

const Dashboard = {
  async cargar() {
    try {
      const [productos, clientes, ventas, stockBajo] = await Promise.all([
        apiFetch('/productos'),
        apiFetch('/clientes'),
        apiFetch('/ventas'),
        apiFetch('/productos/stock-bajo')
      ]);

      const totalVentas = ventas.reduce((s, v) => s + parseFloat(v.total), 0);

      q('#stats-grid').innerHTML = `
        <div class="stat-card">
          <div class="stat-label">Productos</div>
          <div class="stat-value accent">${productos.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Clientes</div>
          <div class="stat-value accent">${clientes.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Ventas registradas</div>
          <div class="stat-value green">${ventas.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Ingresos totales</div>
          <div class="stat-value amber">${formatQ(totalVentas)}</div>
        </div>
      `;

      q('#stock-bajo-list').innerHTML = stockBajo.slice(0, 6).map(p => `
        <div class="dash-row">
          <span>${p.nombre}</span>
          <span class="stock-badge">${p.stock} unid.</span>
        </div>`).join('') || '<p style="color:var(--text2);font-size:.85rem">Sin productos con stock bajo.</p>';

      q('#ultimas-ventas-list').innerHTML = ventas.slice(0, 6).map(v => `
        <div class="dash-row">
          <span>${v.cliente}</span>
          <span class="td-mono" style="color:var(--green)">${formatQ(v.total)}</span>
        </div>`).join('');
    } catch (err) {
      toast('Error al cargar dashboard: ' + err.message, 'error');
    }
  }
};

const Productos = {
  datos: [],

  async cargar() {
    try {
      this.datos = await apiFetch('/productos');
      const tbody = q('#tabla-productos tbody');
      tbody.innerHTML = this.datos.map(p => `
        <tr>
          <td class="td-mono">${p.id_producto}</td>
          <td>${p.nombre}</td>
          <td>${p.categoria}</td>
          <td>${p.proveedor}</td>
          <td class="td-mono">${formatQ(p.precio_unitario)}</td>
          <td>
            <span style="color:${p.stock < 20 ? 'var(--red)' : 'var(--green)'}">
              ${p.stock}
            </span>
          </td>
          <td class="td-actions">
            <button class="btn btn-secondary btn-sm" onclick="Productos.abrirEditar(${p.id_producto})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="Productos.eliminar(${p.id_producto}, '${p.nombre.replace(/'/g,"\\'")}')">Borrar</button>
          </td>
        </tr>`).join('');
    } catch (err) {
      toast('Error al cargar productos: ' + err.message, 'error');
    }
  },

  async getCats() { return apiFetch('/categorias'); },
  async getProv() { return apiFetch('/proveedores'); },

  async abrirCrear() {
    const [cats, provs] = await Promise.all([this.getCats(), this.getProv()]);
    Modal.abrir('Nuevo producto', this.formulario(null, cats, provs));
  },

  async abrirEditar(id) {
    const [prod, cats, provs] = await Promise.all([
      apiFetch('/productos/' + id),
      this.getCats(),
      this.getProv()
    ]);
    Modal.abrir('Editar producto', this.formulario(prod, cats, provs));
  },

  formulario(p, cats, provs) {
    return `
      <div class="form-group"><label>Nombre</label>
        <input id="p-nombre" value="${p?.nombre||''}">
      </div>
      <div class="form-group"><label>Descripción</label>
        <textarea id="p-desc">${p?.descripcion||''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Precio (Q)</label>
          <input id="p-precio" type="number" step="0.01" value="${p?.precio_unitario||''}">
        </div>
        <div class="form-group"><label>Stock</label>
          <input id="p-stock" type="number" value="${p?.stock||0}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Categoría</label>
          <select id="p-cat">
            ${cats.map(c => `<option value="${c.id_categoria}" ${p?.id_categoria==c.id_categoria?'selected':''}>${c.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Proveedor</label>
          <select id="p-prov">
            ${provs.map(pr => `<option value="${pr.id_proveedor}" ${p?.id_proveedor==pr.id_proveedor?'selected':''}>${pr.nombre}</option>`).join('')}
          </select>
        </div>
      </div>
      <div id="p-error" class="alert alert-error hidden"></div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="Modal.cerrar()">Cancelar</button>
        <button class="btn btn-primary" onclick="Productos.guardar(${p?.id_producto||'null'})">Guardar</button>
      </div>`;
  },

  async guardar(id) {
    const body = {
      nombre:          q('#p-nombre').value.trim(),
      descripcion:     q('#p-desc').value.trim(),
      precio_unitario: q('#p-precio').value,
      stock:           q('#p-stock').value,
      id_categoria:    q('#p-cat').value,
      id_proveedor:    q('#p-prov').value
    };
    const errEl = q('#p-error');
    try {
      if (id) {
        await apiFetch('/productos/' + id, { method: 'PUT', body });
        toast('Producto actualizado');
      } else {
        await apiFetch('/productos', { method: 'POST', body });
        toast('Producto creado');
      }
      Modal.cerrar();
      this.cargar();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
    }
  },

  async eliminar(id, nombre) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      await apiFetch('/productos/' + id, { method: 'DELETE' });
      toast('Producto eliminado');
      this.cargar();
    } catch (err) {
      toast(err.message, 'error');
    }
  }
};

const Clientes = {
  async cargar() {
    try {
      const data = await apiFetch('/clientes');
      q('#tabla-clientes tbody').innerHTML = data.map(c => `
        <tr>
          <td class="td-mono">${c.id_cliente}</td>
          <td>${c.nombre} ${c.apellido}</td>
          <td>${c.telefono || '—'}</td>
          <td>${c.email || '—'}</td>
          <td>${c.direccion || '—'}</td>
          <td class="td-actions">
            <button class="btn btn-secondary btn-sm" onclick="Clientes.abrirEditar(${c.id_cliente})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="Clientes.eliminar(${c.id_cliente}, '${c.nombre} ${c.apellido}')">Borrar</button>
          </td>
        </tr>`).join('');
    } catch (err) {
      toast('Error al cargar clientes: ' + err.message, 'error');
    }
  },

  abrirCrear() { Modal.abrir('Nuevo cliente', this.formulario(null)); },

  async abrirEditar(id) {
    const c = await apiFetch('/clientes/' + id);
    Modal.abrir('Editar cliente', this.formulario(c));
  },

  formulario(c) {
    return `
      <div class="form-row">
        <div class="form-group"><label>Nombre</label>
          <input id="c-nombre" value="${c?.nombre||''}">
        </div>
        <div class="form-group"><label>Apellido</label>
          <input id="c-apellido" value="${c?.apellido||''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Teléfono</label>
          <input id="c-tel" value="${c?.telefono||''}">
        </div>
        <div class="form-group"><label>Email</label>
          <input id="c-email" type="email" value="${c?.email||''}">
        </div>
      </div>
      <div class="form-group"><label>Dirección</label>
        <textarea id="c-dir">${c?.direccion||''}</textarea>
      </div>
      <div id="c-error" class="alert alert-error hidden"></div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="Modal.cerrar()">Cancelar</button>
        <button class="btn btn-primary" onclick="Clientes.guardar(${c?.id_cliente||'null'})">Guardar</button>
      </div>`;
  },

  async guardar(id) {
    const body = {
      nombre:    q('#c-nombre').value.trim(),
      apellido:  q('#c-apellido').value.trim(),
      telefono:  q('#c-tel').value.trim(),
      email:     q('#c-email').value.trim(),
      direccion: q('#c-dir').value.trim()
    };
    const errEl = q('#c-error');
    try {
      if (id) {
        await apiFetch('/clientes/' + id, { method: 'PUT', body });
        toast('Cliente actualizado');
      } else {
        await apiFetch('/clientes', { method: 'POST', body });
        toast('Cliente creado');
      }
      Modal.cerrar();
      this.cargar();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
    }
  },

  async eliminar(id, nombre) {
    if (!confirm(`¿Eliminar al cliente "${nombre}"?`)) return;
    try {
      await apiFetch('/clientes/' + id, { method: 'DELETE' });
      toast('Cliente eliminado');
      this.cargar();
    } catch (err) {
      toast(err.message, 'error');
    }
  }
};

const Ventas = {
  items: [],

  async cargar() {
    try {
      const data = await apiFetch('/ventas');
      q('#tabla-ventas tbody').innerHTML = data.map(v => `
        <tr>
          <td class="td-mono">${v.id_venta}</td>
          <td>${formatFecha(v.fecha)}</td>
          <td>${v.cliente}</td>
          <td>${v.empleado}</td>
          <td class="td-mono" style="color:var(--green)">${formatQ(v.total)}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="Ventas.verDetalle(${v.id_venta})">Ver</button>
          </td>
        </tr>`).join('');
    } catch (err) {
      toast('Error al cargar ventas: ' + err.message, 'error');
    }
  },

  async verDetalle(id) {
    try {
      const v = await apiFetch('/ventas/' + id);
      const html = `
        <div class="detalle-header">
          <div class="detalle-info">Cliente: <strong>${v.cliente}</strong></div>
          <div class="detalle-info">Empleado: <strong>${v.empleado}</strong></div>
          <div class="detalle-info">Fecha: <strong>${formatFecha(v.fecha)}</strong></div>
        </div>
        <table style="width:100%;margin-bottom:1rem">
          <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
          <tbody>
            ${v.detalle.map(d => `
              <tr>
                <td>${d.producto}</td>
                <td class="td-mono">${d.cantidad}</td>
                <td class="td-mono">${formatQ(d.precio_unitario)}</td>
                <td class="td-mono">${formatQ(d.subtotal)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div class="venta-total-row">
          <span>Total</span>
          <span style="color:var(--green)">${formatQ(v.total)}</span>
        </div>`;
      Modal.abrir('Detalle de venta #' + id, html);
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  async abrirCrear() {
    const [clientes, empleados, productos] = await Promise.all([
      apiFetch('/clientes'),
      apiFetch('/empleados'),
      apiFetch('/productos')
    ]);
    this.items = [{ id: Date.now() }];
    const html = `
      <div class="form-row">
        <div class="form-group"><label>Cliente</label>
          <select id="v-cliente">
            ${clientes.map(c => `<option value="${c.id_cliente}">${c.nombre} ${c.apellido}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Empleado</label>
          <select id="v-empleado">
            ${empleados.map(e => `<option value="${e.id_empleado}">${e.nombre} ${e.apellido}</option>`).join('')}
          </select>
        </div>
      </div>
      <label style="font-size:.8rem;color:var(--text2);text-transform:uppercase;letter-spacing:.05em">Productos</label>
      <div id="venta-items" class="venta-items" style="margin-top:.5rem"></div>
      <button class="btn btn-secondary btn-sm" onclick="Ventas.agregarItem()" style="margin-bottom:1rem">+ Agregar producto</button>
      <div class="venta-total-row" id="venta-total">
        <span>Total estimado</span><span>Q 0.00</span>
      </div>
      <div id="v-error" class="alert alert-error hidden" style="margin-top:.8rem"></div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="Modal.cerrar()">Cancelar</button>
        <button class="btn btn-primary" onclick="Ventas.guardar()">Registrar venta</button>
      </div>`;
    Modal.abrir('Nueva venta', html);
    this._productos = productos;
    this.renderItems();
  },

  renderItems() {
    const cont = q('#venta-items');
    cont.innerHTML = this.items.map((item, i) => `
      <div class="venta-item">
        <select id="vi-prod-${i}" onchange="Ventas.calcTotal()">
          ${this._productos.map(p =>
            `<option value="${p.id_producto}" data-precio="${p.precio_unitario}">${p.nombre} (${formatQ(p.precio_unitario)})</option>`
          ).join('')}
        </select>
        <input id="vi-cant-${i}" type="number" min="1" value="1" style="width:60px" oninput="Ventas.calcTotal()">
        <button class="btn btn-danger btn-sm" onclick="Ventas.quitarItem(${i})">✕</button>
      </div>`).join('');
    this.calcTotal();
  },

  agregarItem() {
    this.items.push({ id: Date.now() });
    this.renderItems();
  },

  quitarItem(i) {
    this.items.splice(i, 1);
    if (this.items.length === 0) this.items.push({ id: Date.now() });
    this.renderItems();
  },

  calcTotal() {
    let total = 0;
    this.items.forEach((_, i) => {
      const sel  = q(`#vi-prod-${i}`);
      const cant = parseFloat(q(`#vi-cant-${i}`)?.value || 0);
      if (sel) {
        const precio = parseFloat(sel.selectedOptions[0]?.dataset.precio || 0);
        total += precio * cant;
      }
    });
    const el = q('#venta-total');
    if (el) el.innerHTML = `<span>Total estimado</span><span style="color:var(--green)">${formatQ(total)}</span>`;
  },

  async guardar() {
    const errEl = q('#v-error');
    const items = this.items.map((_, i) => ({
      id_producto: parseInt(q(`#vi-prod-${i}`).value),
      cantidad:    parseInt(q(`#vi-cant-${i}`).value)
    }));
    const body = {
      id_cliente:  q('#v-cliente').value,
      id_empleado: q('#v-empleado').value,
      items
    };
    try {
      await apiFetch('/ventas', { method: 'POST', body });
      toast('Venta registrada correctamente');
      Modal.cerrar();
      this.cargar();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
    }
  }
};

const Reportes = {
  actual: 'top-productos',
  datosActuales: [],

  async cargar(tipo, btn) {
    this.actual = tipo;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const cont = q('#reporte-contenido');
    cont.innerHTML = '<p style="color:var(--text2);padding:1rem">Cargando...</p>';
    try {
      let data, html;
      if (tipo === 'top-productos') {
        data = await apiFetch('/reportes/top-productos');
        this.datosActuales = data;
        html = `<table><thead><tr><th>Producto</th><th>Categoría</th><th>Unidades vendidas</th><th>Ingresos totales</th></tr></thead>
          <tbody>${data.map(r => `<tr>
            <td>${r.producto}</td><td>${r.categoria}</td>
            <td class="td-mono">${r.unidades_vendidas}</td>
            <td class="td-mono" style="color:var(--green)">${formatQ(r.ingresos_totales)}</td>
          </tr>`).join('')}</tbody></table>`;
      } else if (tipo === 'por-empleado') {
        data = await apiFetch('/reportes/ventas-por-empleado');
        this.datosActuales = data;
        html = `<table><thead><tr><th>Empleado</th><th>Total ventas</th><th>Monto total</th><th>Promedio</th><th>Venta mayor</th></tr></thead>
          <tbody>${data.map(r => `<tr>
            <td>${r.empleado}</td>
            <td class="td-mono">${r.total_ventas}</td>
            <td class="td-mono" style="color:var(--green)">${formatQ(r.monto_total)}</td>
            <td class="td-mono">${formatQ(r.promedio_venta)}</td>
            <td class="td-mono">${formatQ(r.venta_mayor)}</td>
          </tr>`).join('')}</tbody></table>`;
      } else if (tipo === 'por-categoria') {
        data = await apiFetch('/reportes/ventas-por-categoria');
        this.datosActuales = data;
        html = `<table><thead><tr><th>Categoría</th><th>Núm. ventas</th><th>Unidades</th><th>Ingresos</th></tr></thead>
          <tbody>${data.map(r => `<tr>
            <td>${r.categoria}</td>
            <td class="td-mono">${r.num_ventas}</td>
            <td class="td-mono">${r.unidades}</td>
            <td class="td-mono" style="color:var(--green)">${formatQ(r.ingresos)}</td>
          </tr>`).join('')}</tbody></table>`;
      } else if (tipo === 'clientes-activos') {
        data = await apiFetch('/reportes/clientes-activos');
        this.datosActuales = data;
        html = `<table><thead><tr><th>#</th><th>Cliente</th><th>Email</th><th>Teléfono</th></tr></thead>
          <tbody>${data.map(r => `<tr>
            <td class="td-mono">${r.id_cliente}</td>
            <td>${r.cliente}</td>
            <td>${r.email || '—'}</td>
            <td>${r.telefono || '—'}</td>
          </tr>`).join('')}</tbody></table>`;
      }
      cont.innerHTML = html;
    } catch (err) {
      cont.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  exportarCSV() {
    if (!this.datosActuales.length) { toast('No hay datos para exportar', 'error'); return; }
    const cols  = Object.keys(this.datosActuales[0]);
    const filas = this.datosActuales.map(r => cols.map(c => `"${r[c]}"`).join(','));
    const csv   = [cols.join(','), ...filas].join('\n');
    const blob  = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    a.href      = url;
    a.download  = `reporte_${this.actual}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('CSV exportado correctamente');
  }
};

Auth.verificar();