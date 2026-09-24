Diseña un prototipo completo y funcional de una aplicación web académica para la gestión de productos perecibles de una institución privada.

## 1. Contexto del proyecto

Este es un proyecto académico grupal de Ingeniería de Sistemas.

El proyecto consiste en desarrollar una aplicación web para mejorar la gestión de productos perecibles mediante el registro y control de productos, cantidades, movimientos de inventario y fechas de vencimiento.

El sistema debe facilitar la identificación de productos próximos a vencer y productos vencidos.

La aplicación será desarrollada posteriormente utilizando:

* Java como lenguaje principal del backend.
* Apache NetBeans como entorno de desarrollo.
* Apache Tomcat como servidor.
* JSP/HTML para las páginas web.
* CSS para los estilos.
* JavaScript para funcionalidades del lado del cliente.
* SQL para la base de datos.

Por lo tanto, el diseño debe ser realista, sencillo y factible de implementar con estas tecnologías. No agregar funcionalidades que requieran tecnologías externas o excesivamente complejas.

---

# 2. Objetivo del sistema

El objetivo es:

"Desarrollar una aplicación web para mejorar la gestión de productos perecibles mediante el control del inventario y el seguimiento de sus fechas de vencimiento."

La aplicación debe permitir:

* Registrar productos.
* Consultar productos.
* Editar productos.
* Eliminar productos.
* Controlar cantidades.
* Registrar entradas y salidas.
* Consultar movimientos.
* Registrar fechas de ingreso y vencimiento.
* Identificar productos próximos a vencer.
* Identificar productos vencidos.
* Consultar información mediante búsquedas y filtros.

No se debe evaluar la calidad física de los productos. El estado relacionado con el vencimiento debe determinarse principalmente mediante la fecha de vencimiento registrada.

---

# 3. Estructura general de navegación

Crear una navegación sencilla mediante un menú lateral.

La estructura principal debe ser:

INICIO DE SESIÓN
↓
DASHBOARD
↓
├── PRODUCTOS
│   ├── Registrar producto
│   ├── Editar producto
│   └── Ver detalle
│
├── MOVIMIENTOS
│
├── VENCIMIENTOS
│
└── USUARIOS

El menú lateral debe estar presente en las páginas principales después del inicio de sesión.

---

# 4. Cantidad de páginas

Diseñar exactamente 8 páginas principales:

1. Inicio de sesión
2. Dashboard
3. Gestión de productos
4. Registro / edición de producto
5. Detalle de producto
6. Movimientos de inventario
7. Vencimientos
8. Usuarios

No crear páginas independientes innecesarias.

Cuando una función pueda resolverse dentro de una página mediante un formulario, ventana modal o cambio de estado, utilizar esa opción en lugar de crear otra página.

---

# 5. Página 1 — Inicio de sesión

Crear una pantalla de inicio de sesión sencilla y profesional.

Debe contener:

* Logo o nombre del sistema.
* Campo de usuario o correo.
* Campo de contraseña.
* Botón "Iniciar sesión".
* Mensaje de error para credenciales incorrectas.

No agregar recuperación de contraseña, autenticación mediante redes sociales ni funciones externas.

---

# 6. Página 2 — Dashboard

El Dashboard debe funcionar como resumen general del sistema.

Mostrar tarjetas informativas con:

* Total de productos.
* Productos disponibles.
* Productos próximos a vencer.
* Productos vencidos.
* Movimientos recientes.

También incluir:

### Productos por categoría

Mostrar un gráfico sencillo o representación visual de las categorías de productos.

### Últimos movimientos

Mostrar una tabla con:

* Producto.
* Tipo de movimiento.
* Cantidad.
* Fecha.

El Dashboard debe permitir acceder rápidamente a las secciones principales.

---

# 7. Página 3 — Gestión de productos

Crear una página para consultar y administrar todos los productos registrados.

Debe contener:

### Barra de búsqueda

Permitir buscar por:

* Código.
* Nombre.

### Filtros

Permitir filtrar por:

* Categoría.
* Estado.
* Fecha de vencimiento.

### Tabla de productos

Mostrar:

* Código.
* Nombre.
* Categoría.
* Cantidad.
* Fecha de ingreso.
* Fecha de vencimiento.
* Estado.
* Acciones.

Las acciones deben incluir:

* Ver.
* Editar.
* Eliminar.

Agregar un botón principal:

"+ Registrar producto"

La tabla debe ser clara y permitir visualizar fácilmente el estado de cada producto.

---

# 8. Página 4 — Registro / edición de producto

Utilizar una misma interfaz para registrar y editar productos.

Crear un formulario con:

* Código.
* Nombre del producto.
* Categoría.
* Cantidad.
* Fecha de ingreso.
* Fecha de vencimiento.

Botones:

* Guardar.
* Cancelar.

La interfaz debe poder utilizarse posteriormente como un formulario JSP/HTML conectado con Java.

No crear dos diseños diferentes para registrar y editar.

---

# 9. Página 5 — Detalle de producto

Crear una página para consultar toda la información de un producto seleccionado.

Mostrar:

* Código.
* Nombre.
* Categoría.
* Cantidad actual.
* Fecha de ingreso.
* Fecha de vencimiento.
* Estado.

También mostrar un pequeño historial de movimientos del producto:

* Fecha.
* Tipo de movimiento.
* Cantidad.

Incluir botones:

* Editar.
* Volver a productos.

---

# 10. Página 6 — Movimientos de inventario

Crear una página dedicada al control de entradas y salidas.

En la parte superior incluir botones:

"+ Registrar entrada"

"+ Registrar salida"

El formulario de movimiento debe permitir seleccionar:

* Producto.
* Tipo de movimiento.
* Cantidad.
* Fecha.

También mostrar un historial de movimientos mediante una tabla:

* Producto.
* Tipo.
* Cantidad.
* Fecha.
* Usuario responsable.

Diferenciar visualmente las entradas y salidas de forma clara.

---

# 11. Página 7 — Vencimientos

Esta página es especialmente importante porque está directamente relacionada con el problema de investigación.

Crear dos secciones principales:

### Productos próximos a vencer

Mostrar:

* Producto.
* Cantidad.
* Fecha de vencimiento.
* Estado.

### Productos vencidos

Mostrar:

* Producto.
* Cantidad.
* Fecha de vencimiento.
* Estado.

También incluir indicadores o tarjetas con:

* Número de productos próximos a vencer.
* Número de productos vencidos.

El diseño debe permitir identificar rápidamente los productos que requieren atención.

No incluir evaluaciones sobre la calidad física del producto.

---

# 12. Página 8 — Usuarios

Crear una página sencilla para gestionar los usuarios del sistema.

Mostrar una tabla con:

* Código.
* Nombre.
* Correo.
* Rol.
* Estado.
* Acciones.

Permitir:

* Registrar usuario.
* Editar usuario.
* Activar o desactivar usuario.

Utilizar roles sencillos como:

* Administrador.
* Usuario.

No crear un sistema avanzado de permisos.

---

# 13. Diseño visual general

La interfaz debe tener un estilo:

* Moderno.
* Profesional.
* Sencillo.
* Limpio.
* Académico/empresarial.
* Fácil de utilizar.

Utilizar una estructura consistente:

### Menú lateral

Contener:

* Dashboard
* Productos
* Movimientos
* Vencimientos
* Usuarios
* Cerrar sesión

### Barra superior

Mostrar:

* Nombre del sistema.
* Usuario actualmente conectado.
* Opción de cerrar sesión.

### Contenido principal

Utilizar:

* Tarjetas.
* Tablas.
* Formularios.
* Botones.
* Modales cuando sea conveniente.
* Iconos simples.

El diseño debe estar orientado principalmente a computadoras de escritorio.

---

# 14. Estados de los productos

Utilizar tres estados principales relacionados con el vencimiento:

* Disponible.
* Próximo a vencer.
* Vencido.

Los estados deben ser fácilmente distinguibles visualmente.

La aplicación no debe determinar si un producto es físicamente apto o no para el consumo. Solo debe controlar la información registrada y su fecha de vencimiento.

---

# 15. Diseño pensando en la futura base de datos

El diseño debe considerar que posteriormente la información será almacenada en SQL.

Las entidades principales serán aproximadamente:

### Usuarios

* id_usuario
* nombre
* correo
* contraseña
* rol
* estado

### Categorías

* id_categoria
* nombre

### Productos

* id_producto
* código
* nombre
* categoría
* cantidad
* fecha_ingreso
* fecha_vencimiento

### Movimientos

* id_movimiento
* producto
* usuario
* tipo_movimiento
* cantidad
* fecha

No es necesario diseñar la base de datos visualmente, pero las pantallas deben ser coherentes con esta estructura.

---

# 16. Consideraciones para el desarrollo posterior

Diseñar componentes que puedan implementarse fácilmente mediante:

Frontend:
HTML/JSP + CSS + JavaScript

Backend:
Java + Servlets/JSP

Servidor:
Apache Tomcat

Base de datos:
SQL

IDE:
Apache NetBeans

Los formularios, tablas, botones y menús deben ser sencillos de transformar posteriormente en código.

Evitar:

* Inteligencia artificial.
* Aplicaciones móviles.
* Pagos.
* Códigos QR.
* Sistemas de recomendación.
* Análisis predictivo.
* Integraciones externas.
* Notificaciones mediante servicios externos.
* Funciones que no sean necesarias para la gestión de productos perecibles.

---

# 17. Objetivo del prototipo

El resultado debe ser un prototipo visual completo que permita al equipo de desarrollo entender:

* Cómo se verá cada página.
* Cómo se navegará entre ellas.
* Qué información debe mostrar cada página.
* Qué formularios deben existir.
* Qué botones y acciones debe tener cada sección.
* Cómo se relacionan los productos con los movimientos y vencimientos.

El prototipo debe priorizar la facilidad de implementación sobre la complejidad visual.

Crear una experiencia de usuario coherente entre todas las páginas y mantener los mismos componentes, estilos, botones, tablas y navegación en todo el sistema.
