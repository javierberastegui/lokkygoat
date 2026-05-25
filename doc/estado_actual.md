# estado_actual.md

## Foto operativa actual

Proyecto: Lokkygoat  
Tipo: mascota de escritorio inteligente y configurable  
Stack base: Electron + Node.js + HTML/CSS/JS  
Rama activa esperada: `main`  
Repo activo: `javierberastegui/lokkygoat`

## Estado funcional conocido

El proyecto contiene una base inicial con:

- ventana flotante de mascota;
- ventana de chat;
- ventana de ajustes;
- configuración local;
- integración multiproveedor inicial desde `main.js`;
- documentación README inicial;
- `package.json` y `package-lock.json`.

## Decisión importante

`cabra-tamagotchi-companion` queda como referencia histórica/cuarentena.

Lokkygoat debe avanzar limpio sobre su propio repo.

## Dirección del producto

Lokkygoat debe crecer como:

- mascota local de escritorio;
- bridge visual hacia Hermes, OpenClaw, Ollama y otros proveedores;
- interfaz pequeña, viva y configurable;
- sistema con eventos estructurados;
- proyecto documentado por dominios.

## Restricciones vivas

- No copiar el repo viejo como base.
- No volver a mezclar Hermes dentro del núcleo de Lokkygoat.
- No guardar secretos en repo.
- No loguear claves API.
- Documentar cada etapa.
- Mantener trazabilidad por dominios.

## Próxima prioridad recomendada

Saneamiento base:

1. revisar secretos/logs;
2. normalizar nombres Lokkygoat;
3. introducir eventos estructurados mínimos;
4. separar progresivamente providers;
5. validar arranque Electron.
