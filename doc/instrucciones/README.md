# README instrucciones

## Propósito

Esta carpeta contiene las normas operativas estables de Lokkygoat.

No sustituye a `AGENTS.md`.
Lo desarrolla y lo hace ejecutable para trabajo por dominios.

## Jerarquía

1. `AGENTS.md`
2. este archivo
3. instrucciones específicas aplicables
4. `doc/estado_actual.md`
5. `doc/protocolo_relevo.md`
6. relevo del dominio afectado
7. logs del dominio afectado
8. incidencias abiertas relacionadas
9. prompt activo si existe

## Lectura mínima obligatoria

Según el tipo de cambio, el agente debe leer además de `AGENTS.md`:

- `doc/instrucciones/mapa_dominios.md`
- `doc/instrucciones/micro-refactor.md`
- `doc/instrucciones/leyes_documentacion_operativa.md`

## Regla de aplicación

No se debe tocar código ni documentación viva ignorando estas instrucciones cuando apliquen.

## Qué resuelve esta carpeta

Esta carpeta existe para que el agente pueda:

- resolver dominios usando lenguaje natural;
- aplicar micro-refactor local sin romper arquitectura;
- crear trazabilidad nueva si aparecen módulos o superficies nuevas;
- escribir logs, incidencias y relevos sin mezclarlo todo en un único histórico;
- continuar tareas con órdenes como “sigue con providers”, “sigue con mascota”, “sigue con ajustes” o “sigue con eventos”.

## Secuencia esperada

1. resolver alias en `doc/instrucciones/mapa_dominios.md`;
2. abrir relevo del dominio correcto;
3. abrir log del dominio correcto;
4. revisar incidencias relacionadas;
5. continuar desde el siguiente micro-paso documentado.

## Regla de crecimiento

Si una norma operativa crece demasiado dentro de un archivo existente, debe extraerse a un `.md` nuevo dentro de esta carpeta con nombre claro y estable.
