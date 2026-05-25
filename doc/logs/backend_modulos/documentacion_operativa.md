# Log backend módulo: documentacion_operativa

## Uso

Historial técnico de la documentación operativa del proyecto.

## Entradas

### Etapa

- Fecha: 2026-05-25
- Objetivo: crear estructura documental base de Lokkygoat siguiendo el patrón operativo del proyecto fisioterapia.
- Contexto breve: el usuario decidió avanzar sobre `main` en `lokkygoat` y no usar `cabra-tamagotchi-companion` como base por contaminación con Hermes.

### Cambios

- Archivos nuevos:
  - `AGENTS.md`
  - `doc/instrucciones/README.md`
  - `doc/instrucciones/mapa_dominios.md`
  - `doc/instrucciones/micro-refactor.md`
  - `doc/instrucciones/leyes_documentacion_operativa.md`
  - `doc/estado_actual.md`
  - `doc/protocolo_relevo.md`
  - plantillas en `doc/logs/plantillas/`
  - incidencias base en `doc/logs/incidencias/`
  - relevos iniciales en `doc/logs/relevos/`
- Archivos modificados: ninguno previsto.
- Dependencias: ninguna.
- Tests/validaciones: pendiente `git status --short`.

### Decisiones

- `lokkygoat` será el repo activo.
- `cabra-tamagotchi-companion` queda como cuarentena/referencia.
- Se documentará por dominios, no en histórico único.
- Los eventos estructurados serán requisito de evolución.

### Validación

- Pendiente tras escritura de archivos.

### Incidencias detectadas

- No se corrige todavía deuda técnica de código.

### Siguiente paso sugerido

- Crear saneamiento base de seguridad: logs sin secretos, whitelist IPC y normalización de nombres.
