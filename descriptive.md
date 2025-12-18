# Documentación Descriptiva del Proyecto

## Alcance y Objetivo
Creación de una plataforma de e-commerce moderna para el mercado español.
**Categorías:** Alimentación, Hogar, Salud, Belleza.
**Funcionalidades Clave:**
- Venta online de alto rendimiento.
- Gestión de Clientes.
- Comunidad de Promotores (sistema de recompensas).
- Agente IA nativo para asistencia.

## Stack Tecnológico
- **Frontend:** React, HTML5, CSS (Vanilla/Modules o Tailwind si se aprueba), Vite o Next.js (A confirmar).
- **Backend:** Node.js, Express/NestJS (A definir en arquitectura).
- **Base de Datos:** PostgreSQL (Neon.tech) con Prisma ORM.
- **Lenguajes:** JavaScript, TypeScript.
- **Infraestructura:** Vercel (Despliegue), GitHub (Repositorio).

## Progreso y Decisiones Técnicas
### Fase 1: Inicialización y Landing Page (En Progreso)
- **Arquitectura:** Inicializada con Vite + React.
- **Estilos:** Variables CSS y diseño base implementados (`index.css`).
- **Componentes:** `Header` (Responsivo), `Hero` (Con imagen generada), `Features` (Categorías).
- **Testing:** Configurado Vitest + Testing Library. Pendiente ejecución de pruebas.

### Fase 2: Rediseño y Catálogo (En Progreso)
- **Identidad Visual:** Rediseñada al estilo retail (Amarillo/Negro).
- **Componentes:**
  - `Header` complejo con buscador y acciones de usuario.
  - `Hero` tipo banner promocional.
  - `FeaturedProducts` con grid de productos y precios.

### Fase 3: Autenticación y Backend (Completado)
- **Backend Server**: Implementado con **Node.js** y **Express** (Puerto 3001).
- **Base de Datos**: Conexión establecida con **Neon.tech (PostgreSQL)** mediante **Prisma ORM**.
- **Autenticación**:
  - Sistema basado en **JWT (JSON Web Tokens)**.
  - Endpoints implementados: `login`, `register`, `create-admin`.
  - Roles definidos (Enum): `SUPERADMIN`, `ADMIN`, `VENDEDOR`, `PROMOTOR`, `GESTOR`, `LOGISTICA`, `SUPERVISOR`, `CLIENTE`.
- **Seguridad**:
  - Hashing de contraseñas con `bcrypt`.
  - Middleware de autorización (`auth.middleware.js`) para validar tokens y roles.

### Fase 4: Panel de Administración y Gestión de Usuarios (Completado)
- **Frontend (Integración)**:
  - **Contexto Global**: `AuthContext` para manejo de sesión y persistencia en `localStorage`.
  - **Seguridad UI**: Componente `ProtectedRoute` para bloquear accesos no autorizados.
  - **Registro Público**: Página `/register` con formulario extendido (Nombre, Apellido, Teléfono, Ubicación) para Clientes y Promotores.
- **Panel de Administración (`/admin`)**:
  - Interfaz exclusiva para roles administrativos.
  - **Módulo de Usuarios**: CRUD completo (Crear, Leer, Editar, Eliminar).
  - Capacidad para asignar cualquier rol del sistema desde el panel.
  - Manejo de errores y visualización de estados de carga.

### Fase 5: Mejoras de Interfaz (Header)
- **Refactorización de Layout**:
  - Ajuste del `Header` para una distribución más equilibrada.
  - Implementación de `space-between` y centrado de la barra de búsqueda con márgenes automáticos.
  - Aumento del ancho máximo de la búsqueda a 600px para mayor prominencia.

## Estructura de Base de Datos

La base de datos utiliza **PostgreSQL** gestionada a través de **Prisma ORM**. A continuación se detalla el esquema actual:

### Diagrama ER (Mermaid)

```mermaid
erDiagram
    User {
        Int id PK
        String email UK
        String password
        String name
        String surname
        String phone
        String municipality
        String province
        Role role "Default: CLIENTE"
        DateTime createdAt
        DateTime updatedAt
    }

    Product {
        Int id PK
        String name
        String description "Optional"
        Decimal price
        Decimal oldPrice "Optional"
        String image "Optional"
        String category "Optional"
        Int stock "Default: 0"
        DateTime createdAt
        DateTime updatedAt
    }

    enum Role {
        USER
        ADMIN
        SUPERADMIN
        VENDEDOR
        PROMOTOR
        GESTOR
        LOGISTICA
        SUPERVISOR
        CLIENTE
    }
```

### Modelos y Descripciones

#### 1. Modelo `User`
Almacena la información de todos los usuarios del sistema, incluyendo administradores, empleados y clientes.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | Int | PK, Autoincrement | Identificador único. |
| `email` | String | Unique | Correo electrónico (login). |
| `password` | String | | Contraseña hasheada (bcrypt). |
| `name` | String | | Nombre del usuario. |
| `surname` | String | | Apellido del usuario. |
| `phone` | String | | Número de teléfono de contacto. |
| `municipality` | String | | Municipio de residencia/envío. |
| `province` | String | | Provincia de residencia/envío. |
| `role` | Enum(Role) | Default: CLIENTE | Rol de permisos en el sistema. |
| `createdAt` | DateTime | Default: now() | Fecha de registro. |
| `updatedAt` | DateTime | UpdatedAt | Fecha de última actualización. |

## Despliegue y Almacenamiento

### Infraestructura (Vercel)
La aplicación se ha migrado a una arquitectura serverless en **Vercel**:
- **API**: Implementada como una función única en `/api/index.js` que envuelve la app Express.
- **Frontend**: Desplegado como sitio estático con el preset de Vite.
- **Base de Datos**: Conectada mediante `DATABASE_URL` (Prisma).

### Almacenamiento de Imágenes (Vercel Blob)
Para evitar problemas de permisos con servicios externos (como Google Drive), se integró **Vercel Blob**:
- Las imágenes de productos se suben directamente desde el panel de administración.
- El servidor recibe el archivo y lo transfiere a Vercel Blob, almacenando solo la URL pública en la base de datos.
- Se implementó un sistema de "fallback" con iconos locales por si alguna imagen falla al cargar.

---
*Ultima actualización: 18 de Diciembre, 2025*

#### 2. Modelo `Product`
Catálogo de productos disponibles para la venta.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | Int | PK, Autoincrement | Identificador único del producto. |
| `name` | String | | Nombre comercial del producto. |
| `description` | String? | Opcional | Detalle o descripción extendida. |
| `price` | Decimal | | Precio actual de venta. |
| `oldPrice` | Decimal? | Opcional | Precio anterior (para ofertas). |
| `image` | String? | Opcional | URL o path de la imagen. |
| `category` | String? | Opcional | Categoría taxonómica. |
| `stock` | Int | Default: 0 | Cantidad disponible en inventario. |

#### 3. Enum `Role`
Define los niveles de acceso y tipos de usuario permitidos:
- `SUPERADMIN`: Acceso total al sistema.
- `ADMIN`: Gestión administrativa.
- `VENDEDOR`: Gestión de ventas.
- `PROMOTOR`: Usuario que promueve productos (sistema de referidos).
- `GESTOR`: Gestión operativa.
- `LOGISTICA`: Encargado de envíos.
- `SUPERVISOR`: Supervisión de operaciones.
- `CLIENTE`: Usuario final comprador.
