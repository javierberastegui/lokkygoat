# Relevo dominio: configuracion

## Uso

Este archivo registra la continuidad activa del dominio `configuracion`.

No debe convertirse en histórico largo.
Para historial de etapas, usar el log del dominio.

## Estado actual

- El servicio de configuración está completamente modularizado y funcional en `src/config/configService.js`.
- Se gestiona la persistencia en `~/.config/lokkygoat/config.json`.

## Qué quedó ya hecho

- Extracción de `loadConfig` y `saveConfig` a un módulo dedicado.
- Redacción automática de secretos (`apiKey`) antes de la escritura de logs.
- Carga inicial en el arranque principal de `main.js`.

## Qué no quedó hecho

- Aún no se validan los tipos y esquemas de los payloads de configuración al momento de guardarlos.

## Riesgos o trampas conocidas

- Modificar la estructura de configuración local en `config.json` sin actualizar `DEFAULT_CONFIG` en `src/constants.js` puede causar incoherencias.

## Archivos clave a leer

- `src/config/configService.js`
- `src/constants.js`

## Validaciones pendientes

- Pruebas de guardado de configuraciones corrompidas para asegurar que se recupera elegantemente usando valores por defecto.

## Siguiente micro-paso recomendado

- Agregar un try-catch adicional y una copia de seguridad automática antes de sobrescribir el archivo de configuración.
