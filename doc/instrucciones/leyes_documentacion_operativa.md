# leyes_documentacion_operativa.md

## Ley 1: No hay etapa cerrada sin documentación

Todo cambio relevante debe dejar rastro en el log del dominio afectado.

## Ley 2: Los relevos no son históricos largos

Los relevos contienen continuidad activa, riesgos y siguiente paso.
El historial largo va en logs.

## Ley 3: No usar un histórico único como bitácora principal

No centralizar todo en `doc/logs/historico.md`.
Usar:

- `doc/logs/backend_modulos/`
- `doc/logs/frontend/`
- `doc/logs/incidencias/`
- `doc/logs/relevos/`

## Ley 4: Todo dominio invocable debe estar en el mapa

Si el usuario puede decir “sigue con X”, X debe estar en `doc/instrucciones/mapa_dominios.md`.

## Ley 5: Incidencia detectada, incidencia registrada

Si se detecta un fallo real y no se corrige en la misma etapa, debe registrarse en incidencias.

## Ley 6: Eventos antes que notificaciones

Los módulos deben emitir eventos estructurados.
La decisión de notificar debe vivir en una capa central de reglas.

## Ley 7: Los secretos nunca se documentan

Solo placeholders.
Nunca claves reales.
