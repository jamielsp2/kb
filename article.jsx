// ============ ARTICLE VIEW ============

const CodeBlock = ({ lang, children }) => (
  <pre>
    <span className="lang-tag">{lang}</span>
    <code>{children}</code>
  </pre>
);

const Callout = ({ type = 'info', children }) => (
  <div className="callout">
    <Icon name={type === 'info' ? 'info' : 'star'} size={18} className="ci" />
    <div>{children}</div>
  </div>
);

const ArticleHero = ({ article }) => (
  <header className="a-hero">
    <div className="a-eyebrow">
      <span className="dot" />
      <span>{article.category} · {article.folder}</span>
    </div>
    <h1 className="a-title">{article.title}</h1>
    <p className="a-subtitle">{article.subtitle}</p>
    <div className="a-meta">
      <div className="author-stack">
        <div className="avatars">
          {article.authors.map((a, i) => (
            <div key={i} className="avatar" style={{background: a.color}} title={a.name}>{a.initials}</div>
          ))}
        </div>
        <span>Escrito por <strong style={{color: 'var(--text)', fontWeight: 500}}>{article.authors[0].name}</strong> y {article.authors.length - 1} más</span>
      </div>
      <span className="dotsep" />
      <span><Icon name="clock" size={12} style={{verticalAlign: -2, marginRight: 4}} />{article.readTime} de lectura</span>
      <span className="dotsep" />
      <span>Actualizado el <strong style={{color: 'var(--text)', fontWeight: 500}}>{article.updated}</strong></span>
      <span className="dotsep" />
      <div className="tags">
        {article.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
      </div>
    </div>
  </header>
);

const Prose = () => (
  <div className="prose">
    <h2 id="resumen">Resumen rápido</h2>
    <p>
      Atlas usa <strong>Markdown estándar</strong> (CommonMark) con un conjunto cuidado de extensiones: callouts,
      bloques de código con resaltado, tablas, checklists y embeds nativos de vídeo e imagen.
      Si ya sabes Markdown <em>ya sabes Atlas</em> — solo hay un par de sorpresas agradables.
    </p>
    <Callout>
      <strong>Importa lo que ya tienes.</strong> Arrastra una carpeta con archivos <code>.md</code> al editor y
      Atlas recreará la estructura de carpetas como árbol navegable, preservando frontmatter y enlaces cruzados.
    </Callout>

    <h2 id="sintaxis">Sintaxis soportada</h2>
    <p>
      Encontrarás la mayoría de elementos habituales: encabezados, listas ordenadas y desordenadas, tablas,
      separadores, enlaces con título, imágenes y referencias. Lo importante en un portal de conocimiento es
      que <strong>la jerarquía sea clara</strong>, así que presta atención al orden de tus <code>##</code> y <code>###</code>.
    </p>

    <h3 id="encabezados">Encabezados y estructura</h3>
    <p>
      Cada artículo debería empezar con un <code>#</code> (título) y organizarse en <code>##</code> para
      secciones principales y <code>###</code> para subtemas. Atlas genera automáticamente la tabla de contenidos
      a la derecha que ves al leer este artículo.
    </p>

    <h3 id="codigo">Bloques de código</h3>
    <p>Los bloques de código reconocen el lenguaje y aplican resaltado automático:</p>
    <pre>
      <span className="lang-tag">javascript</span>
      <code>
        <span className="tok-com">{`// Publica un artículo desde un archivo .md`}</span>{`\n`}
        <span className="tok-kw">import</span>{` { atlas } `}<span className="tok-kw">from</span>{` `}<span className="tok-str">{`'@atlas/sdk'`}</span>{`;\n\n`}
        <span className="tok-kw">const</span>{` doc = `}<span className="tok-kw">await</span>{` atlas.`}<span className="tok-fn">publish</span>{`({\n`}
        {`  path: `}<span className="tok-str">{`'./guides/markdown.md'`}</span>{`,\n`}
        {`  folder: `}<span className="tok-str">{`'editor'`}</span>{`,\n`}
        {`  tags: [`}<span className="tok-str">{`'markdown'`}</span>{`, `}<span className="tok-str">{`'editor'`}</span>{`],\n`}
        {`});\n\n`}
        {`console.`}<span className="tok-fn">log</span>{`(`}<span className="tok-str">{'`Publicado: ${doc.url}`'}</span>{`);`}
      </code>
    </pre>

    <h2 id="callouts">Callouts y notas</h2>
    <p>
      Los callouts destacan información importante. Úsalos con moderación — un callout cada pocos
      párrafos es perfecto. Demasiados y pierden impacto.
    </p>
    <blockquote>
      Un buen artículo guía al lector de lo general a lo específico. Empieza con el <em>por qué</em>, luego el <em>qué</em>, y
      solo al final entra en el <em>cómo</em>.
    </blockquote>

    <h2 id="embeds">Embeds e imágenes</h2>
    <p>
      Arrastra imágenes directamente al editor, o pega URLs de vídeo de YouTube, Loom o Vimeo y Atlas
      las convertirá en previews embebidos. Para diagramas técnicos hay soporte nativo de Mermaid.
    </p>
    <div className="img-placeholder">Screenshot — Vista del editor con menú slash</div>

    <h2 id="atajos">Atajos de teclado</h2>
    <p>Los atajos más usados en el editor:</p>
    <ul>
      <li><code>⌘ + B</code> — Negrita</li>
      <li><code>⌘ + I</code> — Cursiva</li>
      <li><code>⌘ + K</code> — Insertar enlace</li>
      <li><code>⌘ + ⇧ + C</code> — Bloque de código</li>
      <li><code>/</code> — Abrir menú slash con todos los bloques</li>
    </ul>

    <h2 id="importar">Importar desde .md</h2>
    <p>
      Si ya tienes una base de conocimiento en Markdown — en un repo de GitHub, en Obsidian, o en una carpeta local —
      puedes importarla completa. Atlas detecta frontmatter YAML, convierte wikilinks <code>[[así]]</code> en
      enlaces internos, y preserva tu estructura de carpetas como árbol de navegación.
    </p>
    <p>
      <a href="#">Ver guía completa de importación →</a>
    </p>
  </div>
);

const Feedback = () => {
  const [vote, setVote] = React.useState(null);
  return (
    <div className="feedback">
      <div>
        <div className="feedback-text">¿Te resultó útil este artículo?</div>
        <div className="feedback-sub">Tu respuesta nos ayuda a mejorar la documentación.</div>
      </div>
      <div className="feedback-btns">
        <button className={`feedback-btn ${vote === 'up' ? 'selected' : ''}`} onClick={() => setVote('up')}>
          <Icon name="thumbUp" size={14} /> Sí, útil
        </button>
        <button className={`feedback-btn ${vote === 'down' ? 'selected' : ''}`} onClick={() => setVote('down')}>
          <Icon name="thumbDown" size={14} /> No del todo
        </button>
      </div>
    </div>
  );
};

const Related = () => (
  <div className="related">
    <h4>Artículos relacionados</h4>
    <div className="related-grid">
      {RELATED.map((r, i) => (
        <div key={i} className="related-card">
          <div className="r-folder">{r.folder}</div>
          <div className="r-title">{r.title}</div>
          <div className="r-snip">{r.snip}</div>
        </div>
      ))}
    </div>
  </div>
);

const TOC = ({ article, activeId }) => (
  <aside className="toc-wrap">
    <div className="toc-label">En esta página</div>
    <ul className="toc-list">
      {article.sections.map(s => (
        <li key={s.id} className={s.level === 3 ? 'h3' : 'h2'}>
          <a href={`#${s.id}`} className={activeId === s.id ? 'active' : ''}>{s.title}</a>
        </li>
      ))}
    </ul>
    <div className="toc-meta">
      <div className="toc-meta-row">
        <Icon name="version" size={14} className="ki" />
        <span><strong>{article.version}</strong> · {article.updated}</span>
      </div>
      <div className="toc-meta-row">
        <Icon name="edit" size={14} className="ki" />
        <a href="#">Sugerir un cambio</a>
      </div>
      <div className="toc-meta-row">
        <Icon name="copy" size={14} className="ki" />
        <a href="#">Copiar como Markdown</a>
      </div>
    </div>
  </aside>
);

const Article = ({ article, onDeleted, onUpdated }) => {
  const [activeSection, setActiveSection] = React.useState(article.sections?.[0]?.id || '');
  const [editing,     setEditing]    = React.useState(false);
  const [deleting,    setDeleting]   = React.useState(false);
  const [saving,      setSaving]     = React.useState(false);
  const [editMsg,     setEditMsg]    = React.useState('');

  // Edit form state
  const [editTitle,   setEditTitle]   = React.useState(article.title || '');
  const [editContent, setEditContent] = React.useState(article.content_md || '');
  const [editTags,    setEditTags]    = React.useState((article.tags || []).join(', '));
  const [editPreview, setEditPreview] = React.useState(false);

  // Who can edit: admin or the article's creator
  const currentUser = window.__ATLAS_USER__;
  const canEdit = currentUser && (
    currentUser.role === 'admin' ||
    (article.created_by && currentUser.id === article.created_by)
  );

  // Reset edit form when article changes
  React.useEffect(() => {
    setEditTitle(article.title || '');
    setEditContent(article.content_md || '');
    setEditTags((article.tags || []).join(', '));
    setEditing(false);
    setEditMsg('');
  }, [article.id]);

  // TOC scroll spy
  React.useEffect(() => {
    const main = document.querySelector('.main');
    if (!main) return;
    const onScroll = () => {
      const headings = (sectionsToUse)
        .map(s => ({ id: s.id, el: document.getElementById(s.id) }))
        .filter(h => h.el);
      const top = main.scrollTop + 100;
      let current = headings[0]?.id;
      for (const h of headings) {
        if (h.el.offsetTop <= top) current = h.id;
      }
      setActiveSection(current);
    };
    main.addEventListener('scroll', onScroll);
    return () => main.removeEventListener('scroll', onScroll);
  }, [article]);

  const hasDynamicContent = !!article.content_md;

  const dynamicSections = React.useMemo(() => {
    if (!hasDynamicContent) return article.sections || [];
    const lines = article.content_md.split('\n');
    const sections = [];
    lines.forEach(line => {
      const h2 = line.match(/^## (.+)/);
      const h3 = line.match(/^### (.+)/);
      if (h2) {
        const id = h2[1].toLowerCase().replace(/[^a-záéíóúñ0-9]+/g, '-').replace(/^-|-$/g, '');
        sections.push({ id, title: h2[1], level: 2 });
      } else if (h3) {
        const id = h3[1].toLowerCase().replace(/[^a-záéíóúñ0-9]+/g, '-').replace(/^-|-$/g, '');
        sections.push({ id, title: h3[1], level: 3 });
      }
    });
    return sections.length > 0 ? sections : (article.sections || []);
  }, [article, hasDynamicContent]);

  const renderedHtml = React.useMemo(() => {
    const src = editing ? editContent : article.content_md;
    if (!src || !window.marked) return '';
    let html = marked.parse(src);
    html = html.replace(/<h([23])>(.*?)<\/h\1>/g, (_, level, text) => {
      const id = text.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^a-záéíóúñ0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<h${level} id="${id}">${text}</h${level}>`;
    });
    return html;
  }, [article, hasDynamicContent, editContent, editing]);

  const sectionsToUse = hasDynamicContent ? dynamicSections : (article.sections || []);

  // ── Save edit ──
  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) { setEditMsg('Título y contenido son requeridos.'); return; }
    setSaving(true); setEditMsg('');
    try {
      const res = await fetch(`${API}?action=update_article`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: article.id,
          title: editTitle.trim(),
          content_md: editContent,
          tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditing(false);
        setEditMsg('');
        onUpdated && onUpdated(article.id);
      } else {
        setEditMsg(data.error || 'Error al guardar.');
      }
    } catch { setEditMsg('Error de conexión.'); }
    setSaving(false);
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!confirm(`¿Eliminar el artículo "${article.title}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}?action=delete_article&id=${encodeURIComponent(article.id)}`, {
        method: 'DELETE', credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        onDeleted && onDeleted();
      } else {
        alert(data.error || 'No se pudo eliminar el artículo.');
      }
    } catch { alert('Error de conexión.'); }
    setDeleting(false);
  };

  // ── Formatted updated date ──
  const updatedStr = article.updated_at
    ? new Date(article.updated_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : (article.updated || '');

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
    background: 'var(--bg)', color: 'var(--text)',
    fontSize: 14, fontFamily: 'inherit', outline: 'none',
    transition: 'border-color .15s',
  };

  return (
    <div className="article-wrap">
      <article className="article">

        {/* ── Hero ── */}
        <header className="a-hero">
          <div className="a-eyebrow">
            <span className="dot" />
            <span>{article.category_name || article.category}{article.folder_name ? ` · ${article.folder_name}` : ''}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <h1 className="a-title" style={{ flex: 1 }}>{article.title}</h1>
            {/* Edit / Delete buttons — only for owner or admin */}
            {canEdit && !editing && (
              <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginTop: 6 }}>
                <button
                  onClick={() => setEditing(true)}
                  title="Editar artículo"
                  style={{
                    padding: '6px 12px', borderRadius: 'var(--r-sm)', fontSize: 12.5, fontWeight: 600,
                    border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-soft)',
                    display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all .12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-soft)'; }}
                >
                  <Icon name="edit" size={13} /> Editar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  title="Eliminar artículo"
                  style={{
                    padding: '6px 12px', borderRadius: 'var(--r-sm)', fontSize: 12.5, fontWeight: 600,
                    border: '1px solid var(--border)', background: 'var(--surface)', color: 'oklch(0.55 0.14 30)',
                    display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all .12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'oklch(0.96 0.04 30)'; e.currentTarget.style.borderColor = 'oklch(0.8 0.08 30)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <Icon name="close" size={13} /> {deleting ? '…' : 'Eliminar'}
                </button>
              </div>
            )}
          </div>
          <p className="a-subtitle">{article.subtitle}</p>
          <div className="a-meta">
            <div className="author-stack">
              <div className="avatars">
                <div className="avatar" style={{ background: article.author_color || 'var(--accent)' }}>
                  {article.author_initials || 'AU'}
                </div>
              </div>
              <span>Escrito por <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{article.author_name || 'Autor'}</strong></span>
            </div>
            <span className="dotsep" />
            <span><Icon name="clock" size={12} style={{ verticalAlign: -2, marginRight: 4 }} />{article.read_time || article.readTime || '5 min'} de lectura</span>
            <span className="dotsep" />
            <span>Actualizado el <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{updatedStr}</strong></span>
            {article.tags?.length > 0 && <><span className="dotsep" /><div className="tags">{article.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}</div></>}
          </div>
        </header>

        {/* ── Inline edit panel ── */}
        {editing && (
          <div style={{
            margin: '0 0 28px', padding: '20px 24px',
            border: '1px solid var(--accent)', borderRadius: 'var(--r-md)',
            background: 'var(--accent-soft)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--accent)', marginBottom: 14 }}>
              Editando artículo
            </div>

            {editMsg && (
              <div style={{ padding: '8px 12px', borderRadius: 8, background: 'oklch(0.96 0.04 30)', color: 'oklch(0.4 0.15 30)', fontSize: 13, marginBottom: 12, border: '1px solid oklch(0.85 0.07 30)' }}>
                {editMsg}
              </div>
            )}

            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 5 }}>Título</label>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 5 }}>
                Tags <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(separados por coma)</span>
              </label>
              <input value={editTags} onChange={e => setEditTags(e.target.value)} placeholder="api, tutorial, react" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Contenido Markdown</label>
                <button onClick={() => setEditPreview(v => !v)}
                  style={{ fontSize: 12, padding: '3px 9px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', cursor: 'pointer', color: 'var(--text-soft)' }}>
                  {editPreview ? 'Editar' : 'Previsualizar'}
                </button>
              </div>
              {editPreview ? (
                <div className="prose" style={{ minHeight: 280, padding: '16px 18px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', background: 'var(--surface)', maxWidth: 'none', overflow: 'auto' }}
                  dangerouslySetInnerHTML={{ __html: renderedHtml }} />
              ) : (
                <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                  rows={14} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => { setEditing(false); setEditMsg(''); }}
                style={{ padding: '8px 16px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                <Icon name="check" size={14} /> {saving ? 'Guardando…' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        )}

        {/* ── Content ── */}
        {hasDynamicContent ? (
          <div className="prose" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
        ) : (
          <Prose />
        )}

        <Feedback />
      </article>

      <TOC article={{ ...article, sections: sectionsToUse }} activeId={activeSection} />
    </div>
  );
};

Object.assign(window, { Article });

