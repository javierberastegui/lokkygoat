# protocolo_relevo.md

## Propósito

Definir cómo dejar continuidad entre etapas en Lokkygoat.

## Regla general

Cada dominio con trabajo abierto debe tener un relevo propio.

Rutas:

- backend/lógica: `doc/logs/relevos/backend_modulos/<slug>.md`
- frontend/superficies: `doc/logs/relevos/frontend/<slug>.md`
- transversal: `doc/logs/relevos/compartidos/<slug>.md`

## Qué debe contener un relevo

- estado actual;
- qué quedó hecho;
- qué no quedó hecho;
- riesgos o trampas conocidas;
- archivos clave a leer;
- validaciones pendientes;
- siguiente micro-paso recomendado.

## Qué no debe contener

- histórico largo;
- teoría;
- duplicación de logs;
- secretos;
- decisiones sin contexto.

## Cuándo actualizarlo

Actualizar relevo si:

- queda trabajo abierto;
- aparece una trampa conocida;
- cambia la prioridad;
- el siguiente agente necesita contexto para continuar;
- se detecta una incidencia que condiciona el siguiente paso.
