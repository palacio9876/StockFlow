<!-- markdownlint-disable MD024 -->
# StockFlow — Arquitectura

## 1. Descripción general de la arquitectura

StockFlow utilizará una arquitectura **Modular Monolith** basada en NestJS.

La aplicación será desplegada inicialmente como una única unidad, pero estará
organizada internamente en módulos orientados al dominio y a las
responsabilidades del negocio.

Cada módulo tendrá una responsabilidad específica y deberá mantener límites
claros con respecto a los demás módulos.

La arquitectura combinará principios de:

- Domain-Driven Design.
- Clean Architecture.
- Layered Architecture.
- Modular Monolith.
- Domain Events.

Estos principios se utilizarán de manera pragmática. No se implementarán
patrones o estructuras únicamente por seguir una metodología, sino cuando
aporten valor al proyecto.

### Objetivos de la arquitectura

- Mantener el dominio independiente de frameworks e infraestructura.
- Separar responsabilidades entre módulos.
- Mantener alta cohesión dentro de los módulos.
- Reducir el acoplamiento entre módulos.
- Facilitar pruebas unitarias, de integración y de extremo a extremo.
- Mantener las operaciones críticas de inventario consistentes mediante
  transacciones.
- Evitar que los controladores contengan lógica de negocio.
- Facilitar futuras integraciones externas.
- Permitir crecimiento funcional sin convertir el sistema en un monolito
  difícil de mantener.
- Mantener una arquitectura comprensible para un equipo de desarrollo
  empresarial.
- Evitar introducir infraestructura innecesaria durante el MVP.

---

## 2. Estilo arquitectónico

StockFlow será un **Modular Monolith**.

Esto significa que la aplicación se desplegará como una única aplicación, pero
estará dividida internamente en módulos independientes orientados al negocio.

```text
                    StockFlow
                        │
                Modular Monolith
                        │
                NestJS Application
                        │
        ┌───────────────┼────────────────┐
        │               │                │
      Modules       Cross-cutting     Configuration
        │               │
        │               ├── Common
        │               ├── Database
        │               └── Config
        │
        ├── Identity
        ├── Organizations
        ├── Catalog
        ├── Inventory
        ├── Transfers
        ├── Purchasing
        ├── Alerts
        ├── Audit
        └── Reporting
                        │
                        ▼
                      MySQL
```

---

## 3. Stack tecnológico

### 3.1 Backend

| Tecnología        | Propósito                 |
| ----------------- | ------------------------- |
| Node.js           | Tiempo de ejecución       |
| NestJS            | Framework de backend      |
| TypeScript        | Lenguaje de programación  |
| REST API          | API externa               |
| MySQL             | Base de datos relacional  |
| TypeORM           | ORM / persistencia        |
| JWT               | Autenticación             |
| class-validator   | Validación de peticiones  |
| class-transformer | Transformación de DTOs    |

### 3.2 Frontend

| Tecnología   | Propósito                |
| ------------ | ------------------------ |
| React        | Framework de frontend    |
| TypeScript   | Lenguaje de programación |
| Vite         | Herramienta de build     |
| React Router | Enrutado en el cliente   |
| Tailwind CSS | Estilos                  |
| shadcn/ui    | Componentes de UI        |
| Lucide       | Iconos                   |

El frontend se comunicará con el backend a través de la API REST.

```text
React
  │
  │ HTTP / REST
  ▼
NestJS API
```

### 3.3 Herramientas de desarrollo

Herramientas de desarrollo recomendadas:

| Herramienta    | Propósito                    |
| -------------- | ---------------------------- |
| Git            | Control de versiones         |
| GitHub         | Repositorio de código fuente |
| Docker         | Infraestructura local        |
| Docker Compose | Entorno local de MySQL       |
| ESLint         | Análisis estático            |
| Prettier       | Formato de código            |
| Jest           | Pruebas unitarias            |
| Supertest      | Pruebas de integración HTTP  |

### 3.4 Infraestructura no utilizada inicialmente

Las siguientes tecnologías se excluyen intencionalmente de la arquitectura
inicial:

- `Redis`.
- `Kafka`.
- `RabbitMQ`.
- `Elasticsearch`.
- `Kubernetes`.
- Microservicios.

Estas tecnologías podrían introducirse en versiones futuras si los requisitos
técnicos reales justifican su uso.

No son necesarias para el MVP.

---

## 4. Estructura del proyecto

El backend seguirá la siguiente estructura de alto nivel:

```text
src/
├── modules/
│   ├── identity/
│   ├── organizations/
│   ├── catalog/
│   ├── inventory/
│   ├── transfers/
│   ├── purchasing/
│   ├── alerts/
│   ├── audit/
│   └── reporting/
│
├── common/
├── config/
├── database/
├── app.module.ts
└── main.ts
```

### modules/

Contiene los módulos de negocio de la aplicación.

### common/

Contiene funcionalidad que es genuinamente compartida entre varios módulos.

Ejemplos:

```text
common/
├── decorators/
├── guards/
├── filters/
├── interceptors/
└── exceptions/
```

El código compartido solo debe colocarse en `common/` cuando sea realmente
transversal.

La lógica específica de negocio debe permanecer dentro de su propio módulo.

### config/

Contiene la configuración de la aplicación.

Ejemplos:

```text
config/
├── app.config.ts
└── database.config.ts
```

### database/

Contiene la configuración a nivel de base de datos y la infraestructura de
persistencia compartida.

---

## 5. Módulos del sistema

StockFlow se organizará en módulos orientados al negocio.

```text
src/modules/
├── identity/
├── organizations/
├── catalog/
├── inventory/
├── transfers/
├── purchasing/
├── alerts/
├── audit/
└── reporting/
```

Cada módulo es propietario de una parte específica del dominio de negocio.

Una entidad del Modelo de Dominio debe tener un módulo propietario claramente
definido.

---

## 6. Responsabilidades de los módulos

### 6.1 Identity

Responsable de la autenticación, los usuarios y el control de acceso.

#### Entidades

- `User`
- `Role`
- `UserRole`

#### Responsabilidades

- Gestión de usuarios.
- Autenticación.
- Gestión de contraseñas.
- Asignación de roles.
- Autorización.
- Generación y validación de JWT.

### 6.2 Organizations

Responsable de la estructura organizativa de StockFlow.

#### Entidades

- `Company`
- `Branch`
- `Warehouse`

#### Responsabilidades

- Gestión de empresas.
- Gestión de sucursales.
- Gestión de almacenes.
- Configuración del almacén predeterminado.
- Relaciones organizativas.

### 6.3 Catalog

Responsable de la información de productos y categorías.

#### Entidades

- `Product`
- `Category`

#### Responsabilidades

- Gestión de productos.
- Gestión de SKU.
- Gestión de categorías.
- Activación y desactivación de productos.
- Consultas del catálogo de productos.

### 6.4 Inventory

Responsable del stock actual y de los movimientos de inventario.

#### Entidades

- `Inventory`
- `InventoryMovement`
- `InventoryAdjustment`

#### Responsabilidades

- Gestión de stock.
- Aumentos de stock.
- Disminuciones de stock.
- Movimientos de inventario.
- Ajustes de inventario.
- Validación de inventario.
- Disponibilidad de stock.
- Historial de inventario.

El inventario es uno de los módulos más críticos del sistema.

### 6.5 Transfers

Responsable de transferir inventario entre almacenes.

#### Entidades

- `InventoryTransfer`

#### Responsabilidades

- Crear transferencias.
- Enviar transferencias.
- Recibir transferencias.
- Recepción parcial.
- Validación de transferencias.
- Historial de transferencias.

El módulo de Transferencias debe utilizar los contratos de aplicación públicos
del módulo de Inventario para realizar los cambios reales de stock.

### 6.6 Purchasing

Responsable de los proveedores y las órdenes de compra.

#### Entidades

- `Supplier`
- `PurchaseOrder`
- `PurchaseOrderItem`

#### Responsabilidades

- Gestión de proveedores.
- Creación de órdenes de compra.
- Gestión de órdenes de compra.
- Recepción parcial.
- Recepción completa.
- Cancelación de órdenes de compra.

La recepción de una orden de compra debe interactuar con el módulo de Inventario
a través de su contrato de aplicación público para aumentar el stock.

### 6.7 Alerts

Responsable de las alertas relacionadas con el inventario.

#### Entidades

- `Alert`

#### Responsabilidades

- Detección de stock bajo.
- Creación de alertas.
- Resolución de alertas.
- Consultas de alertas activas.

El módulo de Alertas debe reaccionar a los eventos de inventario relevantes en
lugar de modificar directamente el inventario.

### 6.8 Audit

Responsable de la auditoría de negocio.

#### Entidades

- `AuditLog`

#### Responsabilidades

- Registrar acciones de negocio relevantes.
- Almacenar la información del actor.
- Almacenar la entidad afectada.
- Almacenar el estado anterior y el nuevo estado cuando corresponda.
- Mantener un historial inmutable.
- Proporcionar consultas de auditoría.

El módulo de Auditoría debe consumir principalmente los eventos de dominio
generados por otros módulos.

Los módulos de negocio no deben manipular directamente la entidad `AuditLog`.

### 6.9 Reporting

Responsable de los informes de negocio orientados a lectura.

#### Responsabilidades

- Inventario consolidado.
- Stock por almacén.
- Stock por sucursal.
- Historial de movimientos de inventario.
- Valoración de inventario.
- Exportaciones futuras.

Reporting no debe modificar el estado del dominio.

---

## 7. Propiedad de los módulos

Cada entidad debe tener un módulo propietario.

| Entidad               | Módulo        |
| --------------------- | ------------- |
| `Company`             | Organizations |
| `User`                | Identity      |
| `Role`                | Identity      |
| `UserRole`            | Identity      |
| `Branch`              | Organizations |
| `Warehouse`           | Organizations |
| `Product`             | Catalog       |
| `Category`            | Catalog       |
| `Inventory`           | Inventory     |
| `InventoryMovement`   | Inventory     |
| `InventoryAdjustment` | Inventory     |
| `InventoryTransfer`   | Transfers     |
| `Supplier`            | Purchasing    |
| `PurchaseOrder`       | Purchasing    |
| `PurchaseOrderItem`   | Purchasing    |
| `Alert`               | Alerts        |
| `AuditLog`            | Audit         |

Una entidad no debe ser modificada directamente por otro módulo.

Por ejemplo:

```text
Purchasing
    ❌ modifica directamente la entidad Inventory
```

```text
Purchasing
    ↓
Use Case de aplicación de Inventory
    ↓
Inventory
```

El módulo propietario es responsable de proteger las reglas y el estado de sus
entidades.

---

## 8. Estructura interna del módulo

Cada módulo de negocio puede seguir la siguiente estructura interna:

```text
inventory/
├── domain/
│   ├── entities/
│   ├── events/
│   ├── repositories/
│   ├── value-objects/
│   └── services/
│
├── application/
│   ├── use-cases/
│   ├── dto/
│   └── services/
│
├── infrastructure/
│   ├── persistence/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── migrations/
│   │
│   └── http/
│       ├── controllers/
│       └── dto/
│
└── inventory.module.ts
```

No todos los módulos deben contener todos los directorios.

Los directorios solo deben existir cuando aporten valor.

La arquitectura debe evitar crear abstracciones vacías o innecesarias.

---

## 9. Capas de la arquitectura

Cada módulo puede dividirse en tres capas principales:

- Dominio.
- Aplicación.
- Infraestructura.

Estas capas existen dentro del módulo, en lugar de ser capas globales de la
aplicación.

Ejemplo:

```text
modules/
└── inventory/
    ├── domain/
    ├── application/
    └── infrastructure/
```

### 9.1 Capa de dominio

La capa de dominio contiene las reglas de negocio y el comportamiento del
dominio.

Responsabilidades:

- Entidades.
- Objetos de valor.
- Servicios de dominio.
- Eventos de dominio.
- Interfaces de repositorio.
- Invariantes del dominio.

La capa de dominio no debe depender de:

- NestJS.
- TypeORM.
- HTTP.
- MySQL.
- Express.
- APIs externas.

Ejemplo:

- `Inventory`
- `InventoryMovement`
- `InventoryAdjustment`
- `StockIncreased`
- `StockDecreased`
- `InventoryRepository`

### 9.2 Capa de aplicación

La capa de aplicación coordina los casos de uso del negocio.

Responsabilidades:

- Casos de uso.
- DTOs de aplicación.
- Coordinación de transacciones.
- Orquestación de objetos de dominio.
- Llamadas a las interfaces de repositorio.
- Publicación de eventos de dominio.

Ejemplos:

- `IncreaseStockUseCase`
- `DecreaseStockUseCase`
- `RequestInventoryAdjustmentUseCase`
- `ApproveInventoryAdjustmentUseCase`

La capa de aplicación puede depender de la capa de dominio.

### 9.3 Capa de infraestructura

La capa de infraestructura contiene las implementaciones técnicas.

Responsabilidades:

- Repositorios TypeORM.
- Entidades de base de datos.
- Configuración de MySQL.
- Controladores HTTP.
- Integraciones con servicios externos.
- Implementaciones específicas del framework.

Ejemplos:

- `TypeOrmInventoryRepository`
- `InventoryController`
- `DatabaseModule`
- `JwtAuthGuard`

La infraestructura puede depender de la capa de aplicación y de dominio.

---

## 10. Dirección de dependencias

Las dependencias deben apuntar hacia el dominio.

```text
Infrastructure
      │
      ▼
Application
      │
      ▼
Domain
```

El dominio no debe depender de la infraestructura.

Permitido

```text
Controller
    ↓
Use Case
    ↓
Domain
```

No permitido

```text
Domain
    ↓
TypeORM
```

No permitido

```text
Domain
    ↓
NestJS Controller
```

El objetivo es mantener las reglas de negocio independientes de los detalles
técnicos de implementación.

---

## 11. Comunicación entre módulos

Los módulos deben comunicarse a través de contratos claramente definidos.

Métodos de comunicación preferidos:

- Casos de uso de aplicación.
- Interfaces de aplicación públicas.
- Eventos de dominio.

El acceso directo a la implementación interna de otro módulo está prohibido.

### 11.1 Comunicación síncrona

Se utiliza cuando una operación requiere un resultado inmediato.

Ejemplo:

```text
PurchaseOrder
      │
      ▼
ReceivePurchaseOrderUseCase
      │
      ▼
Inventory Public Use Case
      │
      ▼
IncreaseStockUseCase
```

### 11.2 Comunicación basada en eventos

Se utiliza cuando otros módulos necesitan reaccionar a algo que ha ocurrido.

Ejemplo:

```text
Inventory
    │
    ▼
StockIncreased
    │
    ├──→ Alerts
    ├──→ Audit
    └──→ Reporting
```

Los eventos de dominio deben usarse cuando la operación no requiere un
acoplamiento directo con el consumidor.

---

## 12. Reglas de dependencia entre módulos

Los módulos deben mantener límites claros.

Un módulo nunca debe importar directamente de otro módulo:

- ❌ La implementación de una entidad.
- ❌ El repositorio TypeORM.
- ❌ El modelo de base de datos.
- ❌ Un servicio interno.
- ❌ Un controlador interno.

En su lugar, los módulos deben comunicarse a través de:

- ✅ Casos de uso de aplicación públicos.
- ✅ Interfaces públicas.
- ✅ Eventos de dominio.

Ejemplo:

```text
Purchasing
    │
    ▼
Contrato público de Inventory
    │
    ▼
Inventory
```

Esto evita que los módulos de negocio queden fuertemente acoplados a los
detalles de implementación de otros módulos.

---

## 13. API pública del módulo

Cada módulo debe exponer solo lo que otros módulos necesitan.

Ejemplo:

```text
inventory/
├── public/
│   ├── increase-stock.use-case.ts
│   ├── decrease-stock.use-case.ts
│   └── inventory.types.ts
│
├── domain/
├── application/
├── infrastructure/
└── inventory.module.ts
```

El área `public/` representa el contrato externo del módulo.

Los detalles de implementación internos deben permanecer inaccesibles para
otros módulos.

La implementación exacta de la API pública se definirá durante el desarrollo de
los módulos.

---

## 14. Arquitectura de base de datos

StockFlow utilizará MySQL como base de datos relacional principal.

Todos los módulos compartirán inicialmente la misma base de datos.

```text
StockFlow
    │
    ▼
MySQL
    │
    ├── companies
    ├── users
    ├── roles
    ├── user_roles
    ├── branches
    ├── warehouses
    ├── products
    ├── categories
    ├── inventories
    ├── inventory_movements
    ├── inventory_adjustments
    ├── inventory_transfers
    ├── purchase_orders
    ├── purchase_order_items
    ├── suppliers
    ├── alerts
    └── audit_logs
```

Aunque la base de datos es compartida, la propiedad de las tablas permanece
alineada con los límites de los módulos.

Los detalles del diseño de la base de datos se definen por separado en
`DATABASE_DESIGN.md`.

---

## 15. Transacciones de base de datos

Las transacciones son necesarias para las operaciones que modifican múltiples
registros relacionados y deben permanecer atómicas.

Ejemplo:

Recibir orden de compra

```text
BEGIN
    ↓
Actualizar PurchaseOrder
    ↓
Actualizar Inventory
    ↓
Crear InventoryMovement
    ↓
Crear eventos de dominio
    ↓
COMMIT
```

Si alguna operación requerida falla:

```text
ROLLBACK
```

El sistema no debe dejar operaciones de inventario parcialmente completadas.

Las operaciones transaccionales críticas incluyen:

- Aumento de stock.
- Disminución de stock.
- Ajuste de inventario.
- Envío de transferencia.
- Recepción de transferencia.
- Recepción de orden de compra.

---

## 16. Concurrencia y consistencia del inventario

Las operaciones de inventario deben tener en cuenta las peticiones concurrentes.

Ejemplo:

```text
Stock = 10

Request A → Remove 7
Request B → Remove 6
```

El sistema debe impedir que ambas operaciones tengan éxito si dieran como
resultado stock negativo.

Las actualizaciones de inventario deben usar mecanismos transaccionales y a
nivel de base de datos apropiados.

La estrategia exacta de bloqueo se definirá durante la implementación de la
base de datos.

---

## 17. Arquitectura de eventos de dominio

Los eventos de dominio representan eventos de negocio relevantes que han
ocurrido.

Ejemplo:

```text
IncreaseStockUseCase
        │
        ▼
Inventory
        │
        ▼
StockIncreased
        │
        ▼
Event Dispatcher
        │
        ├──→ Audit Handler
        ├──→ Alert Handler
        └──→ Reporting Handler
```

Durante el MVP, los eventos de dominio son internos a la aplicación.

No se requiere un broker de mensajes externo.

---

## 18. Fiabilidad de eventos

Los eventos de dominio necesarios solo para el procesamiento síncrono interno
pueden despacharse dentro del proceso de la aplicación.

Para los eventos que eventualmente requieran un procesamiento asíncrono fiable,
la arquitectura puede evolucionar hacia el patrón Outbox.

Arquitectura futura:

```text
Transaction
    │
    ├── Business Data
    └── Outbox Event
            │
            ▼
       Background Worker
            │
            ▼
       Message Broker
```

El patrón Outbox está fuera del alcance del MVP inicial.

---

## 19. Autenticación

La autenticación utilizará JWT.

Flujo general:

```text
Client
   │
   ▼
POST /api/v1/auth/login
   │
   ▼
Identity Module
   │
   ├── Validate credentials
   └── Generate JWT
           │
           ▼
        Client
```

Peticiones autenticadas:

```text
Client
   │
   ▼
JWT
   │
   ▼
Authentication Guard
   │
   ▼
Authorization
   │
   ▼
Controller
```

---

## 20. Autorización

StockFlow utilizará control de acceso basado en roles (RBAC).

Los roles definidos en el modelo de dominio incluyen:

- Administrador.
- Gestor de sucursal.
- Operador de almacén.
- Comprador.
- Solo lectura / Auditor.

La autorización se aplicará en el límite de la aplicación.

Ejemplo:

```text
ApproveInventoryAdjustment
        │
        ▼
Authorization
        │
        ├── Administrator → Allowed
        ├── Branch Manager → Allowed
        └── Warehouse Operator → Denied
```

La matriz de permisos completa se definirá antes de implementar la autorización.

---

## 21. Validación

La validación ocurrirá en múltiples niveles.

### Validación HTTP

Valida las peticiones entrantes.

```text
Controller
    ↓
DTO Validation
```

### Validación de aplicación

Valida los requisitos de los casos de uso.

```text
Use Case
    ↓
Business Preconditions
```

### Validación de dominio

Protege los invariantes del dominio.

```text
Entity
    ↓
Domain Rules
```

Ninguna capa de validación por sí sola debe ser responsable de todas las reglas
de negocio.

---

## 22. Manejo de errores

La API expondrá respuestas de error estandarizadas.

Formato conceptual:

```json
{
  "statusCode": 400,
  "code": "INSUFFICIENT_STOCK",
  "message": "Stock insuficiente disponible.",
  "timestamp": "2026-08-09T20:00:00Z",
  "path": "/api/v1/inventory/..."
}
```

Los errores de dominio deben usar códigos de error a nivel de aplicación en
lugar de exponer excepciones de infraestructura.

Ejemplos:

- `INSUFFICIENT_STOCK`
- `PRODUCT_NOT_FOUND`
- `WAREHOUSE_NOT_FOUND`
- `INVALID_TRANSFER`
- `TRANSFER_ALREADY_RECEIVED`
- `ADJUSTMENT_REQUIRES_APPROVAL`
- `PURCHASE_ORDER_ALREADY_CANCELLED`

El catálogo completo de errores se definirá durante el diseño de la API.

---

## 23. Arquitectura de auditoría

`AuditLog` es propiedad del módulo de Auditoría.

Los módulos de negocio no deben manipular directamente `AuditLog`.

Flujo preferido:

```text
Business Operation
       │
       ▼
Domain Event
       │
       ▼
Audit Event Handler
       │
       ▼
AuditLog
```

Ejemplo:

```text
InventoryTransferSent
       │
       ▼
AuditHandler
       │
       ▼
AuditLog
```

Los registros de auditoría son inmutables.

La funcionalidad de auditoría es responsable de registrar las acciones de
negocio relevantes, incluyendo:

- Actor.
- Acción.
- Entidad.
- Identificador de la entidad.
- Estado anterior cuando corresponda.
- Estado nuevo cuando corresponda.
- Marca de tiempo.
- Metadatos relevantes.

La estrategia exacta de implementación para generar registros de auditoría se
definirá durante la implementación del módulo de Auditoría.

---

## 24. Registro de la aplicación

El registro de la aplicación y la auditoría de negocio son preocupaciones
separadas.

### Registros de la aplicación

Se utilizan para:

- Errores.
- Depuración.
- Eventos de infraestructura.
- Diagnósticos de rendimiento.
- Supervisión operativa.

### Registros de auditoría

Se utilizan para:

- Acciones de negocio.
- Acciones de usuario.
- Cambios de entidades.
- Cumplimiento e historial.

Los registros de aplicación y los registros de auditoría no deben tratarse como
el mismo sistema.

---

## 25. Gestión de configuración

La configuración se gestionará a través de variables de entorno.

Ejemplo:

```text
NODE_ENV
PORT

DATABASE_HOST
DATABASE_PORT
DATABASE_NAME
DATABASE_USER
DATABASE_PASSWORD

JWT_SECRET
JWT_EXPIRES_IN
```

Los valores sensibles no deben confirmarse en el repositorio Git.

Un archivo `.env.example` documentará las variables requeridas sin contener
secretos.

---

## 26. Arquitectura de la API

El backend expondrá una API REST.

Ruta base:

```text
/api/v1
```

Recursos de ejemplo:

```text
/api/v1/auth
/api/v1/users
/api/v1/companies
/api/v1/branches
/api/v1/warehouses
/api/v1/products
/api/v1/categories
/api/v1/inventory
/api/v1/inventory-movements
/api/v1/inventory-adjustments
/api/v1/transfers
/api/v1/suppliers
/api/v1/purchase-orders
/api/v1/alerts
/api/v1/audit-logs
/api/v1/reports
```

El diseño de la API seguirá los principios REST cuando corresponda.

Los endpoints detallados se definirán en un documento separado de diseño de la
API.

---

## 27. Versionado de la API

La versión inicial de la API será:

```text
/api/v1
```

Ejemplo:

- `/api/v1/products`
- `/api/v1/inventory`
- `/api/v1/transfers`

Los cambios que rompan la compatibilidad deberán requerir una nueva versión de
la API.

---

## 28. Estrategia de pruebas

StockFlow utilizará múltiples niveles de pruebas.

### 28.1 Pruebas unitarias

Se utilizan principalmente para:

- Entidades de dominio.
- Objetos de valor.
- Servicios de dominio.
- Casos de uso.

Ejemplo:

```text
IncreaseStockUseCase
    ↓
Unit Test
    ↓
Stock increases correctly
```

### 28.2 Pruebas de integración

Se utilizan para:

- Repositorios.
- Persistencia en MySQL.
- Transacciones.
- Interacciones entre módulos.

Ejemplo:

```text
ReceivePurchaseOrder
        ↓
MySQL
        ↓
Inventory updated
        ↓
Movement created
```

### 28.3 Pruebas de extremo a extremo

Se utilizan para flujos completos de la API.

Ejemplo:

```text
POST /api/v1/auth/login
        ↓
POST /api/v1/purchase-orders
        ↓
POST /api/v1/purchase-orders/:id/receive
        ↓
GET /api/v1/inventory
```

La estrategia de pruebas debe priorizar las pruebas unitarias mientras mantiene
la cobertura de integración y E2E para los flujos de negocio críticos.

---

## 29. Calidad del código

El proyecto aplicará:

- Modo estricto de TypeScript.
- ESLint.
- Prettier.
- Pruebas automatizadas.
- Convenciones de nomenclatura consistentes.
- Clases y funciones pequeñas y enfocadas.
- Límites de módulos claros.
- Separación entre la lógica de negocio y la infraestructura.

Los Pull Requests no deben introducir acoplamiento arquitectónico innecesario.

---

## 30. Estrategia de Git

El proyecto utilizará Git para el control de versiones.

Estructura de ramas recomendada:

```text
main
develop
feature/*
fix/*
refactor/*
```

Ejemplo:

- `feature/inventory-adjustments`
- `feature/purchase-orders`
- `fix/transfer-reception`

Los commits deben describir el cambio claramente.

Ejemplos:

- `feat(inventory): implement stock increase`
- `feat(transfers): add transfer reception`
- `fix(inventory): prevent negative stock`
- `test(inventory): add decrease stock tests`

---

## 31. CI/CD

El pipeline de CI inicial debe realizar:

```text
Push / Pull Request
        │
        ├── Instalar dependencias
        ├── Lint
        ├── Verificación de tipos
        ├── Pruebas unitarias
        ├── Pruebas de integración
        └── Build
```

La automatización del despliegue se implementará después de que la arquitectura
del MVP sea estable.

---

## 32. Estrategia de Docker

Docker se utilizará principalmente para la infraestructura local durante el
desarrollo.

Entorno inicial:

```text
Docker Compose
    │
    └── MySQL
```

La aplicación NestJS puede ejecutarse inicialmente directamente con Node.js
durante el desarrollo.

Los entornos futuros pueden contener la aplicación completa.

---

## 33. Principios de seguridad

StockFlow debe seguir principios básicos de seguridad de aplicaciones.

### Autenticación

- Las contraseñas deben cifrarse de forma segura.
- Los secretos JWT deben almacenarse fuera del control de código fuente.
- Los tokens deben tener expiración.

### Autorización

- Cada operación protegida debe verificar permisos.
- La autorización no debe basarse únicamente en las restricciones del frontend.

### Protección de datos

- Los datos sensibles no deben aparecer en los registros.
- Las credenciales de base de datos no deben confirmarse.
- Los datos de auditoría deben permanecer inmutables.

### Seguridad de la API

- Validación de entrada.
- Limitación de tasa cuando sea requerido.
- Códigos de estado HTTP adecuados.
- Cabeceras seguras.
- Respuestas de error controladas.

---

## 34. Principios de rendimiento

El sistema inicial debe priorizar la corrección y el mantenimiento sobre la
optimización prematura.

Las consideraciones de rendimiento incluyen:

- Índices de base de datos adecuados.
- Paginación para colecciones grandes.
- Consultas de inventario eficientes.
- Evitar consultas N+1.
- Minimizar el alcance de las transacciones.
- Estrategias de carga apropiadas.
- Caché solo cuando exista un requisito de rendimiento real.

Redis no se introducirá hasta que las mediciones demuestren una necesidad.

---

## 35. Estrategia de escalabilidad

StockFlow se escalará inicialmente de forma vertical y mediante múltiples
instancias de aplicación si fuera necesario.

La arquitectura futura puede evolucionar hacia:

```text
                    Load Balancer
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           App #1     App #2     App #3
              │          │          │
              └──────────┼──────────┘
                         ▼
                       MySQL
```

Si los requisitos futuros lo justifican, los módulos individuales pueden
convertirse eventualmente en servicios independientes.

Esto no forma parte del MVP.

---

## 36. Evolución futura

Las capacidades futuras potenciales incluyen:

- Caché con Redis.
- Trabajos en segundo plano.
- Patrón Outbox.
- Broker de mensajes.
- Notificaciones por correo electrónico.
- Escaneo de códigos de barras.
- Ventas a clientes.
- Integración con POS.
- Integración con ERP.
- Integración con e-commerce.
- Informes avanzados.
- Previsión de demanda.
- Aplicación móvil.
- Extracción de microservicios.

Estas capacidades solo deben introducirse cuando los requisitos reales
justifiquen su complejidad.

---

## 37. Registros de decisiones de arquitectura

Las decisiones arquitectónicas importantes deben documentarse mediante ADRs.

Estructura de ejemplo:

```text
docs/
└── adr/
    ├── 001-modular-monolith.md
    ├── 002-mysql-database.md
    ├── 003-typeorm.md
    ├── 004-domain-events.md
    └── 005-jwt-authentication.md
```

Un ADR debe contener:

```text
# Decisión

## Contexto

## Opciones consideradas

## Decisión

## Consecuencias
```

Los ADRs deben crearse cuando una decisión tenga un impacto arquitectónico
significativo a largo plazo.

---

## 38. Restricciones de la arquitectura

Las siguientes restricciones se establecen para el MVP inicial:

- El backend utilizará NestJS y TypeScript.
- El frontend utilizará React y TypeScript.
- El backend utilizará una arquitectura de Modular Monolith.
- MySQL será la base de datos principal.
- TypeORM se utilizará para la persistencia.
- La lógica de dominio no debe depender de NestJS ni de TypeORM.
- Los módulos deben mantener una propiedad clara de las entidades.
- El acceso entre módulos a las implementaciones internas está prohibido.
- Las operaciones críticas de inventario deben ser transaccionales.
- El inventario nunca debe volverse negativo.
- Los eventos de dominio serán internos inicialmente.
- Redis no será necesario para el MVP.
- Los brokers de mensajes externos no serán necesarios para el MVP.
- `AuditLog` será inmutable.
- La autenticación utilizará JWT.
- La autorización utilizará RBAC.
- REST será el estilo inicial de la API.
- El versionado de la API comenzará con `/api/v1`.
- Se requieren pruebas automatizadas para las operaciones de negocio críticas.
- La lógica de negocio no debe implementarse dentro de los controladores.
- Las preocupaciones de infraestructura deben permanecer fuera de la capa de
  dominio.
- Los módulos deben comunicarse a través de contratos públicos definidos o de
  eventos de dominio.
- La funcionalidad compartida no debe contener lógica específica de negocio.
- El frontend consumirá el backend a través de la API REST.

---

## 39. Resumen de la arquitectura

StockFlow utilizará una arquitectura de Modular Monolith basada en NestJS.

La aplicación se desplegará como una única unidad mientras mantiene límites de
negocio claros a través de módulos independientes.

Cada módulo puede contener:

- Dominio.
- Aplicación.
- Infraestructura.

Los módulos de negocio principales son:

- Identity
- Organizations
- Catalog
- Inventory
- Transfers
- Purchasing
- Alerts
- Audit
- Reporting

La arquitectura general es:

```text
                         STOCKFLOW
                             │
                    Modular Monolith
                             │
                    NestJS Application
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
    Identity            Organizations           Catalog
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             │
                         Inventory
                             │
                 ┌───────────┴───────────┐
                 │                       │
             Transfers              Purchasing
                 │                       │
                 └───────────┬───────────┘
                             │
                     Domain Events
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
           Alerts          Audit         Reporting
                             │
                             ▼
                           MySQL
```

La arquitectura prioriza:

- Corrección de negocio.
- Mantenibilidad.
- Propiedad clara de los módulos.
- Capacidad de prueba.
- Consistencia transaccional.
- Acoplamiento controlado.
- Escalabilidad futura.
- Complejidad controlada.

El sistema evolucionará según los requisitos reales de negocio y técnicos en
lugar de introducir complejidad de infraestructura prematuramente.
