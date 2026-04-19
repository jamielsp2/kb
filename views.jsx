// ============ VIEWS: HOME / FAVORITES / RECENT ============

const HERO_STATS = [
  { label: 'Artículos',    value: '0', trend: '-' },
  { label: 'Categorías',   value: '0', trend: '-' },
  { label: 'Tags activos', value: '0', trend: '-' },
  { label: 'Actualizado',  value: '--', trend: '--' },
];

const FAVORITES_SEED = [];
const RECENT_SEED = [];

// Helper to look up article by ID
const lookupArticle = (id) => (window.ALL_ARTICLES || []).find(a => a.id === id);

// ---------- HOME ----------
const Home = ({ onOpen, onCategory, onCreateArticle, liveStats }) => {
  // Use the global data injected in data.jsx
  const articles  = window.ALL_ARTICLES || []; 
  const categories = window.CATEGORIES || [];
  
  const featured = articles.length > 0 ? articles[0] : null;
  const trending = articles.length > 1 ? articles.slice(1, 5) : [];

  const heroStats = liveStats ? [
    { label: 'Artículos',    value: String(liveStats.articles), trend: 'en la base' },
    { label: 'Categorías',   value: String(liveStats.categories), trend: 'disponibles' },
    { label: 'Tags activos', value: String(liveStats.tags), trend: 'etiquetas' },
    { label: 'Actualizado',  value: 'Hoy', trend: new Date().toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'}) },
  ] : HERO_STATS;

  return (
    <div className="home-wrap">
      {/* HERO — SIEMPRE VISIBLE */}
      <section className="home-hero">
        <div className="hh-bg" />
        <div className="hh-inner">
          <div className="a-eyebrow"><span className="dot" />Globetec Technology GROUP</div>
          <h1 className="hh-title" style={{fontSize: 'calc(var(--fs-2xl) * 1.3)', fontWeight: 800, marginBottom: '2rem'}}>
            Portal de Conocimiento de Globetec Technology GROUP
          </h1>
          
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

      {/* CONTENIDO DENTRO DEL HOME */}
      {(!articles || articles.length === 0) ? (
        <section className="home-section">
          <div className="empty" style={{padding: '60px 20px', background: 'var(--bg-paper)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)'}}>
            <div className="empty-ico" style={{opacity: 0.3}}><Icon name="plus" size={40} /></div>
            <div className="empty-title" style={{marginTop: 16}}>Bienvenido a tu nuevo Portal</div>
            <div className="empty-sub">Para comenzar, crea tu primera categoría y luego añade artículos.</div>
            <button className="btn-primary" onClick={onCreateArticle} style={{marginTop: 20}}>
              Crear primer artículo
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* CATEGORY GRID */}
          <section className="home-section">
            <div className="home-section-head">
              <h2>Explorar por categoría</h2>
            </div>
            <div className="cat-grid">
              {categories.map((c, i) => (
                <div key={c.id} className="cat-card" onClick={() => onCategory(c)}>
                  <div className="cat-card-ico"><Icon name={c.icon || 'folder'} size={24} /></div>
                  <div className="cat-card-info">
                    <div className="cat-card-name">{c.name}</div>
                    <div className="cat-card-count">{c.article_count || 0} artículos</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </>
      )}
    </div>
  );
};

// ---------- FAVORITES ----------
const Favorites = ({ favorites, onToggleFav, onOpen }) => {
  if (!favorites || favorites.length === 0) return (
    <div className="view-wrap">
      <div className="empty">
        <div className="empty-ico"><Icon name="star" size={28} /></div>
        <div className="empty-title">Sin favoritos todavía</div>
        <div className="empty-sub">Pulsa en la estrella de cualquier artículo para guardarlo aquí.</div>
      </div>
    </div>
  );

  return (
    <div className="view-wrap">
      <h1 className="view-title">Mis favoritos</h1>
      <div className="fav-grid">
        {favorites.map(f => {
          const articles = window.ALL_ARTICLES || [];
          const a = articles.find(art => art.id === f.article_id);
          if (!a) return null;
          return (
            <div key={f.id} className="fav-card" onClick={() => onOpen(a)}>
              <button className="fav-star active" onClick={(e) => { e.stopPropagation(); onToggleFav(a); }}>
                <Icon name="star" size={16} />
              </button>
              <div className="fav-body">
                <div className="fav-meta">{a.category_name} • {a.read_time}</div>
                <div className="fav-title">{a.title}</div>
                {f.note && <div className="fav-note"><Icon name="arrow" size={12} style={{transform:'rotate(90deg)', marginRight:4}} /> {f.note}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- RECENT ----------
const Recent = ({ onOpen }) => {
  const items = RECENT_SEED || [];

  if (items.length === 0) return (
    <div className="view-wrap">
      <div className="empty">
        <div className="empty-ico"><Icon name="clock" size={28} /></div>
        <div className="empty-title">Historial vacío</div>
        <div className="empty-sub">Aquí aparecerán los artículos que hayas leído recientemente.</div>
      </div>
    </div>
  );

  return (
    <div className="view-wrap">
      <h1 className="view-title">Leído recientemente</h1>
      <div className="recent-list">
        {items.map(r => {
          const a = lookupArticle(r.id);
          if (!a) return null;
          return (
            <div key={r.id} className="recent-item" onClick={() => onOpen(a)}>
              <div className="recent-info">
                <div className="recent-title">{a.title}</div>
                <div className="recent-meta">{a.category_name} • Visto {r.at}</div>
              </div>
              <div className="recent-progress">
                <div className="rp-bar"><div className="rp-fill" style={{width: (r.progress*100)+'%'}} /></div>
                <span>{Math.round(r.progress*100)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
