# AvalTrust (sitio estático anterior)

Este repositorio publicaba avaltrust.co hasta el cutover de septiembre de
2026. **Ya no se despliega automáticamente.**

El sitio vive ahora en [jmaldo1705/avaltrust-dashboard](https://github.com/jmaldo1705/avaltrust-dashboard),
dentro del workspace de Angular, en `projects/landing`. Se prerenderiza a
HTML estático y se publica en el mismo bucket y la misma distribución de
CloudFront.

Este repo se conserva por dos razones:

1. **Rollback.** El workflow `deploy.yml` sigue existiendo y puede
   ejecutarse a mano desde la pestaña Actions para restaurar esta versión
   del sitio sobre el bucket.
2. **Historial y fuentes de diseño** (`image/PSD/`), que nunca se
   publicaron y solo viven aquí.
