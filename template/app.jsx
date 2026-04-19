// ============ APP ROOT ============

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "comfy",
  "font": "serif",
  "hue": 255
}/*EDITMODE-END*/;

const App = () => {
  const [theme,    setTheme]    = React.useState(TWEAK_DEFAULTS.theme);
  const [density,  setDensity]  = React.useState(TWEAK_DEFAULTS.density);
  const [font,     setFont]     = React.useState(TWEAK_DEFAULTS.font);
  const [hue,      setHue]      = React.useState(TWEAK_DEFAULTS.hue);

  const [view, setView] = React.useState('home'); // 'home' | 'favorites' | 'recent' | 'article'
  const [activeCategory, setActiveCategory] = React.useState('product');
  const [expandedFolders, setExpandedFolders] = React.useState(['f-editor']);
  const [activeArticleId, setActiveArticleId] = React.useState('a-blocks');
  const [activeTags, setActiveTags] = React.useState([]);
  const [favorites, setFavorites] = React.useState(FAVORITES_SEED);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  const [editModeOn, setEditModeOn] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.density = density;
    document.documentElement.dataset.font = font;
    document.documentElement.style.setProperty('--hue', hue);
  }, [theme, density, font, hue]);

  const postEdit = React.useCallback((edits) => {
    try { window.parent?.postMessage({type: '__edit_mode_set_keys', edits}, '*'); } catch {}
  }, []);

  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') { setEditModeOn(true); setTweaksOpen(true); }
      if (d.type === '__deactivate_edit_mode') { setEditModeOn(false); setTweaksOpen(false); }
    };
    window.addEventListener('message', onMsg);
    try { window.parent?.postMessage({type: '__edit_mode_available'}, '*'); } catch {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  React.useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Scroll to top when view changes
  React.useEffect(() => {
    const main = document.querySelector('.main');
    if (main) main.scrollTop = 0;
  }, [view, activeArticleId]);

  const toggleFolder = (id) => setExpandedFolders(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleTag    = (name) => setActiveTags(s => s.includes(name) ? s.filter(x => x !== name) : [...s, name]);
  const toggleFav = (id) => {
    setFavorites(s => {
      const existing = s.find(f => f.id === id);
      if (existing) return s.filter(f => f.id !== id);
      return [...s, { id, pinned: false, addedAt: 'Hoy' }];
    });
  };

  const openArticle = (a) => {
    if (!a) return;
    setActiveArticleId(a.id);
    if (a.categoryId) setActiveCategory(a.categoryId);
    if (a.folderId) setExpandedFolders(s => s.includes(a.folderId) ? s : [...s, a.folderId]);
    setView('article');
  };
  const openCategory = (id) => {
    setActiveCategory(id);
    setView('article');
  };

  const updateTheme   = (v) => { setTheme(v);   postEdit({theme: v}); };
  const updateDensity = (v) => { setDensity(v); postEdit({density: v}); };
  const updateFont    = (v) => { setFont(v);    postEdit({font: v}); };
  const updateHue     = (v) => { setHue(v);     postEdit({hue: v}); };

  const crumbs =
    view === 'home'      ? ['Inicio'] :
    view === 'favorites' ? ['Biblioteca', 'Favoritos'] :
    view === 'recent'    ? ['Biblioteca', 'Recientes'] :
    [CURRENT_ARTICLE.category, CURRENT_ARTICLE.folder, CURRENT_ARTICLE.title];

  const screenLabel =
    view === 'home'      ? 'Home' :
    view === 'favorites' ? 'Favorites' :
    view === 'recent'    ? 'Recent' : 'Article';

  return (
    <div className="app">
      <Brand />
      <Topbar
        onSearch={() => setSearchOpen(true)}
        onToggleTweaks={() => setTweaksOpen(v => !v)}
        onToggleTheme={() => updateTheme(theme === 'dark' ? 'light' : 'dark')}
        theme={theme}
        crumbs={crumbs}
      />
      <Sidebar
        view={view}
        setView={setView}
        activeCategory={activeCategory}
        setActiveCategory={(id) => { setActiveCategory(id); setView('article'); }}
        expandedFolders={expandedFolders}
        toggleFolder={toggleFolder}
        activeArticleId={activeArticleId}
        onPickArticle={openArticle}
        activeTags={activeTags}
        toggleTag={toggleTag}
        favCount={favorites.length}
      />
      <main className="main" data-screen-label={screenLabel}>
        {view === 'home'      && <Home onOpen={openArticle} onCategory={openCategory} />}
        {view === 'favorites' && <Favorites favorites={favorites} onToggleFav={toggleFav} onOpen={openArticle} />}
        {view === 'recent'    && <Recent onOpen={openArticle} />}
        {view === 'article'   && <Article article={CURRENT_ARTICLE} />}
      </main>

      {searchOpen && (
        <SearchModal
          onClose={() => setSearchOpen(false)}
          onPick={openArticle}
        />
      )}

      {tweaksOpen ? (
        <TweaksPanel
          onClose={() => setTweaksOpen(false)}
          theme={theme}     setTheme={updateTheme}
          density={density} setDensity={updateDensity}
          font={font}       setFont={updateFont}
          hue={hue}         setHue={updateHue}
        />
      ) : (
        !editModeOn && (
          <button className="tweaks-fab" onClick={() => setTweaksOpen(true)} title="Tweaks">
            <Icon name="sliders" size={18} />
          </button>
        )
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
