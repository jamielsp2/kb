# 🗺️ Estructura del Proyecto — Atlas KB (Globetec)

Este documento explica la organización del código y la función de cada archivo principal para facilitar el mantenimiento y la escalabilidad.

---

## 📁 Archivos de Interfaz (React)
El frontend está construido con **React 18** cargado vía CDN (sin necesidad de `npm install`), utilizando Babel para procesar los archivos `.jsx` en tiempo real.

| Archivo | Función |
| :--- | :--- |
| **`index.html`** | El punto de entrada principal. Carga las librerías externas (React, Babel, Lucide, Marked) y los scripts de la app. |
| **`app.jsx`** | El "cerebro". Maneja el estado global, la carga de datos del API, el enrutamiento interno y los modales principales (Crear artículo, Gestión). |
| **`views.jsx`** | Contiene las vistas principales: **Home** (portada), **Favoritos** y **Recientes**. Aquí se personaliza el diseño de la portada. |
| **`components.jsx`** | Componentes reutilizables: Iconos, Barra Superior (Topbar), Barra Lateral (Sidebar) y el Buscador global. |
| **`article.jsx`** | Se encarga de mostrar un artículo individual, renderizar el Markdown y manejar las acciones de edición/eliminación. |
| **`users.jsx`** | Módulo de gestión de usuarios (solo para administradores). Permite crear, editar roles y suspender cuentas. |
| **`data.jsx`** | Archivo de configuración para datos estáticos y variables globales de ventana. |

---

## 🎨 Estilos (CSS)
| Archivo | Función |
| :--- | :--- |
| **`styles.css`** | Define el diseño base, el sistema de colores (OKLCH), la tipografía y el layout (Sidebar + Main). |
| **`views.css`** | Estilos específicos para las vistas y tarjetas (cards) de la portada y rejillas de categorías. |

---

## ⚙️ Backend y Base de Datos (PHP + SQLite)
| Archivo / Carpeta | Función |
| :--- | :--- |
| **`api/config.php`** | Configura la conexión PDO a la base de datos SQLite. Detecta si debe crear la carpeta `data/`. |
| **`api/index.php`** | API REST principal. Maneja el CRUD de artículos, categorías, carpetas y etiquetas. |
| **`api/auth.php`** | Gestiona el inicio de sesión, sesiones de usuario y la administración de cuentas. |
| **`api/reset.php`** | **Script de inicialización**. Crea las tablas y el primer usuario admin. (⚠️ Borrar tras el primer uso). |
| **`data/atlas.db`** | El archivo físico donde se guardan todos tus datos. |

---

## 🐳 Despliegue (Docker / Coolify)
| Archivo | Función |
| :--- | :--- |
| **`Dockerfile`** | Instrucciones para construir la imagen. Instala el soporte de SQLite en PHP y optimiza Apache. |
| **`entrypoint.sh`** | Script de arranque que asegura que el servidor tenga permisos de escritura sobre el volumen de datos. |
| **`.gitattributes`**| Asegura que los scripts funcionen bien aunque se suban desde Windows (evita errores de fin de línea). |

---

## 🔐 Seguridad y Producción
1. **Acceso a DB**: El archivo `.htaccess` bloquea el acceso directo a la carpeta `/data/`. Solo PHP puede leer la base de datos.
2. **Propiedad de Artículos**: Los colaboradores solo pueden editar los artículos que ellos mismos crearon. El Admin puede editarlo todo.
3. **Persistencia**: En Coolify, el volumen debe apuntar a `/var/www/html/data` para no perder la base de datos al actualizar.
