// ============ APP ROOT ============

const _BASE = typeof window.__ATLAS_BASE__ !== 'undefined' ? window.__ATLAS_BASE__ : '';
const API  = _BASE + '/api/index.php';

const TWEAK_DEFAULTS = {
  "theme": "light",
  "density": "comfy",
  "font": "serif",
  "hue": 255
};

// ============ CREATE ARTICLE MODAL ============
const CreateArticleModal = ({ onClose, onCreated, categories, folders }) => {
  const [title, setTitle] = React.useState('');
  const [subtitle, setSubtitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [categoryId, setCategoryId] = React.useState(categories[0]?.id || '');
  const [folderId, setFolderId] = React.useState('');
  const [tagsInput, setTagsInput] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [preview, setPreview] = React.useState(false);
  const [error, setError] = React.useState('');

  const filteredFolders = folders.filter(f =>
    f.parent_category_id === categoryId || f.parent === categoryId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) { setError('El título y el contenido son obligatorios.'); return; }
    if (!categoryId) { setError('Debes seleccionar una categoría antes de publicar.'); return; }
    if (!folderId) { setError('Debes seleccionar una carpeta antes de publicar.'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${API}?action=create_article`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim(),
          content_md: content,
          category_id: categoryId || null,
          folder_id: folderId || null,
          tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        })
      });
      const data = await res.json();
      if (data.success) { onCreated(data.id); onClose(); }
      else setError(data.error || 'Error al guardar.');
    } catch (err) {
      setError('No se pudo conectar con el servidor. Comprueba que XAMPP esté activo.');
    }
    setSaving(false);
  };

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-modal" style={{
        width: 'min(860px, 95vw)', maxHeight: '92vh',
        display: 'flex', flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="search-head" style={{justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <Icon name="edit" size={18} />
            <span style={{fontSize: 15, fontWeight: 600, color: 'var(--text)'}}>Nuevo artículo</span>
          </div>
          <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
            <button className="btn-ghost"
              style={{padding: '4px 10px', border: '1px solid var(--border)', fontSize: 12}}
              onClick={() => setPreview(p => !p)} type="button">
              {preview ? '✏ Editar' : '👁 Preview'}
            </button>
            <span className="esc" style={{cursor: 'pointer'}} onClick={onClose}>ESC</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column'}}>
          <div style={{padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1, overflow: 'auto'}}>

            {/* Error banner */}
            {error && (
              <div style={{padding: '10px 14px', background: 'oklch(0.95 0.05 30)', border: '1px solid oklch(0.7 0.15 30)', borderRadius: 'var(--r-sm)', color: 'oklch(0.35 0.12 30)', fontSize: 13}}>
                {error}
              </div>
            )}

            {/* Title */}
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Título del artículo"
              required
              style={{
                width: '100%', border: 'none', outline: 'none', background: 'none',
                fontFamily: 'var(--font-body)', fontSize: 30, fontWeight: 600,
                letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1.2,
                borderBottom: '1px solid var(--border)', paddingBottom: 12,
              }}
            />

            {/* Subtitle */}
            <input
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="Descripción breve del artículo (opcional)..."
              style={{
                width: '100%', border: 'none', outline: 'none', background: 'none',
                fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-soft)',
                lineHeight: 1.5
              }}
            />

            {/* Metadata row */}
            <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
              <select value={categoryId} onChange={e => { setCategoryId(e.target.value); setFolderId(''); }}
                style={{flex: 1, minWidth: 160, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13}}>
                <option value="">— Categoría —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select value={folderId} onChange={e => setFolderId(e.target.value)}
                style={{flex: 1, minWidth: 160, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13}}>
                <option value="">— Carpeta —</option>
                {filteredFolders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>

              <input
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Tags separados por coma: api, markdown, setup"
                style={{flex: 2, minWidth: 220, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13}}
              />
            </div>

            {/* Content — editor or preview */}
            {!preview ? (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                placeholder={"# Título del artículo\n\nEscribe en Markdown. Soporta **negritas**, *cursivas*, listas, bloques de código, tablas y más.\n\n## Sección principal\n\nContenido de la sección..."}
                style={{
                  flex: 1, minHeight: 340, width: '100%',
                  fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7,
                  border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
                  padding: '16px 18px', background: 'var(--bg-sunken)',
                  color: 'var(--text)', resize: 'vertical', outline: 'none',
                  transition: 'border-color .15s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            ) : (
              <div
                className="prose"
                style={{flex: 1, minHeight: 340, padding: '20px 24px',
                  border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
                  background: 'var(--surface)', overflow: 'auto', maxWidth: 'none'}}
                dangerouslySetInnerHTML={{
                  __html: window.marked
                    ? marked.parse(content || '*Nada que previsualizar aún...*')
                    : content
                }}
              />
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 24px', borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--bg-sunken)', flexShrink: 0
          }}>
            <span style={{fontSize: 12, color: 'var(--text-muted)'}}>
              <strong style={{color: 'var(--accent)', fontFamily: 'var(--font-mono)'}}>
                {content.split(/\s+/).filter(Boolean).length}
              </strong> palabras · Markdown soportado
            </span>
            <div style={{display: 'flex', gap: 8}}>
              <button type="button" className="btn-ghost" onClick={onClose}
                style={{padding: '7px 14px', border: '1px solid var(--border)'}}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                <Icon name="plus" size={14} />
                {saving ? 'Publicando...' : 'Publicar artículo'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};


// ============ DB-AWARE SIDEBAR ============
// Wraps the static Sidebar but feeds DB data when available
const DbSidebar = ({
  view, setView,
  activeCategory, setActiveCategory,
  expandedFolders, toggleFolder,
  activeArticleId, onPickArticle,
  activeTags, toggleTag,
  favCount,
  onManage,
  dbCategories, dbFolders, dbTags, dbArticles
}) => {
  // If DB data available, build runtime CATEGORIES/FOLDERS/TAGS overrides
  const liveCategories = React.useMemo(() => {
    if (!dbCategories) return window.CATEGORIES || [];
    return dbCategories.map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon || 'folder',
      count: c.article_count || 0
    }));
  }, [dbCategories]);

  const liveFolders = React.useMemo(() => {
    if (!dbFolders || !dbArticles) return window.FOLDERS || [];
    return dbFolders.map(f => ({
      id: f.id,
      name: f.name,
      parent: f.parent_category_id,
      count: f.article_count || 0,
      articles: dbArticles
        .filter(a => a.folder_id === f.id)
        .map(a => ({
          id: a.id,
          title: a.title,
          tags: a.tags || [],
          categoryId: a.category_id,
          folderId: a.folder_id,
          category: a.category_name,
          folder: f.name,
        }))
    }));
  }, [dbFolders, dbArticles]);

  const liveTags = React.useMemo(() => {
    if (!dbTags) return window.TAGS || [];
    return dbTags.map(t => ({ name: t.name, count: parseInt(t.count) || 1 }));
  }, [dbTags]);

  // Temporarily override globals for Sidebar rendering
  const origCats = window.CATEGORIES;
  const origFolders = window.FOLDERS;
  const origTags = window.TAGS;
  if (dbCategories) {
    window.CATEGORIES = liveCategories;
    window.FOLDERS = liveFolders;
    window.TAGS = liveTags;
  }

  const el = React.createElement(Sidebar, {
    view, setView,
    activeCategory, setActiveCategory,
    expandedFolders, toggleFolder,
    activeArticleId, onPickArticle,
    activeTags, toggleTag,
    favCount,
    onManage,
  });

  // Restore is not needed since we update globals persistently for search too
  if (dbCategories) {
    window.CATEGORIES = liveCategories;
    window.FOLDERS = liveFolders;
    window.TAGS = liveTags;
  }

  return el;
};


// ============ DB-AWARE HOME ============
const DbHome = ({ onOpen, onCategory, onCreateArticle, dbArticles, dbStats, dbCategories }) => {
  const liveAllArticles = React.useMemo(() => {
    if (!dbArticles) return window.ALL_ARTICLES || [];
    return dbArticles.map(a => ({
      ...a,
      category: a.category_name || 'General',
      folder: a.folder_name || '',
      categoryId: a.category_id,
      folderId: a.folder_id,
      tags: a.tags || [],
    }));
  }, [dbArticles]);

  if (dbArticles) window.ALL_ARTICLES = liveAllArticles;

  return React.createElement(Home, { onOpen, onCategory, onCreateArticle, liveStats: dbStats });
};


// ============ DB-AWARE SEARCH ============
// Patches ALL_ARTICLES so SearchModal uses live data
const patchSearchData = (dbArticles, dbCategories) => {
  if (!dbArticles) return;
  window.ALL_ARTICLES = dbArticles.map(a => ({
    ...a,
    category: a.category_name || 'General',
    folder: a.folder_name || '',
    categoryId: a.category_id,
    folderId: a.folder_id,
    tags: a.tags || [],
  }));
  if (dbCategories) {
    window.CATEGORIES = dbCategories.map(c => ({
      id: c.id, name: c.name, icon: c.icon || 'folder', count: c.article_count || 0
    }));
  }
};


// ============ MAIN APP ============
const App = () => {
  const [theme,    setTheme]    = React.useState(TWEAK_DEFAULTS.theme);
  const [density,  setDensity]  = React.useState(TWEAK_DEFAULTS.density);
  const [font,     setFont]     = React.useState(TWEAK_DEFAULTS.font);
  const [hue,      setHue]      = React.useState(TWEAK_DEFAULTS.hue);

  // Current user from session (injected by index.php)
  const currentUser = window.__ATLAS_USER__ || { name: 'Admin', role: 'admin', initials: 'AD', color: 'oklch(0.72 0.15 255)' };

  const [view, setView] = React.useState('home');
  const [activeCategory, setActiveCategory] = React.useState('');
  const [expandedFolders, setExpandedFolders] = React.useState([]);
  const [activeArticleId, setActiveArticleId] = React.useState('');
  const [activeTags, setActiveTags] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [tweaksOpen,  setTweaksOpen]  = React.useState(false);
  const [createOpen,  setCreateOpen]  = React.useState(false);
  const [manageOpen,  setManageOpen]  = React.useState(false);
  const [usersOpen,   setUsersOpen]   = React.useState(false);

  // API data
  const [dbArticles,    setDbArticles]    = React.useState(window.ALL_ARTICLES || []);
  const [dbCategories,  setDbCategories]  = React.useState(window.CATEGORIES || []);
  const [dbFolders,     setDbFolders]     = React.useState([]);
  const [dbTags,        setDbTags]        = React.useState([]);
  const [dbStats,       setDbStats]       = React.useState(null);
  const [currentArticle,setCurrentArticle]= React.useState(window.CURRENT_ARTICLE || null);
  const [apiReady,      setApiReady]      = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const opts = { credentials: 'include' };
      const [artRes, catRes, foldRes, tagRes, statsRes] = await Promise.all([
        fetch(`${API}?action=articles`,   opts),
        fetch(`${API}?action=categories`, opts),
        fetch(`${API}?action=folders`,    opts),
        fetch(`${API}?action=tags`,       opts),
        fetch(`${API}?action=stats`,      opts),
      ]);
      if (!artRes.ok) throw new Error('API error');
      const [arts, cats, folds, tags, stats] = await Promise.all([
        artRes.json(), catRes.json(), foldRes.json(), tagRes.json(), statsRes.json()
      ]);
      setDbArticles(arts);
      setDbCategories(cats);
      setDbFolders(folds);
      setDbTags(tags);
      setDbStats(stats);
      setApiReady(true);
      patchSearchData(arts, cats);
    } catch {
      console.log('API not available, using static data');
    }
  }, []);

  React.useEffect(() => { loadData(); }, [loadData]);

  React.useEffect(() => {
    document.documentElement.dataset.theme   = theme;
    document.documentElement.dataset.density = density;
    document.documentElement.dataset.font    = font;
    document.documentElement.style.setProperty('--hue', hue);
  }, [theme, density, font, hue]);

  React.useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  React.useEffect(() => {
    const main = document.querySelector('.main');
    if (main) main.scrollTop = 0;
  }, [view, activeArticleId]);

  const toggleFolder = (id) => setExpandedFolders(s =>
    s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleTag = (name) => setActiveTags(s =>
    s.includes(name) ? s.filter(x => x !== name) : [...s, name]);
  const toggleFav = (id) => setFavorites(s => {
    const ex = s.find(f => f.id === id);
    return ex ? s.filter(f => f.id !== id) : [...s, { id, pinned: false, addedAt: 'Hoy' }];
  });

  const openArticle = async (a) => {
    if (!a) return;
    setActiveArticleId(a.id);
    const cid = a.categoryId || a.category_id;
    const fid = a.folderId   || a.folder_id;
    if (cid) setActiveCategory(cid);
    if (fid) setExpandedFolders(s => s.includes(fid) ? s : [...s, fid]);

    if (apiReady) {
      try {
        const res = await fetch(`${API}?action=article&id=${a.id}`);
        if (res.ok) {
          const full = await res.json();
          const linesForToc = (full.content_md || '').split('\n');
          const sections = [];
          linesForToc.forEach(line => {
            const h2 = line.match(/^## (.+)/);
            const h3 = line.match(/^### (.+)/);
            if (h2) {
              const id = h2[1].toLowerCase().replace(/[^a-z0-9áéíóúñü]+/gi, '-').replace(/^-|-$/g, '');
              sections.push({ id, title: h2[1], level: 2 });
            } else if (h3) {
              const id = h3[1].toLowerCase().replace(/[^a-z0-9áéíóúñü]+/gi, '-').replace(/^-|-$/g, '');
              sections.push({ id, title: h3[1], level: 3 });
            }
          });
          setCurrentArticle({
            id: full.id,
            title: full.title,
            subtitle: full.subtitle || '',
            category: full.category_name || 'General',
            categoryId: full.category_id,
            folder: full.folder_name || '',
            folderId: full.folder_id,
            readTime: full.read_time || '5 min',
            updated: full.updated_at ? new Date(full.updated_at).toLocaleDateString('es-ES', {day:'numeric', month:'short', year:'numeric'}) : 'Hoy',
            version: full.version || 'v1.0',
            tags: full.tags || [],
            authors: [{
              name: full.author_name || 'Admin',
              initials: full.author_initials || 'AD',
              color: full.author_color || 'oklch(0.72 0.15 255)'
            }],
            content_md: full.content_md,
            sections: sections.length > 0 ? sections : (currentArticle?.sections || []),
          });
          setView('article');
          return;
        }
      } catch {}
    }
    setCurrentArticle({ ...CURRENT_ARTICLE, ...a });
    setView('article');
  };

  const openCategory = (id) => {
    setActiveCategory(id);
    setView('article');
  };

  const crumbs =
    view === 'home'      ? ['Inicio'] :
    view === 'favorites' ? ['Biblioteca', 'Favoritos'] :
    view === 'recent'    ? ['Biblioteca', 'Recientes'] :
    [currentArticle.category, currentArticle.folder, currentArticle.title].filter(Boolean);

  const handleArticleCreated = async (newId) => {
    await loadData();
    try {
      const res = await fetch(`${API}?action=article&id=${newId}`, { credentials: 'include' });
      if (res.ok) { const a = await res.json(); openArticle(a); }
    } catch {}
  };

  const handleLogout = async () => {
    try {
      await fetch(_BASE + '/api/auth.php?action=logout', { method: 'POST', credentials: 'include' });
    } catch {}
    window.location.replace(_BASE + '/login.php');
  };

  const canWrite = ['admin','collaborator'].includes(currentUser.role);
  const isAdmin  = currentUser.role === 'admin';

  return (
    <div className="app">
      <Brand />
      <Topbar
        onSearch={() => setSearchOpen(true)}
        onToggleTweaks={() => setTweaksOpen(v => !v)}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        theme={theme}
        crumbs={crumbs}
        onCreateArticle={canWrite ? () => setCreateOpen(true) : null}
        currentUser={currentUser}
        onLogout={handleLogout}
        onManageUsers={isAdmin ? () => setUsersOpen(true) : null}
      />
      <DbSidebar
        view={view} setView={setView}
        activeCategory={activeCategory}
        setActiveCategory={id => { setActiveCategory(id); }}
        expandedFolders={expandedFolders}
        toggleFolder={toggleFolder}
        activeArticleId={activeArticleId}
        onPickArticle={openArticle}
        activeTags={activeTags}
        toggleTag={toggleTag}
        favCount={favorites.length}
        onManage={() => setManageOpen(true)}
        dbArticles={dbArticles}
        dbCategories={dbCategories}
        dbFolders={dbFolders}
        dbTags={dbTags}
      />
      <main className="main">
        {view === 'home' && (
          apiReady
            ? <DbHome onOpen={openArticle} onCategory={openCategory} onCreateArticle={() => setCreateOpen(true)} dbArticles={dbArticles} dbStats={dbStats} dbCategories={dbCategories} />
            : <Home onOpen={openArticle} onCategory={openCategory} onCreateArticle={() => setCreateOpen(true)} />
        )}
        {view === 'favorites' && <Favorites favorites={favorites} onToggleFav={toggleFav} onOpen={openArticle} />}
        {view === 'recent'    && <Recent onOpen={openArticle} />}
        {view === 'article' && (
          <Article
            article={currentArticle}
            onDeleted={async () => { await loadData(); setView('home'); }}
            onUpdated={async (id) => {
              await loadData();
              try {
                const res = await fetch(`${API}?action=article&id=${id}`, { credentials: 'include' });
                if (res.ok) { const a = await res.json(); setCurrentArticle({ ...currentArticle, ...a }); }
              } catch {}
            }}
          />
        )}
      </main>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} onPick={openArticle} />}

      {createOpen && (
        <CreateArticleModal
          onClose={() => setCreateOpen(false)}
          onCreated={handleArticleCreated}
          categories={dbCategories || window.CATEGORIES || []}
          folders={dbFolders || window.FOLDERS || []}
        />
      )}

      {manageOpen && (
        <ManageModal
          onClose={() => setManageOpen(false)}
          onRefresh={loadData}
          dbCategories={dbCategories || []}
          dbFolders={dbFolders || []}
        />
      )}

      {usersOpen && isAdmin && (
        <UsersModal
          onClose={() => setUsersOpen(false)}
          currentUser={currentUser}
        />
      )}

      {tweaksOpen ? (
        <TweaksPanel
          onClose={() => setTweaksOpen(false)}
          theme={theme}     setTheme={setTheme}
          density={density} setDensity={setDensity}
          font={font}       setFont={setFont}
          hue={hue}         setHue={setHue}
        />
      ) : (
        <button className="tweaks-fab" onClick={() => setTweaksOpen(true)} title="Tweaks">
          <Icon name="sliders" size={18} />
        </button>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
