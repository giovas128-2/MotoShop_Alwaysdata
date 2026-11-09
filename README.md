# Moto Shop 🏍️

Proyecto académico de tienda en PHP y MySQL, organizado a partir del proyecto de guitarras. Incluye catálogo, usuarios, carrito, inventario, pedidos, QR, administración, reportes, tickets PDF y opciones de integración con SMTP y Stripe.

## Importante

**GitHub guarda el código, pero GitHub Pages no ejecuta PHP ni MySQL.** Para publicar la tienda funcional necesitas un hosting compatible con PHP y MySQL.

## Instalación

1. Crea una base MySQL/MariaDB e importa `base_datos.sql`.
2. Copia `includes/config.example.php` a `includes/config_local.php` y configura la conexión. **Nunca subas el archivo local con contraseñas a GitHub.**
3. Configura la URL real del sitio en `GX_BASE_URL` o `includes/comercio_local.php`.
4. Publica los archivos en el alojamiento PHP.
5. En una terminal PHP ejecuta `php scripts/crear_admin.php` para crear tu administrador.
6. Consulta `LEEME_INSTALACION.md` para correo SMTP, Stripe y pruebas.

## Seguridad

No publiques contraseñas, tokens, archivos `.env`, ni datos personales. Los archivos de configuración locales deben mantenerse fuera del repositorio. Los pagos con tarjeta no están activos sin configurar Stripe y validar su webhook.

Este repositorio es un proyecto académico; revisa la seguridad y las funciones antes de vender a compradores reales.
