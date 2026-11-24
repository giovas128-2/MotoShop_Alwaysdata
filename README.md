# MOTO SHOP · GitHub Pages 🏍️

Tienda **demostrativa**, inspirada en el proyecto original de guitarras y adaptada para alojamiento estático. No requiere PHP, MySQL, Alwaysdata, SSH, npm ni claves.

## Funciones de la demostración

- Tienda responsive: catálogo, buscador, categorías, ordenación, fichas de productos, favoritos, tres fotografías opcionales y stock.
- Carrito con tabla de **producto | cantidad comprada | imagen | código QR | precio total**. Control de existencias y cantidades.
- Ficha pública de producto mediante QR: al escanear con otro celular, abre información compartida en la URL. La generación de la imagen QR requiere conexión al servicio externo `api.qrserver.com`.
- Registro e inicio de sesión de prueba, cuentas admin/cliente, empleados, registro personal de prueba y bitácora de accesos.
- Checkout simulado: entrega a domicilio (+$30) o recogida; efectivo de prueba o tarjeta aprobada ficticiamente. Se suma IVA (16%). **No se solicitan datos bancarios.**
- Pedido con folio y ticket imprimible o guardable como PDF con el diálogo de impresión del navegador. Correo simulado (vista previa; no envía mensajes).
- Panel administrativo: altas/bajas/edición de productos, fotos, usuarios/empleados, pedidos, cambios de estado, cancelación con reposición de stock, notificaciones y gráficos.
- Reporte de ventas por rango de fechas, ventas pagadas, CSV y opción de imprimir a PDF.
- Pestaña **Escaneos QR** en el panel de administrador: total de aperturas por producto, filtro por fechas y resumen de productos consultados **en el navegador actual**.
- Datos persistentes en `localStorage`, sesión en `sessionStorage`, exportación de JSON de demostración y botón para reiniciar.


## Catálogo tridimensional con más de 100 productos

La ruta **Tienda** (\`#catalogo\`) incluye una animación estilo tabla periódica con **Three.js** y **CSS3DRenderer**. Permite alternar entre Tabla, Esfera, Hélice y Cuadrícula, girar la vista y abrir fichas con nombre, precio, ícono ilustrativo y los botones **Comprar** / **Cancelar**.

- Se añadieron **100 productos ficticios** (36 cascos, 34 accesorios y 30 refacciones) a los 9 existentes para contar con **109 productos de ejemplo** antes de que el usuario añada más.
- Los IDs y códigos son estables; una migración de \`localStorage\` añade los productos nuevos **una sola vez** sin borrar cuentas, pedidos ni artículos personalizados.
- **Comprar** usa el mismo carrito y muestra su pantalla. **Cancelar** anima la ficha de vuelta a su lugar.
- Las fotos pueden reemplazar los íconos desde la edición del producto en la administración. Los precios, nombres, existencias y compras de los 100 modelos son **ilustrativos**, no una oferta comercial.
- La animación utiliza tres archivos: \`assets/js/catalogo3d.js\`, \`assets/css/catalogo3d.css\` y el mapa de importaciones de \`index.html\`. Requiere internet para descargar Three.js desde jsDelivr.
- La interfaz clásica debajo del 3D permanece disponible para buscar y ordenar todos los productos. En dispositivos poco potentes, la animación puede necesitar más recursos.

## Accesos de prueba

- Administrador: `admin@demo.com` / `Admin1234!`
- Cliente: `cliente@demo.com` / `Cliente1234!`

> Las cuentas y contraseñas de prueba **no son cuentas reales**. No uses datos personales ni contraseñas reales. El control de roles del lado del navegador no proporciona seguridad de producción.

## Publicación en GitHub Pages

1. Abre el repositorio `MotoShop_Alwaysdata` en GitHub (o crea otro nuevo independiente).
2. Sube **el contenido de esta carpeta** a la raíz del repositorio: `index.html`, `assets/`, `README.md` y `.nojekyll`.
3. Abre **Settings → Pages → Build and deployment**, elige **Deploy from a branch**, rama `main` y carpeta **/(root)**, después **Save**.
4. La URL predeterminada será: `https://giovas128-2.github.io/MotoShop_Alwaysdata/` si el repositorio y usuario siguen con estos nombres.
5. Al abrir el sitio, inicia sesión con las cuentas demo. Crea un producto, agrégalo al carrito, completa un pedido y revisa los reportes.

## Cómo probar el contador de QR

1. En el catálogo o carrito, abre el QR de un producto y utiliza su enlace en **el mismo navegador**, preferiblemente en una pestaña nueva.
2. Inicia sesión en el panel administrativo de ese navegador y abre **Escaneos QR**.
3. Filtra por fechas para ver la cantidad de aperturas registradas por producto.

**Limitación:** los enlaces QR incluyen `qr_scan=1`. Cuando se abre un enlace con ese parámetro, se registra una apertura en `localStorage` **de ese dispositivo**. Un escaneo desde el teléfono no se reflejará en el panel abierto en la computadora. Las recargas pueden contarse de nuevo. No mide usuarios únicos ni ofrece una estadística global sin backend compartido.

## Límites importantes

GitHub Pages sirve archivos estáticos. **No hay MySQL, PHP, sincronización, pagos, cuentas seguras ni emails reales**. Los datos se guardan *solamente en el navegador donde se generan*: abrir desde otro dispositivo mostrará los datos iniciales. Una ficha generada con código QR sí puede mostrar al menos nombre, precio, stock ilustrativo y categoría de un producto, porque la información se incluye en el enlace, pero la foto subida localmente y el estado posterior del inventario no viajan en el QR. Si borras datos del navegador o utilizas modo incógnito, puedes perder los cambios. El CSV/JSON descargado es respaldo manual, no sincronización.

La imagen QR se obtiene de un servicio de terceros (`api.qrserver.com`). Evita incluir datos personales en los códigos o enlaces. Las fotos agregadas al catálogo son locales y no se publican en el repositorio.

## Estructura

```
index.html
assets/
  css/app.css
  js/app.js
.nojekyll
README.md
```

© Moto Shop · Proyecto académico de demostración.