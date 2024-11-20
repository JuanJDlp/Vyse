# Vyse: Online Marketplace

## Integrantes: 

- Mariana Agudelo Salazar - A00398722 
- Juan Jose De La Pava - A00381213

## Link del repositorio

    https://github.com/JuanJDlp/Vyse

Vyse es una aplicación de tienda en línea desarrollada como parte del proyecto final de **Computación en Internet I** . La plataforma ofrece funcionalidades básicas para que los administradores puedan gestionar productos y los clientes realicen compras de forma sencilla e intuitiva. Además, genera facturas para cada compra realizada y permite a los clientes acceder a su historial de compras.

## Descripción General

Vyse está construido sobre una arquitectura cliente-servidor, utilizando **React** para el frontend y **Node.js** con **Express** para el backend. La persistencia de datos se gestiona mediante **Supabase**, y se integran funcionalidades de autenticación utilizando **JWT** para la seguridad.

---

## Funcionalidades Principales

### Roles de Usuario
1. **Administrador**
   - Gestiona el inventario de productos.
   - Tiene acceso exclusivo para agregar nuevos productos.
2. **Cliente**
   - Puede explorar productos, agregar al carrito y realizar compras.
   - Accede a su historial de compras.

---

### Funcionalidades por Rol
#### Administrador:
- **Inicio de Sesión:** Puede iniciar sesión para gestionar los productos de la tienda.
- **Gestión de Productos:** Agrega nuevos productos especificando:
  - Nombre
  - Descripción
  - Precio
  - Cantidad disponible

#### Cliente:
- **Registro e Inicio de Sesión:** Crea una cuenta o accede con sus credenciales.
- **Exploración de Productos:** Ve una lista de productos disponibles.
- **Carrito de Compras:** Añade productos al carrito.
- **Proceso de Compra:** Completa la compra y genera una factura con los detalles de:
  - Productos adquiridos
  - Cantidad
  - Precio total
- **Historial de Compras:** Consulta sus compras anteriores.

---

## Tecnologías Utilizadas

### Frontend
- **React**: Para crear una interfaz de usuario interactiva y dinámica.
- **HTML5,Tailwind , CSS3**: Para la estructura y diseño visual.

### Backend
- **Node.js**: Servidor basado en JavaScript.
- **Express**: Framework para crear APIs RESTful.

### Base de Datos
- **Supabase**: Para persistencia de datos.

### Seguridad
- **JWT (JSON Web Tokens)**: Para autenticación segura de usuarios.

---

## Configuración e Instalación

Sigue estos pasos para configurar y ejecutar la aplicación en un entorno local:

### Requisitos Previos
- Node.js (v14 o superior)
- npm (v6 o superior)

### Pasos de Instalación
1. Clona el repositorio del proyecto:
   ```bash
   git clone https://github.com/JuanJDlp/Vyse
   cd Vyse

2. Para ejecutar el backend 
`
    cd backend

    npm i

    npm start

`

3. Para ejecutar el front end

`
cd frontend/vyse-store/

npm i

npm start

`

Es importante que tenga todas las dependencias de node instaladas y que para probar el proyecto ejecute el front end y el backend simultaneamente. La base de datos ya esta hosteada en supabase, por lo que no es necesario descargarla.