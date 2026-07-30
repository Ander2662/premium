# Guia de despliegue y operativa offline

## Objetivo
Publicar la web gratis en Cloudflare Pages y dejarla preparada para uso sin cobertura en iPhone/Android.

## 1) Preparar repositorio en GitHub
1. Crear un repositorio nuevo en GitHub.
2. Desde la carpeta del proyecto ejecutar:

   git init
   git add .
   git commit -m "crucero offline pwa"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main

## 2) Crear proyecto en Cloudflare Pages
1. Entrar en Cloudflare Dashboard.
2. Ir a Workers & Pages.
3. Pulsar Create application.
4. Elegir Pages.
5. Seleccionar Connect to Git.
6. Autorizar GitHub y elegir el repositorio.

## 3) Configuracion de build
Usar estos valores:
- Framework preset: None (recomendado para export estatico).
- Build command: npm run build
- Build output directory: out
- Root directory: /
- Deploy command: (vacio)

Importante:
- No usar `npx wrangler deploy` en este proyecto.
- No usar OpenNext/Workers mientras `next.config.mjs` tenga `output: 'export'`.
- Si Cloudflare muestra deteccion automatica de Next.js Worker, desactivarla y mantener modo Pages estatico.

No hacen falta variables de entorno para este proyecto.

## 4) Desplegar
1. Pulsar Save and Deploy.
2. Esperar a que termine el build.
3. Cloudflare generara una URL tipo:
   https://tu-proyecto.pages.dev

## 5) Instalar en iPhone
1. Abrir la URL en Safari.
2. Esperar 1-2 minutos con buena conexion para que termine la precarga offline automatica en segundo plano.
3. Pulsar Compartir.
4. Elegir Anadir a pantalla de inicio.
5. Abrir desde el icono nuevo.

## 6) Prueba real sin cobertura
1. Con la app ya abierta al menos una vez, activar modo avion.
2. Abrir la app desde el icono.
3. Verificar que:
- Se carga el mapa principal.
- Se abren paneles de destinos desbloqueados.
- La galeria muestra fotos disponibles en cache/local.

## 7) Checklist pre-embarque
1. Publicar ultima version en Cloudflare Pages.
2. Abrir la app en el iPhone y dejarla 1-2 minutos con WiFi.
3. Probar modo avion una vez completa.
4. No borrar datos de Safari durante el viaje.

## 8) Dominio personalizado (opcional)
1. En el proyecto de Pages ir a Custom domains.
2. Anadir dominio o subdominio.
3. Confirmar DNS en Cloudflare.

## 9) Problemas comunes
- Si no se actualiza la app: cerrar y abrir de nuevo Safari, luego reabrir desde icono.
- Si faltan fotos offline: abrir la web con conexion y esperar unos minutos para que cachee recursos.
- Si iPhone limpia cache por falta de espacio: liberar almacenamiento y repetir precarga.

