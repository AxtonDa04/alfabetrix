ALFABETRIX - Rediseño visible v3

Esta versión SÍ cambia de forma visible las pantallas principales para acercarse al PDF de rediseño.

Archivos modificados:
- src/index.css
- src/pages/MainMenu.jsx
- src/pages/ModuleSelect.jsx
- src/pages/MyProgress.jsx
- src/pages/Results.jsx
- src/pages/CreateProfile.jsx
- src/pages/Activity.jsx
- src/components/ExerciseRenderer.jsx

Qué se nota visualmente:
1. Menú principal con hero card, anillo de avance, métricas y tarjetas más grandes.
2. Módulos con estilo de ruta de aprendizaje y línea vertical tipo timeline.
3. Resultados con porcentaje circular, tarjetas de resumen y estrellas más grandes.
4. Crear perfil con tarjeta tipo onboarding más cercana al PDF.
5. Actividad con bloque de pregunta más destacado.
6. Opciones de respuesta más grandes y feedback visual más claro.
7. Progreso con tarjetas más modernas y hero visual.

No se toca:
- API PHP
- MySQL
- Servicios JS
- Lógica de guardado de progreso

Instalación:
1. Copia el contenido del ZIP sobre la raíz del proyecto.
2. Acepta reemplazar archivos.
3. Detén Vite:
   Ctrl + C
4. Limpia cache:
   rmdir /s /q node_modules\.vite
5. Ejecuta:
   npm run dev
6. Recarga duro:
   Ctrl + Shift + R

Prueba:
- /create-profile
- /menu
- /modules
- /activity/1
- /results?moduleId=1&correct=5&total=5&stars=3&percentage=100
- /progress
