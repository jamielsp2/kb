// ============ MANAGE MODAL (Categorías, Carpetas, Tags) ============

const ICON_OPTIONS = [
  'folder','rocket','box','plug','card','code','wrench',
  'star','tag','hash','bell','user','file','search','version',
];

const ManageModal = ({ onClose, onRefresh, dbCategories, dbFolders }) => {
  const [tab, setTab] = React.useState('categories'); // 'categories' | 'folders' | 'tags'

  // ---- shared state ----
  const [categories, setCategories] = React.useState(dbCategories || []);
  const [folders,    setFolders]    = React.useState(dbFolders || []);
  const [tags,       setTags]       = React.useState([]);
  const [loading,    setLoading]    = React.useState(false);
  const [error,      setError]      = React.useState('');
  const [success,    setSuccess]    = React.useState('');

  // ---- form state: categories ----
  const [newCatName, setNewCatName] = React.useState('');
  const [newCatIcon, setNewCatIcon] = React.useState('folder');

  // ---- form state: folders ----
  const [newFolderName, setNewFolderName] = React.useState('');
  const [newFolderCat,  setNewFolderCat]  = React.useState(categories[0]?.id || '');

  // ---- form state: tags ----
  const [newTagName, setNewTagName] = React.useState('');

  // fetch all tags on mount
  React.useEffect(() => {
    fetch(`${API}?action=all_tags`)
      .then(r => r.json())
      .then(data => Array.isArray(data) && setTags(data))
      .catch(() => {});
  }, []);

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(''); }
    else { setSuccess(msg); setError(''); }
    setTimeout(() => { setError(''); setSuccess(''); }, 3000);
  };

  const reload = async () => {
    const [catRes, foldRes, tagRes] = await Promise.all([
      fetch(`${API}?action=categories`),
      fetch(`${API}?action=folders`),
      fetch(`${API}?action=all_tags`),
    ]);
    const [cats, folds, tgs] = await Promise.all([catRes.json(), foldRes.json(), tagRes.json()]);
    if (Array.isArray(cats))  setCategories(cats);
    if (Array.isArray(folds)) setFolders(folds);
    if (Array.isArray(tgs))   setTags(tgs);
    onRefresh && onRefresh();
  };

  // ============ CATEGORY ACTIONS ============
  const addCategory = async () => {
    if (!newCatName.trim()) { flash('Escribe un nombre para la categoría.', true); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}?action=create_category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim(), icon: newCatIcon })
      });
      const data = await res.json();
      if (data.success) {
        setNewCatName('');
        setNewCatIcon('folder');
        await reload();
        flash('Categoría creada correctamente.');
      } else flash(data.error || 'Error al crear categoría.', true);
    } catch { flash('Error de conexión.', true); }
    setLoading(false);
  };

  const deleteCategory = async (id, name) => {
    if (!confirm(`¿Eliminar la categoría "${name}"? Los artículos dentro quedarán sin categoría.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}?action=delete_category&id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { await reload(); flash(`Categoría "${name}" eliminada.`); }
      else flash(data.error || 'Error al eliminar.', true);
    } catch { flash('Error de conexión.', true); }
    setLoading(false);
  };

  // ============ FOLDER ACTIONS ============
  const addFolder = async () => {
    if (!newFolderName.trim()) { flash('Escribe un nombre para la carpeta.', true); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}?action=create_folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName.trim(), parent_category_id: newFolderCat || null })
      });
      const data = await res.json();
      if (data.success) {
        setNewFolderName('');
        await reload();
        flash('Carpeta creada correctamente.');
      } else flash(data.error || 'Error al crear carpeta.', true);
    } catch { flash('Error de conexión.', true); }
    setLoading(false);
  };

  const deleteFolder = async (id, name) => {
    if (!confirm(`¿Eliminar la carpeta "${name}"? Los artículos dentro quedarán sin carpeta.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}?action=delete_folder&id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { await reload(); flash(`Carpeta "${name}" eliminada.`); }
      else flash(data.error || 'Error al eliminar.', true);
    } catch { flash('Error de conexión.', true); }
    setLoading(false);
  };

  // ============ TAG ACTIONS ============
  const addTag = async () => {
    const name = newTagName.trim().toLowerCase();
    if (!name) { flash('Escribe un nombre para el tag.', true); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}?action=create_tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (data.success) {
        setNewTagName('');
        await reload();
        flash('Tag creado correctamente.');
      } else flash(data.error || 'Error al crear tag.', true);
    } catch { flash('Error de conexión.', true); }
    setLoading(false);
  };

  const deleteTag = async (id, name) => {
    if (!confirm(`¿Eliminar el tag "#${name}"? Se desvinculará de todos los artículos.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}?action=delete_tag&id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { await reload(); flash(`Tag "#${name}" eliminado.`); }
      else flash(data.error || 'Error al eliminar.', true);
    } catch { flash('Error de conexión.', true); }
    setLoading(false);
  };

  // ============ STYLES ============
  const tabStyle = (active) => ({
    padding: '7px 14px', fontSize: 13, fontWeight: active ? 600 : 500,
    color: active ? 'var(--accent)' : 'var(--text-soft)',
    borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
    transition: 'all .15s', cursor: 'pointer', background: 'none', border: 'none',
    borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
  });

  const rowStyle = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px',
    border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
    background: 'var(--surface)',
    marginBottom: 8, transition: 'border-color .12s',
  };

  const deleteBtn = (onClick) => (
    <button onClick={onClick} title="Eliminar"
      style={{
        marginLeft: 'auto', width: 28, height: 28,
        display: 'grid', placeItems: 'center',
        borderRadius: 'var(--r-sm)', flexShrink: 0,
        color: 'var(--text-muted)', transition: 'all .12s',
        background: 'transparent',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'oklch(0.95 0.05 30)'; e.currentTarget.style.color = 'oklch(0.5 0.18 30)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
    >
      <Icon name="close" size={14} stroke={2.2} />
    </button>
  );

  const addRowStyle = {
    display: 'flex', gap: 8, marginTop: 4, padding: '12px 14px',
    background: 'var(--bg-sunken)', border: '1px dashed var(--border)',
    borderRadius: 'var(--r-md)',
  };

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div
        className="search-modal"
        style={{ width: 'min(680px, 96vw)', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="search-head" style={{ justifyContent: 'space-between', padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="sliders" size={18} />
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Administrar estructura</span>
          </div>
          <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={onClose}>
            <Icon name="close" size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '0 20px', borderBottom: '1px solid var(--border)', gap: 4 }}>
          <button style={tabStyle(tab === 'categories')} onClick={() => setTab('categories')}>
            <Icon name="box" size={13} /> Categorías <span style={{
              fontSize: 10, padding: '1px 5px', borderRadius: 8,
              background: 'var(--border)', color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', marginLeft: 4
            }}>{categories.length}</span>
          </button>
          <button style={tabStyle(tab === 'folders')} onClick={() => setTab('folders')}>
            <Icon name="folder" size={13} /> Carpetas <span style={{
              fontSize: 10, padding: '1px 5px', borderRadius: 8,
              background: 'var(--border)', color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', marginLeft: 4
            }}>{folders.length}</span>
          </button>
          <button style={tabStyle(tab === 'tags')} onClick={() => setTab('tags')}>
            <Icon name="tag" size={13} /> Tags <span style={{
              fontSize: 10, padding: '1px 5px', borderRadius: 8,
              background: 'var(--border)', color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', marginLeft: 4
            }}>{tags.length}</span>
          </button>
        </div>

        {/* Status banner */}
        {(error || success) && (
          <div style={{
            padding: '10px 20px',
            background: error ? 'oklch(0.96 0.04 30)' : 'oklch(0.96 0.06 145)',
            color: error ? 'oklch(0.4 0.18 30)' : 'oklch(0.35 0.15 145)',
            fontSize: 13, borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon name={error ? 'close' : 'check'} size={14} />
            {error || success}
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>

          {/* ====== CATEGORIES TAB ====== */}
          {tab === 'categories' && (
            <div>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16 }}>
                Las categorías son las secciones principales del portal. Cada categoría puede contener múltiples carpetas y artículos.
              </p>

              {/* List */}
              {categories.length === 0 && (
                <div className="empty" style={{ padding: 32 }}>
                  <div className="empty-sub">No hay categorías. Crea la primera.</div>
                </div>
              )}
              {categories.map(c => (
                <div key={c.id} style={rowStyle}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: 'var(--accent-soft)', color: 'var(--accent)',
                    display: 'grid', placeItems: 'center', flexShrink: 0,
                  }}>
                    <Icon name={c.icon || 'folder'} size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {c.article_count || 0} artículos · ID: {c.id}
                    </div>
                  </div>
                  {deleteBtn(() => deleteCategory(c.id, c.name))}
                </div>
              ))}

              {/* Add form */}
              <div style={addRowStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCategory()}
                      placeholder="Nombre de la nueva categoría..."
                      style={{
                        flex: 1, padding: '8px 12px',
                        border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
                        background: 'var(--surface)', color: 'var(--text)', fontSize: 13, outline: 'none',
                      }}
                    />
                    <button
                      className="btn-primary"
                      onClick={addCategory}
                      disabled={loading}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <Icon name="plus" size={14} /> Añadir
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Icono:</span>
                    {ICON_OPTIONS.map(ico => (
                      <button key={ico}
                        onClick={() => setNewCatIcon(ico)}
                        title={ico}
                        style={{
                          width: 30, height: 30, borderRadius: 7,
                          display: 'grid', placeItems: 'center',
                          border: `1.5px solid ${newCatIcon === ico ? 'var(--accent)' : 'var(--border)'}`,
                          background: newCatIcon === ico ? 'var(--accent-soft)' : 'var(--surface)',
                          color: newCatIcon === ico ? 'var(--accent)' : 'var(--text-soft)',
                          cursor: 'pointer', transition: 'all .12s',
                        }}
                      >
                        <Icon name={ico} size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====== FOLDERS TAB ====== */}
          {tab === 'folders' && (
            <div>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16 }}>
                Las carpetas agrupan artículos dentro de una categoría. Aparecen como árbol en el sidebar.
              </p>

              {/* Grouped by category */}
              {categories.map(cat => {
                const catFolders = folders.filter(f =>
                  f.parent_category_id === cat.id || f.parent === cat.id
                );
                return (
                  <div key={cat.id} style={{ marginBottom: 20 }}>
                    <div style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: 'var(--text-muted)',
                      marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <Icon name={cat.icon || 'folder'} size={11} /> {cat.name}
                    </div>
                    {catFolders.length === 0 && (
                      <div style={{ fontSize: 12.5, color: 'var(--text-muted)', padding: '8px 14px', fontStyle: 'italic' }}>
                        Sin carpetas en esta categoría
                      </div>
                    )}
                    {catFolders.map(f => (
                      <div key={f.id} style={rowStyle}>
                        <Icon name="folder" size={15} style={{ color: 'var(--accent)', opacity: 0.8, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, fontSize: 13.5, color: 'var(--text)' }}>{f.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {f.article_count || 0} artículos · ID: {f.id}
                          </div>
                        </div>
                        {deleteBtn(() => deleteFolder(f.id, f.name))}
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Uncategorized folders */}
              {(() => {
                const catIds = categories.map(c => c.id);
                const uncatFolders = folders.filter(f =>
                  !f.parent_category_id || !catIds.includes(f.parent_category_id)
                );
                return uncatFolders.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
                      Sin categoría
                    </div>
                    {uncatFolders.map(f => (
                      <div key={f.id} style={rowStyle}>
                        <Icon name="folder" size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, fontSize: 13.5 }}>{f.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {f.article_count || 0} artículos · {f.id}
                          </div>
                        </div>
                        {deleteBtn(() => deleteFolder(f.id, f.name))}
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Add form */}
              <div style={addRowStyle}>
                <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                  <input
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addFolder()}
                    placeholder="Nombre de la nueva carpeta..."
                    style={{
                      flex: 1, padding: '8px 12px',
                      border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
                      background: 'var(--surface)', color: 'var(--text)', fontSize: 13, outline: 'none',
                    }}
                  />
                  <select
                    value={newFolderCat}
                    onChange={e => setNewFolderCat(e.target.value)}
                    style={{
                      padding: '8px 10px',
                      border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
                      background: 'var(--surface)', color: 'var(--text)', fontSize: 13,
                    }}
                  >
                    <option value="">Sin categoría</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <button
                    className="btn-primary"
                    onClick={addFolder}
                    disabled={loading}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <Icon name="plus" size={14} /> Añadir
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ====== TAGS TAB ====== */}
          {tab === 'tags' && (
            <div>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16 }}>
                Los tags permiten filtrar artículos transversalmente. Puedes asignarlos al crear o editar artículos.
              </p>

              {/* Tag cloud with delete buttons */}
              {tags.length === 0 && (
                <div className="empty" style={{ padding: 32 }}>
                  <div className="empty-sub">No hay tags. Créalos aquí o asígnalos al publicar artículos.</div>
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {tags.map(t => (
                  <div key={t.id || t.name} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 10px 5px 12px',
                    border: '1px solid var(--border)', borderRadius: 999,
                    background: 'var(--surface)', fontSize: 13, color: 'var(--text)',
                    fontWeight: 500,
                  }}>
                    <span style={{ color: 'var(--accent)', opacity: 0.7, fontSize: 12 }}>#</span>
                    {t.name}
                    <span style={{
                      fontSize: 10.5, color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)', margin: '0 2px',
                    }}>{t.count}</span>
                    <button
                      onClick={() => deleteTag(t.id, t.name)}
                      title="Eliminar tag"
                      style={{
                        width: 18, height: 18, borderRadius: 4,
                        display: 'grid', placeItems: 'center',
                        color: 'var(--text-muted)', flexShrink: 0,
                        background: 'transparent', transition: 'all .12s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'oklch(0.9 0.06 30)'; e.currentTarget.style.color = 'oklch(0.5 0.18 30)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      <Icon name="close" size={10} stroke={2.5} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add tag */}
              <div style={addRowStyle}>
                <input
                  value={newTagName}
                  onChange={e => setNewTagName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                  placeholder="Nombre del nuevo tag (ej: frontend)"
                  style={{
                    flex: 1, padding: '8px 12px',
                    border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
                    background: 'var(--surface)', color: 'var(--text)', fontSize: 13, outline: 'none',
                  }}
                />
                <button
                  className="btn-primary"
                  onClick={addTag}
                  disabled={loading}
                >
                  <Icon name="plus" size={14} /> Añadir
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--bg-sunken)', flexShrink: 0,
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Los cambios se guardan automáticamente en la base de datos.
          </span>
          <button className="btn-ghost" onClick={onClose}
            style={{ padding: '7px 14px', border: '1px solid var(--border)' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ManageModal });
