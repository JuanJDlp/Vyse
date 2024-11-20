
# API Documentation - Online Store

Esta API proporciona los servicios necesarios para gestionar una tienda en línea. Los roles de usuario incluyen Administrador y Cliente. A continuación se detallan los endpoints disponibles para interactuar con la tienda.

## Endpoints

### 1. **Inicio de sesión**
- **Método:** `POST`
- **URL:** `/api/auth/login`
- **Descripción:** Este endpoint permite al administrador iniciar sesión en su cuenta.
- **Body:**
  ```json
  {
    "username": "username",
    "password": "password"
  }
  ```
- **Respuesta:**
  - **Código 200**: Login exitoso. Retorna un token JWT para futuras solicitudes.
    ```json
    {
      "token": "jwt_token"
    }
    ```
  - **Código 401**: Credenciales incorrectas.
    ```json
    {
      "error": "Invalid credentials"
    }
    ```


### 2. **Agregar producto - Administrador**
- **Método:** `POST`
- **URL:** `/api/admin/products`
- **Descripción:** Este endpoint permite al administrador agregar nuevos productos al inventario de la tienda.
- **Body:**
  ```json
  {
    "name": "Product Name",
    "description": "Product Description",
    "price": 29.99,
    "quantity": 100,
    "image": "/link/to/image.com"
  }
  ```
- **Respuesta:**
  - **Código 201**: Producto agregado exitosamente.
    ```json
    {
      "message": "Product added successfully"
    }
    ```
  - **Código 400**: Datos inválidos.
    ```json
    {
      "error": "Invalid data"
    }
    ```

---

### 3. **Registro de cliente**
- **Método:** `POST`
- **URL:** `/api/auth/register`
- **Descripción:** Este endpoint permite a los clientes registrarse en la tienda.
- **Body:**
  ```json
  {
    "username": "client_username",
    "password": "client_password",
    "email": "client_email@example.com"
  }
  ```
- **Respuesta:**
  - **Código 201**: Cliente registrado exitosamente.
    ```json
    {
      "message": "Client registered successfully"
    }
    ```
  - **Código 400**: Datos inválidos.
    ```json
    {
      "error": "Invalid data"
    }
    ```

---

### 5. **Ver productos disponibles - Cliente**
- **Método:** `GET`
- **URL:** `/api/products`
- **Descripción:** Este endpoint permite a los clientes ver la lista de productos disponibles en la tienda.
- **Respuesta:**
  - **Código 200**: Retorna la lista de productos disponibles.
    ```json
    [
      {
        "id": 1,
        "name": "Product Name",
        "description": "Product Description",
        "price": 29.99,
        "quantity": 100,
        "image": "link/to/image.com"
      },
      {
        "id": 2,
        "name": "Another Product",
        "description": "Another Description",
        "price": 49.99,
        "quantity": 50,
        "image": "link/to/image.com"
      }
    ]
    ```

---

### 6. **Agregar al carrito - Cliente**
- **Método:** `POST`
- **URL:** `/api/client/cart`
- **Descripción:** Este endpoint permite a los clientes agregar productos al carrito de compras.
- **Body:**
  ```json
  {
    "product_id": 1,
    "quantity": 2
  }
  ```
- **Respuesta:**
  - **Código 200**: Producto agregado al carrito exitosamente.
    ```json
    {
      "message": "Product added to cart"
    }
    ```

---

### . **Ver los productos del carro - Cliente**
- **Método:** `GET`
- **URL:** `/api/client/cart`
- **Descripción:** Este endpoint permite a los clientes ver los productos que tiene actualmente en el carrito 
- **Respuesta:**
  - **Código 200**: Se retornan todos los objectos dentro del carrito del cliente 
    ```json
    [
      {
        "id": 1,
        "name": "Product Name",
        "description": "Product Description",
        "price": 29.99,
        "quantity": 2,
        "image": "link/to/image.com"
      },
      {
        "id": 2,
        "name": "Another Product",
        "description": "Another Description",
        "price": 49.99,
        "quantity": 3,
        "image": "link/to/image.com"
      }
    ]
    ```

  - La cantidad inidica cuantos elementos de esos se encuentran en el carro

---

### 7. **Realizar compra - Cliente**
- **Método:** `POST`
- **URL:** `/api/client/checkout`
- **Descripción:** Este endpoint permite a los clientes realizar una compra, generando una factura con los detalles de los productos adquiridos.
- **Respuesta:**
  - **Código 200**: Compra realizada exitosamente. Retorna la factura.
    ```json
    {
      "invoice_id": 12345,
      "items": [
        {
          "name": "Product Name",
          "quantity": 2,
          "price": 29.99,
          "total": 59.98
        },
        {
          "name": "Another Product",
          "quantity": 1,
          "price": 49.99,
          "total": 49.99
        }
      ],
      "total_amount": 109.97
    }
    ```

---

### 8. **Historial de compras - Cliente**
- **Método:** `GET`
- **URL:** `/api/client/purchases`
- **Descripción:** Este endpoint permite a los clientes ver su historial de compras anteriores.
- **Respuesta:**
  - **Código 200**: Retorna el historial de compras.
    ```json
    [
      {
        "invoice_id": 12345,
        "date": "2024-11-01",
        "total_amount": 109.97,
        "items": [
          {
            "name": "Product Name",
            "quantity": 2,
            "price": 29.99,
            "total": 59.98
          },
          {
            "name": "Another Product",
            "quantity": 1,
            "price": 49.99,
            "total": 49.99
          }
        ]
      }
    ]
    ```
