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

const Article = ({ article }) => {
  const [activeSection, setActiveSection] = React.useState(article.sections[0].id);

  React.useEffect(() => {
    const main = document.querySelector('.main');
    if (!main) return;
    const onScroll = () => {
      const headings = article.sections
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

  return (
    <div className="article-wrap">
      <article className="article">
        <ArticleHero article={article} />
        <Prose />
        <Feedback />
        <Related />
      </article>
      <TOC article={article} activeId={activeSection} />
    </div>
  );
};

Object.assign(window, { Article });
