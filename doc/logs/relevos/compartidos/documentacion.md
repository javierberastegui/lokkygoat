# Relevo dominio: documentacion

## Uso

Continuidad activa de la documentación operativa de Lokkygoat.

## Estado actual

Estructura documental base creada para que el proyecto pueda avanzar por dominios.

## Qué quedó ya hecho

- `AGENTS.md` adaptado a Lokkygoat.
- Instrucciones base creadas.
- Mapa de dominios creado.
- Plantillas de logs/relevos creadas.
- Incidencias base creadas.
- Estado actual inicial creado.

## Qué no quedó hecho

- No se ha reorganizado código.
- No se han separado providers.
- No se ha añadido bus de eventos real.
- No se ha saneado todavía gestión de secretos.

## Riesgos o trampas conocidas

- No reutilizar `cabra-tamagotchi-companion` como base.
- No copiar Hermes dentro del núcleo de Lokkygoat.
- No loguear claves API en futuras fases.

## Archivos clave a leer

- `AGENTS.md`
- `doc/instrucciones/README.md`
- `doc/instrucciones/mapa_dominios.md`
- `doc/estado_actual.md`
- `doc/logs/backend_modulos/documentacion_operativa.md`

## Validaciones pendientes

- `git status --short`
- revisar que los archivos fueron creados correctamente.

## Siguiente micro-paso recomendado

- Ejecutar revisión de seguridad mínima sobre `main.js`, `preload.js`, `settings.html` y documentación.
