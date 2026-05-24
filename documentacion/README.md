# ALFABETRIX

**Proyecto Escolar Comunitario — CONALEP Ixtapaluca (2026)**

Aplicación web progresiva (PWA) orientada a la alfabetización de adultos mayores. Ofrece una experiencia accesible, touch-friendly y con asistencia por voz (TTS) para que personas adultas puedan aprender a leer y escribir paso a paso, con calma y a su propio ritmo.

> **Lema:** *"Aprende paso a paso, con calma y a tu ritmo."*

---

## Índice

1. [Descripción general](#descripcion-general)
2. [Stack tecnológico](#stack-tecnologico)
3. [Arquitectura del proyecto](#arquitectura-del-proyecto)
4. [Frontend — Páginas y componentes](#frontend)
5. [Backend — API REST PHP](#backend)
6. [Base de datos MySQL](#base-de-datos)
7. [Sistema de módulos y progreso](#sistema-de-modulos)
8. [Rutas de la aplicación](#rutas)
9. [Servicios y API](#servicios)
10. [Accesibilidad](#accesibilidad)
11. [Instalación y configuración](#instalacion)
12. [Scripts disponibles](#scripts)

---

<a name="descripcion-general"></a>
## 1. Descripción general

ALFABETRIX es una plataforma educativa diseñada específicamente para adultos mayores que inician su proceso de alfabetización. La aplicación se compone de **6 módulos progresivos** que van desde el reconocimiento de vocales hasta la comprensión lectora de textos breves.

### Público objetivo
- Adultos mayores (edad sugerida: 60+)
- Personas sin escolaridad previa
- Usuarios con poca o nula experiencia en tecnología

### Principios de diseño
- **Interfaces táctiles grandes**: botones de mínimo 48px, targets cómodos
- **Tipografía de lectura fácil**: Nunito + Atkinson Hyperlegible, tamaños grandes
- **Asistencia por voz**: cada instrucción, pregunta y mensaje puede ser leído en voz alta con un solo toque
- **Sin presión**: no hay castigos por errores, se puede repetir cualquier módulo
- **Retroalimentación positiva**: mensajes alentadores del personaje "Lex" (la guía)
- **Tema visual cálido**: paleta guinda, verde, beige, arena y salvia

---

<a name="stack-tecnologico"></a>
## 2. Stack tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | ^18.2.0 | Librería UI |
| Vite | ^6.1.0 | Bundler / dev server |
| React Router DOM | ^6.26.0 | Enrutamiento SPA |
| Tailwind CSS | ^3.4.17 | Estilos utilitarios |
| Framer Motion | ^11.16.4 | Animaciones |
| Radix UI | múltiple | Primitivas accesibles (49 componentes) |
| React Hook Form | ^7.54.2 | Manejo de formularios |
| Zod | ^3.24.2 | Validación de esquemas |
| TanStack React Query | ^5.84.1 | Estado asíncrono / caché |
| Lucide React | ^0.475.0 | Iconos SVG |
| Recharts | ^2.15.4 | Gráficas de progreso |
| canvas-confetti | ^1.9.4 | Confetti en resultados |
| jsPDF + html2canvas | ^4.2.1 / ^1.4.1 | Generación de PDF (certificados) |
| embla-carousel-react | ^8.5.2 | Carruseles |
| vaul | ^1.1.2 | Drawers accesibles |
| sonner | ^2.0.1 | Toasts |
| cmdk | ^1.0.0 | Command palette |
| input-otp | ^1.4.2 | Campos OTP |
| Stripe | ^3.0.0 / ^5.2.0 | Pagos |

### Backend

| Tecnología | Propósito |
|------------|-----------|
| PHP 8+ con PDO | API REST |
| MySQL 8+ / MariaDB | Base de datos relacional |
| Apache (XAMPP) | Servidor web |

### DevOps

| Herramienta | Propósito |
|-------------|-----------|
| ESLint + `eslint-plugin-react` | Linter |
| TypeScript (type-checking) | Verificación de tipos en `jsconfig.json` |
| PostCSS + autoprefixer | Procesamiento CSS |
| `tailwindcss-animate` | Animaciones Tailwind |

---

<a name="arquitectura-del-proyecto"></a>
## 3. Arquitectura del proyecto

```
alfabetrix/
│
├── api/                          # Backend PHP
│   ├── config/
│   │   ├── database.php          # Conexión PDO a MySQL
│   │   ├── cors.php              # Headers CORS (localhost:5173)
│   │   └── ___database.php       # Copia de respaldo
│   └── v1/
│       ├── activities/
│       │   └── index.php         # GET /?module_id=... → actividades
│       ├── activity-options/
│       │   └── index.php         # GET /?activity_id=... → opciones
│       ├── lessons/
│       │   └── index.php         # (endpoint de lecciones)
│       ├── modules/
│       │   └── index.php         # GET / → módulos activos ordenados
│       ├── profiles/
│       │   └── index.php         # GET → listar, POST → crear, DELETE → eliminar
│       ├── progress/
│       │   └── index.php         # GET → consultar, POST → crear/actualizar
│       └── rewards/
│           └── index.php         # GET → desbloquear+listar, POST → sincronizar
│
├── db/                           # Esquemas SQL
│   ├── schema.sql                # Esquema inicial (versión corta)
│   └── schema_v1.sql             # Esquema final v1 con seeds, FK, índices
│
├── entities/                     # Definiciones de entidades (Base44 legacy)
│   ├── Progress
│   ├── Reward
│   └── UserProfile
│
├── public/                       # Archivos estáticos
│   ├── favicon.ico / .png
│   ├── apple-touch-icon.png
│   ├── icon-192.png / icon-512.png
│   └── manifest.json
│
├── src/                          # Código fuente frontend
│   ├── api/                      # (reservado para llamadas HTTP)
│   ├── assets/
│   │   └── images/
│   │       └── logo-conalep.png  # Logo institucional CONALEP
│   ├── components/               # Componentes reutilizables
│   │   ├── ui/                   # 49 primitivas shadcn-style (Radix UI)
│   │   ├── AppHeader.jsx         # Header con botón de regreso
│   │   ├── AppLayout.jsx         # Layout con bottom navigation
│   │   ├── BottomNavigation.jsx  # Barra fija inferior (5 items)
│   │   ├── EmptyState.jsx        # Estado vacío genérico
│   │   ├── ExerciseRenderer.jsx  # Renderizador de ejercicios
│   │   ├── FeatureCard.jsx       # Tarjeta de funcionalidad
│   │   ├── LexBubble.jsx         # Burbuja del personaje Lex
│   │   ├── MemoryGame.jsx        # Juego de memoria (6 pares)
│   │   ├── PageSection.jsx       # Sección de página con título
│   │   ├── ProgressSummaryCard.jsx # Resumen de progreso
│   │   ├── ProtectedRoute.jsx    # Ruta protegida
│   │   ├── StarAnimation.jsx     # Animación de estrellas
│   │   ├── StatCard.jsx          # Tarjeta estadística
│   │   └── UserNotRegisteredError.jsx # Error de acceso
│   ├── hooks/
│   │   └── use-mobile.jsx        # Hook de detección mobile (<768px)
│   ├── lib/
│   │   ├── AuthContext.jsx       # Contexto de autenticación (perfil local)
│   │   ├── PageNotFound.jsx      # Página 404
│   │   ├── modules.js            # Datos estáticos de módulos y ejercicios
│   │   ├── query-client.js       # TanStack QueryClient config
│   │   ├── tts.js                # Text-to-Speech (Web Speech API)
│   │   └── useSettings.js        # Hook de configuración (font, contraste, volumen)
│   ├── pages/
│   │   ├── Splash.jsx            # Pantalla de inicio animada
│   │   ├── CreateProfile.jsx     # Creación/selección de perfil
│   │   ├── MainMenu.jsx          # Menú principal con dashboard
│   │   ├── ModuleSelect.jsx      # Selección de módulos (timeline)
│   │   ├── Activity.jsx          # Ejercicios del módulo
│   │   ├── Results.jsx           # Resultados con confetti
│   │   ├── MyProgress.jsx        # Progreso detallado + recompensas
│   │   ├── Games.jsx             # Juegos interactivos
│   │   ├── Help.jsx              # Ayuda y preguntas frecuentes
│   │   └── Settings.jsx          # Configuración de accesibilidad
│   ├── services/
│   │   ├── apiClient.js          # Cliente HTTP base
│   │   ├── profileService.js     # CRUD de perfiles
│   │   ├── modulesService.js     # Consulta de módulos
│   │   ├── activitiesService.js  # Consulta de actividades
│   │   ├── activityOptionsService.js # Consulta de opciones
│   │   ├── progressService.js    # Consulta/guardado de progreso
│   │   └── Home.jsx              # Componente de prueba (debug)
│   ├── styles/                   # Estilos adicionales (vacíos)
│   ├── utils/
│   │   └── index.ts              # Utilidad createPageUrl
│   ├── App.jsx                   # Componente raíz con rutas
│   ├── index.css                 # Estilos globales + Tailwind
│   └── main.jsx                  # Entry point
│
├── dist/                         # Build de producción
├── documentacion/                # Documentación adicional
├── borrar/                       # Archivos temporales/legacy
│
├── .env                          # Variables de entorno (api base url)
├── .gitignore
├── components.json               # Configuración shadcn/ui
├── eslint.config.js              # Configuración ESLint flat
├── index.html                    # HTML principal
├── jsconfig.json                 # Configuración TypeScript/JS
├── package.json
├── postcss.config.js
├── tailwind.config.js            # Tema: guinda, verde, beige, etc.
└── vite.config.js                # Alias @ → src/
```

---

<a name="frontend"></a>
## 4. Frontend — Páginas y componentes

### 4.1 Páginas

#### `/src/pages/Splash.jsx`
Pantalla de presentación institucional que se muestra al cargar la aplicación. Incluye:
- Logo de CONALEP Ixtapaluca (desde `src/assets/images/logo-conalep.png`)
- Fondo gradiente con blur (guinda, verde, beige)
- Icono de la app circular
- Animación Framer Motion (fade-in, scale, spring)
- Barra de progreso animada de 3.2 segundos
- Navegación automática a `/create-profile` al terminar
- Puede usarse también como splash interno en navegación directa

#### `/src/pages/CreateProfile.jsx`
Gestión de perfiles de usuario. Soporta:
- Lista de perfiles guardados (desde MySQL vía `profileService`)
- Selección de perfil existente → redirige a `/menu`
- Creación de perfil nuevo (nombre + edad opcional)
- Eliminación de perfil con confirmación (borra en cascada: progreso, intentos, recompensas, certificados, ajustes)
- Almacenamiento en `localStorage` como `alfabetrix_profile`
- Mensaje TTS de bienvenida de Lex

#### `/src/pages/MainMenu.jsx`
Menú principal tipo dashboard con:
- Tarjeta de bienvenida con nombre del usuario y foto de la app
- Anillo de progreso radial (conic-gradient via CSS custom property)
- Indicador de avance general (módulos completados / total)
- Botón de acción principal "Practicar {siguiente módulo}"
- Tres tarjetas de resumen: Estrellas, Módulos, Ruta (%)
- Grid de 6 tarjetas de navegación: Aprender, Mi progreso, Mis logros, Juegos, Ayuda, Configuración
- Datos cargados desde: `getProfiles()`, `getModules()`, `getProgress()`
- Botón de audio para escuchar resumen

#### `/src/pages/ModuleSelect.jsx`
Selección de módulos con vista de **timeline vertical**:
- Timeline CSS con gradiente (guinda → verde → arena) y dots conectados
- Cada módulo muestra: ícono, nombre, descripción, barra de progreso, estrellas
- Línea temporal conectora `::before` con `linear-gradient`
- Módulos bloqueados (candado) si no se alcanzó 70% en el anterior
- Módulos completados con checkmark verde
- Módulo desbloqueado con flecha y efecto hover
- Encabezado con barra de progreso general

#### `/src/pages/Activity.jsx`
Ejecución de ejercicios del módulo:
- Carga dinámica desde MySQL: `getActivities(dbModuleId)` + `getActivityOptions(activityId)`
- Máximo 5 ejercicios por ronda
- Tipos de actividad: `select_option`, `listen_and_choose`, `match_image_word`, `complete_word`, `order_letters`, `order_phrase`, `reading_comprehension`, `memory_game`, `word_search`, `target_sound`
- Mapeo de `moduleId` (1-6) a `dbModuleId` (UUID)
- Barra de progreso de la ronda
- Al terminar: calcula estrellas (3: ≥90%, 2: ≥70%, 1: >0%), guarda progreso, redirige a `/results`

#### `/src/pages/Results.jsx`
Pantalla de resultados con:
- Confetti (`canvas-confetti`) en colores institucionales si pasó el módulo
- Anillo de progreso grande (escala 1.35×)
- Animación de estrellas (1-3) con spring animation
- Mensaje contextual de Lex según desempeño
- Grid de 3 indicadores: Puntaje, Estrellas, Avance
- Botones: Siguiente módulo / Repetir / Menú principal
- TTS automático del resultado

#### `/src/pages/MyProgress.jsx`
Panel de progreso detallado:
- Consulta robusta a la API con 4 estrategias de endpoints (fallback)
- Sistema de recompensas/insignias con catálogo automático
- 3 formas de normalización de datos de la API
- Parseo seguro de fechas con `toLocaleDateString('es-MX')`
- Módulos cargados desde API o fallback local (`MODULES`)
- Cálculo de progreso acumulado por módulo

#### `/src/pages/Games.jsx`
Juegos interactivos para reforzar el aprendizaje:
- **Memory Game**: juego de memoria con 6 pares (palabra ↔ emoji). Palabras: MAMÁ, PAPÁ, MESA, SOL, LUNA, AGUA
- Tablero 4×4 con animaciones Framer Motion
- Contador de movimientos, botón de nuevo juego
- TTS al descubrir palabras y al completar el juego
- Diseño responsivo con grid

#### `/src/pages/Help.jsx`
Página de ayuda con:
- Personaje Lex como guía (burbuja con emoji 🧠)
- 3 pasos visuales: Escuche, Toque, Repita (con iconos Lucide)
- Acordeón de 6 preguntas frecuentes (FAQ) con TTS
- Botón "Escuchar explicación" en cada respuesta
- Efectos hover y transiciones

#### `/src/pages/Settings.jsx`
Configuración de accesibilidad:
- Tamaño de letra: 3 niveles (Normal, Grande, Muy grande)
- Alto contraste (toggle)
- Volumen del TTS (slider 0-100)
- Persistencia en `localStorage` como `alfabetrix_settings`
- TTS de confirmación al cambiar opciones

### 4.2 Componentes principales

| Componente | Archivo | Función |
|------------|---------|---------|
| **AppHeader** | `AppHeader.jsx` | Header con botón de regreso, título, subtítulo y slot derecho |
| **AppLayout** | `AppLayout.jsx` | Layout con `Outlet` de React Router + `BottomNavigation` condicional |
| **BottomNavigation** | `BottomNavigation.jsx` | Barra fija inferior con 5 ítems: Inicio, Aprender, Progreso, Juegos, Ajustes |
| **ExerciseRenderer** | `ExerciseRenderer.jsx` | Renderiza el ejercicio actual con animaciones, TTS, pistas y feedback |
| **LexBubble** | `LexBubble.jsx` | Burbuja de diálogo del personaje "Lex" con TTS |
| **MemoryGame** | `MemoryGame.jsx` | Juego de memoria completo con 6 pares |
| **FeatureCard** | `FeatureCard.jsx` | Tarjeta con ícono, título y descripción |
| **EmptyState** | `EmptyState.jsx` | Estado vacío con ícono, título y acción |
| **StatCard** | `StatCard.jsx` | Tarjeta estadística con 5 tonos de color |
| **ProgressSummaryCard** | `ProgressSummaryCard.jsx` | Resumen de progreso con anillo |
| **StarAnimation** | `StarAnimation.jsx` | Animación de estrellas con spring |
| **ProtectedRoute** | `ProtectedRoute.jsx` | Ruta protegida verificando autenticación |
| **PageSection** | `PageSection.jsx` | Sección con título opcional y slot derecho |

### 4.3 UI Primitives (49 componentes)

Basados en shadcn/ui con Radix UI:

`accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `input`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toaster`, `toggle-group`, `toggle`, `tooltip`, `use-toast`

### 4.4 Tema y paleta de colores

Definido en `tailwind.config.js`:

| Color | HEX | HSL | Uso |
|-------|-----|-----|-----|
| `guinda` | `#7A0F3D` | `335 78% 25%` | Color primario, botones, títulos |
| `verde` | `#1F6A43` | `143 26% 36%` | Éxito, progreso, aciertos |
| `beige` | `#F7F4EE` | `42 33% 95%` | Fondo principal |
| `arena` | `#DCC9A9` | `40 43% 77%` | Acentos suaves |
| `salvia` | `#8DAA91` | `143 19% 62%` | Secundario, badges |
| `azul` | `#5C7FA3` | `209 28% 50%` | Acento informativo |
| `tinta` | `#3E3E3E` | `0 0% 24%` | Texto principal |
| `terracota` | `#C97B63` | `8 52% 59%` | Destructivo, errores |

---

<a name="backend"></a>
## 5. Backend — API REST PHP

### 5.1 Configuración

**`api/config/database.php`**: Conexión PDO a MySQL local (`root` sin contraseña, base `alfabetrix`). Manejo de errores con `PDO::ERRMODE_EXCEPTION`.

**`api/config/cors.php`**: Permite orígenes:
- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://192.168.100.12:5173`

Headers: `Content-Type`, `Authorization`, `X-Requested-With`. Métodos: `GET, POST, PUT, PATCH, DELETE, OPTIONS`.

### 5.2 Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/profiles/` | Lista todos los perfiles ordenados por fecha |
| `POST` | `/api/v1/profiles/` | Crea perfil + configuración de accesibilidad |
| `DELETE` | `/api/v1/profiles/?id=XXX` | Elimina perfil con limpieza en cascada (13 tablas) |
| `GET` | `/api/v1/modules/` | Lista módulos activos ordenados por `order_index` |
| `GET` | `/api/v1/activities/?module_id=XXX` | Actividades activas de un módulo |
| `GET` | `/api/v1/activity-options/?activity_id=XXX` | Opciones de respuesta de una actividad |
| `GET` | `/api/v1/progress/?user_profile_id=XXX&module_id=XXX` | Progreso de un usuario/módulo |
| `POST` | `/api/v1/progress/` | Crea o actualiza progreso (upsert) |
| `GET` | `/api/v1/rewards/?user_profile_id=XXX` | Desbloquea recompensas pendientes + lista |
| `POST` | `/api/v1/rewards/` | Sincroniza recompensas manualmente |

### 5.3 Formato de respuesta

```json
{
  "success": true,
  "data": [ ... ]
}
```

Errores:
```json
{
  "success": false,
  "error": "Mensaje de error"
}
```

---

<a name="base-de-datos"></a>
## 6. Base de datos MySQL

### 6.1 Tablas (13)

| # | Tabla | Propósito |
|---|-------|-----------|
| 1 | `users` | Usuarios del sistema (login legacy) |
| 2 | `user_profiles` | Perfiles de estudiantes (nombre, edad, foto, nivel) |
| 3 | `user_settings` | Configuración por perfil (font_size, contraste, volumen) |
| 4 | `modules` | Módulos educativos (6 módulos base) |
| 5 | `lessons` | Lecciones por módulo |
| 6 | `activities` | Ejercicios (10 tipos, con JSON de contenido) |
| 7 | `activity_options` | Opciones de respuesta por actividad |
| 8 | `activity_attempts` | Intentos de usuario por actividad |
| 9 | `module_progress` | Progreso acumulado por usuario + módulo |
| 10 | `reward_catalog` | Catálogo de recompensas/insignias |
| 11 | `user_rewards` | Recompensas ganadas por usuario |
| 12 | `generated_exercises` | Ejercicios generados por IA (Gemini) |
| 13 | `certificates` | Certificados generados (module/final) |

### 6.2 Tipos de actividad (10)

- `select_option` — Seleccionar opción correcta
- `listen_and_choose` — Escuchar y elegir
- `match_image_word` — Relacionar imagen con palabra
- `complete_word` — Completar palabra faltante
- `order_letters` — Ordenar letras
- `order_phrase` — Ordenar frase
- `reading_comprehension` — Comprensión lectora
- `memory_game` — Juego de memoria
- `word_search` — Sopa de letras
- `target_sound` — Identificar sonido objetivo

### 6.3 Módulos semilla

| Orden | Module Key | Nombre | Descripción | Desbloqueo |
|-------|-----------|--------|-------------|------------|
| 1 | `vocales` | Vocales | Reconocer vocales A, E, I, O, U | Siempre disponible |
| 2 | `consonantes` | Consonantes básicas | M, P, S, L, T, N | 70% en vocales |
| 3 | `silabas` | Sílabas | ma, pa, sa, la, ta | 70% en consonantes |
| 4 | `palabras` | Palabras simples | mamá, mesa, sol, pan, mano | 70% en sílabas |
| 5 | `frases` | Frases cortas | Frases: "Mamá me ama" | 70% en palabras |
| 6 | `comprension` | Comprensión básica | Texto breve + preguntas | 70% en frases |

### 6.4 Recompensas semilla

6 insignias (`badge_vocales` a `badge_comprension`), una por módulo, desbloqueables al alcanzar ≥70% en el módulo correspondiente.

---

<a name="sistema-de-modulos"></a>
## 7. Sistema de módulos y progreso

### 7.1 Flujo de aprendizaje

```
Splash → Crear perfil → Menú principal → Seleccionar módulo
                                         → Hasta 5 ejercicios
                                         → Resultados (confetti + estrellas)
                                         → Siguiente módulo / Repetir / Menú
```

### 7.2 Cálculo de progreso

- El progreso se guarda en `module_progress` (por user + module)
- `percentage`: calculado como `(correctas / total) × 100`
- `completed`: `true` si percentage ≥ 70
- `stars`: 1 (>0%), 2 (≥70%), 3 (≥90%)
- Al repetir un módulo: se acumulan respuestas correctas/incorrectas, se usa el mayor porcentaje y estrellas
- `current_round` se incrementa en cada repetición

### 7.3 Sistema de desbloqueo

Cada módulo requiere ≥70% en el módulo anterior para desbloquearse. El primer módulo (Vocales) siempre está disponible.

### 7.4 Recompensas

- Se desbloquean automáticamente al consultar `/api/v1/rewards/`
- Usan `INSERT IGNORE` para evitar duplicados
- Se sincronizan en la pantalla de progreso
- Cada módulo tiene su insignia correspondiente

---

<a name="rutas"></a>
## 8. Rutas de la aplicación

| Ruta | Página | Descripción | Layout |
|------|--------|-------------|--------|
| `/` | `Splash` | Pantalla de presentación CONALEP | Sin layout |
| `/create-profile` | `CreateProfile` | Selección/creación de perfil | Sin layout |
| `/menu` | `MainMenu` | Menú principal con dashboard | `AppLayout` + BottomNav |
| `/modules` | `ModuleSelect` | Timeline de módulos | `AppLayout` + BottomNav |
| `/activity/:moduleId` | `Activity` | Ejercicios del módulo | Sin BottomNav |
| `/results` | `Results` | Resultados con confetti | Sin BottomNav |
| `/progress` | `MyProgress` | Progreso detallado + insignias | `AppLayout` + BottomNav |
| `/games` | `Games` | Juegos interactivos | `AppLayout` + BottomNav |
| `/help` | `Help` | Ayuda y preguntas frecuentes | `AppLayout` + BottomNav |
| `/settings` | `Settings` | Configuración de accesibilidad | `AppLayout` + BottomNav |
| `*` | `PageNotFound` | Página 404 | Sin layout |

### 8.1 Bottom Navigation (5 ítems)

Siempre visible en las rutas principales:
- **Inicio** (`/menu`)
- **Aprender** (`/modules`)
- **Progreso** (`/progress`)
- **Juegos** (`/games`)
- **Ajustes** (`/settings`) — también activo en `/help`

Barra fija inferior con `!important` para garantizar posicionamiento. Estilo activo con fondo guinda y texto blanco.

---

<a name="servicios"></a>
## 9. Servicios y API

### 9.1 Cliente HTTP (`apiClient.js`)

- Base URL: `http://localhost/alfabetrix/api/v1`
- Método `request(endpoint, options)` con `fetch`
- Headers: `Content-Type: application/json`
- Métodos helpers: `getModules()`, `getActivities(moduleId)`

### 9.2 Service Layer

| Servicio | Métodos | Endpoints |
|----------|---------|-----------|
| `profileService` | `getProfiles()`, `createProfile()`, `deleteProfile()` | `/profiles/` |
| `modulesService` | `getModules()` | `/modules/` |
| `activitiesService` | `getActivities(moduleId)` | `/activities/?module_id=` |
| `activityOptionsService` | `getActivityOptions(activityId)` | `/activity-options/?activity_id=` |
| `progressService` | `getProgress()`, `saveProgress()` | `/progress/` |

### 9.3 Cliente MyProgress (fallback API)

La página `MyProgress.jsx` tiene su propio cliente HTTP con:
- 4 estrategias de normalización de respuesta (`data`, `results`, `progress`, `rewards`)
- 4 patrones de endpoint fallback (`modules/`, `modules/index.php`, etc.)
- 6 claves de búsqueda de perfil en localStorage
- 2 formatos de parseo de fechas

---

<a name="accesibilidad"></a>
## 10. Accesibilidad

### 10.1 Configuración de usuario

Parámetros guardados en `localStorage` (`alfabetrix_settings`) y sincronizados con MySQL (`user_settings`):

| Parámetro | Valores | Default |
|-----------|---------|---------|
| `font_size` | `normal`, `large`, `extra_large` | `large` |
| `high_contrast` | `true`, `false` | `false` |
| `volume` | 0–100 | 80 |
| `voice_enabled` | `true`, `false` | `true` |
| `music_enabled` | `true`, `false` | `false` |
| `navigation_voice` | `true`, `false` | `true` |
| `reduced_motion` | `true`, `false` | `false` |

### 10.2 Alto contraste

Clase CSS `.high-contrast` que anula variables CSS:
- Fondo blanco puro (`#ffffff`)
- Texto negro puro (`#000000`)
- Bordes con grosor 2px
- Sin sombras (`box-shadow: none`)

### 10.3 Text-to-Speech (`tts.js`)

- API: Web Speech API (`window.speechSynthesis`)
- Idioma: `es-MX` (fallback a `es`)
- Velocidad: `0.85` (más lento para adultos mayores)
- Volumen: desde `localStorage` (`alfabetrix_volume`, default 80%)
- Voz: busca voz mexicana primero, luego cualquier español
- Precarga de voces al cargar el módulo
- Función `stopSpeaking()` para cancelar

### 10.4 Touch targets

- Todos los botones tienen mínimo 48px de altura
- Inputs de 64px / 72px
- Tarjetas clickeables con área completa
- `-webkit-tap-highlight-color: transparent`

### 10.5 Tipografía

- Principal: **Nunito** (pesos 400–900, redonda y amigable)
- Secundaria: **Atkinson Hyperlegible** (diseñada para baja visión)
- Tamaños adaptables por configuración (`.text-lg`, `.text-xl`, `.text-2xl`)

---

<a name="instalacion"></a>
## 11. Instalación y configuración

### 11.1 Requisitos

- Node.js ≥ 18
- MySQL 8+ o MariaDB
- PHP 8+ con extensión PDO MySQL
- Apache (XAMPP, WAMP, Laragon, etc.)
- Navegador moderno con soporte para Web Speech API

### 11.2 Configuración del backend

1. Clonar el proyecto en `C:\xampp\htdocs\alfabetrix\` (o el document root de Apache)
2. Crear la base de datos MySQL:
   ```sql
   CREATE DATABASE alfabetrix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Importar el esquema:
   ```bash
   mysql -u root alfabetrix < db/schema_v1.sql
   ```
4. Verificar la conexión en `api/config/database.php`:
   ```php
   $host = "localhost";
   $db_name = "alfabetrix";
   $username = "root";
   $password = "";
   ```

### 11.3 Configuración del frontend

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear archivo `.env.local`:
   ```
   VITE_BASE44_APP_ID=tu_app_id
   VITE_BASE44_APP_BASE_URL=http://localhost/alfabetrix/api/v1
   VITE_API_BASE_URL=http://localhost/alfabetrix/api/v1
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Asegurarse de que Apache esté corriendo con MySQL

### 11.4 Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_BASE44_APP_ID` | — | ID de app Base44 (legacy) |
| `VITE_BASE44_APP_BASE_URL` | — | URL backend Base44 (legacy) |
| `VITE_API_BASE_URL` | `http://localhost/alfabetrix/api/v1` | URL base de la API PHP |

---

<a name="scripts"></a>
## 12. Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo Vite (hot reload) |
| `npm run build` | Compila para producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint en modo silencioso |
| `npm run lint:fix` | Ejecuta ESLint y corrige errores automáticos |
| `npm run typecheck` | Verifica tipos con TypeScript (`jsconfig.json`) |

---

## Licencia

Proyecto académico sin fines de lucro. CONALEP Ixtapaluca — 2026.

---

## Créditos

- **Institución**: CONALEP Ixtapaluca, Estado de México
- **Año**: 2026
- **Personaje guía**: Lex (🧠)
- **Paleta visual**: Guinda (`#7A0F3D`), Verde (`#1F6A43`), Beige (`#F7F4EE`), Arena (`#DCC9A9`), Salvia (`#8DAA91`)
