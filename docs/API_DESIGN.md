# StockFlow — API Design

## 1. API Overview

StockFlow expondrá una API RESTful para permitir la interacción entre el frontend y el backend.

La API será implementada utilizando:

* Node.js
* NestJS
* TypeScript
* TypeORM
* MySQL

La API seguirá una arquitectura de monolito modular.

```text
Client
   │
   ▼
REST API
   │
   ▼
NestJS
   │
   ├── Identity
   ├── Organizations
   ├── Catalog
   ├── Inventory
   ├── Transfers
   ├── Purchasing
   ├── Alerts
   └── Audit
         │
         ▼
       MySQL
```

---

# 2. API Versioning

Todas las rutas estarán versionadas.

```text
/api/v1
```

Ejemplo:

```text
/api/v1/products
/api/v1/inventory
/api/v1/transfers
```

Esto permitirá evolucionar la API en el futuro sin romper clientes existentes.

---

# 3. Base URL

Development:

```text
http://localhost:3000/api/v1
```

Production:

```text
https://api.stockflow.example/api/v1
```

El dominio de producción es ilustrativo.

---

# 4. HTTP Methods

La API utilizará los métodos HTTP estándar.

| Method | Purpose                               |
| ------ | ------------------------------------- |
| GET    | Obtener recursos                      |
| POST   | Crear recursos o ejecutar operaciones |
| PATCH  | Actualizar parcialmente un recurso    |
| DELETE | Realizar eliminación lógica           |

---

# 5. Resource Naming

Los endpoints utilizarán nombres de recursos en plural.

Correcto:

```text
/products
/users
/branches
/warehouses
/inventory
/transfers
/purchase-orders
```

No se utilizarán verbos innecesarios:

```text
/create-product
/update-product
/delete-product
```

Las operaciones específicas del dominio podrán utilizar acciones cuando sea necesario.

Ejemplo:

```text
/transfers/:id/send
/transfers/:id/receive
/adjustments/:id/approve
```

---

# 6. Authentication

La API utilizará autenticación basada en tokens.

El usuario iniciará sesión mediante:

```text
POST /auth/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Response:

```json
{
  "access_token": "token",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

Las rutas protegidas requerirán:

```http
Authorization: Bearer <token>
```

---

# 7. Authentication Endpoints

## POST /auth/login

Authenticates a user.

### Request

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Response

```json
{
  "access_token": "token",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "first_name": "Cristian",
    "last_name": "Example",
    "email": "user@example.com"
  }
}
```

---

## GET /auth/me

Returns the authenticated user.

### Response

```json
{
  "id": 1,
  "first_name": "Cristian",
  "last_name": "Example",
  "email": "user@example.com",
  "roles": [
    "ADMINISTRATOR"
  ]
}
```

---

# 8. Standard Response Format

Successful responses should follow a consistent structure.

Example:

```json
{
  "data": {
    "id": 1,
    "name": "Laptop"
  }
}
```

Collection:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Laptop"
    },
    {
      "id": 2,
      "name": "Keyboard"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 2,
    "last_page": 1
  }
}
```

---

# 9. Standard Error Format

All API errors should follow a consistent format.

Example:

```json
{
  "statusCode": 422,
  "error": "VALIDATION_ERROR",
  "message": "The request contains invalid data.",
  "details": {
    "sku": [
      "The SKU is already registered."
    ]
  },
  "timestamp": "2026-08-09T20:00:00.000Z",
  "path": "/api/v1/products"
}
```

---

# 10. HTTP Status Codes

The API will use standard HTTP status codes.

| Status | Usage                                      |
| -----: | ------------------------------------------ |
|    200 | Successful operation                       |
|    201 | Resource created                           |
|    204 | Successful operation without response body |
|    400 | Bad request                                |
|    401 | Authentication required/invalid            |
|    403 | Insufficient permissions                   |
|    404 | Resource not found                         |
|    409 | Business conflict                          |
|    422 | Validation failure                         |
|    500 | Unexpected server error                    |

---

# 11. Pagination

Collection endpoints will support pagination.

Example:

```text
GET /products?page=1&per_page=20
```

Response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "last_page": 8
  }
}
```

Default:

```text
page = 1
per_page = 20
```

Maximum:

```text
per_page = 100
```

---

# 12. Filtering

Collection endpoints may support filters.

Example:

```text
GET /products?status=ACTIVE
```

Inventory:

```text
GET /inventory?warehouse_id=10
```

Transfers:

```text
GET /transfers?status=SENT
```

Purchase orders:

```text
GET /purchase-orders?status=ORDERED
```

---

# 13. Sorting

Resources may support sorting.

Example:

```text
GET /products?sort_by=name&sort_direction=asc
```

Allowed sort fields should be explicitly defined by each endpoint.

The API must never directly interpolate arbitrary query parameters into SQL queries.

---

# 14. Product API

## POST /products

Creates a product.

### Required fields

```json
{
  "category_id": 1,
  "sku": "SKU-001",
  "name": "Wireless Keyboard",
  "description": "Wireless keyboard",
  "unit_of_measure": "UNIT"
}
```

### Response

```text
201 Created
```

---

## GET /products

Returns paginated products.

Supported filters:

```text
category_id
status
sku
name
```

Example:

```text
GET /products?status=ACTIVE&category_id=5
```

---

## GET /products/:id

Returns a specific product.

---

## PATCH /products/:id

Updates a product.

Example:

```json
{
  "name": "Wireless Mechanical Keyboard"
}
```

---

## DELETE /products/:id

Performs a soft delete.

The product is not physically removed from the database.

---

# 15. Category API

## POST /categories

Creates a category.

## GET /categories

Lists categories.

## GET /categories/:id

Returns a category.

## PATCH /categories/:id

Updates a category.

## DELETE /categories/:id

Soft deletes a category.

---

# 16. Branch API

## POST /branches

Creates a branch.

## GET /branches

Lists branches.

## GET /branches/:id

Returns a branch.

## PATCH /branches/:id

Updates a branch.

## DELETE /branches/:id

Soft deletes a branch.

---

# 17. Warehouse API

## POST /warehouses

Creates a warehouse.

Example:

```json
{
  "branch_id": 1,
  "name": "Main Warehouse",
  "code": "WH-001",
  "is_default": true
}
```

---

## GET /warehouses

Lists warehouses.

Filters:

```text
branch_id
status
is_default
```

---

## GET /warehouses/:id

Returns a warehouse.

---

## PATCH /warehouses/:id

Updates a warehouse.

---

## DELETE /warehouses/:id

Soft deletes a warehouse.

---

# 18. Inventory API

Inventory represents the current stock of a product in a warehouse.

## GET /inventory

Returns inventory records.

Example:

```text
GET /inventory?warehouse_id=1
```

Supported filters:

```text
warehouse_id
product_id
low_stock
```

---

## GET /inventory/:id

Returns a specific inventory record.

Example:

```json
{
  "data": {
    "id": 1,
    "product_id": 10,
    "warehouse_id": 2,
    "quantity": 85,
    "minimum_quantity": 20,
    "maximum_quantity": 100
  }
}
```

---

# 19. Inventory Movement API

Inventory movements are historical records.

## GET /inventory/movements

Returns inventory movement history.

Filters:

```text
product_id
warehouse_id
inventory_id
movement_type
user_id
date_from
date_to
```

Example:

```text
GET /inventory/movements?product_id=10&warehouse_id=2
```

---

## GET /inventory/movements/:id

Returns a specific movement.

Inventory movements cannot be edited or deleted through the API.

---

# 20. Inventory Adjustment API

Adjustments are controlled stock corrections.

## POST /inventory/adjustments

Creates an adjustment request.

Example:

```json
{
  "inventory_id": 10,
  "quantity": 3,
  "direction": "OUT",
  "observation": "Physical count found three missing units."
}
```

---

## GET /inventory/adjustments

Lists adjustment requests.

Filters:

```text
status
warehouse_id
product_id
requested_by
```

---

## GET /inventory/adjustments/:id

Returns an adjustment.

---

## POST /inventory/adjustments/:id/approve

Approves an adjustment.

Only authorized users may perform this operation.

---

## POST /inventory/adjustments/:id/reject

Rejects an adjustment.

Request:

```json
{
  "reason": "Physical count must be performed again."
}
```

---

## POST /inventory/adjustments/:id/apply

Applies an approved adjustment to inventory.

The application will:

```text
Adjustment
     ↓
Inventory update
     ↓
InventoryMovement
     ↓
AuditLog
```

The operation must be transactional.

---

# 21. Inventory Transfer API

Transfers move stock between warehouses.

## POST /transfers

Creates a transfer.

Example:

```json
{
  "source_warehouse_id": 1,
  "destination_warehouse_id": 2,
  "product_id": 10,
  "quantity": 20,
  "observation": "Replenishment of branch inventory."
}
```

Observation is mandatory.

---

## GET /transfers

Lists transfers.

Filters:

```text
source_warehouse_id
destination_warehouse_id
product_id
status
created_by
date_from
date_to
```

---

## GET /transfers/:id

Returns transfer details.

---

## POST /transfers/:id/send

Marks the transfer as sent.

Business operation:

```text
Validate stock
      ↓
Decrease source inventory
      ↓
Create TRANSFER_OUT movement
      ↓
Update transfer
```

The operation is transactional.

---

## POST /transfers/:id/receive

Receives the transfer.

Example:

```json
{
  "received_quantity": 20,
  "observation": "All units received correctly."
}
```

The operation:

```text
Validate transfer
      ↓
Increase destination inventory
      ↓
Create TRANSFER_IN movement
      ↓
Update transfer status
```

---

# 22. Supplier API

## POST /suppliers

Creates a supplier.

## GET /suppliers

Lists suppliers.

Filters:

```text
status
name
```

## GET /suppliers/:id

Returns a supplier.

## PATCH /suppliers/:id

Updates a supplier.

## DELETE /suppliers/:id

Soft deletes a supplier.

---

# 23. Purchase Order API

## POST /purchase-orders

Creates a purchase order.

Example:

```json
{
  "supplier_id": 5,
  "branch_id": 1,
  "warehouse_id": 2,
  "items": [
    {
      "product_id": 10,
      "quantity_ordered": 50,
      "unit_price": 25000
    }
  ],
  "notes": "Monthly replenishment."
}
```

---

## GET /purchase-orders

Lists purchase orders.

Filters:

```text
supplier_id
branch_id
warehouse_id
status
date_from
date_to
```

---

## GET /purchase-orders/:id

Returns purchase order details including items.

---

## PATCH /purchase-orders/:id

Updates a purchase order while it is editable.

---

## POST /purchase-orders/:id/order

Marks a purchase order as ordered.

---

## POST /purchase-orders/:id/receive

Registers a purchase order reception.

Example:

```json
{
  "items": [
    {
      "purchase_order_item_id": 10,
      "quantity_received": 30
    }
  ]
}
```

The operation updates:

```text
PurchaseOrderItem
       ↓
Inventory
       ↓
InventoryMovement
       ↓
PurchaseOrder status
       ↓
AuditLog
```

The entire operation must be transactional.

---

# 24. Alert API

## GET /alerts

Lists alerts.

Filters:

```text
status
type
warehouse_id
product_id
```

---

## GET /alerts/:id

Returns an alert.

---

## POST /alerts/:id/resolve

Marks an alert as resolved.

The authenticated user is stored as the resolver.

---

# 25. Audit API

Audit logs are read-only from the API perspective.

## GET /audit-logs

Returns audit records.

Filters:

```text
user_id
entity_type
entity_id
action
date_from
date_to
```

Example:

```text
GET /audit-logs?entity_type=InventoryTransfer&entity_id=25
```

---

## GET /audit-logs/:id

Returns a specific audit record.

There will be no:

```text
POST /audit-logs
PATCH /audit-logs/:id
DELETE /audit-logs/:id
```

Audit records are generated internally by the application.

---

# 26. User API

## GET /users

Lists users.

## POST /users

Creates a user.

## GET /users/:id

Returns a user.

## PATCH /users/:id

Updates a user.

## DELETE /users/:id

Soft deletes a user.

---

# 27. Role API

Roles are system-defined.

The MVP will not allow arbitrary role creation.

Available roles:

```text
ADMINISTRATOR
BRANCH_MANAGER
WAREHOUSE_OPERATOR
BUYER
READ_ONLY
```

User-role assignments will be managed through the user management functionality.

---

# 28. Authorization

Authorization will be based on roles and business permissions.

Example:

| Operation              | Admin | Manager | Operator | Buyer | Read Only |
| ---------------------- | :---: | :-----: | :------: | :---: | :-------: |
| Manage users           |   ✓   |         |          |       |           |
| Manage branches        |   ✓   |         |          |       |           |
| Manage warehouses      |   ✓   |    ✓    |          |       |           |
| Manage products        |   ✓   |    ✓    |          |       |           |
| View inventory         |   ✓   |    ✓    |     ✓    |   ✓   |     ✓     |
| Send transfer          |   ✓   |    ✓    |     ✓    |       |           |
| Receive transfer       |   ✓   |    ✓    |     ✓    |       |           |
| Request adjustment     |   ✓   |    ✓    |     ✓    |       |           |
| Approve adjustment     |   ✓   |    ✓    |          |       |           |
| Create purchase order  |   ✓   |         |          |   ✓   |           |
| Receive purchase order |   ✓   |    ✓    |     ✓    |   ✓   |           |
| View reports           |   ✓   |    ✓    |     ✓    |   ✓   |     ✓     |
| View audit logs        |   ✓   |    ✓    |          |       |     ✓     |

The exact authorization matrix may evolve during implementation.

---

# 29. Branch and Warehouse Authorization

Users should not automatically have access to every warehouse.

The authorization layer must consider organizational scope.

Example:

```text
Company
   │
   ├── Branch A
   │     ├── Warehouse A1
   │     └── Warehouse A2
   │
   └── Branch B
         └── Warehouse B1
```

A Branch Manager assigned to Branch A should not manage Branch B inventory.

This authorization must be enforced server-side.

---

# 30. Business Validation

Validation occurs at multiple levels.

```text
HTTP Request
     ↓
DTO Validation
     ↓
Application Service
     ↓
Domain Rules
     ↓
Database Constraints
```

Example:

```text
POST /transfers
        ↓
Validate DTO
        ↓
Validate warehouses
        ↓
Validate product
        ↓
Validate quantity
        ↓
Validate business rules
        ↓
Execute transaction
```

Validation must never depend exclusively on the frontend.

---

# 31. Domain Errors

Business errors should use meaningful error codes.

Example:

```json
{
  "statusCode": 409,
  "error": "INSUFFICIENT_STOCK",
  "message": "There is not enough inventory to perform this operation."
}
```

Initial domain errors may include:

```text
PRODUCT_NOT_FOUND
WAREHOUSE_NOT_FOUND
INVENTORY_NOT_FOUND
INSUFFICIENT_STOCK
TRANSFER_ALREADY_SENT
TRANSFER_ALREADY_RECEIVED
INVALID_TRANSFER_WAREHOUSES
ADJUSTMENT_NOT_APPROVED
PURCHASE_ORDER_NOT_EDITABLE
INVALID_PURCHASE_RECEIPT
UNAUTHORIZED_OPERATION
```

---

# 32. Idempotency

Critical operations should consider idempotency.

Operations such as:

```text
POST /transfers/:id/send
POST /transfers/:id/receive
POST /purchase-orders/:id/receive
POST /inventory/adjustments/:id/apply
```

must not accidentally execute the inventory modification twice.

The service must verify the current state before applying the operation.

Example:

```text
Transfer status = SENT

Request:
POST /transfers/10/send

Result:

409 TRANSFER_ALREADY_SENT
```

This prevents duplicate inventory movements.

---

# 33. Transaction Boundaries

Transactions will be handled inside application services.

Example:

```text
TransferService.send()
       │
       ├── Begin transaction
       ├── Validate transfer
       ├── Update inventory
       ├── Create movement
       ├── Update transfer
       ├── Create domain event
       └── Commit
```

The controller must not be responsible for transaction management.

---

# 34. Audit Integration

Business operations should generate domain events.

Example:

```text
TransferService.send()
        ↓
Inventory updated
        ↓
TransferSent event
        ↓
Audit handler
        ↓
AuditLog
```

This keeps audit logic separated from business logic.

The same mechanism can be used for:

```text
ProductCreated
ProductUpdated
InventoryAdjusted
TransferSent
TransferReceived
PurchaseOrderCreated
PurchaseOrderReceived
UserCreated
UserUpdated
```

---

# 35. API Security

The API must implement:

* Password hashing.
* Authentication.
* Authorization.
* DTO validation.
* Rate limiting where appropriate.
* Input sanitization.
* Secure HTTP headers.
* CORS configuration.
* Protection against common web vulnerabilities.
* No sensitive information in error responses.

Passwords must never be returned by API responses.

---

# 36. Password Handling

The API will use:

```text
password
```

for the incoming user credential.

The database will store the hashed value:

```text
password
```

The password must never be stored in plaintext.

Recommended hashing strategy:

```text
Argon2
```

The exact implementation will be defined during authentication development.

---

# 37. Date and Time

All API timestamps will use ISO 8601.

Example:

```text
2026-08-09T20:30:00.000Z
```

The backend stores timestamps in UTC.

Clients may convert timestamps to the user's local timezone.

---

# 38. API Documentation

The API will use OpenAPI/Swagger.

Development endpoint:

```text
/api/docs
```

Swagger will document:

* Endpoints.
* Request DTOs.
* Response DTOs.
* Authentication.
* Validation errors.
* HTTP status codes.
* Query parameters.

The OpenAPI documentation should be generated from the NestJS application where possible.

---

# 39. API Module Structure

The API will follow the modular architecture.

Example:

```text
src/
├── modules/
│
├── identity/
│   └── presentation/
│
├── organizations/
│   └── presentation/
│
├── catalog/
│   └── presentation/
│
├── inventory/
│   └── presentation/
│
├── transfers/
│   └── presentation/
│
├── purchasing/
│   └── presentation/
│
├── alerts/
│   └── presentation/
│
└── audit/
    └── presentation/
```

Controllers belong to the presentation layer.

Business logic must remain outside controllers.

---

# 40. Controller Responsibilities

Controllers are responsible for:

* Receiving HTTP requests.
* Validating DTOs.
* Extracting authenticated user information.
* Calling application services.
* Returning HTTP responses.

Controllers must not contain business logic.

Bad:

```text
Controller
    ↓
Validate stock
    ↓
Update inventory
    ↓
Create movement
```

Preferred:

```text
Controller
    ↓
Application Service
    ↓
Domain
    ↓
Repository
```

---

# 41. DTO Strategy

Requests and responses will use DTOs.

Example:

```text
CreateProductDto
UpdateProductDto
ProductResponseDto
CreateTransferDto
ReceiveTransferDto
CreatePurchaseOrderDto
ReceivePurchaseOrderDto
```

Entities should not be exposed directly through the API.

---

# 42. API Design Principles

StockFlow API follows these principles:

1. RESTful resource-oriented endpoints.
2. Versioned API.
3. Consistent response structures.
4. Consistent error structures.
5. DTO validation.
6. Role-based authorization.
7. Business rules enforced server-side.
8. Transactional inventory operations.
9. Immutable historical records.
10. Soft deletion for application entities.
11. Idempotent critical business operations.
12. OpenAPI documentation.
13. Controllers kept thin.
14. Business logic kept inside application/domain layers.

---

# 43. Initial API Resource Map

```text
/auth

/users
/roles

/companies
/branches
/warehouses

/categories
/products

/inventory
/inventory/movements
/inventory/adjustments

/transfers

/suppliers
/purchase-orders

/alerts

/audit-logs
```

---

# 44. Future API Resources

The following are intentionally outside the MVP:

```text
/customers
/sales
/sales-orders
/sales-order-items
/invoices
/payments
```

Future sales functionality will integrate with the inventory domain.

Example:

```text
Sale
  ↓
Stock Out
  ↓
InventoryMovement
```

The current API should not implement sales until that domain is properly designed.

---

# 45. API Evolution

Future versions may introduce:

```text
/api/v2
```

if breaking changes are required.

Non-breaking changes should preferably be introduced without creating a new API version.

Examples:

```text
Adding optional response fields → no new version
Adding optional query parameters → no new version
Changing response structure → new version
Removing fields → new version
Changing business semantics → evaluate versioning
```

---

# 46. API Design Summary

StockFlow exposes a REST API organized around business resources and domain operations.

The main flow is:

```text
Client
   ↓
Controller
   ↓
Application Service
   ↓
Domain
   ↓
Repository
   ↓
MySQL
```

For inventory-critical operations:

```text
HTTP Request
      ↓
Authorization
      ↓
DTO Validation
      ↓
Application Service
      ↓
Domain Rules
      ↓
Database Transaction
      ↓
Inventory
      ↓
InventoryMovement
      ↓
Domain Event
      ↓
AuditLog
```

The API is designed to keep the external interface simple while preserving the business rules and transactional integrity of the StockFlow domain.
