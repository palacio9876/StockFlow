# StockFlow — Architecture

## 1. Architecture Overview

StockFlow será construido como un **Modular Monolith** utilizando NestJS como framework backend y MySQL como sistema principal de persistencia.

La arquitectura busca mantener una separación clara entre:

* Domain.
* Application.
* Infrastructure.

El sistema será desplegado inicialmente como una única aplicación, pero sus módulos estarán desacoplados para permitir una futura evolución hacia servicios independientes si los requisitos del negocio lo justifican.

### Architecture Goals

* Mantener el dominio independiente de frameworks e infraestructura.
* Separar responsabilidades entre módulos.
* Facilitar pruebas unitarias e integración.
* Evitar acoplamiento innecesario entre módulos.
* Mantener las operaciones de inventario consistentes mediante transacciones.
* Permitir crecimiento funcional sin convertir el sistema en un monolito difícil de mantener.
* Facilitar futuras integraciones externas.
* Mantener una arquitectura comprensible para un equipo de desarrollo empresarial.

---

# 2. Architectural Style

StockFlow utilizará una combinación de:

* **Modular Monolith**
* **Domain-Driven Design principles**
* **Clean Architecture principles**
* **Layered Architecture**
* **Domain Events**

La arquitectura no implementará una versión estricta de todos estos patrones. Se utilizarán únicamente los principios que aporten valor al proyecto.

### High-Level Architecture

```text
                    Client
                      │
                      ▼
                HTTP / REST API
                      │
                      ▼
                NestJS Application
                      │
          ┌───────────┴───────────┐
          │                       │
      Modules                 Cross-cutting
          │                       │
          ▼                       ▼
   ┌───────────────┐       ┌───────────────┐
   │   Identity    │       │ Authentication│
   │ Organizations │       │ Authorization │
   │    Catalog    │       │ Validation    │
   │   Inventory   │       │ Error Handling│
   │  Transfers    │       │ Logging       │
   │  Purchasing   │       │ Configuration │
   │    Alerts     │       └───────────────┘
   │    Audit      │
   │   Reporting   │
   └───────────────┘
          │
          ▼
      MySQL Database
```

---

# 3. Technology Stack

## 3.1 Backend

| Technology        | Purpose              |
| ----------------- | -------------------- |
| Node.js           | Runtime              |
| NestJS            | Backend framework    |
| TypeScript        | Programming language |
| REST API          | External API         |
| MySQL             | Relational database  |
| TypeORM           | ORM / persistence    |
| JWT               | Authentication       |
| class-validator   | Request validation   |
| class-transformer | DTO transformation   |

---

## 3.2 Development Tools

Recommended development tools:

| Tool           | Purpose                  |
| -------------- | ------------------------ |
| Git            | Version control          |
| GitHub         | Source code repository   |
| Docker         | Local infrastructure     |
| Docker Compose | Local MySQL environment  |
| ESLint         | Static analysis          |
| Prettier       | Code formatting          |
| Jest           | Unit testing             |
| Supertest      | HTTP integration testing |

---

## 3.3 Infrastructure Not Used Initially

The following technologies are intentionally excluded from the initial architecture:

* Redis.
* Kafka.
* RabbitMQ.
* Elasticsearch.
* Kubernetes.
* Microservices.

They may be introduced in future versions if actual technical requirements justify them.

---

# 4. System Modules

StockFlow will be organized into business-oriented modules.

```text
src/
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

Each module owns a specific part of the business domain.

---

# 5. Module Responsibilities

## 5.1 Identity

Responsible for authentication and user access.

### Entities

* User
* Role
* UserRole

### Responsibilities

* User management.
* Authentication.
* Password management.
* Role assignment.
* Authorization.
* JWT generation and validation.

---

## 5.2 Organizations

Responsible for the organizational structure of StockFlow.

### Entities

* Company
* Branch
* Warehouse

### Responsibilities

* Company management.
* Branch management.
* Warehouse management.
* Default warehouse configuration.
* Organizational relationships.

---

## 5.3 Catalog

Responsible for product information.

### Entities

* Product
* Category

### Responsibilities

* Product management.
* SKU management.
* Category management.
* Product activation/deactivation.
* Product catalog queries.

---

## 5.4 Inventory

Responsible for the current stock and its movements.

### Entities

* Inventory
* InventoryMovement
* InventoryAdjustment

### Responsibilities

* Stock management.
* Stock increases.
* Stock decreases.
* Inventory movements.
* Inventory adjustments.
* Inventory validation.
* Stock availability.
* Inventory history.

Inventory is one of the most critical modules in the system.

---

## 5.5 Transfers

Responsible for inventory movement between warehouses.

### Entities

* InventoryTransfer

### Responsibilities

* Create transfers.
* Send transfers.
* Receive transfers.
* Partial reception.
* Transfer validation.
* Transfer history.

The Transfers module must use the Inventory module to perform actual stock changes.

---

## 5.6 Purchasing

Responsible for suppliers and purchase orders.

### Entities

* Supplier
* PurchaseOrder
* PurchaseOrderItem

### Responsibilities

* Supplier management.
* Purchase order creation.
* Purchase order management.
* Partial reception.
* Complete reception.
* Purchase order cancellation.

Purchase order reception must interact with the Inventory module to increase stock.

---

## 5.7 Alerts

Responsible for inventory-related alerts.

### Entities

* Alert

### Responsibilities

* Low stock detection.
* Alert creation.
* Alert resolution.
* Active alert queries.

The Alerts module should react to relevant inventory events rather than directly modifying inventory.

---

## 5.8 Audit

Responsible for immutable business auditing.

### Entities

* AuditLog

### Responsibilities

* Record relevant business actions.
* Store actor information.
* Store affected entity.
* Store previous and new state when appropriate.
* Maintain immutable history.
* Provide audit queries.

The Audit module should primarily consume Domain Events generated by other modules.

---

## 5.9 Reporting

Responsible for read-oriented business reports.

### Responsibilities

* Consolidated inventory.
* Stock by warehouse.
* Stock by branch.
* Inventory movement history.
* Inventory valuation.
* Future exports.

Reporting should avoid modifying domain state.

---

# 6. Module Ownership

Each entity must have one owning module.

| Entity              | Owner         |
| ------------------- | ------------- |
| Company             | Organizations |
| User                | Identity      |
| Role                | Identity      |
| UserRole            | Identity      |
| Branch              | Organizations |
| Warehouse           | Organizations |
| Product             | Catalog       |
| Category            | Catalog       |
| Inventory           | Inventory     |
| InventoryMovement   | Inventory     |
| InventoryAdjustment | Inventory     |
| InventoryTransfer   | Transfers     |
| Supplier            | Purchasing    |
| PurchaseOrder       | Purchasing    |
| PurchaseOrderItem   | Purchasing    |
| Alert               | Alerts        |
| AuditLog            | Audit         |

An entity must not be directly modified by another module.

For example:

```text
Purchasing
    ❌ directly modifies Inventory entity

Purchasing
    ↓
Inventory Application Use Case
    ↓
Inventory
```

---

# 7. Internal Module Structure

Each business module will follow a consistent internal structure.

Example:

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
└── infrastructure/
    ├── persistence/
    │   ├── entities/
    │   ├── repositories/
    │   └── migrations/
    │
    └── http/
        ├── controllers/
        └── dto/
```

Not every module must contain every directory.

Directories should only exist when they provide value.

---

# 8. Architectural Layers

## 8.1 Domain Layer

The Domain layer contains business rules and domain behavior.

Responsibilities:

* Entities.
* Value Objects.
* Domain Services.
* Domain Events.
* Repository interfaces.

The Domain layer must not depend on:

* NestJS.
* TypeORM.
* HTTP.
* MySQL.
* Express.
* External APIs.

Example:

```text
Inventory
InventoryMovement
InventoryAdjustment
StockIncreased
StockDecreased
InventoryRepository
```

---

## 8.2 Application Layer

The Application layer coordinates business use cases.

Responsibilities:

* Use Cases.
* Application DTOs.
* Transaction coordination.
* Domain object orchestration.
* Calling repositories.
* Publishing domain events.

Examples:

```text
IncreaseStockUseCase
DecreaseStockUseCase
RequestInventoryAdjustmentUseCase
ApproveInventoryAdjustmentUseCase
```

The Application layer may depend on the Domain layer.

---

## 8.3 Infrastructure Layer

The Infrastructure layer contains technical implementations.

Responsibilities:

* TypeORM repositories.
* Database entities.
* MySQL configuration.
* HTTP controllers.
* External service integrations.
* Framework-specific implementations.

Examples:

```text
TypeOrmInventoryRepository
InventoryController
DatabaseModule
JwtAuthGuard
```

Infrastructure may depend on Application and Domain.

---

# 9. Dependency Direction

Dependencies must point toward the domain.

```text
Infrastructure
      │
      ▼
Application
      │
      ▼
Domain
```

The Domain must not depend on Infrastructure.

### Allowed

```text
Controller
    ↓
Use Case
    ↓
Domain
```

### Not Allowed

```text
Domain
    ↓
TypeORM
```

### Not Allowed

```text
Domain
    ↓
NestJS Controller
```

---

# 10. Module Communication

Modules must communicate through clearly defined contracts.

Preferred communication methods:

1. Application Use Cases.
2. Domain Events.
3. Explicit module interfaces.

Direct access to another module's internal implementation is prohibited.

---

## 10.1 Synchronous Communication

Used when one operation requires an immediate result.

Example:

```text
PurchaseOrder
      │
      ▼
ReceivePurchaseOrderUseCase
      │
      ▼
Inventory Module
      │
      ▼
IncreaseStockUseCase
```

---

## 10.2 Event-Based Communication

Used when other modules need to react to something that happened.

Example:

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

---

# 11. Module Dependency Rules

The following dependency direction is preferred:

```text
Identity
   │
   ▼
Organizations
   │
   ▼
Catalog
   │
   ▼
Inventory
   │
   ├──→ Transfers
   │
   └──→ Purchasing
```

However, business dependencies should be implemented through application contracts rather than direct access to another module's internals.

### Important Rule

A module must never import another module's:

```text
❌ Entity implementation
❌ TypeORM repository
❌ Database model
❌ Internal service
❌ Internal controller
```

Instead, it should use:

```text
✅ Public application service
✅ Public use case
✅ Public interface
✅ Domain event
```

---

# 12. Module Public API

Each module should expose only what other modules need.

Example:

```text
inventory/
├── public/
│   ├── increase-stock.use-case.ts
│   ├── decrease-stock.use-case.ts
│   └── inventory.types.ts
│
└── internal/
    ├── entities/
    ├── repositories/
    └── services/
```

The exact implementation of this public API will be defined during project setup.

The objective is to prevent other modules from depending on internal implementation details.

---

# 13. Database Architecture

StockFlow will use MySQL as its primary relational database.

All modules will initially share the same database.

```text
StockFlow
    │
    ▼
MySQL
    │
    ├── companies
    ├── users
    ├── branches
    ├── warehouses
    ├── products
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

Although the database is shared, ownership of tables remains aligned with module boundaries.

---

# 14. Database Transactions

Transactions are required for operations that modify multiple related records and must remain atomic.

Example:

```text
Receive Purchase Order

BEGIN
    ↓
Update PurchaseOrder
    ↓
Update Inventory
    ↓
Create InventoryMovement
    ↓
Create Domain Events
    ↓
COMMIT
```

If any required operation fails:

```text
ROLLBACK
```

The system must not leave partially completed inventory operations.

Critical transactional operations include:

* Stock increase.
* Stock decrease.
* Inventory adjustment.
* Transfer send.
* Transfer receive.
* Purchase order reception.

---

# 15. Concurrency and Inventory Consistency

Inventory operations must account for concurrent requests.

Example:

```text
Stock = 10

Request A → Remove 7
Request B → Remove 6
```

The system must prevent both operations from succeeding if they would result in negative stock.

Inventory updates must use appropriate transactional and database-level mechanisms.

The exact locking strategy will be defined during database design and implementation.

---

# 16. Domain Events Architecture

Domain Events are generated by the Domain/Application layer when relevant business actions occur.

Example:

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

During the MVP, events are internal to the application.

No external message broker will be used.

---

# 17. Event Reliability

Domain events that are required only for internal synchronous processing may be dispatched within the application process.

For events that eventually require reliable asynchronous processing, the architecture may evolve toward the Outbox Pattern.

Future architecture:

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

The Outbox Pattern is explicitly out of scope for the initial MVP.

---

# 18. Authentication

Authentication will use JWT.

General flow:

```text
Client
   │
   ▼
POST /auth/login
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

Authenticated requests:

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

# 19. Authorization

StockFlow will use Role-Based Access Control (RBAC).

Roles defined in the DMD:

* Administrator.
* Branch Manager.
* Warehouse Operator.
* Buyer.
* Read-only / Auditor.

Authorization will be enforced at the application boundary.

Example:

```text
ApproveInventoryAdjustment
        │
        ▼
Authorization
        │
        ├── Administrator → Allowed
        ├── Branch Manager → Allowed
        └── Operator → Denied
```

The exact permission matrix will be defined before implementing authorization.

---

# 20. Validation

Validation will occur at multiple levels.

### HTTP Validation

Validates incoming requests.

```text
Controller
    ↓
DTO Validation
```

### Application Validation

Validates use-case requirements.

```text
Use Case
    ↓
Business Preconditions
```

### Domain Validation

Protects domain invariants.

```text
Entity
    ↓
Domain Rules
```

No single validation layer should be responsible for all business rules.

---

# 21. Error Handling

The API will expose standardized error responses.

Conceptual format:

```json
{
  "statusCode": 400,
  "code": "INSUFFICIENT_STOCK",
  "message": "Insufficient stock available.",
  "timestamp": "2026-08-09T20:00:00Z",
  "path": "/api/inventory/..."
}
```

Domain errors should use application-level error codes rather than exposing infrastructure exceptions.

Examples:

```text
INSUFFICIENT_STOCK
PRODUCT_NOT_FOUND
WAREHOUSE_NOT_FOUND
INVALID_TRANSFER
TRANSFER_ALREADY_RECEIVED
ADJUSTMENT_REQUIRES_APPROVAL
PURCHASE_ORDER_ALREADY_CANCELLED
```

The complete error catalog will be defined during API design.

---

# 22. Audit Architecture

AuditLog is owned by the Audit module.

Business modules should not directly manipulate `AuditLog`.

Preferred flow:

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

Example:

```text
InventoryTransferSent
       │
       ▼
AuditHandler
       │
       ▼
AuditLog
```

This keeps auditing independent from the business logic that generated the event.

Audit records are immutable.

---

# 23. Logging

Application logging will be separated from business auditing.

### Application Logs

Used for:

* Errors.
* Debugging.
* Infrastructure events.
* Performance diagnostics.
* Operational monitoring.

### Audit Logs

Used for:

* Business actions.
* User actions.
* Entity changes.
* Compliance/history.

They must not be treated as the same system.

---

# 24. Configuration Management

Configuration will be managed through environment variables.

Example:

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

Sensitive values must not be committed to Git.

A `.env.example` file will document required variables without containing secrets.

---

# 25. API Architecture

The backend will expose a REST API.

Base path:

```text
/api
```

Example resources:

```text
/api/auth
/api/users
/api/companies
/api/branches
/api/warehouses
/api/products
/api/categories
/api/inventory
/api/inventory-movements
/api/inventory-adjustments
/api/transfers
/api/suppliers
/api/purchase-orders
/api/alerts
/api/audit-logs
/api/reports
```

API design will follow REST principles where appropriate.

Detailed endpoints will be defined in a separate API Design document.

---

# 26. API Versioning

The API will be designed to support future versioning.

Initial version:

```text
/api/v1
```

Example:

```text
/api/v1/products
/api/v1/inventory
/api/v1/transfers
```

Breaking changes should require a new API version.

---

# 27. Testing Strategy

StockFlow will use multiple testing levels.

## 27.1 Unit Tests

Used primarily for:

* Domain entities.
* Value Objects.
* Domain Services.
* Use Cases.

Example:

```text
IncreaseStockUseCase
    ↓
Unit Test
    ↓
Stock increases correctly
```

---

## 27.2 Integration Tests

Used for:

* Repositories.
* MySQL persistence.
* Transactions.
* Module interactions.

Example:

```text
ReceivePurchaseOrder
        ↓
MySQL
        ↓
Inventory updated
        ↓
Movement created
```

---

## 27.3 End-to-End Tests

Used for complete API flows.

Example:

```text
POST /auth/login
        ↓
POST /purchase-orders
        ↓
POST /purchase-orders/:id/receive
        ↓
GET /inventory
```

The testing pyramid should favor unit tests while maintaining integration and E2E coverage for critical business flows.

---

# 28. Code Quality

The project will enforce:

* TypeScript strict mode.
* ESLint.
* Prettier.
* Automated tests.
* Consistent naming conventions.
* Small and focused classes/functions.
* Clear module boundaries.

Pull Requests should not introduce unnecessary architectural coupling.

---

# 29. Git Strategy

The project will use Git for version control.

Recommended branch structure:

```text
main
develop
feature/*
fix/*
refactor/*
```

Example:

```text
feature/inventory-adjustments
feature/purchase-orders
fix/transfer-reception
```

Commits should describe the change clearly.

Example:

```text
feat(inventory): implement stock increase
feat(transfers): add transfer reception
fix(inventory): prevent negative stock
test(inventory): add decrease stock tests
```

---

# 30. CI/CD

Initial CI pipeline should perform:

```text
Push / Pull Request
        │
        ├── Install dependencies
        ├── Lint
        ├── Type check
        ├── Unit tests
        ├── Integration tests
        └── Build
```

Deployment automation will be implemented after the MVP architecture is stable.

---

# 31. Docker Strategy

Docker will be used primarily for local infrastructure during development.

Initial environment:

```text
Docker Compose
    │
    └── MySQL
```

The NestJS application may initially run directly through Node.js during development.

Future environments may containerize the complete application.

---

# 32. Security Principles

StockFlow must follow basic application security principles.

### Authentication

* Passwords must be securely hashed.
* JWT secrets must be stored outside source control.
* Tokens must have expiration.

### Authorization

* Every protected operation must verify permissions.
* Authorization must not rely solely on frontend restrictions.

### Data Protection

* Sensitive data must not appear in logs.
* Database credentials must not be committed.
* Audit data must remain immutable.

### API Security

* Input validation.
* Rate limiting when required.
* Proper HTTP status codes.
* Secure headers.
* Controlled error responses.

---

# 33. Performance Principles

The initial system should prioritize correctness and maintainability over premature optimization.

Performance considerations include:

* Proper database indexes.
* Pagination for large collections.
* Efficient inventory queries.
* Avoiding N+1 queries.
* Transaction scope minimization.
* Appropriate eager/lazy loading strategy.
* Caching only when a real performance requirement exists.

Redis will not be introduced until measurements demonstrate a need.

---

# 34. Scalability Strategy

StockFlow will initially scale vertically and through multiple application instances if necessary.

Future architecture may evolve toward:

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

If future requirements justify it, individual modules may eventually become independent services.

This is not part of the MVP.

---

# 35. Future Evolution

Potential future capabilities include:

* Redis caching.
* Background jobs.
* Outbox Pattern.
* Message broker.
* Email notifications.
* Barcode scanning.
* Customer sales.
* POS integration.
* ERP integration.
* E-commerce integration.
* Advanced reporting.
* Demand forecasting.
* Mobile application.
* Microservice extraction.

The architecture should make these evolutions possible without implementing them prematurely.

---

# 36. Architecture Decision Records

Important architectural decisions should be documented using ADRs.

Examples:

```text
docs/
└── adr/
    ├── 001-modular-monolith.md
    ├── 002-mysql-database.md
    ├── 003-typeorm.md
    ├── 004-domain-events.md
    └── 005-jwt-authentication.md
```

An ADR should contain:

```text
# Decision

## Context

## Options Considered

## Decision

## Consequences
```

ADRs should be created when a decision has a meaningful long-term architectural impact.

---

# 37. Architecture Constraints

The following constraints are established for the initial MVP:

1. The backend will use NestJS and TypeScript.
2. The application will be a Modular Monolith.
3. MySQL will be the primary database.
4. TypeORM will be used for persistence.
5. Domain logic must not depend on NestJS or TypeORM.
6. Modules must maintain clear ownership of entities.
7. Cross-module access to internal implementations is prohibited.
8. Critical inventory operations must be transactional.
9. Inventory must never become negative.
10. Domain Events will be internal initially.
11. Redis will not be required for the MVP.
12. External message brokers will not be required for the MVP.
13. AuditLog will be immutable.
14. Authentication will use JWT.
15. Authorization will use RBAC.
16. REST will be the initial API style.
17. API versioning will start with `/api/v1`.
18. Automated testing is required for critical business operations.
19. Business logic must not be implemented inside controllers.
20. Infrastructure concerns must remain outside the Domain layer.

---

# 38. Architecture Summary

StockFlow will use a Modular Monolith architecture that combines clear business module boundaries with Domain-Driven Design and Clean Architecture principles.

```text
                         STOCKFLOW
                             │
                    Modular Monolith
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

The architecture prioritizes:

* Business correctness.
* Maintainability.
* Clear module ownership.
* Testability.
* Transactional consistency.
* Future scalability.
* Controlled complexity.

The system will evolve based on real requirements rather than introducing infrastructure complexity prematurely.

## Modular Monolith

StockFlow utiliza una arquitectura Modular Monolith basada en NestJS.

La aplicación se despliega como una única unidad, pero el código está organizado
en módulos independientes orientados al dominio.

Los módulos encapsulan sus responsabilidades y exponen únicamente las
interfaces necesarias para comunicarse con otros módulos.

La arquitectura busca mantener bajo acoplamiento y alta cohesión entre
los módulos.

### Module Structure

src/
├── modules/
├── common/
├── config/
└── database/