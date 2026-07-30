
VERSION PREMIUM BASE

Fotos:
public/photos/{destino}/1.jpg ... n.jpg

Ideas ya preparadas:
- mapa interactivo
- ruta del crucero
- galería por puerto
- pantalla especial Santorini
- estructura para desbloqueo por fecha
- animaciones Framer Motion

Siguientes mejoras:
- PDF final
- música
- cartas ocultas
- login secreto
- timeline

## Modo offline (PWA + backup)

### Build offline
- `npm install`
- `npm run build:offline`

La carpeta `out/` queda lista como backup estatico.

### Probar backup estatico en local
- `npm run serve:offline`
- Abrir `http://localhost:4173`

### Instalar como app en movil
- Android: abrir la web y elegir "Instalar app".
- iPhone: Safari > Compartir > "Anadir a pantalla de inicio".

### Checklist antes del crucero
1. Abrir la app con internet y dejarla abierta 1-2 minutos para la precarga automatica en segundo plano.
2. Activar modo avion y confirmar que mapa y paneles siguen cargando.
3. No borrar datos de Safari hasta terminar el viaje.

## Hosting gratuito recomendado

### Opcion 1 (recomendada): Cloudflare Pages
- Gratuito, HTTPS incluido y muy estable para estaticos.
- Flujo simple: conectar repo, build command `npm run build`, output `out`.
- Ideal para abrir desde movil en iPhone/Android.

### Opcion 2: Netlify
- Gratuito, HTTPS incluido.
- Build command `npm run build`, publish directory `out`.

### Opcion 3: GitHub Pages (si prefieres GitHub)
- Gratuito para contenido estatico.
- Requiere ajustar despliegue (Actions o carpeta docs) pero funciona bien.

## Nota importante de fiabilidad offline
- Para garantizar 100% sin cobertura, conviene tener fotos locales reales en `public/photos/{destino}/`.
- Si faltan fotos locales, la app intentara guardar las remotas en cache durante "Descargar todo", pero si alguna URL falla no estara disponible offline.
