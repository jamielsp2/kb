// ============ ICONS ============
const Icon = ({ name, size = 16, stroke = 1.8, className }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
    folder: <path d="M3 7a2 2 0 0 1 2-2h3.5l2 2.5H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
    'folder-open': <path d="M3 7a2 2 0 0 1 2-2h3.5l2 2.5H19a2 2 0 0 1 2 2v.5H3zM3 10h18l-1.5 7a2 2 0 0 1-2 1.6H6.5a2 2 0 0 1-2-1.6z"/>,
    file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></>,
    chevron: <path d="m9 6 6 6-6 6"/>,
    chevronDown: <path d="m6 9 6 6 6-6"/>,
    tag: <><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor"/></>,
    hash: <><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></>,
    home: <><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></>,
    star: <path d="m12 3 2.9 6 6.6.9-4.8 4.5 1.2 6.6L12 18l-5.9 3 1.2-6.6L2.5 9.9l6.6-.9z"/>,
    rocket: <><path d="M13.5 5c3 0 6 1.5 6.5 3.5S19 14 15 15c-1 3-3 5-6 5 0-3 2-5 5-6 1-4 2-6 4-7z"/><circle cx="14.5" cy="10" r="1.3" fill="currentColor"/></>,
    box: <><path d="m3 7 9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"/></>,
    plug: <><path d="M9 3v6M15 3v6M7 9h10v4a5 5 0 0 1-10 0zM12 18v3"/></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></>,
    code: <><path d="m8 6-5 6 5 6M16 6l5 6-5 6"/></>,
    wrench: <path d="M14.7 6.3a4 4 0 0 0 5 5L21 12l-8.5 8.5a2.8 2.8 0 0 1-4-4L17 8z"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    version: <><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 8v8M8 6h6a4 4 0 0 1 4 4v1M8 18h6a4 4 0 0 0 4-4v-1"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>,
    sliders: <><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></>,
    check: <path d="m5 12 5 5 9-11"/>,
    thumbUp: <path d="M7 11v9H3v-9zM7 11l4-8a2 2 0 0 1 2 2v5h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 1.5H7"/>,
    thumbDown: <path d="M17 13V4h4v9zM17 13l-4 8a2 2 0 0 1-2-2v-5H5a2 2 0 0 1-2-2l2-7a2 2 0 0 1 2-1.5h10"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 8h0M11 12h1v5h1"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    edit: <><path d="M4 20h4l11-11-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

// ============ BRAND + TOPBAR ============
const Brand = () => (
  <div className="brand">
    <div className="brand-mark">A</div>
    <div style={{display:'flex', flexDirection:'column', lineHeight:1.1}}>
      <div className="brand-name">Atlas</div>
      <div className="brand-tag">Knowledge</div>
    </div>
  </div>
);

const Breadcrumbs = ({ crumbs }) => (
  <div className="breadcrumbs">
    <Icon name="home" size={13} />
    {crumbs.map((c, i) => (
      <React.Fragment key={i}>
        <span className="sep">/</span>
        <a href="#" className={`crumb ${i === crumbs.length - 1 ? 'active' : ''}`}>{c}</a>
      </React.Fragment>
    ))}
  </div>
);

const SearchTrigger = ({ onClick }) => (
  <button className="search-trigger" onClick={onClick}>
    <Icon name="search" size={14} />
    <span>Buscar artículos, tags o categorías…</span>
    <span className="kbd">⌘K</span>
  </button>
);

const Topbar = ({ onSearch, onToggleTweaks, onToggleTheme, theme, crumbs }) => (
  <div className="topbar">
    <Breadcrumbs crumbs={crumbs} />
    <SearchTrigger onClick={onSearch} />
    <div className="top-actions">
      <button className="icon-btn" onClick={onToggleTheme} title="Modo claro/oscuro">
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
      </button>
      <button className="icon-btn" title="Novedades"><Icon name="bell" size={16} /></button>
      <button className="icon-btn" onClick={onToggleTweaks} title="Tweaks"><Icon name="sliders" size={16} /></button>
      <button className="btn-primary"><Icon name="plus" size={14} /> Nuevo artículo</button>
      <div className="avatar" title="Tú">TR</div>
    </div>
  </div>
);

// ============ SIDEBAR ============
const TreeFolder = ({ folder, active, expanded, onToggle, onPickArticle, activeArticleId }) => (
  <div className="tree-node">
    <div className={`tree-row ${active ? 'active' : ''}`} onClick={onToggle}>
      <span className={`tree-chev ${expanded ? 'open' : ''}`}>
        <Icon name="chevron" size={12} stroke={2.2} />
      </span>
      <Icon name={expanded ? 'folder-open' : 'folder'} size={15} className="tree-ico" />
      <span className="tree-label">{folder.name}</span>
      <span className="tree-count">{folder.count}</span>
    </div>
    {expanded && (
      <div className="tree-children">
        {folder.articles.map(a => (
          <div
            key={a.id}
            className={`tree-row leaf ${activeArticleId === a.id ? 'active' : ''}`}
            onClick={() => onPickArticle(a)}
          >
            <span className="tree-chev leaf" />
            <Icon name="file" size={13} className="tree-ico" />
            <span className="tree-label">{a.title}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Sidebar = ({
  view, setView,
  activeCategory, setActiveCategory,
  expandedFolders, toggleFolder,
  activeArticleId, onPickArticle,
  activeTags, toggleTag,
  favCount,
}) => {
  const filteredFolders = FOLDERS.filter(f => f.parent === activeCategory);

  return (
    <aside className="sidebar">
      <div className="nav-group">
        <div className="nav-label">Navegación</div>
        <div className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>
          <Icon name="home" size={15} className="ico" />
          <span className="label">Inicio</span>
        </div>
        <div className={`nav-item ${view === 'favorites' ? 'active' : ''}`} onClick={() => setView('favorites')}>
          <Icon name="star" size={15} className="ico" />
          <span className="label">Favoritos</span>
          <span className="badge">{favCount}</span>
        </div>
        <div className={`nav-item ${view === 'recent' ? 'active' : ''}`} onClick={() => setView('recent')}>
          <Icon name="clock" size={15} className="ico" />
          <span className="label">Recientes</span>
        </div>
      </div>

      <div className="nav-group">
        <div className="nav-label">
          <span>Categorías</span>
          <span className="count">{CATEGORIES.length}</span>
        </div>
        {CATEGORIES.map(c => (
          <div
            key={c.id}
            className={`nav-item ${activeCategory === c.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(c.id)}
          >
            <Icon name={c.icon} size={15} className="ico" />
            <span className="label">{c.name}</span>
            <span className="badge">{c.count}</span>
          </div>
        ))}
      </div>

      <div className="nav-group">
        <div className="nav-label">
          <span>Carpetas</span>
          <span className="count">{filteredFolders.length}</span>
        </div>
        <div className="tree" style={{padding: 0}}>
          {filteredFolders.map(f => (
            <TreeFolder
              key={f.id}
              folder={f}
              expanded={expandedFolders.includes(f.id)}
              onToggle={() => toggleFolder(f.id)}
              onPickArticle={onPickArticle}
              activeArticleId={activeArticleId}
            />
          ))}
        </div>
      </div>

      <div className="nav-group">
        <div className="nav-label">
          <span>Tags populares</span>
          <span className="count">{TAGS.length}</span>
        </div>
        <div className="tag-cloud">
          {TAGS.map(t => (
            <button
              key={t.name}
              className={`tag-pill ${activeTags.includes(t.name) ? 'active' : ''}`}
              onClick={() => toggleTag(t.name)}
            >
              {t.name}
              <span style={{opacity: 0.7, fontSize: 10.5}}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

// ============ SEARCH MODAL ============
const SearchModal = ({ onClose, onPick }) => {
  const [q, setQ] = React.useState('');
  const [focus, setFocus] = React.useState(0);

  const results = React.useMemo(() => {
    if (!q.trim()) return ALL_ARTICLES.slice(0, 6);
    const needle = q.toLowerCase();
    return ALL_ARTICLES
      .filter(a =>
        a.title.toLowerCase().includes(needle) ||
        a.tags.some(t => t.toLowerCase().includes(needle)) ||
        a.folder.toLowerCase().includes(needle)
      )
      .slice(0, 8);
  }, [q]);

  const categoriesMatch = q.trim()
    ? CATEGORIES.filter(c => c.name.toLowerCase().includes(q.toLowerCase())).slice(0, 3)
    : [];

  React.useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setFocus(f => Math.min(f + 1, results.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setFocus(f => Math.max(f - 1, 0)); }
      if (e.key === 'Enter' && results[focus]) { onPick(results[focus]); onClose(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [focus, results, onClose, onPick]);

  const highlight = (text) => {
    if (!q.trim()) return text;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    const parts = text.split(re);
    return parts.map((p, i) => re.test(p) ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>);
  };

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-head">
          <Icon name="search" size={18} />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setFocus(0); }}
            placeholder="Buscar en la base de conocimiento…"
          />
          <span className="esc">ESC</span>
        </div>
        <div className="search-body">
          {categoriesMatch.length > 0 && (
            <>
              <div className="search-group-label">Categorías</div>
              {categoriesMatch.map(c => (
                <div key={c.id} className="search-result">
                  <div className="si"><Icon name={c.icon} size={15} /></div>
                  <div className="sr-main">
                    <div className="sr-title">{highlight(c.name)}</div>
                    <div className="sr-path">{c.count} artículos</div>
                  </div>
                </div>
              ))}
            </>
          )}
          <div className="search-group-label">Artículos</div>
          {results.length === 0 && (
            <div style={{padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13}}>
              Sin resultados para “{q}”
            </div>
          )}
          {results.map((r, i) => (
            <div
              key={r.id}
              className={`search-result ${i === focus ? 'focused' : ''}`}
              onMouseEnter={() => setFocus(i)}
              onClick={() => { onPick(r); onClose(); }}
            >
              <div className="si"><Icon name="file" size={15} /></div>
              <div className="sr-main">
                <div className="sr-title">{highlight(r.title)}</div>
                <div className="sr-path">{r.category} · {r.folder} · {r.tags.map(t => `#${t}`).join(' ')}</div>
              </div>
              <Icon name="arrow" size={14} />
            </div>
          ))}
        </div>
        <div className="search-foot">
          <span><span className="k">↑</span> <span className="k">↓</span> navegar</span>
          <span><span className="k">↵</span> abrir</span>
          <span><span className="k">esc</span> cerrar</span>
          <span style={{marginLeft: 'auto'}}>{ALL_ARTICLES.length} artículos indexados</span>
        </div>
      </div>
    </div>
  );
};

// ============ TWEAKS PANEL ============
const HUES = [
  { name: 'Índigo', value: 265 },
  { name: 'Azul',   value: 255 },
  { name: 'Cerúleo', value: 240 },
  { name: 'Cielo',  value: 225 },
];

const TweaksPanel = ({ onClose, theme, setTheme, density, setDensity, font, setFont, hue, setHue }) => (
  <div className="tweaks-panel">
    <div className="tweaks-head">
      <div className="tweaks-title">Tweaks</div>
      <button className="icon-btn" style={{width: 26, height: 26}} onClick={onClose}>
        <Icon name="close" size={14} />
      </button>
    </div>
    <div className="tweaks-body">
      <div className="tweak-row">
        <div className="tweak-label">Modo</div>
        <div className="seg">
          <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>Claro</button>
          <button className={theme === 'dark'  ? 'on' : ''} onClick={() => setTheme('dark')}>Oscuro</button>
        </div>
      </div>
      <div className="tweak-row">
        <div className="tweak-label">Tono de azul</div>
        <div className="hue-swatches">
          {HUES.map(h => (
            <button
              key={h.value}
              className={`hue-sw ${hue === h.value ? 'on' : ''}`}
              title={h.name}
              style={{background: `oklch(0.55 0.18 ${h.value})`}}
              onClick={() => setHue(h.value)}
            />
          ))}
        </div>
      </div>
      <div className="tweak-row">
        <div className="tweak-label">Densidad</div>
        <div className="seg">
          <button className={density === 'comfy'   ? 'on' : ''} onClick={() => setDensity('comfy')}>Cómodo</button>
          <button className={density === 'compact' ? 'on' : ''} onClick={() => setDensity('compact')}>Compacto</button>
        </div>
      </div>
      <div className="tweak-row">
        <div className="tweak-label">Tipografía del artículo</div>
        <div className="seg">
          <button className={font === 'serif' ? 'on' : ''} onClick={() => setFont('serif')}>Editorial</button>
          <button className={font === 'sans'  ? 'on' : ''} onClick={() => setFont('sans')}>Sans</button>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { Icon, Brand, Topbar, Sidebar, SearchModal, TweaksPanel });
