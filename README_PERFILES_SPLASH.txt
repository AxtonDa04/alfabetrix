ALFABETRIX - Perfil eliminable + Splash global

Incluye:
1. src/App.jsx
   - Muestra el Splash durante 3.2 segundos al cargar una URL interna directa como /menu, /modules, /progress, etc.
   - No lo muestra en cada navegación interna, solo al iniciar la app.

2. src/pages/Splash.jsx
   - Ahora acepta props: autoNavigate, onDone y minDuration.
   - Sigue funcionando normal en /, redirigiendo a /create-profile.
   - También sirve como splash de carga global sin redirigir.

3. src/services/profileService.js
   - Agrega deleteProfile(profileId).
   - Unifica createProfile usando apiClient.

4. api/v1/profiles/index.php
   - Agrega DELETE /profiles/?id=...
   - Elimina primero datos relacionados del perfil:
     user_settings, module_progress, activity_attempts, user_rewards,
     generated_exercises y certificates.
   - Luego elimina user_profiles.
   - Usa transacción para evitar borrar a medias si ocurre error.

5. src/pages/CreateProfile.jsx
   - Agrega botón rojo de eliminar junto a la palomita de cada perfil.
   - Muestra confirmación antes de borrar.
   - Si se elimina el perfil activo, limpia la sesión local.
   - Si ya no quedan perfiles, muestra formulario para crear uno nuevo.

Instalación:
1. Copia el contenido del ZIP sobre la raíz del proyecto.
2. Acepta reemplazar archivos.
3. Reinicia Vite:
   Ctrl + C
   npm run dev
4. Recarga duro:
   Ctrl + Shift + R

Pruebas recomendadas:
1. Ir a Configuración > Cerrar sesión / cambiar usuario.
2. En la pantalla de perfiles, eliminar un perfil de prueba.
3. Confirmar en phpMyAdmin:
   SELECT * FROM user_profiles;
   SELECT * FROM module_progress;
   SELECT * FROM user_settings;

4. Abrir directamente:
   http://localhost:5173/modules
   Debe aparecer Splash 3.2 segundos y después cargar /modules.
