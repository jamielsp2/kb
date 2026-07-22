// ============ USERS MODAL — Admin only ============

const AUTH_API = (window.__ATLAS_BASE__ || '') + '/api/auth.php';

const ROLE_LABELS = {
  admin:        { label: 'Administrador', color: 'oklch(0.5 0.18 30)',  bg: 'oklch(0.96 0.04 30)'  },
  collaborator: { label: 'Colaborador',   color: 'oklch(0.5 0.18 255)', bg: 'oklch(0.95 0.04 255)' },
  viewer:       { label: 'Visualizador',  color: 'oklch(0.5 0.12 145)', bg: 'oklch(0.95 0.04 145)' },
};

const RoleBadge = ({ role }) => {
  const r = ROLE_LABELS[role] || ROLE_LABELS.viewer;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
      color: r.color, background: r.bg, letterSpacing: '.01em',
    }}>{r.label}</span>
  );
};

const UsersModal = ({ onClose, currentUser }) => {
  const [users,   setUsers]   = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [msg,     setMsg]     = React.useState({ text: '', type: '' });

  // New user form
  const [form, setForm] = React.useState({ name: '', email: '', password: '', role: 'viewer' });
  const [saving, setSaving] = React.useState(false);
  const [showPw, setShowPw]  = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3500);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${AUTH_API}?action=users`, { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
      else flash(data.error || 'Error cargando usuarios.', 'error');
    } catch { flash('Error de conexión.', 'error'); }
    setLoading(false);
  };

  React.useEffect(() => { loadUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      flash('Completa todos los campos.', 'error'); return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${AUTH_API}?action=create_user`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setForm({ name: '', email: '', password: '', role: 'viewer' });
        setShowForm(false);
        await loadUsers();
        flash('Usuario creado correctamente.');
      } else flash(data.error || 'Error al crear usuario.', 'error');
    } catch { flash('Error de conexión.', 'error'); }
    setSaving(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${AUTH_API}?action=update_user`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) { await loadUsers(); flash('Rol actualizado.'); }
      else flash(data.error || 'Error al actualizar.', 'error');
    } catch { flash('Error de conexión.', 'error'); }
  };

  const handleToggleActive = async (userId, currentActive) => {
    try {
      const res = await fetch(`${AUTH_API}?action=update_user`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, active: currentActive ? 0 : 1 }),
      });
      const data = await res.json();
      if (data.success) { await loadUsers(); flash(currentActive ? 'Cuenta suspendida.' : 'Cuenta reactivada.'); }
      else flash(data.error || 'Error.', 'error');
    } catch { flash('Error de conexión.', 'error'); }
  };

  const handleDelete = async (userId, name) => {
    if (!confirm(`¿Eliminar permanentemente a "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`${AUTH_API}?action=delete_user&id=${encodeURIComponent(userId)}`, {
        method: 'DELETE', credentials: 'include',
      });
      const data = await res.json();
      if (data.success) { await loadUsers(); flash(`Usuario "${name}" eliminado.`); }
      else flash(data.error || 'Error.', 'error');
    } catch { flash('Error de conexión.', 'error'); }
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px',
    border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
    background: 'var(--surface)', color: 'var(--text)',
    fontSize: 13, fontFamily: 'inherit', outline: 'none',
  };

  const selectStyle = {
    ...inputStyle, cursor: 'pointer',
  };

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div
        className="search-modal"
        style={{ width: 'min(720px, 96vw)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="search-head" style={{ justifyContent: 'space-between', padding: '14px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="user" size={18} />
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Gestión de usuarios</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ({users.length} {users.length === 1 ? 'usuario' : 'usuarios'})
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn-primary" onClick={() => setShowForm(v => !v)}
              style={{ padding: '6px 12px', fontSize: 13 }}>
              <Icon name="plus" size={13} /> Nuevo usuario
            </button>
            <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={onClose}>
              <Icon name="close" size={15} />
            </button>
          </div>
        </div>

        {/* Status */}
        {msg.text && (
          <div style={{
            padding: '10px 24px', fontSize: 13,
            background: msg.type === 'error' ? 'oklch(0.96 0.04 30)' : 'oklch(0.96 0.06 145)',
            color: msg.type === 'error' ? 'oklch(0.4 0.18 30)' : 'oklch(0.35 0.15 145)',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon name={msg.type === 'error' ? 'close' : 'check'} size={14} />
            {msg.text}
          </div>
        )}

        {/* New user form */}
        {showForm && (
          <div style={{ padding: '16px 24px', background: 'var(--bg-sunken)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
              Crear nuevo usuario
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <input
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nombre completo" style={inputStyle} required
                />
                <input
                  type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="correo@empresa.com" style={inputStyle} required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px auto', gap: 10 }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Contraseña" style={{ ...inputStyle, paddingRight: 36 }} required
                  />
                  <button type="button"
                    onClick={() => setShowPw(v => !v)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'grid', placeItems: 'center', padding: 2 }}>
                    <Icon name={showPw ? 'close' : 'search'} size={13} />
                  </button>
                </div>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={selectStyle}>
                  <option value="viewer">Visualizador</option>
                  <option value="collaborator">Colaborador</option>
                  <option value="admin">Administrador</option>
                </select>
                <button type="submit" className="btn-primary" disabled={saving} style={{ whiteSpace: 'nowrap' }}>
                  {saving ? '...' : <><Icon name="plus" size={13} /> Crear</>}
                </button>
                <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}
                  style={{ padding: '8px 12px', border: '1px solid var(--border)' }}>
                  <Icon name="close" size={13} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User list */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 20px' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Cargando usuarios...</div>
          ) : users.length === 0 ? (
            <div className="empty" style={{ padding: 40 }}>
              <div className="empty-title">Sin usuarios</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Usuario', 'Rol', 'Último acceso', 'Estado', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const isSelf = u.id === currentUser.id;
                  return (
                    <tr key={u.id} style={{
                      borderBottom: '1px solid var(--border)',
                      opacity: u.active ? 1 : 0.5,
                      transition: 'background .1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-sunken)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Avatar + name */}
                      <td style={{ padding: '10px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: u.color || 'var(--accent)',
                            display: 'grid', placeItems: 'center',
                            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                          }}>{u.initials || u.name[0].toUpperCase()}</div>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 13.5, color: 'var(--text)' }}>
                              {u.name} {isSelf && <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>(tú)</span>}
                            </div>
                            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role selector */}
                      <td style={{ padding: '10px 8px' }}>
                        {isSelf ? (
                          <RoleBadge role={u.role} />
                        ) : (
                          <select
                            value={u.role}
                            onChange={e => handleRoleChange(u.id, e.target.value)}
                            style={{
                              padding: '4px 8px', fontSize: 12, fontWeight: 600,
                              border: '1px solid var(--border)', borderRadius: 6,
                              background: ROLE_LABELS[u.role]?.bg || 'var(--surface)',
                              color: ROLE_LABELS[u.role]?.color || 'var(--text)',
                              cursor: 'pointer', outline: 'none',
                            }}
                          >
                            <option value="viewer">Visualizador</option>
                            <option value="collaborator">Colaborador</option>
                            <option value="admin">Administrador</option>
                          </select>
                        )}
                      </td>

                      {/* Last login */}
                      <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--text-muted)' }}>
                        {u.last_login
                          ? new Date(u.last_login).toLocaleDateString('es-ES', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })
                          : 'Nunca'}
                      </td>

                      {/* Active toggle */}
                      <td style={{ padding: '10px 8px' }}>
                        {isSelf ? (
                          <span style={{ fontSize: 12, color: 'oklch(0.45 0.15 145)', fontWeight: 600 }}>● Activo</span>
                        ) : (
                          <button
                            onClick={() => handleToggleActive(u.id, u.active)}
                            style={{
                              padding: '3px 10px', fontSize: 12, fontWeight: 600,
                              border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer',
                              background: u.active ? 'oklch(0.95 0.05 145)' : 'oklch(0.95 0.02 0)',
                              color: u.active ? 'oklch(0.4 0.15 145)' : 'var(--text-muted)',
                              transition: 'all .12s',
                            }}
                          >
                            {u.active ? '● Activo' : '○ Suspendido'}
                          </button>
                        )}
                      </td>

                      {/* Delete */}
                      <td style={{ padding: '10px 8px' }}>
                        {!isSelf && (
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            title="Eliminar usuario"
                            style={{
                              width: 28, height: 28, borderRadius: 6, background: 'transparent',
                              display: 'grid', placeItems: 'center', cursor: 'pointer',
                              color: 'var(--text-muted)', border: '1px solid var(--border)',
                              transition: 'all .12s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'oklch(0.95 0.04 30)'; e.currentTarget.style.color = 'oklch(0.5 0.18 30)'; e.currentTarget.style.borderColor = 'oklch(0.8 0.08 30)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                          >
                            <Icon name="close" size={13} stroke={2.2} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Roles reference */}
        <div style={{
          padding: '12px 24px', borderTop: '1px solid var(--border)',
          background: 'var(--bg-sunken)',
          display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center',
        }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Roles:</span>
          {Object.entries(ROLE_LABELS).map(([key, r]) => (
            <span key={key} style={{ fontSize: 12, color: 'var(--text-soft)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <RoleBadge role={key} /> — {
                key === 'admin'        ? 'Acceso total, gestión de usuarios' :
                key === 'collaborator' ? 'Puede crear y editar artículos' :
                                        'Solo puede ver artículos'
              }
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

// ============ CHANGE PASSWORD MODAL ============
const ChangePasswordModal = ({ onClose }) => {
  const [form, setForm] = React.useState({ current: '', newPw: '', confirm: '' });
  const [msg, setMsg] = React.useState({ text: '', type: '' });
  const [saving, setSaving] = React.useState(false);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.current || !form.newPw || !form.confirm) {
      flash('Completa todos los campos.', 'error'); return;
    }
    if (form.newPw !== form.confirm) {
      flash('La nueva contraseña no coincide.', 'error'); return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${AUTH_API}?action=change_password`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: form.current,
          new_password: form.newPw
        }),
      });
      const data = await res.json();
      if (data.success) {
        flash('Contraseña actualizada correctamente.');
        setTimeout(onClose, 1500);
      } else {
        flash(data.error || 'Error al actualizar contraseña.', 'error');
      }
    } catch {
      flash('Error de conexión.', 'error');
    }
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
    background: 'var(--surface)', color: 'var(--text)',
    fontSize: 14, fontFamily: 'inherit', outline: 'none',
    marginBottom: 14
  };

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-modal" style={{ width: 400, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
        <div className="search-head" style={{ padding: '16px 24px' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Cambiar contraseña</div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={16} /></button>
        </div>

        {msg.text && (
          <div style={{
            padding: '10px 24px', fontSize: 13,
            background: msg.type === 'error' ? 'oklch(0.96 0.04 30)' : 'oklch(0.96 0.06 145)',
            color: msg.type === 'error' ? 'oklch(0.4 0.18 30)' : 'oklch(0.35 0.15 145)',
            borderBottom: '1px solid var(--border)',
          }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>
            Contraseña actual
          </label>
          <input
            type="password"
            value={form.current}
            onChange={e => setForm(f => ({ ...f, current: e.target.value }))}
            style={inputStyle}
            required
          />

          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>
            Nueva contraseña
          </label>
          <input
            type="password"
            value={form.newPw}
            onChange={e => setForm(f => ({ ...f, newPw: e.target.value }))}
            style={inputStyle}
            required
          />

          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            value={form.confirm}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            style={inputStyle}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Object.assign(window, { UsersModal, ChangePasswordModal, AUTH_API });
