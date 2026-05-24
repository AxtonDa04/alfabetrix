ALFABETRIX - Fase 1 Visual Base

Objetivo:
Unificar visualmente la app sin tocar la lógica de MySQL/PHP/API.

Archivos incluidos:
1. src/index.css
   - conserva estilos actuales y agrega clases de Fase 1:
     navegación inferior, estados visuales, tarjetas, foco accesible y decoración.

2. src/components/AppLayout.jsx
   - agrega navegación inferior solo en pantallas principales:
     /menu, /modules, /progress, /games, /help, /settings.

3. src/components/BottomNavigation.jsx
   - navegación fija inferior con Lucide React.
   - no requiere instalar paquetes nuevos.

4. src/components/AppHeader.jsx
   - mantiene compatibilidad y agrega soporte opcional para "eyebrow".

5. src/lib/designSystem.js
   - centraliza colores, iconos y temas por módulo.

6. Nuevos componentes reutilizables:
   - StatCard.jsx
   - FeatureCard.jsx
   - ProgressSummaryCard.jsx
   - PageSection.jsx
   - EmptyState.jsx

Dónde colocar:
- Copia cada carpeta del ZIP sobre la raíz del proyecto.
- Permite reemplazar los archivos cuando Windows pregunte.
- No reemplaza servicios, API ni archivos de MySQL.

Después de copiar:
1. Detén Vite con Ctrl + C
2. Ejecuta:
   npm run dev
3. Recarga duro el navegador:
   Ctrl + Shift + R

Validar:
- /menu debe verse igual o mejor, pero ahora con navegación inferior.
- /modules debe conservar módulos y progreso.
- /progress debe conservar datos de MySQL.
- /games, /help y /settings deben verse con navegación inferior.
- /activity y /results NO deben mostrar navegación inferior para no estorbar.

Notas:
- No se instalaron paquetes nuevos.
- Se usa lucide-react, Tailwind, Framer Motion y shadcn/ui, que ya están en el proyecto.
