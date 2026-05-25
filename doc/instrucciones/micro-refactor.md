# micro-refactor.md

## Propósito

Definir cómo aplicar cambios pequeños y seguros en Lokkygoat sin rehacer el proyecto.

## Regla principal

Todo cambio debe ser local, trazable y reversible.

## Flujo

1. leer archivo real;
2. identificar responsabilidad afectada;
3. modificar solo lo necesario;
4. no mover arquitectura sin necesidad;
5. validar;
6. documentar en el log del dominio;
7. actualizar relevo si queda continuación abierta.

## Extracción progresiva

Cuando un archivo crece demasiado, extraer en este orden:

1. constantes;
2. helpers puros;
3. servicios de configuración;
4. bus de eventos;
5. adaptadores de providers;
6. controladores IPC;
7. superficies visuales o animaciones.

## No cuenta como micro-refactor válido

- mover código sin reducir responsabilidad;
- duplicar lógica;
- crear wrappers vacíos;
- cambiar nombres sin motivo;
- convertir un archivo grande en otro archivo grande.
