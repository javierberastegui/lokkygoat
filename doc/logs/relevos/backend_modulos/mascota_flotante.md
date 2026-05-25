# Relevo dominio: mascota_flotante

## Uso

Este archivo registra la continuidad activa del dominio `mascota_flotante` en el backend.

No debe convertirse en histórico largo.
Para historial de etapas, usar el log del dominio.

## Estado actual

- La lógica de físicas en `src/pet/petPhysics.js` incorpora un suelo virtual (`groundY`) y simula gravedad, rebotes, caminata, saltos y vuelo alternado.
- Mantiene compatibilidad de firmas e interfaces.

## Qué quedó ya hecho

- Implementación de gravedad para caídas libres hacia el suelo virtual.
- Estados físicos diferenciados: `grounded_walk`, `idle_grounded`, `hop` (parábola de salto) y `fly` (vuelo libre 2D).
- Retorno de la variable `behaviorState` en la respuesta física de tick.

## Qué no quedó hecho

- Los límites de pantalla y el suelo virtual asumen una sola pantalla principal activa; no hay soporte inteligente para configuraciones multipantalla complejas.

## Riesgos o trampas conocidas

- Modificar la altura de la ventana (260px) requiere que la física sepa el tamaño real (`bounds.height`) para calcular `groundY` de forma correcta.

## Archivos clave a leer

- `src/pet/petPhysics.js`
- `main.js` (función `stepPet`)

## Validaciones pendientes

- Probar el comportamiento de caída cuando la resolución de la pantalla cambia dinámicamente.

## Siguiente micro-paso recomendado

- Agregar un detector de resolución de pantalla para recalcular los límites si el área de trabajo se modifica en caliente.
