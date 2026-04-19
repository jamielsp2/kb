// ============ DATA ============
const CATEGORIES = [
  { id: 'getting-started', name: 'Primeros pasos', icon: 'rocket', count: 14 },
  { id: 'product',         name: 'Producto',       icon: 'box',    count: 38 },
  { id: 'integrations',    name: 'Integraciones',  icon: 'plug',   count: 22 },
  { id: 'billing',         name: 'Facturación',    icon: 'card',   count: 11 },
  { id: 'api',             name: 'API & Desarrollo', icon: 'code', count: 47 },
  { id: 'troubleshooting', name: 'Solución de problemas', icon: 'wrench', count: 19 },
];

const FOLDERS = [
  { id: 'f-install', parent: 'getting-started', name: 'Instalación y setup', count: 6,
    articles: [
      { id: 'a-install-mac', title: 'Instalar Atlas en macOS', tags: ['setup', 'macos'] },
      { id: 'a-install-win', title: 'Instalar Atlas en Windows', tags: ['setup', 'windows'] },
      { id: 'a-install-linux', title: 'Instalar Atlas en Linux', tags: ['setup', 'linux'] },
    ]
  },
  { id: 'f-workspaces', parent: 'getting-started', name: 'Workspaces y equipos', count: 8,
    articles: [
      { id: 'a-create-ws', title: 'Crear tu primer workspace', tags: ['workspace', 'onboarding'] },
      { id: 'a-invite', title: 'Invitar colaboradores al workspace', tags: ['workspace', 'teams'] },
      { id: 'a-roles', title: 'Roles y permisos', tags: ['workspace', 'security'] },
    ]
  },
  { id: 'f-editor', parent: 'product', name: 'Editor y bloques', count: 15,
    articles: [
      { id: 'a-blocks', title: 'Tipos de bloque en el editor', tags: ['editor', 'markdown'] },
      { id: 'a-shortcuts', title: 'Atajos de teclado imprescindibles', tags: ['editor', 'productividad'] },
    ]
  },
  { id: 'f-publish', parent: 'product', name: 'Publicar y compartir', count: 9,
    articles: [
      { id: 'a-publish', title: 'Publicar un artículo al portal público', tags: ['publish', 'seo'] },
      { id: 'a-share', title: 'Compartir con enlaces privados', tags: ['publish', 'security'] },
    ]
  },
  { id: 'f-slack', parent: 'integrations', name: 'Slack', count: 7,
    articles: [
      { id: 'a-slack', title: 'Conectar Slack a tu workspace', tags: ['slack', 'integrations'] },
    ]
  },
  { id: 'f-github', parent: 'integrations', name: 'GitHub', count: 8,
    articles: [
      { id: 'a-github', title: 'Sincronizar repos de GitHub', tags: ['github', 'integrations'] },
    ]
  },
  { id: 'f-plans', parent: 'billing', name: 'Planes y precios', count: 6,
    articles: [
      { id: 'a-plans', title: 'Comparativa de planes', tags: ['pricing'] },
    ]
  },
  { id: 'f-rest', parent: 'api', name: 'REST API', count: 22,
    articles: [
      { id: 'a-auth', title: 'Autenticación con tokens', tags: ['api', 'auth'] },
      { id: 'a-ratelimit', title: 'Rate limiting y cuotas', tags: ['api', 'limits'] },
    ]
  },
  { id: 'f-webhooks', parent: 'api', name: 'Webhooks', count: 9,
    articles: [
      { id: 'a-webhooks', title: 'Configurar webhooks entrantes', tags: ['api', 'webhooks'] },
    ]
  },
  { id: 'f-errors', parent: 'troubleshooting', name: 'Errores comunes', count: 12,
    articles: [
      { id: 'a-401', title: 'Error 401: token inválido', tags: ['errors', 'api'] },
      { id: 'a-sync', title: 'El workspace no se sincroniza', tags: ['errors', 'workspace'] },
    ]
  },
];

const TAGS = [
  { name: 'api', count: 42 },
  { name: 'editor', count: 28 },
  { name: 'workspace', count: 24 },
  { name: 'markdown', count: 19 },
  { name: 'setup', count: 17 },
  { name: 'integrations', count: 15 },
  { name: 'security', count: 14 },
  { name: 'webhooks', count: 9 },
  { name: 'billing', count: 8 },
];

// The main article the user is viewing
const CURRENT_ARTICLE = {
  id: 'a-blocks',
  category: 'Producto',
  categoryId: 'product',
  folder: 'Editor y bloques',
  folderId: 'f-editor',
  title: 'Escribir en Markdown: bloques, atajos y el editor de Atlas',
  subtitle: 'Todo lo que necesitas saber para escribir contenido estructurado en Atlas usando sintaxis Markdown estándar con extensiones para callouts, embeds y bloques de código.',
  readTime: '6 min',
  updated: '12 abr 2026',
  version: 'v3.2',
  tags: ['editor', 'markdown', 'productividad'],
  authors: [
    { name: 'Lucía Méndez', initials: 'LM', color: 'oklch(0.72 0.15 30)' },
    { name: 'David Ortiz',  initials: 'DO', color: 'oklch(0.68 0.17 200)' },
    { name: 'Noa Keller',   initials: 'NK', color: 'oklch(0.7 0.15 320)' },
  ],
  sections: [
    { id: 'resumen',        title: 'Resumen rápido',             level: 2 },
    { id: 'sintaxis',       title: 'Sintaxis soportada',         level: 2 },
    { id: 'encabezados',    title: 'Encabezados y estructura',   level: 3 },
    { id: 'codigo',         title: 'Bloques de código',          level: 3 },
    { id: 'callouts',       title: 'Callouts y notas',           level: 2 },
    { id: 'embeds',         title: 'Embeds e imágenes',          level: 2 },
    { id: 'atajos',         title: 'Atajos de teclado',          level: 2 },
    { id: 'importar',       title: 'Importar desde .md',         level: 2 },
  ]
};

const RELATED = [
  { folder: 'Editor y bloques', title: 'Atajos de teclado imprescindibles', snip: 'Una hoja rápida con los atajos más útiles para moverte por el editor sin tocar el ratón.' },
  { folder: 'Producto',         title: 'Publicar un artículo al portal público', snip: 'Configura permisos, SEO, slug y la preview social antes de que salga al mundo.' },
  { folder: 'API & Desarrollo', title: 'Crear contenido via REST API',      snip: 'Automatiza la subida de archivos Markdown desde tu pipeline o CI.' },
  { folder: 'Primeros pasos',   title: 'Roles y permisos',                  snip: 'Quién puede editar, comentar o solo leer en tus workspaces.' },
];

// Flat article index for search
const ALL_ARTICLES = FOLDERS.flatMap(f =>
  f.articles.map(a => ({
    ...a,
    folder: f.name,
    folderId: f.id,
    category: CATEGORIES.find(c => c.id === f.parent).name,
    categoryId: f.parent,
  }))
);

Object.assign(window, { CATEGORIES, FOLDERS, TAGS, CURRENT_ARTICLE, RELATED, ALL_ARTICLES });
