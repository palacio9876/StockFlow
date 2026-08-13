# StockFlow — Database Design

## 1. Database Overview

StockFlow utilizará **MySQL** como sistema principal de persistencia.

El diseño de base de datos está basado en:

* PRD.
* Domain Model.
* Architecture Document.
* Modular Monolith.
* Domain-driven business rules.
* Integridad referencial.
* Consistencia transaccional.

La base de datos será compartida por todos los módulos del monolito, pero cada módulo será responsable de sus propias entidades y tablas.

```text
StockFlow
    │
    ▼
   MySQL
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
```

---

# 2. Database Principles

## 2.1 Primary Keys

Todas las tablas utilizarán una clave primaria `id` autoincremental.

```text
id BIGINT AUTO_INCREMENT PRIMARY KEY
```

Las columnas de foreign keys utilizarán el mismo tipo que la clave primaria referenciada:

```text
BIGINT
```

Ejemplo:

```text
id = 1
```

### Reason

Autoincrement permite:

* Generación nativa por MySQL.
* Índices compactos y joins más rápidos.
* Menor complejidad en la capa de aplicación.
* Simplicidad acorde al monolito del MVP.

---

# 2.2 Timestamps

Todas las entidades incluirán:

```text
created_at
updated_at
```

y, salvo las entidades históricas inmutables (`InventoryMovement`, `AuditLog`), también:

```text
deleted_at
```

Todos los timestamps deberán almacenarse en UTC.

---

# 2.3 Soft Delete

Todas las entidades utilizarán Soft Delete a través de una columna `deleted_at`.

```text
created_at
updated_at
deleted_at
```

Excepción: las entidades históricas inmutables **no** incluirán `deleted_at`:

```text
InventoryMovement
AuditLog
```

Estas tablas representan hechos históricos y nunca deben eliminarse, ni siquiera de forma lógica.

Las demás entidades:

```text
Product
Warehouse
Supplier
User
```

deberán preferir estados de activación/desactivación y, en su caso, soft delete.

---

# 2.4 Naming Convention

Las tablas utilizarán `snake_case`.

Ejemplo:

```text
inventory_movements
purchase_order_items
audit_logs
```

Las columnas también utilizarán `snake_case`.

---

# 2.5 Foreign Keys

Las relaciones entre entidades utilizarán foreign keys.

Ejemplo:

```text
products.category_id
        ↓
categories.id
```

Las relaciones deberán mantener integridad referencial.

Todas las foreign keys utilizarán las acciones referenciales:

```text
ON DELETE NO ACTION
ON UPDATE NO ACTION
```

En InnoDB, `NO ACTION` equivale a `RESTRICT` (verificación inmediata): la operación falla si existen referencias pendientes. No se permite cascada ni borrado automático.

---

# 3. Database Modules

```text
Identity
├── users
├── roles
└── user_roles

Organizations
├── companies
├── branches
└── warehouses

Catalog
├── categories
└── products

Inventory
├── inventories
├── inventory_movements
└── inventory_adjustments

Transfers
└── inventory_transfers

Purchasing
├── suppliers
├── purchase_orders
└── purchase_order_items

Alerts
└── alerts

Audit
└── audit_logs
```

---

# 4. Entity Relationship Overview

```text
Company
   │
   ├──< User
   │
   └──< Branch
          │
          └──< Warehouse
                  │
                  └──< Inventory
                          │
                          └── Product
                                │
                                └── Category
```

Purchasing:

```text
Supplier
   │
   └──< PurchaseOrder
           │
           └──< PurchaseOrderItem
                    │
                    └── Product
```

Transfers:

```text
Warehouse
   │
   ├──────── Source
   │
   └──────── Destination
                │
                ▼
       InventoryTransfer
```

Inventory:

```text
Inventory
    │
    ├──< InventoryMovement
    │
    └──< InventoryAdjustment
```

Audit:

```text
User
 │
 ▼
AuditLog
 │
 ├── entity_type
 └── entity_id
```

---

# 5. Identity Tables

## 5.1 users

Stores application users.

### Columns

| Column        | Type                     | Constraints  |
| ------------- | ------------------------ | ------------ |
| id            | BIGINT AUTO_INCREMENT    | PK           |
| company_id    | BIGINT                   | FK, NOT NULL |
| first_name    | VARCHAR(100)             | NOT NULL     |
| last_name     | VARCHAR(100)             | NOT NULL     |
| email         | VARCHAR(255)             | NOT NULL     |
| password      | VARCHAR(255)             | NOT NULL     |
| status        | ENUM('ACTIVE','INACTIVE')| NOT NULL     |
| created_at    | DATETIME(6)              | NOT NULL     |
| updated_at    | DATETIME(6)              | NOT NULL     |
| deleted_at    | DATETIME(6)              | NULL         |

### Constraints

```text
UNIQUE(company_id, email)
```

A user belongs to one company.

### Initial status

```text
ACTIVE
INACTIVE
```

---

## 5.2 roles

Stores system roles.

### Columns

| Column      | Type                  | Constraints      |
| ----------- | --------------------- | ---------------- |
| id          | BIGINT AUTO_INCREMENT | PK               |
| name        | VARCHAR(50)           | UNIQUE, NOT NULL |
| description | VARCHAR(255)          | NULL             |
| created_at  | DATETIME(6)           | NOT NULL         |
| updated_at  | DATETIME(6)           | NOT NULL         |
| deleted_at  | DATETIME(6)           | NULL             |

Initial roles:

```text
ADMINISTRATOR
BRANCH_MANAGER
WAREHOUSE_OPERATOR
BUYER
READ_ONLY
```

---

## 5.3 user_roles

Many-to-many relationship between users and roles.

### Columns

| Column     | Type                  | Constraints  |
| ---------- | --------------------- | ------------ |
| id         | BIGINT AUTO_INCREMENT | PK           |
| user_id    | BIGINT                | FK, NOT NULL |
| role_id    | BIGINT                | FK, NOT NULL |
| created_at | DATETIME(6)           | NOT NULL     |
| deleted_at | DATETIME(6)           | NULL         |

### Constraints

```text
UNIQUE(user_id, role_id)
```

A user may have multiple roles.

---

# 6. Organization Tables

## 6.1 companies

Represents a company using StockFlow.

### Columns

| Column         | Type                     | Constraints  |
| -------------- | ------------------------ | ------------ |
| id             | BIGINT AUTO_INCREMENT    | PK           |
| name           | VARCHAR(150)             | NOT NULL     |
| legal_name     | VARCHAR(200)             | NULL         |
| tax_identifier | VARCHAR(50)              | NULL         |
| status         | ENUM('ACTIVE','INACTIVE')| NOT NULL     |
| created_at     | DATETIME(6)              | NOT NULL     |
| updated_at     | DATETIME(6)              | NOT NULL     |
| deleted_at     | DATETIME(6)              | NULL         |

### Initial status

```text
ACTIVE
INACTIVE
```

---

## 6.2 branches

Represents a company branch.

### Columns

| Column     | Type                     | Constraints  |
| ---------- | ------------------------ | ------------ |
| id         | BIGINT AUTO_INCREMENT    | PK           |
| company_id | BIGINT                   | FK, NOT NULL |
| name       | VARCHAR(150)             | NOT NULL     |
| code       | VARCHAR(50)              | NOT NULL     |
| address    | VARCHAR(255)             | NULL         |
| status     | ENUM('ACTIVE','INACTIVE')| NOT NULL     |
| created_at | DATETIME(6)              | NOT NULL     |
| updated_at | DATETIME(6)              | NOT NULL     |
| deleted_at | DATETIME(6)              | NULL         |

### Constraints

```text
UNIQUE(company_id, code)
```

---

## 6.3 warehouses

Represents a physical warehouse belonging to a branch.

### Columns

| Column     | Type                     | Constraints            |
| ---------- | ------------------------ | ---------------------- |
| id         | BIGINT AUTO_INCREMENT    | PK                     |
| branch_id  | BIGINT                   | FK, NOT NULL           |
| name       | VARCHAR(150)             | NOT NULL               |
| code       | VARCHAR(50)              | NOT NULL               |
| is_default | BOOLEAN                  | NOT NULL DEFAULT FALSE |
| status     | ENUM('ACTIVE','INACTIVE')| NOT NULL               |
| created_at | DATETIME(6)              | NOT NULL               |
| updated_at | DATETIME(6)              | NOT NULL               |
| deleted_at | DATETIME(6)              | NULL                   |

### Constraints

```text
UNIQUE(branch_id, code)
```

A branch may contain multiple warehouses.

---

## 6.4 Default Warehouse Constraint

Each branch may have only one default warehouse.

Conceptually:

```text
Branch A
├── Warehouse 1 → DEFAULT
├── Warehouse 2
└── Warehouse 3
```

Invalid:

```text
Branch A
├── Warehouse 1 → DEFAULT
├── Warehouse 2 → DEFAULT ❌
```

This rule must be enforced at the database/application level.

The implementation strategy will be defined during migration development.

---

# 7. Catalog Tables

## 7.1 categories

Stores product categories.

### Columns

| Column      | Type                     | Constraints  |
| ----------- | ------------------------ | ------------ |
| id          | BIGINT AUTO_INCREMENT    | PK           |
| company_id  | BIGINT                   | FK, NOT NULL |
| name        | VARCHAR(100)             | NOT NULL     |
| description | VARCHAR(255)             | NULL         |
| status      | ENUM('ACTIVE','INACTIVE')| NOT NULL     |
| created_at  | DATETIME(6)              | NOT NULL     |
| updated_at  | DATETIME(6)              | NOT NULL     |
| deleted_at  | DATETIME(6)              | NULL         |

### Constraints

```text
UNIQUE(company_id, name)
```

Categories belong to a company.

---

## 7.2 products

Stores the product catalog.

### Columns

| Column          | Type                     | Constraints  |
| --------------- | ------------------------ | ------------ |
| id              | BIGINT AUTO_INCREMENT    | PK           |
| company_id      | BIGINT                   | FK, NOT NULL |
| category_id     | BIGINT                   | FK, NOT NULL |
| sku             | VARCHAR(100)             | NOT NULL     |
| name            | VARCHAR(200)             | NOT NULL     |
| description     | TEXT                     | NULL         |
| unit_of_measure | VARCHAR(30)              | NOT NULL     |
| status          | ENUM('ACTIVE','INACTIVE')| NOT NULL     |
| created_at      | DATETIME(6)              | NOT NULL     |
| updated_at      | DATETIME(6)              | NOT NULL     |
| deleted_at      | DATETIME(6)              | NULL         |

### Constraints

```text
UNIQUE(company_id, sku)
```

SKU uniqueness is scoped to the company.

---

# 8. Inventory Tables

## 8.1 inventories

Represents the current stock of a product in a warehouse.

This is one of the most important tables in StockFlow.

### Columns

| Column           | Type                  | Constraints        |
| ---------------- | --------------------- | ------------------ |
| id               | BIGINT AUTO_INCREMENT | PK                 |
| product_id       | BIGINT                | FK, NOT NULL       |
| warehouse_id     | BIGINT                | FK, NOT NULL       |
| quantity         | DECIMAL(15,3)         | NOT NULL DEFAULT 0 |
| minimum_quantity | DECIMAL(15,3)         | NOT NULL DEFAULT 0 |
| maximum_quantity | DECIMAL(15,3)         | NOT NULL           |
| created_at       | DATETIME(6)           | NOT NULL           |
| updated_at       | DATETIME(6)           | NOT NULL           |
| deleted_at       | DATETIME(6)           | NULL               |

### Constraints

```text
UNIQUE(product_id, warehouse_id)
```

There can only be one inventory record for a product in a warehouse.

Example:

```text
Product: SKU-001

Warehouse A → 100
Warehouse B → 50
Warehouse C → 20
```

These are three different `inventories` records.

---

## 8.2 Quantity Rules

```text
quantity >= 0
minimum_quantity >= 0
maximum_quantity >= minimum_quantity
```

The application and database should enforce these invariants where possible.

---

## 8.3 inventory_movements

Immutable historical record of stock changes.

### Columns

| Column         | Type                  | Constraints  |
| -------------- | --------------------- | ------------ |
| id             | BIGINT AUTO_INCREMENT | PK           |
| inventory_id   | BIGINT                | FK, NOT NULL |
| product_id     | BIGINT                | FK, NOT NULL |
| warehouse_id   | BIGINT                | FK, NOT NULL |
| user_id        | BIGINT                | FK, NOT NULL |
| movement_type  | ENUM('PURCHASE_RECEIPT','TRANSFER_IN','TRANSFER_OUT','ADJUSTMENT_IN','ADJUSTMENT_OUT','STOCK_OUT') | NOT NULL |
| quantity       | DECIMAL(15,3)         | NOT NULL     |
| observation    | TEXT                  | NULL         |
| reference_type | VARCHAR(50)           | NULL         |
| reference_id   | BIGINT                | NULL         |
| created_at     | DATETIME(6)           | NOT NULL     |

### Movement types

Initial types:

```text
PURCHASE_RECEIPT
TRANSFER_IN
TRANSFER_OUT
ADJUSTMENT_IN
ADJUSTMENT_OUT
STOCK_OUT
```

The movement quantity will always be positive.

Direction is represented by `movement_type`.

Example:

```text
TRANSFER_OUT
quantity = 20
```

means:

```text
Inventory - 20
```

---

## 8.4 Inventory Movement Immutability

Once created, an `inventory_movements` record must not be modified through normal application operations.

Movements represent historical facts.

Esta tabla es inmutable y **no** incluye `deleted_at`: no debe eliminarse ni física ni lógicamente.

Corrections must be represented by new movements.

Example:

```text
Incorrect movement
      ↓
Do NOT edit old movement
      ↓
Create corrective movement
```

---

# 9. Inventory Adjustment Tables

## 9.1 inventory_adjustments

Represents requested or applied inventory adjustments.

### Columns

| Column           | Type                  | Constraints  |
| ---------------- | --------------------- | ------------ |
| id               | BIGINT AUTO_INCREMENT | PK           |
| inventory_id     | BIGINT                | FK, NOT NULL |
| product_id       | BIGINT                | FK, NOT NULL |
| warehouse_id     | BIGINT                | FK, NOT NULL |
| requested_by     | BIGINT                | FK, NOT NULL |
| approved_by      | BIGINT                | FK, NULL     |
| quantity         | DECIMAL(15,3)         | NOT NULL     |
| direction        | ENUM('IN','OUT')      | NOT NULL     |
| observation      | TEXT                  | NOT NULL     |
| status           | ENUM('PENDING','APPROVED','REJECTED','APPLIED') | NOT NULL |
| rejection_reason | TEXT                  | NULL         |
| created_at       | DATETIME(6)           | NOT NULL     |
| updated_at       | DATETIME(6)           | NOT NULL     |
| deleted_at       | DATETIME(6)           | NULL         |

### Direction

```text
IN
OUT
```

### Status

```text
PENDING
APPROVED
REJECTED
APPLIED
```

---

# 10. Inventory Transfer Tables

## 10.1 inventory_transfers

Represents a transfer between warehouses.

### Columns

| Column                   | Type                  | Constraints        |
| ------------------------ | --------------------- | ------------------ |
| id                       | BIGINT AUTO_INCREMENT | PK                 |
| source_warehouse_id      | BIGINT                | FK, NOT NULL       |
| destination_warehouse_id | BIGINT                | FK, NOT NULL       |
| product_id               | BIGINT                | FK, NOT NULL       |
| quantity                 | DECIMAL(15,3)         | NOT NULL           |
| received_quantity        | DECIMAL(15,3)         | NOT NULL DEFAULT 0 |
| status                   | ENUM('CREATED','SENT','PARTIALLY_RECEIVED','RECEIVED','CANCELLED') | NOT NULL |
| created_by               | BIGINT                | FK, NOT NULL       |
| sent_by                  | BIGINT                | FK, NULL           |
| received_by              | BIGINT                | FK, NULL           |
| observation              | TEXT                  | NOT NULL           |
| created_at               | DATETIME(6)           | NOT NULL           |
| updated_at               | DATETIME(6)           | NOT NULL           |
| deleted_at               | DATETIME(6)           | NULL               |

---

## 10.2 Transfer Status

Initial states:

```text
CREATED
SENT
PARTIALLY_RECEIVED
RECEIVED
CANCELLED
```

There is intentionally no:

```text
IN_TRANSIT
```

The system only records the business facts:

```text
Not sent
    ↓
Sent
    ↓
Received
```

---

## 10.3 Transfer Rules

```text
source_warehouse_id != destination_warehouse_id
```

The source and destination warehouses cannot be the same.

Also:

```text
quantity > 0
received_quantity >= 0
received_quantity <= quantity
```

---

# 11. Purchasing Tables

## 11.1 suppliers

Stores supplier information.

### Columns

| Column         | Type                     | Constraints  |
| -------------- | ------------------------ | ------------ |
| id             | BIGINT AUTO_INCREMENT    | PK           |
| company_id     | BIGINT                   | FK, NOT NULL |
| name           | VARCHAR(200)             | NOT NULL     |
| tax_identifier | VARCHAR(50)              | NULL         |
| email          | VARCHAR(255)             | NULL         |
| phone          | VARCHAR(50)              | NULL         |
| address        | VARCHAR(255)             | NULL         |
| status         | ENUM('ACTIVE','INACTIVE')| NOT NULL     |
| created_at     | DATETIME(6)              | NOT NULL     |
| updated_at     | DATETIME(6)              | NOT NULL     |
| deleted_at     | DATETIME(6)              | NULL         |

---

## 11.2 purchase_orders

Represents an order placed with a supplier.

### Columns

| Column       | Type                  | Constraints  |
| ------------ | --------------------- | ------------ |
| id           | BIGINT AUTO_INCREMENT | PK           |
| company_id   | BIGINT                | FK, NOT NULL |
| supplier_id  | BIGINT                | FK, NOT NULL |
| branch_id    | BIGINT                | FK, NOT NULL |
| warehouse_id | BIGINT                | FK, NOT NULL |
| order_number | VARCHAR(50)           | NOT NULL     |
| status       | ENUM('DRAFT','ORDERED','PARTIALLY_RECEIVED','RECEIVED','CANCELLED') | NOT NULL |
| notes        | TEXT                  | NULL         |
| created_by   | BIGINT                | FK, NOT NULL |
| ordered_at   | DATETIME(6)           | NULL         |
| created_at   | DATETIME(6)           | NOT NULL     |
| updated_at   | DATETIME(6)           | NOT NULL     |
| deleted_at   | DATETIME(6)           | NULL         |

### Constraints

```text
UNIQUE(company_id, order_number)
```

---

## 11.3 purchase_order_items

Stores products included in a purchase order.

### Columns

| Column            | Type                  | Constraints        |
| ----------------- | --------------------- | ------------------ |
| id                | BIGINT AUTO_INCREMENT | PK                 |
| purchase_order_id | BIGINT                | FK, NOT NULL       |
| product_id        | BIGINT                | FK, NOT NULL       |
| quantity_ordered  | DECIMAL(15,3)         | NOT NULL           |
| quantity_received | DECIMAL(15,3)         | NOT NULL DEFAULT 0 |
| unit_price        | DECIMAL(15,2)         | NOT NULL           |
| created_at        | DATETIME(6)           | NOT NULL           |
| updated_at        | DATETIME(6)           | NOT NULL           |
| deleted_at        | DATETIME(6)           | NULL               |

### Rules

```text
quantity_ordered > 0
quantity_received >= 0
quantity_received <= quantity_ordered
unit_price >= 0
```

---

## 11.4 Purchase Order Status

Initial states:

```text
DRAFT
ORDERED
PARTIALLY_RECEIVED
RECEIVED
CANCELLED
```

---

# 12. Alert Tables

## 12.1 alerts

Stores system-generated alerts.

### Columns

| Column       | Type                  | Constraints  |
| ------------ | --------------------- | ------------ |
| id           | BIGINT AUTO_INCREMENT | PK           |
| company_id   | BIGINT                | FK, NOT NULL |
| inventory_id | BIGINT                | FK, NOT NULL |
| type         | ENUM('LOW_STOCK')     | NOT NULL     |
| status       | ENUM('ACTIVE','RESOLVED') | NOT NULL  |
| message      | VARCHAR(500)          | NOT NULL     |
| created_at   | DATETIME(6)           | NOT NULL     |
| resolved_at  | DATETIME(6)           | NULL         |
| resolved_by  | BIGINT                | FK, NULL     |
| deleted_at   | DATETIME(6)           | NULL         |

### Initial alert types

```text
LOW_STOCK
```

### Initial statuses

```text
ACTIVE
RESOLVED
```

---

# 13. Audit Tables

## 13.1 audit_logs

Stores immutable business audit information.

### Columns

| Column         | Type                  | Constraints  |
| -------------- | --------------------- | ------------ |
| id             | BIGINT AUTO_INCREMENT | PK           |
| company_id     | BIGINT                | FK, NOT NULL |
| user_id        | BIGINT                | FK, NULL     |
| action         | VARCHAR(50)           | NOT NULL     |
| entity_type    | VARCHAR(100)          | NOT NULL     |
| entity_id      | BIGINT                | NOT NULL     |
| previous_state | JSON                  | NULL         |
| new_state      | JSON                  | NULL         |
| metadata       | JSON                  | NULL         |
| occurred_at    | DATETIME(6)           | NOT NULL     |

---

## 13.2 Audit Design

Audit records are immutable.

Esta tabla es inmutable y **no** incluye `deleted_at`: no debe eliminarse ni física ni lógicamente.

The application must never expose an operation such as:

```text
UPDATE /audit-logs/:id
DELETE /audit-logs/:id
```

The audit module only supports:

```text
CREATE
READ
```

Audit records should be generated primarily from Domain Events.

Example:

```text
InventoryTransferSent
        ↓
Audit Event Handler
        ↓
audit_logs
```

---

# 14. Foreign Key Relationships

## Company Relationships

```text
companies
   │
   ├──< users
   ├──< branches
   ├──< categories
   ├──< products
   ├──< suppliers
   ├──< purchase_orders
   └──< alerts
```

---

## Branch Relationships

```text
branches
   │
   └──< warehouses
```

---

## Warehouse Relationships

```text
warehouses
   │
   ├──< inventories
   ├──< inventory_movements
   ├──< inventory_adjustments
   │
   ├──< inventory_transfers
   │       ├── source
   │       └── destination
   │
   └──< purchase_orders
```

---

## Product Relationships

```text
products
   │
   ├── category
   │
   ├──< inventories
   ├──< inventory_movements
   ├──< inventory_adjustments
   ├──< inventory_transfers
   └──< purchase_order_items
```

---

# 15. Index Strategy

Indexes should support the most common queries.

## 15.1 Users

```text
INDEX(company_id)
UNIQUE(company_id, email)
```

---

## 15.2 Branches

```text
INDEX(company_id)
UNIQUE(company_id, code)
```

---

## 15.3 Warehouses

```text
INDEX(branch_id)
UNIQUE(branch_id, code)
```

---

## 15.4 Products

```text
INDEX(company_id)
INDEX(category_id)
UNIQUE(company_id, sku)
```

---

## 15.5 Inventory

```text
INDEX(warehouse_id)
INDEX(product_id)
UNIQUE(product_id, warehouse_id)
```

---

## 15.6 Inventory Movements

```text
INDEX(inventory_id, created_at)
INDEX(product_id, created_at)
INDEX(warehouse_id, created_at)
INDEX(user_id, created_at)
INDEX(reference_type, reference_id)
```

The movement table is expected to grow significantly over time, so indexing and query performance are important.

---

## 15.7 Inventory Adjustments

```text
INDEX(inventory_id)
INDEX(status)
INDEX(requested_by)
INDEX(created_at)
```

---

## 15.8 Inventory Transfers

```text
INDEX(source_warehouse_id)
INDEX(destination_warehouse_id)
INDEX(status)
INDEX(created_by)
INDEX(created_at)
```

---

## 15.9 Purchase Orders

```text
INDEX(supplier_id)
INDEX(branch_id)
INDEX(warehouse_id)
INDEX(status)
INDEX(created_at)
UNIQUE(company_id, order_number)
```

---

## 15.10 Purchase Order Items

```text
INDEX(purchase_order_id)
INDEX(product_id)
```

---

## 15.11 Alerts

```text
INDEX(company_id, status)
INDEX(inventory_id)
INDEX(type, status)
```

---

## 15.12 Audit Logs

```text
INDEX(company_id, occurred_at)
INDEX(user_id, occurred_at)
INDEX(entity_type, entity_id)
INDEX(action, occurred_at)
```

---

# 16. Transactional Operations

The following operations must be transactional.

## 16.1 Increase Stock

```text
BEGIN

Lock inventory row
       ↓
Validate product
       ↓
Validate warehouse
       ↓
Increase quantity
       ↓
Create InventoryMovement
       ↓
Commit
```

---

## 16.2 Decrease Stock

```text
BEGIN

Lock inventory row
       ↓
Validate available quantity
       ↓
Decrease quantity
       ↓
Create InventoryMovement
       ↓
Commit
```

The operation must fail if:

```text
current_quantity < requested_quantity
```

---

## 16.3 Send Transfer

```text
BEGIN

Lock source inventory
       ↓
Validate stock
       ↓
Decrease source inventory
       ↓
Create TRANSFER_OUT movement
       ↓
Update transfer status
       ↓
Commit
```

---

## 16.4 Receive Transfer

```text
BEGIN

Validate transfer
       ↓
Lock destination inventory
       ↓
Increase destination inventory
       ↓
Create TRANSFER_IN movement
       ↓
Update received quantity
       ↓
Update transfer status
       ↓
Commit
```

---

## 16.5 Receive Purchase Order

```text
BEGIN

Validate purchase order
       ↓
Validate received quantities
       ↓
Update PurchaseOrderItem
       ↓
Increase Inventory
       ↓
Create InventoryMovement
       ↓
Update PurchaseOrder status
       ↓
Commit
```

---

# 17. Concurrency Control

Inventory operations must protect against concurrent modifications.

Example:

```text
Initial stock = 10

Request A → remove 7
Request B → remove 6
```

The database must prevent:

```text
10 - 7 - 6 = -3
```

from being committed.

The implementation should use appropriate row-level locking or atomic update strategies.

Potential strategy:

```sql
SELECT ...
FROM inventories
WHERE id = ?
FOR UPDATE;
```

The exact implementation will be defined in the repository layer.

---

# 18. Referential Integrity

Foreign keys should prevent invalid references.

Todas las foreign keys son de tipo `BIGINT` (mismo tipo que las claves primarias referenciadas) y utilizan las acciones:

```text
ON DELETE NO ACTION
ON UPDATE NO ACTION
```

Examples:

A product cannot reference a nonexistent category.

```text
products.category_id
        ↓
categories.id
```

An inventory cannot reference a nonexistent warehouse.

```text
inventories.warehouse_id
        ↓
warehouses.id
```

A purchase order item cannot reference a nonexistent purchase order.

```text
purchase_order_items.purchase_order_id
        ↓
purchase_orders.id
```

---

# 19. Delete Strategy

No existe borrado físico en la aplicación.

Todas las tablas soportan Soft Delete a través de `deleted_at`, excepto los registros históricos inmutables:

### Inmutables (sin borrado físico ni lógico):

* Inventory movements.
* Audit logs.

### Soft delete (deleted_at):

* Users.
* Products.
* Warehouses.
* Branches.
* Suppliers.
* Companies.
* Categories.
* Roles.
* User roles.
* Inventories.
* Inventory adjustments.
* Inventory transfers.
* Purchase orders.
* Purchase order items.
* Alerts.

La deactivación (`status`) se utiliza para deshabilitar operativamente una entidad; el soft delete (`deleted_at`) marca su eliminación lógica preservando la trazabilidad histórica.

Historical data must remain traceable.

---

# 20. Data Integrity Rules

Important invariants include:

### Inventory

```text
quantity >= 0
minimum_quantity >= 0
maximum_quantity >= minimum_quantity
```

### Transfers

```text
source != destination
quantity > 0
received_quantity >= 0
received_quantity <= quantity
```

### Purchase Orders

```text
quantity_ordered > 0
quantity_received >= 0
quantity_received <= quantity_ordered
unit_price >= 0
```

### Adjustments

```text
quantity > 0
observation IS NOT NULL
```

### Products

```text
SKU unique within company
```

### Warehouses

```text
warehouse belongs to exactly one branch
```

### Default Warehouse

```text
One default warehouse per branch
```

---

# 21. Status Representation

Los status de negocio se representarán con MySQL `ENUM`, ya que sus valores están definidos y no cambiarán.

Example:

```text
status ENUM('ACTIVE','INACTIVE')
```

Esto aplica a:

* `users.status`
* `companies.status`
* `branches.status`
* `warehouses.status`
* `categories.status`
* `products.status`
* `suppliers.status`
* `inventory_adjustments.status`
* `inventory_adjustments.direction`
* `inventory_transfers.status`
* `purchase_orders.status`
* `alerts.status`
* `alerts.type`
* `inventory_movements.movement_type`

La aplicación definirá los mismos valores en TypeScript como enum o union.

### Reason

Los conjuntos de valores son cerrados y estables, por lo que el `ENUM` de MySQL proporciona validación a nivel de base de datos y almacenamiento más compacto.

Trade-off: agregar un nuevo valor requiere un `ALTER TABLE`. Como los valores son fijos por diseño, este costo es aceptable para el MVP.

---

# 22. Money Representation

Monetary values will use:

```text
DECIMAL(15,2)
```

Never use floating-point types for monetary values.

Example:

```text
unit_price DECIMAL(15,2)
```

---

# 23. Quantity Representation

Inventory quantities will use:

```text
DECIMAL(15,3)
```

This allows support for decimal quantities.

Example:

```text
1.500 KG
2.750 L
10.000 UNIT
```

The final decision regarding decimal quantities remains documented in the DMD Open Questions.

If the business later determines that all products are integer-based, this can be restricted at the domain level.

---

# 24. JSON Usage

JSON columns will be used only where the data is naturally dynamic.

Initial candidates:

```text
audit_logs.previous_state
audit_logs.new_state
audit_logs.metadata
```

Business-critical relational data should not be stored inside JSON.

For example, this is discouraged:

```text
products.data JSON
```

when the data should instead have explicit relational columns.

---

# 25. Audit Data Model

The audit system intentionally uses polymorphic references:

```text
entity_type
entity_id
```

Example:

```text
entity_type = "InventoryTransfer"
entity_id = 123
```

This allows the audit system to record events from different modules without requiring foreign keys to every business entity.

The trade-off is that `entity_id` cannot have a traditional foreign key to every possible entity.

`entity_id` es de tipo `BIGINT` y no lleva constraint de foreign key.

The Audit module is responsible for maintaining logical integrity.

---

# 26. Inventory as Source of Truth

The `inventories.quantity` column represents the current available stock.

The `inventory_movements` table represents the historical changes that produced that state.

Conceptually:

```text
Inventory
    │
    │ Current State
    ▼
quantity = 85

InventoryMovement
    │
    ├── +100 PURCHASE_RECEIPT
    ├── -10  STOCK_OUT
    ├── -5   TRANSFER_OUT
    └── +0? ...
```

The system must never calculate current stock exclusively by summing all historical movements during normal queries.

The current quantity is stored directly for efficient reads.

Historical movements remain available for auditing and reporting.

---

# 27. Inventory Reconciliation

Future functionality may allow comparing:

```text
System Quantity
       vs
Physical Quantity
```

This will be implemented through `InventoryAdjustment`.

Example:

```text
System:   100
Physical: 97
Difference: -3
```

Result:

```text
InventoryAdjustment
direction = OUT
quantity = 3
observation = "Physical count difference"
```

The original inventory movement history remains unchanged.

---

# 28. Multi-Company Data Isolation

All company-owned data must be associated with a `company_id` directly or indirectly.

Example:

```text
Company
   │
   ├── Branch
   │     └── Warehouse
   │           └── Inventory
   │
   └── Product
```

Application-level authorization must ensure that a user cannot access another company's data.

This is especially important because `Company` is part of the core domain model and allows future evolution toward multi-tenant architecture.

---

# 29. Migration Strategy

Database changes will be managed through versioned migrations.

Example:

```text
migrations/
├── 001_create_companies
├── 002_create_users
├── 003_create_roles
├── 004_create_user_roles
├── 005_create_branches
├── 006_create_warehouses
├── 007_create_categories
├── 008_create_products
├── 009_create_inventories
├── 010_create_inventory_movements
├── ...
```

Migrations must be committed to Git.

The database schema must never depend on manual production modifications.

---

# 30. Seed Data

Initial seed data should include system roles.

Example:

```text
ADMINISTRATOR
BRANCH_MANAGER
WAREHOUSE_OPERATOR
BUYER
READ_ONLY
```

Development environments may also include sample:

* Company.
* Branch.
* Warehouses.
* Categories.
* Products.
* Suppliers.
* Users.

Production seed data must not contain fake development accounts.

---

# 31. Database Environment

Development environment:

```text
Docker Compose
      │
      ▼
    MySQL
```

Example configuration:

```text
MYSQL_DATABASE=stockflow
MYSQL_USER=stockflow
MYSQL_PASSWORD=********
MYSQL_ROOT_PASSWORD=********
MYSQL_PORT=3306
```

Credentials must be provided through environment variables.

---

# 32. Backup Strategy

Database backups are required for production environments.

Future production strategy should include:

* Automated backups.
* Backup retention.
* Restore testing.
* Point-in-time recovery where appropriate.

Backup configuration is outside the MVP development environment but must be considered before production deployment.

---

# 33. Database Performance Considerations

The database design should prioritize:

1. Correctness.
2. Transactional consistency.
3. Appropriate indexes.
4. Query efficiency.
5. Maintainability.

Potential future optimizations include:

* Read replicas.
* Partitioning of `inventory_movements`.
* Archiving historical data.
* Query optimization.
* Caching.
* Materialized reporting structures.

These optimizations are not required for the MVP.

---

# 34. Future Database Evolution

Potential future changes:

```text
Current
   │
   ▼
MySQL
   │
   ├── Read replicas
   ├── Redis cache
   ├── Outbox
   ├── Background workers
   └── Reporting database
```

The current schema should remain simple until actual requirements justify additional infrastructure.

---

# 35. Initial Table Inventory

|  # | Table                 | Module        | Purpose                 |
| -: | --------------------- | ------------- | ----------------------- |
|  1 | companies             | Organizations | Companies               |
|  2 | users                 | Identity      | Users                   |
|  3 | roles                 | Identity      | Roles                   |
|  4 | user_roles            | Identity      | User-role relationship  |
|  5 | branches              | Organizations | Branches                |
|  6 | warehouses            | Organizations | Warehouses              |
|  7 | categories            | Catalog       | Product categories      |
|  8 | products              | Catalog       | Products                |
|  9 | inventories           | Inventory     | Current stock           |
| 10 | inventory_movements   | Inventory     | Stock history           |
| 11 | inventory_adjustments | Inventory     | Stock adjustments       |
| 12 | inventory_transfers   | Transfers     | Warehouse transfers     |
| 13 | suppliers             | Purchasing    | Suppliers               |
| 14 | purchase_orders       | Purchasing    | Purchase orders         |
| 15 | purchase_order_items  | Purchasing    | Purchase order products |
| 16 | alerts                | Alerts        | Inventory alerts        |
| 17 | audit_logs            | Audit         | Business audit          |

Total initial tables:

```text
17
```

---

# 36. Database Design Summary

StockFlow will use a relational MySQL schema organized around the business domain.

The most important relationship is:

```text
Company
   ↓
Branch
   ↓
Warehouse
   ↓
Inventory
   ↓
Product
```

Inventory history is maintained through:

```text
Inventory
    ↓
InventoryMovement
```

Business corrections use:

```text
InventoryAdjustment
```

Warehouse-to-warehouse operations use:

```text
InventoryTransfer
```

Supplier procurement uses:

```text
Supplier
    ↓
PurchaseOrder
    ↓
PurchaseOrderItem
```

Business auditing uses:

```text
Domain Event
     ↓
Audit Handler
     ↓
AuditLog
```

The database is designed to provide:

* Strong referential integrity.
* Transactional inventory operations.
* Non-negative stock.
* Immutable historical movements.
* Immutable audit records.
* Multi-company isolation.
* Multiple warehouses per branch.
* One default warehouse per branch.
* Support for partial receptions.
* Future extensibility.

The database design will be used as the source of truth for the subsequent TypeORM entities and migrations.
