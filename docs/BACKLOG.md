# StockFlow — Product Backlog

## 1. Backlog Overview

StockFlow se desarrollará como una aplicación web empresarial full-stack para la gestión distribuida de inventario.

El sistema estará compuesto por:

```text
Frontend
    React + TypeScript
          │
          │ HTTP / JSON
          ▼
Backend
    Node.js + NestJS
          │
          ▼
Persistence
    TypeORM
          │
          ▼
Database
    MySQL
```

El proyecto utilizará una metodología ágil basada en Scrum.

El backlog representa el trabajo funcional y técnico necesario para construir el MVP y preparar posteriormente el sistema para un entorno productivo.

---

# 2. Technology Stack

## Backend

| Tecnología        | Propósito                  |
| ----------------- | -------------------------- |
| Node.js           | Runtime                    |
| NestJS            | Backend framework          |
| TypeScript        | Lenguaje                   |
| TypeORM           | ORM                        |
| MySQL             | Base de datos              |
| JWT               | Autenticación              |
| Swagger / OpenAPI | Documentación de API       |
| Jest              | Unit / integration testing |

## Frontend

| Tecnología      | Propósito              |
| --------------- | ---------------------- |
| React           | UI                     |
| TypeScript      | Lenguaje               |
| Vite            | Build tool             |
| Tailwind CSS    | Estilos                |
| shadcn/ui       | Componentes UI         |
| TanStack Query  | Server state           |
| React Hook Form | Formularios            |
| Zod             | Validación             |
| Vitest          | Testing                |
| Testing Library | Testing de componentes |
| Playwright      | E2E                    |

## Development & Infrastructure

| Tecnología     | Propósito               |
| -------------- | ----------------------- |
| Git            | Control de versiones    |
| GitHub         | Repositorio             |
| Docker         | Contenedores            |
| Docker Compose | Entorno local           |
| Postman        | Pruebas manuales de API |
| GitHub Actions | CI/CD                   |

Redis queda fuera del MVP inicial y podrá incorporarse posteriormente cuando exista una necesidad técnica concreta.

---

# 3. Repository Structure

El proyecto estará dividido inicialmente en dos aplicaciones:

```text
stockflow/
├── stockflow-api/
└── stockflow-web/
```

### Backend

```text
stockflow-api/
├── src/
│   ├── modules/
│   ├── common/
│   ├── config/
│   └── main.ts
├── test/
├── migrations/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

### Frontend

```text
stockflow-web/
├── src/
│   ├── modules/
│   ├── components/
│   ├── layouts/
│   ├── routes/
│   ├── services/
│   ├── hooks/
│   └── main.tsx
└── package.json
```

---

# 4. Backlog Structure

Cada elemento del backlog seguirá esta jerarquía:

```text
Epic
 └── User Story
      ├── Acceptance Criteria
      ├── Technical Tasks
      └── Subtasks
```

### Epic

Representa una capacidad grande del producto.

Ejemplo:

```text
EPIC-05 — Inventory Management
```

### User Story

Representa una funcionalidad desde la perspectiva del usuario.

Ejemplo:

```text
STORY-05-01 — Consultar inventario
```

### Technical Task

Representa trabajo técnico necesario para completar una historia.

Ejemplo:

```text
TASK — Crear Inventory entity
TASK — Crear migration
TASK — Crear repository
TASK — Crear endpoint
TASK — Crear inventory page
```

---

# 5. Priorities

| Priority | Meaning                      |
| -------- | ---------------------------- |
| P0       | Crítica / bloquea el sistema |
| P1       | Alta / necesaria para MVP    |
| P2       | Media / importante           |
| P3       | Baja / futura                |

---

# 6. Story Points

Las historias utilizarán la secuencia de Fibonacci:

```text
1
2
3
5
8
13
21
```

Los Story Points representan complejidad, incertidumbre y esfuerzo relativo.

No representan horas directamente.

---

# 7. EPIC-01 — Project Foundation

## Objective

Crear la base técnica del proyecto y preparar el entorno de desarrollo.

---

### STORY-01-01 — Inicializar backend NestJS

**Priority:** P0
**Story Points:** 3

**Como** desarrollador
**quiero** inicializar el backend utilizando NestJS
**para** disponer de una base sólida para desarrollar StockFlow.

#### Acceptance Criteria

* El proyecto NestJS está creado.
* TypeScript está configurado.
* La aplicación inicia correctamente.
* El código está versionado en Git.

---

### STORY-01-02 — Inicializar frontend React

**Priority:** P0
**Story Points:** 3

**Como** desarrollador
**quiero** inicializar el frontend utilizando React y TypeScript
**para** construir la interfaz web de StockFlow.

#### Acceptance Criteria

* El proyecto React está creado.
* Vite está configurado.
* TypeScript está configurado.
* La aplicación inicia correctamente.
* El código está versionado.

---

### STORY-01-03 — Configurar estructura modular del backend

**Priority:** P0
**Story Points:** 5

#### Acceptance Criteria

* Existe una estructura modular.
* Los módulos representan dominios del negocio.
* Las responsabilidades están separadas.
* La estructura sigue el Architecture Document.

---

### STORY-01-04 — Configurar arquitectura del frontend

**Priority:** P0
**Story Points:** 5

Configurar:

```text
modules/
components/
layouts/
routes/
services/
hooks/
```

#### Acceptance Criteria

* La estructura está documentada.
* Los módulos están separados por dominio.
* Los componentes reutilizables están separados.
* La comunicación con la API está centralizada.

---

### STORY-01-05 — Configurar MySQL y TypeORM

**Priority:** P0
**Story Points:** 5

#### Acceptance Criteria

* TypeORM está configurado.
* MySQL está disponible.
* La aplicación puede conectarse a MySQL.
* Las credenciales utilizan variables de entorno.
* Las migraciones están habilitadas.

---

### STORY-01-06 — Configurar Docker

**Priority:** P1
**Story Points:** 5

#### Acceptance Criteria

* MySQL puede iniciarse mediante Docker Compose.
* La aplicación puede conectarse al contenedor.
* Las variables de entorno están documentadas.
* El entorno puede reproducirse desde una máquina limpia.

---

### STORY-01-07 — Configurar Tailwind CSS

**Priority:** P1
**Story Points:** 3

---

### STORY-01-08 — Configurar shadcn/ui

**Priority:** P1
**Story Points:** 3

Configurar los componentes base de interfaz.

---

### STORY-01-09 — Configurar calidad de código

**Priority:** P1
**Story Points:** 3

Configurar:

```text
ESLint
Prettier
Husky
Lint-staged
```

---

### STORY-01-10 — Configurar Swagger

**Priority:** P1
**Story Points:** 2

---

### STORY-01-11 — Configurar testing

**Priority:** P1
**Story Points:** 3

Configurar:

```text
Backend:
Jest

Frontend:
Vitest
Testing Library

E2E:
Playwright
```

---

# 8. EPIC-02 — Authentication & Identity

## Objective

Permitir autenticación, administración de usuarios y autorización basada en roles.

---

### STORY-02-01 — Crear usuarios

**Priority:** P1
**Story Points:** 5

**Como** administrador
**quiero** crear usuarios
**para** permitir que empleados utilicen StockFlow.

#### Acceptance Criteria

* Se puede crear un usuario.
* El email es único dentro de la compañía.
* La contraseña se almacena de forma segura.
* El usuario recibe un estado válido.
* La operación queda auditada.

---

### STORY-02-02 — Login API

**Priority:** P0
**Story Points:** 5

---

### STORY-02-03 — Login frontend

**Priority:** P0
**Story Points:** 5

**Como** usuario
**quiero** iniciar sesión desde la aplicación web
**para** acceder a StockFlow.

#### Acceptance Criteria

* Existe formulario de login.
* Se validan los campos.
* Se muestran errores.
* El usuario autenticado accede al dashboard.
* Las credenciales no se almacenan de forma insegura.

---

### STORY-02-04 — Consultar usuario autenticado

**Priority:** P1
**Story Points:** 2

Implementar:

```text
GET /auth/me
```

---

### STORY-02-05 — Gestionar roles

**Priority:** P1
**Story Points:** 5

Roles:

```text
ADMINISTRATOR
BRANCH_MANAGER
WAREHOUSE_OPERATOR
BUYER
READ_ONLY
```

---

### STORY-02-06 — Implementar autorización

**Priority:** P0
**Story Points:** 8

---

### STORY-02-07 — Scope por compañía y sucursal

**Priority:** P1
**Story Points:** 8

---

### STORY-02-08 — Protección de rutas frontend

**Priority:** P0
**Story Points:** 5

El frontend debe proteger las rutas que requieren autenticación.

---

### STORY-02-09 — Autorización visual por rol

**Priority:** P1
**Story Points:** 5

El frontend debe adaptar menús, acciones y vistas según el rol.

La autorización real siempre será validada por el backend.

---

# 9. EPIC-03 — Organization Management

## Objective

Gestionar compañías, sucursales y bodegas.

---

### STORY-03-01 — Crear compañía API

**Priority:** P1
**Story Points:** 3

---

### STORY-03-02 — Crear compañía frontend

**Priority:** P1
**Story Points:** 3

---

### STORY-03-03 — Crear sucursal

**Priority:** P1
**Story Points:** 3

---

### STORY-03-04 — Crear bodega

**Priority:** P1
**Story Points:** 3

---

### STORY-03-05 — Configurar bodega por defecto

**Priority:** P1
**Story Points:** 5

#### Acceptance Criteria

* Una sucursal puede tener múltiples bodegas.
* Una sucursal puede tener una bodega por defecto.
* No pueden existir dos bodegas por defecto en la misma sucursal.
* Cambiar la bodega por defecto actualiza correctamente la anterior.

---

### STORY-03-06 — Gestionar estado de sucursales y bodegas

**Priority:** P2
**Story Points:** 3

---

### STORY-03-07 — Crear vistas administrativas

**Priority:** P1
**Story Points:** 5

Frontend para:

```text
Companies
Branches
Warehouses
```

---

# 10. EPIC-04 — Product Catalog

## Objective

Gestionar el catálogo de productos.

---

### STORY-04-01 — Crear categoría

**Priority:** P1
**Story Points:** 3

---

### STORY-04-02 — Crear categoría frontend

**Priority:** P1
**Story Points:** 3

---

### STORY-04-03 — Crear producto

**Priority:** P1
**Story Points:** 5

#### Acceptance Criteria

* El producto requiere SKU.
* El SKU es único dentro de la compañía.
* El producto pertenece a una categoría.
* Se define unidad de medida.
* El producto puede activarse/desactivarse.

---

### STORY-04-04 — Consultar productos

**Priority:** P1
**Story Points:** 3

Debe soportar:

```text
Paginación
Filtros
Búsqueda
Ordenamiento
```

---

### STORY-04-05 — Construir catálogo frontend

**Priority:** P1
**Story Points:** 5

Debe incluir:

```text
Tabla de productos
Búsqueda
Filtros
Paginación
Estados
Acciones
```

---

### STORY-04-06 — Crear formulario de producto

**Priority:** P1
**Story Points:** 5

Utilizar:

```text
React Hook Form
Zod
```

---

### STORY-04-07 — Actualizar producto

**Priority:** P1
**Story Points:** 3

---

### STORY-04-08 — Desactivar producto

**Priority:** P1
**Story Points:** 2

---

# 11. EPIC-05 — Inventory Management

## Objective

Gestionar el stock disponible por producto y bodega.

---

### STORY-05-01 — Crear inventario

**Priority:** P0
**Story Points:** 5

---

### STORY-05-02 — Consultar stock API

**Priority:** P0
**Story Points:** 5

---

### STORY-05-03 — Construir dashboard de inventario

**Priority:** P0
**Story Points:** 8

Debe mostrar:

```text
Producto
SKU
Sucursal
Bodega
Stock disponible
Stock mínimo
Stock máximo
Estado
```

---

### STORY-05-04 — Registrar entrada de inventario

**Priority:** P0
**Story Points:** 5

La operación debe:

```text
Actualizar Inventory
        ↓
Crear InventoryMovement
        ↓
Registrar observación
        ↓
Generar AuditLog
```

---

### STORY-05-05 — Registrar salida de inventario

**Priority:** P0
**Story Points:** 5

#### Acceptance Criteria

* Se valida disponibilidad.
* No se permite stock negativo.
* La observación es obligatoria.
* Se crea InventoryMovement.
* Se genera AuditLog.
* La operación es transaccional.

---

### STORY-05-06 — Formularios de entrada y salida

**Priority:** P0
**Story Points:** 5

---

### STORY-05-07 — Consultar movimientos

**Priority:** P1
**Story Points:** 5

Filtros:

```text
Producto
Bodega
Tipo
Usuario
Fecha
```

---

### STORY-05-08 — Pantalla de movimientos

**Priority:** P1
**Story Points:** 5

---

### STORY-05-09 — Configurar niveles mínimo/máximo

**Priority:** P1
**Story Points:** 5

---

# 12. EPIC-06 — Inventory Adjustments

## Objective

Permitir corregir diferencias entre inventario físico y sistema.

---

### STORY-06-01 — Solicitar ajuste

**Priority:** P1
**Story Points:** 5

El operador debe proporcionar:

```text
Producto
Bodega
Cantidad
Tipo
Observación
```

---

### STORY-06-02 — Aprobar ajuste

**Priority:** P1
**Story Points:** 5

---

### STORY-06-03 — Rechazar ajuste

**Priority:** P1
**Story Points:** 3

El rechazo requiere una razón.

---

### STORY-06-04 — Aplicar ajuste

**Priority:** P1
**Story Points:** 5

```text
InventoryAdjustment
        ↓
Inventory
        ↓
InventoryMovement
        ↓
AuditLog
```

---

### STORY-06-05 — Ajustes directos de gerente/administrador

**Priority:** P1
**Story Points:** 3

Gerentes y administradores pueden realizar ajustes directamente.

La observación continúa siendo obligatoria.

---

### STORY-06-06 — Pantalla de ajustes

**Priority:** P1
**Story Points:** 5

Debe permitir:

```text
Consultar
Crear
Aprobar
Rechazar
Ver detalle
```

Las acciones disponibles dependen del rol.

---

# 13. EPIC-07 — Inventory Transfers

## Objective

Permitir transferir productos entre bodegas.

---

### STORY-07-01 — Crear transferencia

**Priority:** P1
**Story Points:** 5

Requiere:

```text
Bodega origen
Bodega destino
Producto
Cantidad
Observación
```

---

### STORY-07-02 — Enviar transferencia

**Priority:** P1
**Story Points:** 8

Al enviar:

```text
Source Inventory
      ↓
- quantity
      ↓
TRANSFER_OUT
      ↓
Transfer = SENT
```

---

### STORY-07-03 — Recibir transferencia

**Priority:** P1
**Story Points:** 8

Al recibir:

```text
Destination Inventory
      ↓
+ quantity
      ↓
TRANSFER_IN
      ↓
Transfer = RECEIVED
```

---

### STORY-07-04 — Recepción parcial

**Priority:** P2
**Story Points:** 8

Ejemplo:

```text
Enviado: 20
Recibido: 15
Pendiente: 5
```

---

### STORY-07-05 — Historial de transferencias

**Priority:** P2
**Story Points:** 3

---

### STORY-07-06 — Pantalla de transferencias

**Priority:** P1
**Story Points:** 8

Debe permitir:

```text
Crear
Consultar
Enviar
Recibir
Ver detalle
```

---

# 14. EPIC-08 — Purchasing

## Objective

Gestionar proveedores y órdenes de compra.

---

### STORY-08-01 — Crear proveedor

**Priority:** P1
**Story Points:** 3

---

### STORY-08-02 — Consultar proveedores

**Priority:** P1
**Story Points:** 3

---

### STORY-08-03 — Gestión frontend de proveedores

**Priority:** P1
**Story Points:** 5

---

### STORY-08-04 — Crear orden de compra

**Priority:** P1
**Story Points:** 8

Una orden contiene:

```text
Proveedor
Sucursal
Bodega
Productos
Cantidad
Precio unitario
```

---

### STORY-08-05 — Enviar orden de compra

**Priority:** P1
**Story Points:** 3

---

### STORY-08-06 — Recibir orden de compra

**Priority:** P1
**Story Points:** 8

La recepción actualiza:

```text
PurchaseOrderItem
        ↓
Inventory
        ↓
InventoryMovement
```

---

### STORY-08-07 — Recepción parcial

**Priority:** P2
**Story Points:** 8

Ejemplo:

```text
Ordenada: 100
Recibida: 70
Pendiente: 30
```

---

### STORY-08-08 — Pantalla de órdenes de compra

**Priority:** P1
**Story Points:** 8

---

### STORY-08-09 — Pantalla de recepción

**Priority:** P1
**Story Points:** 8

---

# 15. EPIC-09 — Inventory Alerts

## Objective

Alertar sobre niveles bajos de inventario.

---

### STORY-09-01 — Detectar stock bajo

**Priority:** P1
**Story Points:** 5

Cuando:

```text
quantity <= minimum_quantity
```

se genera una alerta.

---

### STORY-09-02 — Consultar alertas

**Priority:** P1
**Story Points:** 3

---

### STORY-09-03 — Resolver alerta

**Priority:** P2
**Story Points:** 3

---

### STORY-09-04 — Evitar alertas duplicadas

**Priority:** P2
**Story Points:** 5

---

### STORY-09-05 — Centro de alertas frontend

**Priority:** P1
**Story Points:** 5

Debe permitir:

```text
Consultar alertas
Filtrar
Ver detalle
Resolver
```

---

# 16. EPIC-10 — Audit & Traceability

## Objective

Mantener trazabilidad completa de las operaciones importantes.

---

### STORY-10-01 — Crear infraestructura de auditoría

**Priority:** P1
**Story Points:** 5

---

### STORY-10-02 — Auditar operaciones de inventario

**Priority:** P1
**Story Points:** 5

Auditar:

```text
Entradas
Salidas
Ajustes
Transferencias
Recepciones
```

---

### STORY-10-03 — Auditar operaciones de catálogo

**Priority:** P2
**Story Points:** 3

---

### STORY-10-04 — Consultar auditoría

**Priority:** P1
**Story Points:** 5

Filtros:

```text
Usuario
Entidad
Acción
Fecha
```

---

### STORY-10-05 — Garantizar inmutabilidad

**Priority:** P1
**Story Points:** 5

No deben existir operaciones normales para modificar o eliminar logs.

---

### STORY-10-06 — Pantalla de auditoría

**Priority:** P1
**Story Points:** 5

La interfaz debe permitir consultar:

```text
Fecha
Usuario
Acción
Entidad
Identificador
Descripción
```

---

# 17. EPIC-11 — Reporting

## Objective

Proporcionar información consolidada para administración y gerencia.

---

### STORY-11-01 — Reporte de stock por bodega

**Priority:** P2
**Story Points:** 5

---

### STORY-11-02 — Reporte consolidado por sucursal

**Priority:** P2
**Story Points:** 5

---

### STORY-11-03 — Reporte global de inventario

**Priority:** P2
**Story Points:** 8

---

### STORY-11-04 — Reporte de movimientos

**Priority:** P2
**Story Points:** 5

---

### STORY-11-05 — Exportar reportes

**Priority:** P3
**Story Points:** 5

Formatos:

```text
CSV
Excel
```

---

### STORY-11-06 — Dashboard ejecutivo

**Priority:** P2
**Story Points:** 8

Mostrar indicadores como:

```text
Stock total
Productos con stock bajo
Movimientos recientes
Transferencias pendientes
Órdenes de compra
```

Los indicadores deben respetar el alcance del usuario.

---

# 18. EPIC-12 — Quality & Production Readiness

## Objective

Preparar StockFlow para un entorno cercano a producción.

---

### STORY-12-01 — Unit testing backend

**Priority:** P1
**Story Points:** 8

---

### STORY-12-02 — Integration testing backend

**Priority:** P1
**Story Points:** 8

---

### STORY-12-03 — Unit testing frontend

**Priority:** P1
**Story Points:** 5

---

### STORY-12-04 — End-to-end testing

**Priority:** P1
**Story Points:** 8

Utilizar Playwright.

---

### STORY-12-05 — Health checks

**Priority:** P2
**Story Points:** 3

Implementar:

```text
GET /health
```

Validar:

```text
Application
Database
```

---

### STORY-12-06 — Logging estructurado

**Priority:** P1
**Story Points:** 5

Registrar:

```text
Request
Response
Error
Execution time
Correlation ID
```

No registrar información sensible.

---

### STORY-12-07 — Manejo global de excepciones

**Priority:** P1
**Story Points:** 5

---

### STORY-12-08 — Seguridad de API

**Priority:** P1
**Story Points:** 8

Considerar:

```text
Rate limiting
CORS
Helmet
Validation
Authentication security
Sensitive data protection
```

---

### STORY-12-09 — Manejo global de errores frontend

**Priority:** P1
**Story Points:** 5

Implementar:

```text
Loading states
Error states
Empty states
Unauthorized states
Not found states
```

---

### STORY-12-10 — CI/CD

**Priority:** P2
**Story Points:** 8

Pipeline:

```text
Push
 ↓
Install
 ↓
Lint
 ↓
Unit Tests
 ↓
Integration Tests
 ↓
Build
 ↓
E2E
```

---

# 19. EPIC-13 — Frontend Experience

## Objective

Construir una experiencia consistente y profesional para los usuarios de StockFlow.

Esta épica contiene capacidades transversales del frontend que no pertenecen exclusivamente a un dominio.

---

### STORY-13-01 — Crear aplicación layout

**Priority:** P1
**Story Points:** 5

Crear:

```text
Sidebar
Header
Main content
User menu
Navigation
```

---

### STORY-13-02 — Sistema de navegación

**Priority:** P1
**Story Points:** 3

La navegación debe adaptarse al rol.

---

### STORY-13-03 — Sistema de notificaciones

**Priority:** P1
**Story Points:** 3

Mostrar mensajes para:

```text
Success
Error
Warning
Information
```

---

### STORY-13-04 — Componentes reutilizables

**Priority:** P1
**Story Points:** 5

Crear componentes para:

```text
Tables
Forms
Dialogs
Buttons
Badges
Cards
Pagination
Filters
Loading
Empty states
```

---

### STORY-13-05 — Manejo centralizado de API

**Priority:** P1
**Story Points:** 5

Crear una capa para:

```text
HTTP requests
Authentication
Headers
Error handling
API configuration
```

---

### STORY-13-06 — Server state management

**Priority:** P1
**Story Points:** 5

Utilizar TanStack Query para:

```text
Fetching
Caching
Mutations
Invalidation
Loading states
Error states
```

---

### STORY-13-07 — Responsive design

**Priority:** P1
**Story Points:** 5

La aplicación debe funcionar correctamente en:

```text
Desktop
Tablet
Mobile
```

Especialmente en tablets utilizadas en operaciones de bodega.

---

### STORY-13-08 — Accesibilidad

**Priority:** P2
**Story Points:** 5

Considerar:

```text
Keyboard navigation
Labels
ARIA
Contrast
Focus states
```

---

# 20. MVP Definition

El MVP estará compuesto principalmente por:

```text
EPIC-01 Foundation
EPIC-02 Authentication & Identity
EPIC-03 Organization Management
EPIC-04 Product Catalog
EPIC-05 Inventory Management
EPIC-06 Inventory Adjustments
EPIC-07 Inventory Transfers
EPIC-08 Purchasing
EPIC-09 Inventory Alerts
EPIC-10 Audit & Traceability
EPIC-13 Frontend Experience
```

Las funcionalidades avanzadas de reporting y producción podrán desarrollarse progresivamente.

---

# 21. MVP User Journey

El flujo principal esperado será:

```text
Administrator
      │
      ├── Login
      │
      ├── Create Company
      │
      ├── Create Branch
      │
      ├── Create Warehouses
      │
      ├── Create Users
      │
      └── Assign Roles
               │
               ▼
            Catalog
               │
               ├── Create Category
               └── Create Product
                        │
                        ▼
                     Inventory
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
           Purchase   Transfer   Adjustment
              │         │         │
              └─────────┼─────────┘
                        ▼
                    Inventory
                        │
                        ▼
                      Alert
                        │
                        ▼
                      Audit
```

---

# 22. Vertical Slice Development

StockFlow no se desarrollará separando completamente frontend y backend.

Cada funcionalidad importante deberá construirse como un flujo vertical:

```text
User Story
    ↓
Domain
    ↓
Database
    ↓
Backend
    ↓
API
    ↓
Postman
    ↓
Frontend
    ↓
Frontend Tests
    ↓
E2E
```

Por ejemplo:

```text
STORY — Crear producto

Database
   ↓
Product Entity
   ↓
Migration
   ↓
Repository
   ↓
Application Service
   ↓
Controller
   ↓
Swagger
   ↓
Postman
   ↓
React Service
   ↓
Product Form
   ↓
React Query Mutation
   ↓
Validation
   ↓
E2E Test
```

Esto permite detectar problemas rápidamente y evita construir grandes cantidades de código desconectado.

---

# 23. API Development Workflow

Antes de conectar una funcionalidad con React se deberá validar la API.

El flujo será:

```text
Implement API
      ↓
Unit Tests
      ↓
Integration Tests
      ↓
Swagger
      ↓
Postman
      ↓
Frontend Integration
```

Postman será utilizado principalmente como herramienta de desarrollo y validación de API.

No será la interfaz final del usuario.

---

# 24. Definition of Ready

Una User Story estará lista para entrar a un sprint cuando:

* El objetivo está claramente definido.
* El comportamiento esperado está documentado.
* Los criterios de aceptación están definidos.
* Las dependencias conocidas están identificadas.
* El equipo entiende la historia.
* La historia puede estimarse.
* No existen preguntas críticas pendientes.

---

# 25. Definition of Done

Una User Story estará terminada cuando:

* El código está implementado.
* Se respetan las reglas de arquitectura.
* Las validaciones están implementadas.
* Las pruebas necesarias están creadas.
* Los tests pasan.
* El código pasa lint.
* La documentación necesaria está actualizada.
* La API está documentada cuando corresponde.
* Las migraciones están incluidas cuando corresponde.
* La funcionalidad frontend está integrada cuando corresponde.
* Los estados de loading/error/empty están manejados.
* Se realizó code review.
* No existen errores conocidos bloqueantes.
* La funcionalidad cumple los criterios de aceptación.

---

# 26. Development Order

El desarrollo seguirá inicialmente este orden:

```text
Sprint 0
Project Foundation
        ↓
Sprint 1
Authentication & Identity
        ↓
Sprint 2
Organizations
        ↓
Sprint 3
Catalog
        ↓
Sprint 4
Inventory
        ↓
Sprint 5
Inventory Adjustments
        ↓
Sprint 6
Transfers
        ↓
Sprint 7
Purchasing
        ↓
Sprint 8
Alerts & Audit
        ↓
Sprint 9
Reporting
        ↓
Sprint 10
Quality & Production Readiness
```

Los sprints son una propuesta inicial y podrán modificarse durante Sprint Planning.

---

# 27. MVP Completion Criteria

El MVP será considerado funcional cuando:

* Un administrador pueda configurar una compañía.
* Se puedan crear sucursales.
* Se puedan crear múltiples bodegas por sucursal.
* Se pueda definir una única bodega por defecto.
* Se puedan crear usuarios.
* Se puedan asignar roles.
* Los usuarios puedan autenticarse desde el frontend.
* Las rutas estén protegidas.
* Se puedan crear categorías.
* Se puedan crear productos.
* Se pueda consultar inventario por bodega.
* Se puedan registrar entradas.
* Se puedan registrar salidas.
* No se permita stock negativo.
* Se puedan realizar ajustes.
* Los ajustes de operadores requieran aprobación.
* Gerentes y administradores puedan realizar ajustes directamente.
* Se puedan realizar transferencias.
* Se puedan enviar transferencias.
* Se puedan recibir transferencias.
* Se puedan realizar recepciones parciales.
* Se puedan crear órdenes de compra.
* Se puedan recibir órdenes de compra.
* Se puedan generar alertas de stock bajo.
* Las operaciones importantes queden auditadas.
* Se pueda consultar la auditoría.
* Exista una interfaz web funcional.
* La interfaz respete los roles.
* La aplicación sea responsive.
* Los endpoints estén documentados mediante Swagger.
* Existan pruebas automatizadas para las operaciones críticas.

---

# 28. Future Features

Estas funcionalidades están fuera del MVP:

```text
Sales
Customers
Sales Orders
Invoicing
ERP Integrations
External Supplier Integrations
Mobile Application
Demand Forecasting
Machine Learning
Advanced Analytics
Redis Caching
Background Jobs
Notifications
Email Notifications
Real-time Notifications
Barcode Scanning
QR Code Support
```

La futura funcionalidad de ventas deberá integrarse con Inventory:

```text
Sale
  ↓
Stock Out
  ↓
InventoryMovement
  ↓
AuditLog
```

---

# 29. Future Redis Integration

Redis no forma parte de la primera versión.

Podrá incorporarse posteriormente cuando exista una necesidad técnica concreta.

Posibles usos:

```text
Caching
Session management
Rate limiting
Background jobs
Temporary data
Distributed locks
```

La incorporación deberá justificarse mediante una necesidad real de arquitectura o rendimiento.

---

# 30. Product Roadmap

## Phase 1 — Foundation

```text
Backend
Frontend
Database
Docker
Architecture
Authentication
```

## Phase 2 — Core Inventory

```text
Organizations
Catalog
Inventory
Adjustments
Transfers
```

## Phase 3 — Procurement

```text
Suppliers
Purchase Orders
Receiving
Alerts
```

## Phase 4 — Visibility

```text
Audit
Reports
Exports
Dashboard
```

## Phase 5 — Production Readiness

```text
Testing
Security
Observability
CI/CD
Performance
```

## Phase 6 — Future Commerce

```text
Customers
Sales
Orders
Invoicing
```

---

# 31. Backlog Evolution

Este backlog no es estático.

Durante el desarrollo pueden aparecer:

* Nuevas historias.
* Cambios de prioridad.
* Cambios en reglas de negocio.
* Bugs.
* Technical Debt.
* Mejoras.
* Nuevos requisitos.

Los cambios deben registrarse en Jira.

El código no debe modificarse informalmente fuera del flujo establecido.

El Product Backlog representa el estado actual de las necesidades del producto.

---

# 32. Backlog Summary

StockFlow se desarrollará desde una base técnica pequeña hacia una plataforma empresarial de gestión de inventario.

El objetivo no es construir todas las funcionalidades posibles desde el inicio.

La prioridad es construir correctamente el núcleo:

```text
Identity
   ↓
Organization
   ↓
Catalog
   ↓
Inventory
   ↓
Business Operations
   ↓
Audit
   ↓
Reporting
```

Cada nueva funcionalidad deberá respetar:

```text
PRD
 ↓
Domain Model
 ↓
Architecture
 ↓
Database Design
 ↓
API Design
 ↓
Backlog
 ↓
Implementation
 ↓
Testing
```

El frontend y backend evolucionarán conjuntamente mediante vertical slices.

La trazabilidad entre negocio, dominio, persistencia, API, interfaz y pruebas debe mantenerse durante todo el desarrollo.
