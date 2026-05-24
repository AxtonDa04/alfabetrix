ALFABETRIX - Fase 1.2 Visual Detalles

Qué hace este paquete:
- Corrige opacidades no estándar de Tailwind como /12, /16, /18, /35, /88, etc.
- Agrega navegación inferior común en:
  /menu, /modules, /progress, /games, /help, /settings.
- Mejora detalles globales:
  foco accesible, microinteracciones, hover, tarjetas, píldoras, divisores y estados visuales.
- Agrega componentes reutilizables:
  BottomNavigation, StatCard, FeatureCard, EmptyState, PageSection, designSystem.
- No toca PHP, MySQL ni endpoints.
- No instala paquetes nuevos.

Colocación:
Copia el contenido del ZIP sobre la raíz del proyecto y acepta reemplazar archivos.

Después:
1. Detén Vite:
   Ctrl + C

2. Limpia cache si hace falta:
   rmdir /s /q node_modules\.vite

3. Corre:
   npm run dev

4. Recarga duro:
   Ctrl + Shift + R

Validación rápida:
- /menu abre y tiene navegación inferior.
- /modules conserva módulos y progreso.
- /progress conserva datos de MySQL.
- /activity NO debe mostrar navegación inferior.
- /results NO debe mostrar navegación inferior.
