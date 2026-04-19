// ============ VIEWS: HOME / FAVORITES / RECENT ============

const HERO_STATS = [
  { label: 'Artículos',    value: '151', trend: '+12 esta semana' },
  { label: 'Categorías',   value: '6',   trend: '2 nuevas' },
  { label: 'Contribuidores', value: '24', trend: '+3 este mes' },
  { label: 'Actualizado',  value: 'Hoy', trend: new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}) },
];

const FAVORITES_SEED = [
  { id: 'a-install-mac', pinned: true,  addedAt: '2 abr',  note: 'Setup inicial del equipo' },
  { id: 'a-blocks',      pinned: true,  addedAt: '28 mar', note: 'Referencia diaria' },
  { id: 'a-auth',        pinned: false, addedAt: '15 mar', note: 'Integración con tokens' },
  { id: 'a-webhooks',    pinned: false, addedAt: '10 mar' },
  { id: 'a-invite',      pinned: false, addedAt: '8 mar' },
  { id: 'a-publish',     pinned: false, addedAt: '2 mar',  note: 'Preview social' },
];

const RECENT_SEED = [
  { id: 'a-blocks',      at: 'Hace 12 min', progress: 0.72 },
  { id: 'a-auth',        at: 'Hace 1 h',    progress: 1.0 },
  { id: 'a-shortcuts',   at: 'Hace 3 h',    progress: 0.35 },
  { id: 'a-webhooks',    at: 'Ayer, 17:20', progress: 1.0 },
  { id: 'a-publish',     at: 'Ayer, 11:04', progress: 0.48 },
  { id: 'a-401',         at: '2 abr',       progress: 1.0 },
  { id: 'a-create-ws',   at: '30 mar',      progress: 0.9 },
  { id: 'a-roles',       at: '28 mar',      progress: 0.22 },
  { id: 'a-github',      at: '24 mar',      progress: 1.0 },
  { id: 'a-slack',       at: '20 mar',      progress: 0.6 },
];

const lookupArticle = (id) => ALL_ARTICLES.find(a => a.id === id);

// ---------- HOME ----------
const Home = ({ onOpen, onCategory, onCreateArticle, liveStats }) => {
  const featured = ALL_ARTICLES[0] || lookupArticle('a-blocks');
  const trending  = ALL_ARTICLES.slice(1, 5);

  const heroStats = liveStats ? [
    { label: 'Artículos',    value: String(liveStats.articles), trend: 'en la base' },
    { label: 'Categorías',   value: String(liveStats.categories), trend: 'disponibles' },
    { label: 'Tags activos', value: String(liveStats.tags), trend: 'etiquetas' },
    { label: 'Actualizado',  value: 'Hoy', trend: new Date().toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'}) },
  ] : HERO_STATS;

  if (!featured) return (
    <div className="home-wrap">
      <div className="empty">
        <div className="empty-ico"><Icon name="file" size={28} /></div>
        <div className="empty-title">Sin artículos todavía</div>
        <div className="empty-sub">Crea el primer artículo con el botón "Nuevo artículo".</div>
      </div>
    </div>
  );

  return (
    <div className="home-wrap">
      {/* HERO */}
      <section className="home-hero">
        <div className="hh-bg" />
        <div className="hh-inner">
          <div className="a-eyebrow"><span className="dot" />Base de conocimiento Atlas</div>
          <h1 className="hh-title">
            Todo lo que tu equipo necesita saber, <em>organizado</em>.
          </h1>
          <p className="hh-sub">
            {heroStats[0].value} artículos escritos en Markdown, organizados en {heroStats[1].value} categorías.
            Busca con ⌘K, filtra por tags, o empieza por donde lo dejaste.
          </p>
          <div className="hh-cta">
            <button className="btn-primary" onClick={() => onOpen(featured)}>
              <Icon name="arrow" size={14} /> Continuar leyendo
            </button>
            <button className="btn-ghost"
              onClick={onCreateArticle}
              style={{padding: '8px 14px', border: '1px solid rgba(255,255,255,0.3)'}}>
              <Icon name="plus" size={13} style={{verticalAlign: -2, marginRight: 4}} />
              Crear artículo
            </button>
          </div>
          <div className="hh-stats">
            {heroStats.map(s => (
              <div key={s.label} className="hh-stat">
                <div className="hh-stat-val">{s.value}</div>
                <div className="hh-stat-lbl">{s.label}</div>
                <div className="hh-stat-trend">{s.trend}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="home-section">
        <div className="home-section-head">
          <h2>Explorar por categoría</h2>
          <a href="#" className="home-see-all">Ver todas <Icon name="arrow" size={12}/></a>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((c, i) => (
            <button key={c.id} className="cat-card" onClick={() => onCategory(c.id)} style={{'--i': i}}>
              <div className="cat-ico"><Icon name={c.icon} size={20} /></div>
              <div className="cat-name">{c.name}</div>
              <div className="cat-meta">{c.count} artículos</div>
              <div className="cat-arrow"><Icon name="arrow" size={14} /></div>
            </button>
          ))}
        </div>
      </section>

      {/* TWO-COL: featured + trending */}
      <section className="home-split">
        <div className="home-section">
          <div className="home-section-head">
            <h2>Artículo destacado</h2>
          </div>
          <div className="featured-card" onClick={() => onOpen(featured)}>
            <div className="featured-img">
              <div className="fi-overlay">
                <div className="fi-cat">{featured.category_name || featured.category || 'General'} · {featured.folder_name || featured.folder || ''}</div>
                <div className="fi-title">{featured.title}</div>
                <div className="fi-meta">
                  <span>{featured.author_name || 'Admin'} · {featured.read_time || '5 min'} de lectura · {featured.updated_at ? new Date(featured.updated_at).toLocaleDateString('es-ES') : 'Hoy'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="home-section">
          <div className="home-section-head">
            <h2>Artículos recientes</h2>
          </div>
          {trending.length > 0 ? (
            <ol className="trend-list">
              {trending.map((a, i) => (
                <li key={a.id} className="trend-row" onClick={() => onOpen(a)}>
                  <div className="trend-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="trend-main">
                    <div className="trend-title">{a.title}</div>
                    <div className="trend-path">{a.category_name || a.category || 'General'} · {a.folder_name || a.folder || 'Sin carpeta'}</div>
                  </div>
                  <div className="trend-views">
                    <Icon name="arrow" size={13} />
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="empty" style={{border: '1px dashed var(--border)', padding: 32}}>
              <div className="empty-sub">Crea más artículos para verlos aquí.</div>
            </div>
          )}
        </div>
      </section>

      {/* QUICK ACTIONS + TAGS */}
      <section className="home-split">
        <div className="home-section">
          <div className="home-section-head">
            <h2>Acciones rápidas</h2>
          </div>
          <div className="quick-grid">
            <button className="quick-card" onClick={onCreateArticle}>
              <Icon name="plus" size={16} />
              <div><strong>Nuevo artículo</strong><span>Crea en Markdown desde cero</span></div>
            </button>
            <button className="quick-card" onClick={onCreateArticle}>
              <Icon name="folder" size={16} />
              <div><strong>Importar .md</strong><span>Sube contenido Markdown</span></div>
            </button>
            <button className="quick-card" onClick={() => setSearchOpen && setSearchOpen(true)}>
              <Icon name="search" size={16} />
              <div><strong>Buscar <span className="kbd-inline">⌘K</span></strong><span>Filtra por tags, folder, contenido</span></div>
            </button>
            <button className="quick-card">
              <Icon name="version" size={16} />
              <div><strong>Historial</strong><span>Revisa cambios recientes</span></div>
            </button>
          </div>
        </div>

        <div className="home-section">
          <div className="home-section-head">
            <h2>Tags más activos</h2>
          </div>
          <div className="home-tags">
            {TAGS.map(t => {
              const maxCount = Math.max(...TAGS.map(x => x.count), 1);
              const scale = 0.8 + (t.count / maxCount) * 0.7;
              return (
                <button key={t.name} className="home-tag" style={{fontSize: `${12 + scale * 3}px`}}>
                  <span className="ht-hash">#</span>{t.name}
                  <span className="ht-count">{t.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

// ---------- FAVORITES ----------
const Favorites = ({ favorites, onToggleFav, onOpen }) => {
  const [sort, setSort] = React.useState('pinned');
  const [query, setQuery] = React.useState('');

  const items = favorites
    .map(f => ({ ...f, article: lookupArticle(f.id) }))
    .filter(f => f.article)
    .filter(f => !query.trim() || f.article.title.toLowerCase().includes(query.toLowerCase()));

  const sorted = [...items].sort((a, b) => {
    if (sort === 'pinned') return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    if (sort === 'title')  return a.article.title.localeCompare(b.article.title);
    return 0;
  });

  const pinned  = sorted.filter(f => f.pinned);
  const others  = sorted.filter(f => !f.pinned);

  return (
    <div className="page-wrap">
      <header className="page-head">
        <div className="page-eyebrow"><Icon name="star" size={12} /> Tu biblioteca</div>
        <h1 className="page-title">Favoritos</h1>
        <p className="page-sub">
          Los artículos que marcaste con estrella. Ancla los más importantes para encontrarlos al vuelo.
        </p>
        <div className="page-toolbar">
          <div className="mini-search">
            <Icon name="search" size={13} />
            <input placeholder="Filtrar en favoritos…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="seg" style={{width: 'auto'}}>
            <button className={sort === 'pinned' ? 'on' : ''} onClick={() => setSort('pinned')}>Fijados primero</button>
            <button className={sort === 'title'  ? 'on' : ''} onClick={() => setSort('title')}>Título A–Z</button>
          </div>
          <div className="page-count">{items.length} artículos</div>
        </div>
      </header>

      {pinned.length > 0 && (
        <section className="fav-section">
          <div className="fav-section-head">
            <Icon name="star" size={13} /> Fijados
          </div>
          <div className="fav-grid">
            {pinned.map(f => (
              <FavoriteCard key={f.id} fav={f} onOpen={onOpen} onToggle={onToggleFav} />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="fav-section">
          <div className="fav-section-head">Todos los favoritos</div>
          <div className="fav-list">
            {others.map(f => (
              <FavoriteRow key={f.id} fav={f} onOpen={onOpen} onToggle={onToggleFav} />
            ))}
          </div>
        </section>
      )}

      {items.length === 0 && (
        <div className="empty">
          <div className="empty-ico"><Icon name="star" size={28} /></div>
          <div className="empty-title">Aún no tienes favoritos</div>
          <div className="empty-sub">Haz clic en la estrella de cualquier artículo para añadirlo aquí.</div>
        </div>
      )}
    </div>
  );
};

const FavoriteCard = ({ fav, onOpen, onToggle }) => {
  const a = fav.article;
  return (
    <div className="fav-card" onClick={() => onOpen(a)}>
      <div className="fav-card-head">
        <div className="fav-cat">{a.category}</div>
        <button className="fav-star on" onClick={(e) => { e.stopPropagation(); onToggle(a.id); }}>
          <Icon name="star" size={14} />
        </button>
      </div>
      <div className="fav-title">{a.title}</div>
      <div className="fav-tags">
        {(a.tags || []).map(t => <span key={t} className="tag-pill">{t}</span>)}
      </div>
      {fav.note && <div className="fav-note">"{fav.note}"</div>}
      <div className="fav-foot">
        <Icon name="folder" size={12} /> {a.folder}
        <span style={{marginLeft: 'auto', color: 'var(--text-muted)'}}>Añadido {fav.addedAt}</span>
      </div>
    </div>
  );
};

const FavoriteRow = ({ fav, onOpen, onToggle }) => {
  const a = fav.article;
  return (
    <div className="fav-row" onClick={() => onOpen(a)}>
      <button className="fav-star on" onClick={(e) => { e.stopPropagation(); onToggle(a.id); }}>
        <Icon name="star" size={14} />
      </button>
      <div className="fav-row-main">
        <div className="fav-row-title">{a.title}</div>
        <div className="fav-row-path">{a.category} · {a.folder} · {(a.tags||[]).map(t=>`#${t}`).join(' ')}</div>
      </div>
      <div className="fav-row-date">Añadido {fav.addedAt}</div>
      <Icon name="arrow" size={13} />
    </div>
  );
};

// ---------- RECENT ----------
const Recent = ({ onOpen }) => {
  const [filter, setFilter] = React.useState('all');

  const items = RECENT_SEED
    .map(r => ({ ...r, article: lookupArticle(r.id) }))
    .filter(r => r.article)
    .filter(r => filter === 'all' ? true : filter === 'unread' ? r.progress < 1 : r.progress === 1);

  const buckets = {
    'Hoy':  items.filter(r => r.at.includes('min') || r.at.includes(' h')),
    'Ayer': items.filter(r => r.at.toLowerCase().startsWith('ayer')),
    'Esta semana': items.filter(r => !r.at.includes('min') && !r.at.includes(' h') && !r.at.toLowerCase().startsWith('ayer')),
  };

  return (
    <div className="page-wrap">
      <header className="page-head">
        <div className="page-eyebrow"><Icon name="clock" size={12} /> Tu actividad</div>
        <h1 className="page-title">Recientes</h1>
        <p className="page-sub">
          Retoma donde lo dejaste. Atlas guarda tu progreso de lectura y te muestra los artículos que visitaste últimamente.
        </p>
        <div className="page-toolbar">
          <div className="seg" style={{width: 'auto'}}>
            <button className={filter === 'all'    ? 'on' : ''} onClick={() => setFilter('all')}>Todos</button>
            <button className={filter === 'unread' ? 'on' : ''} onClick={() => setFilter('unread')}>Sin terminar</button>
            <button className={filter === 'done'   ? 'on' : ''} onClick={() => setFilter('done')}>Leídos</button>
          </div>
          <div className="page-count">{items.length} lecturas</div>
          <button className="btn-ghost" style={{marginLeft: 'auto', padding: '6px 12px', border: '1px solid var(--border)'}}>
            Limpiar historial
          </button>
        </div>
      </header>

      <div className="timeline">
        {Object.entries(buckets).map(([label, rows]) =>
          rows.length > 0 && (
            <div key={label} className="tl-group">
              <div className="tl-label">{label}</div>
              <div className="tl-list">
                {rows.map((r, i) => (
                  <div key={r.id + i} className="tl-item" onClick={() => onOpen(r.article)}>
                    <div className="tl-dot-wrap">
                      <div className={`tl-dot ${r.progress === 1 ? 'done' : ''}`} />
                    </div>
                    <div className="tl-card">
                      <div className="tl-card-head">
                        <span className="tl-cat">{r.article.category} · {r.article.folder}</span>
                        <span className="tl-at">{r.at}</span>
                      </div>
                      <div className="tl-title">{r.article.title}</div>
                      <div className="tl-tags">
                        {(r.article.tags||[]).map(t => <span key={t} className="tag-pill">{t}</span>)}
                      </div>
                      <div className="tl-progress">
                        <div className="tl-bar"><div className="tl-fill" style={{width: `${r.progress * 100}%`}}/></div>
                        <span className="tl-pct">
                          {r.progress === 1 ? 'Completo' : `${Math.round(r.progress * 100)}% leído`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {items.length === 0 && (
        <div className="empty">
          <div className="empty-ico"><Icon name="clock" size={28} /></div>
          <div className="empty-title">Sin historial reciente</div>
          <div className="empty-sub">Abre un artículo y Atlas empezará a recordar tu progreso.</div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { Home, Favorites, Recent, FAVORITES_SEED, RECENT_SEED });
