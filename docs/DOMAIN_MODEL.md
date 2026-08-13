# StockFlow — Domain Model

## 1. Domain Overview

StockFlow es una plataforma de gestión de inventario para empresas de distribución y mayoristas que operan con múltiples sucursales y bodegas.

El sistema centraliza el control de productos, existencias, movimientos de inventario, transferencias entre bodegas, compras a proveedores y alertas de stock, proporcionando trazabilidad sobre las operaciones realizadas por los usuarios.

1.1 Domain Core

El núcleo del dominio es el inventario.

StockFlow mantiene la cantidad disponible de cada producto dentro de una bodega específica. Todas las operaciones que modifican el inventario deben realizarse mediante operaciones controladas y quedar registradas para garantizar consistencia y trazabilidad.

Las principales operaciones que pueden afectar el inventario son:

Recepción de mercancía proveniente de órdenes de compra.

Salidas de inventario.

Transferencias entre bodegas.

Ajustes de inventario.

Otras operaciones de inventario que puedan incorporarse en futuras versiones.

El inventario actual representa el estado presente, mientras que los movimientos de inventario representan el historial de cambios que llevaron a ese estado.

1.2 Organizational Structure

StockFlow organiza la operación mediante una estructura jerárquica:

Company

   │

   └── Branch

         │

         └── Warehouse

               │

               └── Inventory

Una empresa puede tener múltiples sucursales y cada sucursal puede tener múltiples bodegas.

Cada sucursal debe contar con una única bodega marcada como predeterminada.

El inventario pertenece a una bodega y relaciona una existencia específica de un producto dentro de ella.

1.3 Product and Inventory Management

Los productos representan los artículos administrados por StockFlow y pueden pertenecer a una categoría.

El inventario determina cuántas unidades de cada producto están disponibles en cada bodega.

Product

   │

   └── Inventory

          │

          └── Warehouse

Un mismo producto puede existir en múltiples bodegas con cantidades independientes.

### 1.4 Inventory Operations

Las operaciones de inventario representan acciones que modifican las existencias.

Los principales procesos son:

```text
Purchase
    ↓
Receive
    ↓
Inventory + Quantity

Transfer
    ↓
Source Warehouse - Quantity
    ↓
Destination Warehouse + Quantity

Adjustment
    ↓
Inventory +/- Quantity
```

Las operaciones deben validar las reglas de negocio correspondientes antes de modificar el inventario.

No se permite que una operación produzca stock negativo.

### 1.5 Purchasing

El módulo de compras permite gestionar órdenes de compra asociadas a proveedores.

Una orden de compra puede contener múltiples productos mediante sus líneas de detalle.

```text
Supplier
   │
   └── PurchaseOrder
          │
          └── PurchaseOrderItem
                    │
                    └── Product
```

La creación de una orden de compra no modifica el inventario.

El inventario solamente se modifica cuando se registra la recepción de mercancía.

Las recepciones pueden ser parciales o completas.

### 1.6 Transfers

StockFlow permite transferir productos entre bodegas.

Una transferencia identifica:

* Bodega de origen.
* Bodega de destino.
* Producto.
* Cantidad enviada.
* Cantidad recibida.
* Usuario que realiza la operación.
* Usuario que registra la recepción.
* Observación.
* Estado de la transferencia.

StockFlow no administra el transporte físico ni mantiene un estado de mercancía "en tránsito". El sistema registra únicamente las operaciones de salida y recepción.

Toda transferencia debe contener una observación.

### 1.7 Inventory Adjustments

Los ajustes permiten corregir diferencias entre el inventario registrado en el sistema y el inventario físico.

Los operadores pueden solicitar ajustes, pero estos requieren aprobación de un administrador o gerente.

Los administradores y gerentes pueden realizar ajustes directamente sin aprobación adicional.

Todo ajuste debe:

* Indicar la cantidad modificada.
* Permitir valores positivos o negativos.
* Contener una observación.
* Registrar el usuario responsable.
* Mantener trazabilidad del proceso.
* Generar un movimiento de inventario cuando sea aprobado.

### 1.8 Users and Access Control

El acceso al sistema se controla mediante usuarios, roles y asignación de roles.

```text
User
   │
   └── UserRole
          │
          └── Role
```

Los roles principales del MVP son:

* Administrador.
* Gerente de sucursal.
* Operador de bodega.
* Comprador.
* Auditor / Solo lectura.

Los permisos y el alcance de cada usuario determinan qué operaciones puede realizar y sobre qué sucursales o bodegas puede operar.

### 1.9 Alerts

StockFlow puede generar alertas cuando determinadas condiciones del inventario requieren atención.

El principal caso del MVP es el stock bajo.

```text
Inventory
   │
   ├── Current Stock
   └── Minimum Stock
          │
          ▼
       Low Stock
          │
          ▼
         Alert
```

Las alertas permiten identificar productos que requieren una acción de reabastecimiento.

### 1.10 Auditability

Las operaciones críticas del sistema deben mantener trazabilidad.

StockFlow diferencia entre:

**InventoryMovement**

Registra cambios efectivos en las existencias.

**AuditLog**

Registra acciones relevantes realizadas por los usuarios sobre las entidades del sistema.

```text
User Action
     │
     ├── Domain Operation
     │       │
     │       └── InventoryMovement
     │
     └── AuditLog
```

Los registros de auditoría son inmutables y no deben modificarse ni eliminarse mediante las operaciones normales del sistema.

### 1.11 Domain Boundaries

El dominio se organiza en diferentes áreas funcionales:

```text
StockFlow
│
├── Organization
│   ├── Company
│   ├── Branch
│   └── Warehouse
│
├── Identity & Access
│   ├── User
│   ├── Role
│   └── UserRole
│
├── Catalog
│   ├── Product
│   └── Category
│
├── Inventory
│   ├── Inventory
│   ├── InventoryMovement
│   ├── InventoryAdjustment
│   └── InventoryTransfer
│
├── Purchasing
│   ├── Supplier
│   ├── PurchaseOrder
│   └── PurchaseOrderItem
│
├── Notifications
│   └── Alert
│
└── Audit
    └── AuditLog
```

Estos límites representan responsabilidades del dominio y servirán posteriormente como referencia para definir los módulos de la aplicación.

### 1.12 Future Domain Extensions

El MVP está diseñado para permitir la incorporación de funcionalidades futuras sin modificar el concepto central del inventario.

Entre las posibles extensiones se encuentran:

* Ventas a clientes.
* Clientes.
* Pedidos de venta.
* Integración con sistemas ERP.
* Pronóstico de demanda.
* Integraciones externas.
* Aplicaciones móviles.

Estas funcionalidades quedan fuera del alcance del MVP y no forman parte del dominio actual.

## 2. Entities
Company
User
Role
UserRole
Branch
Warehouse
Product
Category
Inventory
InventoryMovement
InventoryAdjustment
InventoryTransfer
PurchaseOrder
PurchaseOrderItem
Supplier
Alert
AuditLog
## 3. Relationships
Las relaciones del dominio definen cómo interactúan las entidades de StockFlow y las restricciones que existen entre ellas.

### 3.1 Company → Branch

**Cardinality:** 1:N

Una empresa puede tener múltiples sucursales.

Cada sucursal pertenece exclusivamente a una empresa.

```text
Company 1 ───── N Branch
```

**Business meaning:**

Una empresa representa la organización propietaria de la operación. Las sucursales representan sus diferentes ubicaciones operativas.

---

### 3.2 Company → User

**Cardinality:** 1:N

Una empresa puede tener múltiples usuarios.

Cada usuario pertenece a una empresa.

```text
Company 1 ───── N User
```

Los usuarios solamente pueden operar sobre los recursos pertenecientes a su empresa.

---

### 3.3 User → UserRole

**Cardinality:** 1:N

Un usuario puede tener uno o varios registros de asignación de roles.

```text
User 1 ───── N UserRole
```

`UserRole` representa la asignación de un rol específico a un usuario.

---

### 3.4 Role → UserRole

**Cardinality:** 1:N

Un rol puede estar asignado a múltiples usuarios.

```text
Role 1 ───── N UserRole
```

La combinación de `User` y `Role` determina qué rol o roles tiene un usuario dentro del sistema.

---

### 3.5 Branch → Warehouse

**Cardinality:** 1:N

Una sucursal puede tener múltiples bodegas.

Cada bodega pertenece exclusivamente a una sucursal.

```text
Branch 1 ───── N Warehouse
```

Una sucursal debe tener exactamente una bodega marcada como predeterminada.

```text
Branch
├── Warehouse A
├── Warehouse B
└── Warehouse C ★ Default
```

No puede existir más de una bodega predeterminada dentro de la misma sucursal.

---

### 3.6 Category → Product

**Cardinality:** 1:N

Una categoría puede contener múltiples productos.

Cada producto pertenece a una categoría.

```text
Category 1 ───── N Product
```

Ejemplo:

```text
Electronics
├── Laptop
├── Monitor
└── Keyboard
```

---

### 3.7 Product → Inventory

**Cardinality:** 1:N

Un producto puede tener múltiples registros de inventario.

Cada registro representa la existencia del producto en una bodega específica.

```text
Product 1 ───── N Inventory
```

Ejemplo:

```text
Product X
├── Inventory → Warehouse Armenia → 100
├── Inventory → Warehouse Bogotá  → 50
└── Inventory → Warehouse Medellín → 30
```

Debe existir como máximo un registro de inventario para una combinación determinada de producto y bodega.

---

### 3.8 Warehouse → Inventory

**Cardinality:** 1:N

Una bodega puede contener múltiples productos mediante registros de inventario.

```text
Warehouse 1 ───── N Inventory
```

Cada registro de `Inventory` pertenece a una única bodega.

En conjunto con la relación `Product → Inventory`, `Inventory` representa la relación entre productos y bodegas.

```text
Product
    │
    └── Inventory ─── Warehouse
```

---

### 3.9 Inventory → InventoryMovement

**Cardinality:** 1:N

Un registro de inventario puede tener múltiples movimientos a lo largo de su ciclo de vida.

```text
Inventory 1 ───── N InventoryMovement
```

Los movimientos representan los cambios efectivos realizados sobre las existencias.

Ejemplo:

```text
Inventory
   │
   ├── +100 PURCHASE_RECEIPT
   ├── -20 TRANSFER_OUT
   ├── +50 PURCHASE_RECEIPT
   └── -3 STOCK_ADJUSTMENT
```

---

### 3.10 Inventory → InventoryAdjustment

**Cardinality:** 1:N

Un registro de inventario puede tener múltiples ajustes a lo largo del tiempo.

```text
Inventory 1 ───── N InventoryAdjustment
```

Un ajuste representa una solicitud o proceso de corrección de la cantidad registrada en el inventario.

Un ajuste aprobado genera el movimiento de inventario correspondiente.

```text
InventoryAdjustment
        │
        │ APPROVED
        ▼
InventoryMovement
        │
        ▼
Inventory
```

---

### 3.11 User → InventoryAdjustment

**Cardinality:** 1:N

Un usuario puede crear múltiples solicitudes de ajuste.

```text
User 1 ───── N InventoryAdjustment
```

El usuario que solicita el ajuste queda registrado como responsable de la solicitud.

Un ajuste también puede registrar al usuario que lo aprueba cuando la operación requiere aprobación.

---

### 3.12 Warehouse → InventoryTransfer

Una bodega puede participar en múltiples transferencias como origen.

```text
Warehouse 1 ───── N InventoryTransfer
                  │
                  └── sourceWarehouse
```

Una bodega también puede participar en múltiples transferencias como destino.

```text
Warehouse 1 ───── N InventoryTransfer
                  │
                  └── destinationWarehouse
```

Por lo tanto, `InventoryTransfer` mantiene dos relaciones diferentes con `Warehouse`:

```text
Warehouse
   │
   ├── sourceWarehouse
   │
   └── destinationWarehouse
```

La bodega de origen y la bodega de destino deben ser diferentes.

---

### 3.13 Product → InventoryTransfer

**Cardinality:** 1:N

Un producto puede participar en múltiples transferencias.

```text
Product 1 ───── N InventoryTransfer
```

Cada transferencia corresponde a un producto y una cantidad determinada.

---

### 3.14 User → InventoryTransfer

Un usuario puede crear múltiples transferencias.

```text
User 1 ───── N InventoryTransfer
```

La transferencia registra quién realizó la operación de salida.

También puede registrar el usuario que realizó la recepción.

```text
InventoryTransfer
├── createdBy
└── receivedBy
```

---

### 3.15 Supplier → PurchaseOrder

**Cardinality:** 1:N

Un proveedor puede tener múltiples órdenes de compra.

```text
Supplier 1 ───── N PurchaseOrder
```

Cada orden de compra pertenece a un único proveedor.

---

### 3.16 Branch → PurchaseOrder

**Cardinality:** 1:N

Una sucursal puede tener múltiples órdenes de compra destinadas a sus operaciones.

```text
Branch 1 ───── N PurchaseOrder
```

Cada orden de compra tiene una sucursal de destino.

La sucursal determina dónde se recibirá la mercancía.

---

### 3.17 PurchaseOrder → PurchaseOrderItem

**Cardinality:** 1:N

Una orden de compra puede contener múltiples líneas de productos.

```text
PurchaseOrder 1 ───── N PurchaseOrderItem
```

Cada línea pertenece exclusivamente a una orden de compra.

```text
PurchaseOrder
├── Item → Product A × 100
├── Item → Product B × 50
└── Item → Product C × 20
```

---

### 3.18 Product → PurchaseOrderItem

**Cardinality:** 1:N

Un producto puede aparecer en múltiples líneas de diferentes órdenes de compra.

```text
Product 1 ───── N PurchaseOrderItem
```

Esto permite que un mismo producto sea comprado múltiples veces.

---

### 3.19 Warehouse → PurchaseOrder

**Cardinality:** 1:N

Una bodega puede ser el destino de múltiples órdenes de compra.

```text
Warehouse 1 ───── N PurchaseOrder
```

La bodega de destino determina dónde se incorporará al inventario la mercancía recibida.

La orden de compra puede utilizar la bodega predeterminada de la sucursal como destino por defecto, pero debe permitir seleccionar otra bodega autorizada de la misma sucursal.

---

### 3.20 Inventory → Alert

**Cardinality:** 1:N

Un registro de inventario puede generar múltiples alertas durante su ciclo de vida.

```text
Inventory 1 ───── N Alert
```

Por ejemplo, un producto puede alcanzar varias veces el nivel mínimo:

```text
Stock
100 → 15  → alerta
50  → 18  → alerta
80  → 19  → alerta
```

Las alertas permiten conservar el historial de situaciones que requieren atención.

---

### 3.21 User → AuditLog

**Cardinality:** 1:N

Un usuario puede generar múltiples registros de auditoría.

```text
User 1 ───── N AuditLog
```

Cada registro identifica al usuario responsable de la acción cuando esta se realiza dentro de un contexto autenticado.

---

### 3.22 Entity → AuditLog

`AuditLog` mantiene una relación lógica con las entidades sobre las cuales se realizan acciones auditables.

Una auditoría puede registrar acciones sobre diferentes tipos de entidades:

```text
AuditLog
├── entityType
└── entityId
```

Ejemplos:

```text
InventoryAdjustment #123
PurchaseOrder #45
InventoryTransfer #87
Product #10
User #5
```

Por esta razón, esta relación es polimórfica a nivel conceptual y no representa una relación tradicional directa entre `AuditLog` y una única entidad.

---
### 3.23 Relationship Summary

Las principales relaciones del dominio pueden resumirse de la siguiente manera:

```text
Company
│
├── 1:N ── User
│            │
│            └── N:1 ── Role
│
└── 1:N ── Branch
              │
              └── 1:N ── Warehouse
                            │
                            └── 1:N ── Inventory
                                          │
                                          ├── N:1 ── Product
                                          │              │
                                          │              └── N:1 ── Category
                                          │
                                          ├── 1:N ── InventoryMovement
                                          ├── 1:N ── InventoryAdjustment
                                          └── 1:N ── Alert


Supplier
   │
   └── 1:N ── PurchaseOrder
                   │
                   ├── N:1 ── Branch
                   ├── N:1 ── Warehouse
                   │
                   └── 1:N ── PurchaseOrderItem
                                    │
                                    └── N:1 ── Product


InventoryTransfer
   │
   ├── N:1 ── source Warehouse
   ├── N:1 ── destination Warehouse
   ├── N:1 ── Product
   └── N:1 ── User


AuditLog
   │
   ├── N:1 ── User
   └── N:1 ── Auditable Entity
```
## 4. Aggregates

Los agregados representan conjuntos de entidades que deben mantenerse consistentes dentro de una operación de negocio.

Cada agregado posee un **Aggregate Root**, responsable de controlar las operaciones que modifican su estado y garantizar el cumplimiento de las reglas de negocio.

Las entidades pertenecientes a un agregado no deberían ser modificadas directamente desde otros agregados. Las operaciones deben realizarse a través de su Aggregate Root o mediante operaciones de dominio claramente definidas.

### 4.1 Organization Aggregate

**Aggregate Root:** `Company`

**Entities:**

* Company
* Branch
* Warehouse

```text
Company
   │
   └── Branch
         │
         └── Warehouse
```

**Responsibility:**

Gestionar la estructura organizacional y física donde opera StockFlow.

**Business rules:**

* Una empresa puede tener múltiples sucursales.
* Una sucursal puede tener múltiples bodegas.
* Una sucursal debe tener exactamente una bodega predeterminada.
* Una bodega pertenece exclusivamente a una sucursal.
* Una bodega no puede pertenecer a múltiples sucursales.

**Operations:**

* CreateBranch
* UpdateBranch
* CreateWarehouse
* UpdateWarehouse
* SetDefaultWarehouse
* DeactivateWarehouse

---

### 4.2 Catalog Aggregate

**Aggregate Root:** `Product`

**Entities:**

* Product
* Category

```text
Product
   │
   └── Category
```

**Responsibility:**

Gestionar los productos disponibles dentro del catálogo de StockFlow.

**Business rules:**

* Cada producto debe tener un SKU único.
* Un producto debe pertenecer a una categoría.
* Un producto puede estar activo o inactivo.
* Un producto inactivo no puede utilizarse en nuevas operaciones que requieran productos activos.
* Los productos con historial de operaciones no deben eliminarse físicamente.

**Operations:**

* CreateProduct
* UpdateProduct
* ActivateProduct
* DeactivateProduct

---

### 4.3 Inventory Aggregate

**Aggregate Root:** `Inventory`

**Entities:**

* Inventory
* InventoryMovement

```text
Inventory
   │
   └── InventoryMovement
```

**Responsibility:**

Gestionar las existencias actuales de un producto dentro de una bodega y registrar los movimientos que modifican dichas existencias.

**Business rules:**

* Un inventario representa un producto dentro de una bodega específica.
* No puede existir más de un inventario para la misma combinación de producto y bodega.
* El stock no puede ser negativo.
* Todo cambio efectivo de stock debe generar un `InventoryMovement`.
* Los movimientos deben registrar la cantidad, tipo de operación, usuario, fecha y observación cuando corresponda.
* Las operaciones de inventario deben ejecutarse de manera consistente para evitar cantidades incorrectas ante operaciones concurrentes.

**Operations:**

* ReceiveStock
* DecreaseStock
* IncreaseStock
* RegisterMovement

El `Inventory` es el principal responsable de proteger la cantidad disponible.

---

### 4.4 Inventory Adjustment Aggregate

**Aggregate Root:** `InventoryAdjustment`

**Entities:**

* InventoryAdjustment

Este agregado representa el proceso de solicitud y aprobación de ajustes de inventario.

```text
InventoryAdjustment
```

El `Inventory` pertenece a un agregado diferente y no debe ser modificado directamente por otros objetos.

Cuando un ajuste es aprobado, el sistema debe ejecutar una operación sobre el agregado de inventario que genere el movimiento correspondiente.

**Responsibility:**

Gestionar el proceso de corrección de diferencias entre el inventario físico y el inventario registrado.

**Business rules:**

* Todo ajuste debe tener una observación.
* El ajuste puede ser positivo o negativo.
* Un operador debe solicitar aprobación.
* Un gerente o administrador puede aprobar o rechazar un ajuste.
* Un gerente o administrador puede realizar ajustes directamente.
* Un ajuste aprobado solamente puede aplicarse una vez.
* Un ajuste rechazado no modifica el inventario.
* Un ajuste aprobado debe generar un `InventoryMovement`.

**States:**

```text
PENDING
   │
   ├── APPROVED
   │
   └── REJECTED
```

**Operations:**

* RequestAdjustment
* ApproveAdjustment
* RejectAdjustment
* ApplyAdjustment

---

### 4.5 Inventory Transfer Aggregate

**Aggregate Root:** `InventoryTransfer`

**Entities:**

* InventoryTransfer

```text
InventoryTransfer
   │
   ├── Source Warehouse
   └── Destination Warehouse
```

**Responsibility:**

Gestionar el proceso de transferencia de productos entre dos bodegas.

La transferencia coordina operaciones sobre los inventarios de las bodegas de origen y destino, pero dichos inventarios pertenecen al `Inventory Aggregate`.

**Business rules:**

* La bodega de origen y la bodega de destino deben ser diferentes.
* Ambas bodegas deben estar activas.
* El producto debe existir y estar activo.
* La cantidad debe ser mayor que cero.
* Debe existir stock suficiente en la bodega de origen.
* Toda transferencia debe tener una observación.
* La salida debe descontar el inventario de origen.
* La recepción debe incrementar el inventario de destino.
* La cantidad recibida no puede superar la cantidad enviada.
* Una transferencia debe poder registrar diferencias entre la cantidad enviada y recibida.

**States:**

```text
CREATED
   │
   ▼
SENT
   │
   ├── RECEIVED
   │
   └── PARTIALLY_RECEIVED
```

**Operations:**

* CreateTransfer
* SendTransfer
* ReceiveTransfer
* PartiallyReceiveTransfer

---

### 4.6 Purchasing Aggregate

**Aggregate Root:** `PurchaseOrder`

**Entities:**

* PurchaseOrder
* PurchaseOrderItem

```text
PurchaseOrder
   │
   └── PurchaseOrderItem
```

**Responsibility:**

Gestionar las órdenes de compra y sus productos asociados hasta completar su recepción.

**Business rules:**

* Una orden debe estar asociada a un proveedor.
* Una orden debe tener una sucursal y una bodega de destino.
* Una orden debe contener al menos un producto.
* Cada producto debe aparecer como una línea de la orden.
* La cantidad solicitada debe ser mayor que cero.
* Una orden creada no modifica el inventario.
* La recepción de mercancía modifica el inventario.
* Una orden puede recibirse parcialmente.
* La cantidad recibida no puede superar la cantidad solicitada.
* Una orden completamente recibida no puede recibir cantidades adicionales.
* Una orden cancelada no puede recibir mercancía.

**States:**

```text
DRAFT
   │
   ▼
ORDERED
   │
   ├── PARTIALLY_RECEIVED
   │        │
   │        ▼
   │     RECEIVED
   │
   └── RECEIVED

ORDERED
   │
   ▼
CANCELLED
```

**Operations:**

* CreatePurchaseOrder
* AddItem
* RemoveItem
* SubmitPurchaseOrder
* ReceivePurchaseOrder
* PartiallyReceivePurchaseOrder
* CancelPurchaseOrder

---

### 4.7 Supporting Entities

Algunas entidades no forman parte directamente de los agregados principales porque tienen responsabilidades transversales o de soporte.

#### Identity & Access

```text
User
Role
UserRole
```

Responsable de la identidad y autorización de los usuarios.

#### Alert

```text
Alert
```

Representa situaciones del sistema que requieren atención y puede ser generada a partir de diferentes operaciones o condiciones del dominio.

#### Audit

```text
AuditLog
```

Registra acciones relevantes realizadas por los usuarios y mantiene la trazabilidad de las operaciones.

Estas entidades pueden interactuar con los agregados principales sin convertirse en parte de ellos.

---

### 4.8 Aggregate Interaction

Los agregados colaboran entre sí sin compartir directamente sus estructuras internas.

Un ejemplo de recepción de una orden de compra sería:

```text
PurchaseOrder
      │
      │ Receive
      ▼
PurchaseOrder Aggregate
      │
      │ solicita modificación de stock
      ▼
Inventory Aggregate
      │
      ├── IncreaseStock()
      │
      └── InventoryMovement
```

Para una transferencia:

```text
InventoryTransfer
       │
       ├── DecreaseStock()
       │       │
       │       └── Source Inventory
       │
       └── IncreaseStock()
               │
               └── Destination Inventory
```

El objetivo es evitar que un módulo modifique directamente el estado interno de otro agregado.

---

### 4.9 Aggregate Rules

Las siguientes reglas generales aplican a los agregados:

* Cada agregado tiene un único Aggregate Root.
* Las operaciones externas deben ingresar al agregado mediante su Root.
* Los objetos internos del agregado no deben ser modificados directamente desde otros agregados.
* Las reglas de consistencia deben protegerse dentro del agregado correspondiente.
* Las operaciones que involucren múltiples agregados deben coordinarse mediante servicios de aplicación o mecanismos de dominio apropiados.
* Las transacciones de base de datos se utilizarán cuando una operación requiera garantizar consistencia entre múltiples cambios relacionados.
## 5. Entity States

Los estados representan las diferentes etapas del ciclo de vida de las entidades que requieren control de transición.

Las transiciones de estado deben cumplir las reglas de negocio definidas en el dominio. Una entidad no puede pasar arbitrariamente de un estado a otro.

---

### 5.1 Company

**States:**

```text
ACTIVE
INACTIVE
```

**Transitions:**

```text
ACTIVE
   │
   ▼
INACTIVE

INACTIVE
   │
   ▼
ACTIVE
```

Una empresa inactiva no puede crear nuevas operaciones dentro del sistema.

---

### 5.2 User

**States:**

```text
ACTIVE
INACTIVE
```

**Transitions:**

```text
ACTIVE
   │
   ▼
INACTIVE

INACTIVE
   │
   ▼
ACTIVE
```

Un usuario inactivo no puede autenticarse ni ejecutar operaciones en el sistema.

La desactivación de un usuario no elimina su historial de operaciones ni sus registros de auditoría.

---

### 5.3 Role

**States:**

```text
ACTIVE
INACTIVE
```

Un rol inactivo no puede ser asignado a nuevos usuarios.

Las asignaciones existentes deben conservar su historial.

---

### 5.4 UserRole

**States:**

```text
ACTIVE
INACTIVE
```

Una asignación de rol representa la relación entre un usuario y un rol.

```text
User
  │
  └── UserRole
          │
          └── Role
```

Una asignación puede desactivarse sin eliminar el registro histórico.

---

### 5.5 Branch

**States:**

```text
ACTIVE
INACTIVE
```

Una sucursal inactiva no puede recibir nuevas operaciones de inventario.

La desactivación no elimina sus bodegas, productos, movimientos ni historial.

---

### 5.6 Warehouse

**States:**

```text
ACTIVE
INACTIVE
```

Una bodega activa puede recibir y enviar inventario.

Una bodega inactiva no puede participar en nuevas operaciones de inventario.

No se debe permitir desactivar una bodega si esto deja a la sucursal sin una bodega predeterminada activa.

Una bodega inactiva conserva su inventario e historial para fines de consulta y auditoría.

---

### 5.7 Product

**States:**

```text
ACTIVE
INACTIVE
```

Un producto activo puede utilizarse en nuevas operaciones.

Un producto inactivo:

* No puede agregarse a nuevas órdenes de compra.
* No puede utilizarse en nuevas transferencias.
* No puede utilizarse en nuevos movimientos manuales.
* Conserva su inventario e historial.

Un producto puede ser desactivado aunque tenga historial de movimientos.

---

### 5.8 Category

**States:**

```text
ACTIVE
INACTIVE
```

Una categoría inactiva no puede utilizarse para nuevos productos.

No debe eliminarse físicamente si tiene productos asociados.

---

### 5.9 Inventory

`Inventory` representa el estado actual de las existencias y no necesita un ciclo de estados tradicional.

Su estado está determinado principalmente por su cantidad disponible.

```text
Stock > Minimum
        │
        ▼
     NORMAL


Stock <= Minimum
        │
        ▼
   LOW_STOCK


Stock = 0
        │
        ▼
     OUT_OF_STOCK
```

Estos valores representan **estados derivados**, no necesariamente un campo persistido `status`.

El sistema debe garantizar:

```text
stock >= 0
```

---

### 5.10 InventoryMovement

Los movimientos de inventario son registros históricos e inmutables.

**Lifecycle:**

```text
CREATED
   │
   ▼
FINALIZED
```

Una vez registrado un movimiento que representa un cambio efectivo de inventario, no debe modificarse ni eliminarse mediante las operaciones normales del sistema.

Si ocurre un error, debe realizarse una nueva operación de corrección en lugar de modificar el movimiento histórico.

**Movement Types:**

```text
PURCHASE_RECEIPT
TRANSFER_OUT
TRANSFER_IN
STOCK_ADJUSTMENT
STOCK_OUT
```

Los tipos representan la causa del movimiento, no estados.

---

### 5.11 InventoryAdjustment

**States:**

```text
PENDING
   │
   ├── APPROVED
   │
   └── REJECTED
```

**Operator flow:**

```text
Operator
   │
   ▼
PENDING
   │
   ▼
Manager / Administrator
   │
   ├── APPROVE
   │      │
   │      ▼
   │   APPROVED
   │      │
   │      ▼
   │ Inventory updated
   │
   └── REJECT
          │
          ▼
       REJECTED
```

Los administradores y gerentes pueden realizar ajustes directamente sin pasar por `PENDING`, siempre que proporcionen una observación.

Una vez aprobado o rechazado, el ajuste no puede volver a `PENDING`.

---

### 5.12 InventoryTransfer

**States:**

```text
CREATED
   │
   ▼
SENT
   │
   ├── RECEIVED
   │
   └── PARTIALLY_RECEIVED
              │
              ▼
           RECEIVED
```

#### CREATED

La transferencia ha sido creada pero todavía no se ha realizado la salida.

El inventario de origen no ha sido modificado.

#### SENT

La mercancía fue registrada como salida de la bodega de origen.

```text
Source Inventory
       │
       ▼
      -20
```

La transferencia no se considera "en tránsito". El sistema únicamente registra que fue enviada.

#### PARTIALLY_RECEIVED

La bodega destino recibió una cantidad inferior a la enviada.

Ejemplo:

```text
Sent:     20
Received: 18
Difference: 2
```

La cantidad recibida se agrega al inventario de destino.

#### RECEIVED

La recepción fue completada.

Una vez recibida completamente, la transferencia no puede recibir cantidades adicionales.

---

### 5.13 PurchaseOrder

**States:**

```text
DRAFT
   │
   ▼
ORDERED
   │
   ├── PARTIALLY_RECEIVED
   │        │
   │        ▼
   │     RECEIVED
   │
   └── RECEIVED

ORDERED
   │
   ▼
CANCELLED
```

#### DRAFT

La orden puede ser creada y modificada.

Los productos y cantidades pueden agregarse o eliminarse.

No afecta el inventario.

#### ORDERED

La orden ha sido enviada al proveedor.

Los productos y cantidades principales ya no deberían modificarse directamente.

No afecta el inventario.

#### PARTIALLY_RECEIVED

Se ha recibido parte de la mercancía.

Ejemplo:

```text
Ordered: 100
Received: 60
Pending: 40
```

La cantidad recibida incrementa el inventario.

#### RECEIVED

Toda la mercancía solicitada fue recibida.

```text
Ordered: 100
Received: 100
Pending: 0
```

No se permiten nuevas recepciones.

#### CANCELLED

La orden fue cancelada antes de completar su recepción.

Una orden cancelada no puede recibir mercancía.

---

### 5.14 PurchaseOrderItem

El estado de `PurchaseOrderItem` se deriva principalmente de sus cantidades.

```text
orderedQuantity = 100
receivedQuantity = 0
```

```text
PENDING
```

Cuando:

```text
0 < receivedQuantity < orderedQuantity
```

el item se encuentra:

```text
PARTIALLY_RECEIVED
```

Cuando:

```text
receivedQuantity = orderedQuantity
```

el item se encuentra:

```text
RECEIVED
```

Estos estados pueden calcularse a partir de las cantidades en lugar de almacenarse directamente.

---

### 5.15 Supplier

**States:**

```text
ACTIVE
INACTIVE
```

Un proveedor inactivo no puede utilizarse en nuevas órdenes de compra.

Las órdenes históricas asociadas al proveedor deben conservarse.

---

### 5.16 Alert

**States:**

```text
ACTIVE
RESOLVED
```

Una alerta permanece activa mientras la condición que la originó requiere atención.

Cuando la condición deja de aplicar o la alerta es atendida, puede pasar a `RESOLVED`.

Ejemplo:

```text
Stock <= Minimum
       │
       ▼
    ACTIVE
       │
       │ stock replenished
       ▼
   RESOLVED
```

---

### 5.17 AuditLog

`AuditLog` no tiene un ciclo de estados tradicional.

Los registros son creados y posteriormente permanecen inmutables.

```text
CREATED
   │
   ▼
IMMUTABLE
```

No se permite modificar ni eliminar un registro de auditoría mediante las operaciones normales del sistema.

---

### 5.18 State Transition Principles

Las siguientes reglas aplican de forma general:

1. Las transiciones deben ser explícitas y controladas.
2. Una entidad no puede saltarse estados intermedios cuando el flujo de negocio no lo permita.
3. Las operaciones que cambian estados deben validar permisos.
4. Las transiciones relevantes deben quedar registradas en `AuditLog`.
5. Los cambios que afecten inventario deben generar los correspondientes `InventoryMovement`.
6. Los registros históricos no deben modificarse para corregir errores; deben generarse nuevas operaciones de corrección.
7. Las entidades desactivadas conservan su información histórica.
8. Las eliminaciones físicas deben evitarse para entidades que participen en operaciones históricas.

---

### 5.19 State Transition Summary

```text
Company
ACTIVE ↔ INACTIVE

User
ACTIVE ↔ INACTIVE

Role
ACTIVE ↔ INACTIVE

UserRole
ACTIVE ↔ INACTIVE

Branch
ACTIVE ↔ INACTIVE

Warehouse
ACTIVE ↔ INACTIVE

Product
ACTIVE ↔ INACTIVE

Category
ACTIVE ↔ INACTIVE

Supplier
ACTIVE ↔ INACTIVE

Inventory
NORMAL / LOW_STOCK / OUT_OF_STOCK
(derived)

InventoryMovement
CREATED → FINALIZED

InventoryAdjustment
PENDING → APPROVED
PENDING → REJECTED

InventoryTransfer
CREATED → SENT
SENT → PARTIALLY_RECEIVED
SENT → RECEIVED
PARTIALLY_RECEIVED → RECEIVED

PurchaseOrder
DRAFT → ORDERED
ORDERED → PARTIALLY_RECEIVED
ORDERED → RECEIVED
ORDERED → CANCELLED
PARTIALLY_RECEIVED → RECEIVED

PurchaseOrderItem
PENDING → PARTIALLY_RECEIVED → RECEIVED

Alert
ACTIVE → RESOLVED

AuditLog
CREATED → IMMUTABLE
```
## 6. Business Rules

Las reglas de negocio definen las condiciones que deben cumplirse para mantener la consistencia y comportamiento correcto del dominio de StockFlow.

Estas reglas pertenecen al dominio y no deben depender exclusivamente de la interfaz de usuario o de las validaciones HTTP. Deben ser protegidas por la capa de aplicación y dominio.

---

### 6.1 Organization Rules

#### BR-ORG-001 — Company

Una `Company` puede tener múltiples sucursales.

Una sucursal pertenece exclusivamente a una empresa.

Una empresa inactiva no puede realizar nuevas operaciones de negocio.

---

#### BR-ORG-002 — Branch

Una `Branch` pertenece exclusivamente a una `Company`.

Una sucursal puede tener múltiples bodegas.

Una sucursal debe tener exactamente una bodega marcada como predeterminada.

No puede existir más de una bodega predeterminada activa dentro de una misma sucursal.

Una sucursal inactiva no puede participar en nuevas operaciones de inventario o compras.

---

#### BR-ORG-003 — Warehouse

Una `Warehouse` pertenece exclusivamente a una `Branch`.

Una bodega debe pertenecer a una sucursal activa para poder utilizarse en nuevas operaciones.

Una bodega inactiva no puede:

* Recibir inventario.
* Enviar inventario.
* Participar en transferencias.
* Ser seleccionada como destino de una orden de compra.

Una bodega con historial de operaciones no debe eliminarse físicamente.

---

### 6.2 Identity and Access Rules

#### BR-AUTH-001 — User

Un `User` pertenece exclusivamente a una `Company`.

Un usuario inactivo no puede autenticarse ni ejecutar operaciones.

La desactivación de un usuario no elimina sus registros históricos.

---

#### BR-AUTH-002 — UserRole

Un usuario puede tener uno o varios roles mediante `UserRole`.

No puede existir la misma combinación activa de:

```text
User + Role
```

más de una vez.

Una asignación de rol puede desactivarse sin eliminar el registro histórico.

---

#### BR-AUTH-003 — Role

Un rol inactivo no puede asignarse a nuevos usuarios.

Los roles existentes deben mantenerse para conservar la trazabilidad histórica.

---

#### BR-AUTH-004 — Access Scope

El usuario solamente puede operar sobre los recursos para los cuales tiene autorización.

Como mínimo:

```text
Administrator
→ Acceso global a la empresa.

Branch Manager
→ Acceso a su sucursal y sus bodegas.

Warehouse Operator
→ Acceso a las bodegas que tenga asignadas.

Buyer
→ Acceso a las operaciones de compras autorizadas.

Auditor
→ Acceso de lectura.
```

El alcance exacto de usuarios, sucursales y bodegas deberá definirse antes de implementar autorización avanzada.

---

### 6.3 Product Rules

#### BR-PROD-001 — SKU

Cada producto debe tener un `SKU` único dentro de la empresa.

No pueden existir dos productos activos con el mismo SKU.

---

#### BR-PROD-002 — Product Category

Cada producto debe pertenecer a una categoría válida.

Una categoría inactiva no puede asignarse a nuevos productos.

---

#### BR-PROD-003 — Product Status

Un producto inactivo no puede utilizarse en nuevas:

* Órdenes de compra.
* Transferencias.
* Ajustes.
* Operaciones de inventario.

El producto conserva su información histórica.

---

#### BR-PROD-004 — Product Deletion

Los productos que tengan historial de operaciones no deben eliminarse físicamente.

En su lugar deben desactivarse.

---

### 6.4 Inventory Rules

#### BR-INV-001 — Product and Warehouse Uniqueness

Solo puede existir un registro de `Inventory` para una combinación:

```text
Product + Warehouse
```

Ejemplo:

```text
Product X + Warehouse A
```

debe corresponder a un único registro de inventario.

---

#### BR-INV-002 — Non-Negative Stock

El inventario nunca puede ser negativo.

```text
currentStock >= 0
```

Una operación que produzca stock negativo debe ser rechazada.

---

#### BR-INV-003 — Positive Quantities

Las cantidades utilizadas en operaciones de inventario deben ser mayores que cero.

Las operaciones no deben recibir cantidades ambiguas como:

```text
0
-10
null
```

La dirección del movimiento determina si la cantidad incrementa o disminuye el inventario.

---

#### BR-INV-004 — Stock Increase

Toda operación que incremente el inventario debe generar un `InventoryMovement`.

Ejemplos:

```text
Purchase Receipt
Transfer In
Positive Adjustment
```

---

#### BR-INV-005 — Stock Decrease

Toda operación que disminuya el inventario debe generar un `InventoryMovement`.

Ejemplos:

```text
Stock Out
Transfer Out
Negative Adjustment
```

---

#### BR-INV-006 — Movement Immutability

Los `InventoryMovement` representan hechos históricos.

Una vez registrado un movimiento efectivo, no debe modificarse ni eliminarse mediante operaciones normales.

Los errores deben corregirse mediante nuevos movimientos.

---

#### BR-INV-007 — Observation

Las operaciones que modifiquen manualmente el inventario deben requerir una observación.

Como mínimo:

* Ajustes.
* Transferencias.

La observación debe explicar el motivo de la operación.

---

### 6.5 Inventory Adjustment Rules

#### BR-ADJ-001 — Adjustment Quantity

Un ajuste puede ser positivo o negativo.

Ejemplo:

```text
+10
-3
```

La cantidad no puede ser cero.

---

#### BR-ADJ-002 — Operator Approval

Cuando un operador solicita un ajuste:

```text
Operator
   ↓
Adjustment
   ↓
PENDING
```

El ajuste requiere aprobación de un:

```text
Manager
o
Administrator
```

---

#### BR-ADJ-003 — Manager and Administrator Adjustment

Un gerente o administrador puede realizar un ajuste directamente sin requerir aprobación adicional.

La operación debe incluir una observación.

---

#### BR-ADJ-004 — Approved Adjustment

Un ajuste aprobado debe modificar el inventario y generar un `InventoryMovement`.

```text
Adjustment APPROVED
        ↓
Inventory +/- quantity
        ↓
InventoryMovement
```

---

#### BR-ADJ-005 — Rejected Adjustment

Un ajuste rechazado no puede modificar el inventario.

---

#### BR-ADJ-006 — Adjustment Immutability

Una vez que un ajuste ha sido aprobado o rechazado, no puede volver a `PENDING`.

No se debe modificar un ajuste histórico para cambiar el resultado de la operación.

---

#### BR-ADJ-007 — Stock Validation

Un ajuste negativo no puede producir inventario negativo.

Ejemplo:

```text
Current stock: 5
Adjustment: -8
```

Debe rechazarse.

---

### 6.6 Inventory Transfer Rules

#### BR-TRANSFER-001 — Different Warehouses

La bodega de origen y la bodega de destino deben ser diferentes.

```text
sourceWarehouseId != destinationWarehouseId
```

---

#### BR-TRANSFER-002 — Active Warehouses

Las bodegas de origen y destino deben estar activas.

---

#### BR-TRANSFER-003 — Active Product

El producto transferido debe estar activo.

---

#### BR-TRANSFER-004 — Positive Quantity

La cantidad transferida debe ser mayor que cero.

---

#### BR-TRANSFER-005 — Observation Required

Toda transferencia debe contener una observación.

---

#### BR-TRANSFER-006 — Stock Availability

La bodega de origen debe disponer de suficiente stock.

Ejemplo:

```text
Available: 20
Transfer: 25
```

La operación debe ser rechazada.

---

#### BR-TRANSFER-007 — Send Transfer

Al registrar la salida de una transferencia:

```text
Source Inventory
       ↓
- quantity
```

Debe generarse un:

```text
TRANSFER_OUT
```

---

#### BR-TRANSFER-008 — Receive Transfer

Al recibir una transferencia:

```text
Destination Inventory
       ↓
+ quantity
```

Debe generarse un:

```text
TRANSFER_IN
```

---

#### BR-TRANSFER-009 — Partial Reception

La cantidad recibida puede ser menor que la cantidad enviada.

Ejemplo:

```text
Sent: 20
Received: 18
```

La transferencia queda en:

```text
PARTIALLY_RECEIVED
```

---

#### BR-TRANSFER-010 — Reception Limit

La cantidad total recibida nunca puede superar la cantidad enviada.

```text
receivedQuantity <= sentQuantity
```

---

#### BR-TRANSFER-011 — No In-Transit State

StockFlow no mantiene un estado físico de "en tránsito".

El sistema registra únicamente:

```text
Salida
Recepción
```

La mercancía física puede encontrarse en transporte, pero esa situación no forma parte del estado del inventario en el MVP.

---

### 6.7 Supplier Rules

#### BR-SUP-001 — Supplier Status

Un proveedor inactivo no puede utilizarse en nuevas órdenes de compra.

---

#### BR-SUP-002 — Supplier History

Un proveedor que tenga órdenes de compra históricas no debe eliminarse físicamente.

Debe desactivarse.

---

### 6.8 Purchase Order Rules

#### BR-PO-001 — Supplier Required

Toda orden de compra debe estar asociada a un proveedor activo.

---

#### BR-PO-002 — Destination Required

Toda orden de compra debe definir:

```text
Branch
Warehouse
```

como destino de la mercancía.

La bodega debe pertenecer a la sucursal seleccionada.

---

#### BR-PO-003 — At Least One Item

Una orden de compra debe contener al menos un `PurchaseOrderItem`.

---

#### BR-PO-004 — Valid Product

Cada producto incluido en una orden debe estar activo.

---

#### BR-PO-005 — Positive Ordered Quantity

La cantidad solicitada debe ser mayor que cero.

---

#### BR-PO-006 — Purchase Order Does Not Affect Stock

Crear o enviar una orden de compra no modifica el inventario.

```text
PurchaseOrder
      ↓
NO STOCK CHANGE
```

El inventario solamente se modifica cuando se registra una recepción.

---

#### BR-PO-007 — Partial Reception

Una orden puede recibirse parcialmente.

Ejemplo:

```text
Ordered: 100
Received: 60
Pending: 40
```

---

#### BR-PO-008 — Reception Limit

La cantidad recibida nunca puede superar la cantidad solicitada.

```text
receivedQuantity <= orderedQuantity
```

---

#### BR-PO-009 — Complete Reception

Una orden pasa a `RECEIVED` cuando todos sus productos han sido recibidos completamente.

---

#### BR-PO-010 — Cancelled Order

Una orden cancelada no puede recibir mercancía.

---

#### BR-PO-011 — Inventory Update on Reception

Cada recepción efectiva debe incrementar el inventario y generar un `InventoryMovement`.

```text
PurchaseOrder
      ↓
Receive
      ↓
Inventory + quantity
      ↓
PURCHASE_RECEIPT
```

---

### 6.9 Alert Rules

#### BR-ALERT-001 — Low Stock

Debe generarse una alerta cuando:

```text
currentStock <= minimumStock
```

---

#### BR-ALERT-002 — Alert Scope

Una alerta de stock bajo pertenece a una combinación específica de:

```text
Product + Warehouse
```

---

#### BR-ALERT-003 — Alert Resolution

Una alerta puede marcarse como `RESOLVED` cuando la condición que la originó deja de cumplirse.

---

#### BR-ALERT-004 — Duplicate Active Alerts

No deben existir múltiples alertas activas simultáneas para la misma condición:

```text
Product + Warehouse + Alert Type
```

---

### 6.10 Audit Rules

#### BR-AUDIT-001 — Critical Operations

Las operaciones críticas deben generar registros de auditoría.

Como mínimo:

* Creación y modificación de productos.
* Desactivación de entidades.
* Ajustes de inventario.
* Aprobación y rechazo de ajustes.
* Transferencias.
* Recepción de transferencias.
* Creación y cancelación de órdenes de compra.
* Recepción de órdenes de compra.
* Cambios relevantes de permisos o roles.

---

#### BR-AUDIT-002 — Actor

Cada registro de auditoría debe identificar al usuario responsable cuando la operación sea realizada dentro de una sesión autenticada.

---

#### BR-AUDIT-003 — Action

Cada registro debe indicar claramente la acción realizada.

Ejemplos:

```text
CREATE_PRODUCT
UPDATE_PRODUCT
APPROVE_ADJUSTMENT
REJECT_ADJUSTMENT
SEND_TRANSFER
RECEIVE_TRANSFER
CREATE_PURCHASE_ORDER
RECEIVE_PURCHASE_ORDER
```

---

#### BR-AUDIT-004 — Entity

Cada auditoría debe identificar la entidad afectada y su identificador.

```text
entityType
entityId
```

---

#### BR-AUDIT-005 — State Changes

Cuando sea relevante, la auditoría debe conservar el estado anterior y posterior de la entidad.

```text
before
after
```

---

#### BR-AUDIT-006 — Immutability

Los registros de auditoría son inmutables.

No pueden modificarse ni eliminarse mediante las operaciones normales del sistema.

---

### 6.11 Concurrency and Consistency Rules

#### BR-CON-001 — Concurrent Stock Operations

Las operaciones que modifiquen inventario deben ejecutarse de forma segura ante solicitudes concurrentes.

Dos operaciones simultáneas no deben permitir que el inventario termine en un estado inconsistente.

---

#### BR-CON-002 — Atomic Inventory Operations

Una operación de inventario debe ser atómica.

Por ejemplo, una transferencia debe garantizar la consistencia entre:

```text
Source Inventory
InventoryMovement OUT
Transfer

Destination Inventory
InventoryMovement IN
```

Si la operación falla antes de completarse, no debe quedar un estado parcialmente aplicado.

---

#### BR-CON-003 — Transaction Boundaries

Las operaciones que modifiquen múltiples registros relacionados deben ejecutarse dentro de una transacción de base de datos cuando sea necesario para garantizar consistencia.

---

### 6.12 General Domain Rules

#### BR-GEN-001 — Historical Data

Las entidades que participen en operaciones históricas no deben eliminarse físicamente cuando esto comprometa la trazabilidad.

Se debe preferir la desactivación.

---

#### BR-GEN-002 — Authorization

La autorización debe validarse antes de ejecutar operaciones de negocio.

Tener acceso a un endpoint no implica automáticamente tener permiso para ejecutar la operación.

---

#### BR-GEN-003 — Domain Validation

Las reglas de negocio deben mantenerse independientemente de la interfaz utilizada.

Una operación debe cumplir las mismas reglas si es ejecutada desde:

```text
Web
API
CLI
Job
Future Integration
```

---

#### BR-GEN-004 — Auditability

Las operaciones relevantes deben poder reconstruirse mediante la combinación de:

```text
Domain Entity
+
InventoryMovement
+
AuditLog
```

El objetivo es poder responder:

* Qué ocurrió.
* Cuándo ocurrió.
* Quién lo realizó.
* Sobre qué recurso.
* Qué cantidad fue afectada.
* Cuál era el estado anterior.
* Cuál fue el nuevo estado.
## 7. Domain Operations

Las operaciones de dominio representan las acciones principales que pueden ejecutarse sobre las entidades y agregados de StockFlow.

Cada operación debe respetar las reglas de negocio definidas en la sección `Business Rules`.

Las operaciones de dominio no representan directamente endpoints HTTP. Una misma operación puede ser ejecutada posteriormente desde una API, un proceso automático, un job o una integración externa.

---

### 7.1 Organization Operations

#### 7.1.1 Create Branch

Crea una nueva sucursal dentro de una empresa.

**Input:**

* Company
* Branch information

**Rules:**

* La empresa debe estar activa.
* El nombre de la sucursal debe cumplir las restricciones de unicidad definidas.
* La sucursal debe comenzar en estado `ACTIVE`.

---

#### 7.1.2 Update Branch

Actualiza la información de una sucursal.

No debe modificar su identidad ni eliminar su historial operativo.

---

#### 7.1.3 Deactivate Branch

Desactiva una sucursal.

Una sucursal inactiva no puede participar en nuevas operaciones de negocio.

---

#### 7.1.4 Create Warehouse

Crea una nueva bodega dentro de una sucursal.

**Rules:**

* La sucursal debe estar activa.
* La bodega debe pertenecer exclusivamente a esa sucursal.
* Si es la primera bodega de la sucursal, puede establecerse automáticamente como predeterminada.

---

#### 7.1.5 Set Default Warehouse

Establece una bodega como predeterminada para una sucursal.

**Rules:**

* La bodega debe pertenecer a la sucursal.
* La bodega debe estar activa.
* Una sucursal solamente puede tener una bodega predeterminada.

---

#### 7.1.6 Deactivate Warehouse

Desactiva una bodega.

**Rules:**

* No debe dejar a la sucursal sin una bodega predeterminada activa.
* La bodega conserva su historial.
* No puede participar en nuevas operaciones.

---

### 7.2 Identity and Access Operations

#### 7.2.1 Create User

Crea un usuario dentro de una empresa.

**Rules:**

* La empresa debe estar activa.
* El usuario comienza en estado `ACTIVE` o según la política de activación definida.
* Debe existir la información mínima requerida para autenticación.

---

#### 7.2.2 Assign Role

Asigna un rol a un usuario.

```text
User
   │
   ▼
UserRole
   │
   ▼
Role
```

**Rules:**

* El usuario debe estar activo.
* El rol debe estar activo.
* No debe existir una asignación activa duplicada.

---

#### 7.2.3 Revoke Role

Desactiva una asignación `UserRole`.

La asignación histórica no debe eliminarse físicamente.

---

#### 7.2.4 Deactivate User

Desactiva un usuario.

El usuario deja de poder ejecutar operaciones, pero sus operaciones históricas permanecen asociadas a él.

---

### 7.3 Product Operations

#### 7.3.1 Create Product

Crea un producto dentro del catálogo.

**Input:**

* SKU
* Name
* Category
* Unit of measure
* Minimum stock configuration
* Maximum stock configuration

**Rules:**

* El SKU debe ser único.
* La categoría debe estar activa.
* El producto comienza activo.

---

#### 7.3.2 Update Product

Actualiza la información editable de un producto.

Los cambios deben respetar las reglas de integridad del catálogo.

---

#### 7.3.3 Activate Product

Reactiva un producto previamente desactivado.

---

#### 7.3.4 Deactivate Product

Desactiva un producto.

Un producto desactivado conserva su inventario e historial.

---

### 7.4 Inventory Operations

El inventario es uno de los principales núcleos del dominio.

Las operaciones de inventario deben garantizar que el stock y sus movimientos permanezcan consistentes.

---

#### 7.4.1 Increase Stock

Incrementa la cantidad disponible de un producto en una bodega.

```text
Current Stock
      +
 Quantity
      ↓
New Stock
```

**Rules:**

* El producto debe estar activo.
* La bodega debe estar activa.
* La cantidad debe ser mayor que cero.
* Debe generarse un `InventoryMovement`.

---

#### 7.4.2 Decrease Stock

Disminuye la cantidad disponible.

```text
Current Stock
      -
 Quantity
      ↓
New Stock
```

**Rules:**

* El producto debe estar activo.
* La bodega debe estar activa.
* Debe existir stock suficiente.
* La cantidad debe ser mayor que cero.
* Debe generarse un `InventoryMovement`.

---

#### 7.4.3 Register Inventory Movement

Registra un movimiento efectivo de inventario.

Un movimiento debe contener como mínimo:

* Inventory.
* Movement type.
* Quantity.
* User.
* Date/time.
* Reference/origin.
* Observation cuando corresponda.

Los movimientos son históricos e inmutables.

---

#### 7.4.4 Get Inventory

Consulta el inventario de un producto dentro de una bodega.

Puede utilizarse para:

* Consultar stock disponible.
* Validar disponibilidad.
* Mostrar información en reportes.
* Consultar niveles mínimos y máximos.

---

#### 7.4.5 Get Consolidated Stock

Obtiene la cantidad total disponible de un producto considerando múltiples bodegas.

Ejemplo:

```text
Warehouse A → 100
Warehouse B → 50
Warehouse C → 30
----------------
Total       → 180
```

Esta operación es de consulta y no modifica el dominio.

---

### 7.5 Inventory Adjustment Operations

#### 7.5.1 Request Adjustment

Permite a un operador solicitar un ajuste de inventario.

**Input:**

* Product
* Warehouse
* Quantity
* Direction
* Observation
* User

El ajuste comienza en:

```text
PENDING
```

---

#### 7.5.2 Approve Adjustment

Permite a un gerente o administrador aprobar un ajuste solicitado.

```text
PENDING
   ↓
APPROVED
   ↓
Inventory updated
```

**Rules:**

* El usuario debe tener autorización.
* El ajuste debe estar en `PENDING`.
* Un ajuste negativo no puede producir stock negativo.
* Debe generarse un `InventoryMovement`.
* La operación debe quedar auditada.

---

#### 7.5.3 Reject Adjustment

Permite rechazar un ajuste pendiente.

```text
PENDING
   ↓
REJECTED
```

No modifica el inventario.

---

#### 7.5.4 Apply Direct Adjustment

Permite a un gerente o administrador realizar directamente un ajuste.

```text
Manager / Administrator
          ↓
       Adjustment
          ↓
      Inventory +/- N
```

**Rules:**

* Debe existir una observación.
* Debe existir stock suficiente para ajustes negativos.
* Debe generarse un movimiento.
* Debe registrarse auditoría.

---

### 7.6 Inventory Transfer Operations

#### 7.6.1 Create Transfer

Crea una transferencia entre dos bodegas.

**Input:**

* Source warehouse.
* Destination warehouse.
* Product.
* Quantity.
* Observation.
* User.

Estado inicial:

```text
CREATED
```

---

#### 7.6.2 Send Transfer

Registra la salida de la mercancía de la bodega de origen.

```text
Transfer
   ↓
SENT

Source Inventory
   ↓
- Quantity
```

Debe generarse:

```text
TRANSFER_OUT
```

---

#### 7.6.3 Receive Transfer

Registra la recepción de la mercancía en la bodega destino.

```text
Transfer
   ↓
RECEIVED

Destination Inventory
   ↓
+ Quantity
```

Debe generarse:

```text
TRANSFER_IN
```

---

#### 7.6.4 Partially Receive Transfer

Registra la recepción de una cantidad inferior a la enviada.

Ejemplo:

```text
Sent: 20
Received: 18
```

Resultado:

```text
PARTIALLY_RECEIVED
```

La cantidad recibida incrementa el inventario de destino.

---

### 7.7 Supplier Operations

#### 7.7.1 Create Supplier

Crea un proveedor.

---

#### 7.7.2 Update Supplier

Actualiza la información del proveedor.

---

#### 7.7.3 Activate Supplier

Activa un proveedor previamente inactivo.

---

#### 7.7.4 Deactivate Supplier

Desactiva un proveedor.

Un proveedor inactivo no puede utilizarse en nuevas órdenes de compra.

---

### 7.8 Purchase Order Operations

#### 7.8.1 Create Purchase Order

Crea una nueva orden de compra.

Estado inicial:

```text
DRAFT
```

No modifica el inventario.

---

#### 7.8.2 Add Purchase Order Item

Agrega un producto a una orden.

**Rules:**

* El producto debe estar activo.
* La cantidad debe ser mayor que cero.
* La orden debe estar en `DRAFT`.

---

#### 7.8.3 Remove Purchase Order Item

Elimina una línea de una orden mientras la orden se encuentre en `DRAFT`.

---

#### 7.8.4 Submit Purchase Order

Confirma la orden y la pasa a:

```text
DRAFT
   ↓
ORDERED
```

Una orden sin productos no puede enviarse.

---

#### 7.8.5 Receive Purchase Order

Registra la recepción total o parcial de mercancía.

Ejemplo:

```text
Ordered: 100
Received: 60
```

Resultado:

```text
PARTIALLY_RECEIVED
```

La recepción incrementa el inventario y genera los movimientos correspondientes.

---

#### 7.8.6 Cancel Purchase Order

Cancela una orden que todavía no haya sido completamente recibida.

Una orden cancelada no puede recibir mercancía posteriormente.

---

### 7.9 Alert Operations

#### 7.9.1 Generate Low Stock Alert

Genera una alerta cuando el stock alcanza o cae por debajo del mínimo configurado.

```text
Current Stock <= Minimum Stock
              ↓
         Low Stock Alert
```

---

#### 7.9.2 Resolve Alert

Marca una alerta como resuelta cuando la condición que la originó deja de existir.

---

#### 7.9.3 Get Active Alerts

Consulta las alertas que requieren atención.

Esta operación no modifica el dominio.

---

### 7.10 Audit Operations

#### 7.10.1 Record Audit Event

Registra una acción relevante realizada dentro del sistema.

Debe registrar, como mínimo:

* User.
* Action.
* Entity type.
* Entity ID.
* Timestamp.
* Previous state cuando corresponda.
* New state cuando corresponda.
* Metadata adicional cuando sea necesaria.

---

#### 7.10.2 Get Audit History

Consulta el historial de auditoría de una entidad.

Ejemplo:

```text
Product #123
   │
   ├── CREATE
   ├── UPDATE
   ├── DEACTIVATE
   └── UPDATE
```

Los registros no pueden modificarse mediante esta operación.

---

### 7.11 Reporting Operations

Las operaciones de consulta y reporting no modifican el estado del dominio.

#### 7.11.1 Get Stock Report

Obtiene el stock por:

* Empresa.
* Sucursal.
* Bodega.
* Producto.
* Categoría.

---

#### 7.11.2 Get Consolidated Inventory

Obtiene la existencia consolidada de productos en múltiples bodegas.

---

#### 7.11.3 Get Inventory Movement History

Consulta los movimientos de inventario dentro de un rango determinado.

---

#### 7.11.4 Get Inventory Valuation

Obtiene la valorización del inventario según el mecanismo de valoración definido por el sistema.

> El método de valoración de inventario se definirá posteriormente.

---

### 7.12 Operation Principles

Las operaciones del dominio deben seguir los siguientes principios:

1. Una operación debe representar una acción de negocio significativa.
2. Las operaciones deben validar las reglas de negocio correspondientes.
3. Las operaciones que modifican inventario deben generar los movimientos correspondientes.
4. Las operaciones críticas deben generar registros de auditoría.
5. Las operaciones que modifiquen múltiples entidades relacionadas deben ejecutarse dentro de límites transaccionales apropiados.
6. Las operaciones de consulta no deben modificar el estado del dominio.
7. Las operaciones no deben depender de HTTP, controllers o detalles específicos de infraestructura.
8. Una misma operación debe poder reutilizarse desde diferentes interfaces futuras.

## 8. Domain Events

Los Domain Events representan hechos relevantes que han ocurrido dentro del dominio de StockFlow.

Un evento no representa una orden para realizar una acción, sino el registro de que una operación de negocio ocurrió correctamente.

Los eventos permiten desacoplar diferentes partes del sistema y facilitar futuras funcionalidades como auditoría, alertas, notificaciones, reportes e integraciones externas.

En el MVP, los eventos serán manejados internamente dentro del monolito modular. No se utilizará inicialmente un sistema de mensajería externo como Redis, RabbitMQ o Kafka.

---

### 8.1 Domain Event Principles

Los Domain Events deben cumplir las siguientes características:

* Representan hechos que ya ocurrieron.
* Utilizan nombres en pasado.
* Son inmutables.
* Contienen la información necesaria para que los consumidores procesen el evento.
* No deben contener lógica de negocio.
* No deben depender de HTTP.
* No deben depender directamente de MySQL.
* Pueden ser consumidos por diferentes módulos.
* Deben poder evolucionar sin acoplar fuertemente los módulos.

Ejemplo:

```text id="rq9m0j"
Inventory received
       ↓
InventoryIncreased
```

El evento indica que el inventario aumentó.

No debe decir:

```text id="x0j6ad"
IncreaseInventory
```

porque eso representa una orden o comando, no un hecho ocurrido.

---

### 8.2 Inventory Events

### 8.2.1 StockIncreased

Se genera cuando el stock de un producto aumenta.

**Triggered by:**

* Recepción de orden de compra.
* Recepción de transferencia.
* Ajuste positivo.

**Payload conceptual:**

```text id="wh5u6g"
StockIncreased
├── inventoryId
├── productId
├── warehouseId
├── quantity
├── movementId
├── reason
├── userId
└── occurredAt
```

**Possible consumers:**

* Alert module.
* Audit module.
* Reporting module.

---

### 8.2.2 StockDecreased

Se genera cuando el stock de un producto disminuye.

**Triggered by:**

* Salida de inventario.
* Transferencia saliente.
* Ajuste negativo.

```text id="9qwdab"
StockDecreased
├── inventoryId
├── productId
├── warehouseId
├── quantity
├── movementId
├── reason
├── userId
└── occurredAt
```

---

### 8.2.3 InventoryMovementRecorded

Se genera cuando se registra correctamente un movimiento de inventario.

Puede utilizarse para alimentar:

* Auditoría.
* Reportes.
* Historial.
* Futuras integraciones.

```text id="m55q3r"
InventoryMovementRecorded
├── movementId
├── inventoryId
├── movementType
├── quantity
├── userId
└── occurredAt
```

---

# 8.3 Inventory Adjustment Events

### 8.3.1 InventoryAdjustmentRequested

Se genera cuando un operador solicita un ajuste.

```text id="j5j8oa"
InventoryAdjustmentRequested
├── adjustmentId
├── productId
├── warehouseId
├── quantity
├── direction
├── requestedBy
└── occurredAt
```

El ajuste permanece en:

```text id="f6c3g8"
PENDING
```

---

### 8.3.2 InventoryAdjustmentApproved

Se genera cuando un gerente o administrador aprueba un ajuste.

```text id="f6v9f3"
InventoryAdjustmentApproved
├── adjustmentId
├── approvedBy
├── quantity
├── occurredAt
```

Este evento representa la aprobación.

La modificación efectiva del inventario debe producir posteriormente los eventos correspondientes:

```text id="r1d8te"
InventoryAdjustmentApproved
          ↓
Inventory updated
          ↓
StockIncreased / StockDecreased
```

---

### 8.3.3 InventoryAdjustmentRejected

Se genera cuando un ajuste pendiente es rechazado.

```text id="k4q6z2"
InventoryAdjustmentRejected
├── adjustmentId
├── rejectedBy
├── reason
└── occurredAt
```

Este evento no modifica el inventario.

---

### 8.3.4 InventoryAdjustmentApplied

Se genera cuando un ajuste autorizado modifica efectivamente el inventario.

```text id="y1r4jp"
InventoryAdjustmentApplied
├── adjustmentId
├── movementId
├── inventoryId
├── quantity
├── appliedBy
└── occurredAt
```

---

# 8.4 Inventory Transfer Events

### 8.4.1 InventoryTransferCreated

Se genera cuando se crea una transferencia.

```text id="h2x5kn"
InventoryTransferCreated
├── transferId
├── sourceWarehouseId
├── destinationWarehouseId
├── productId
├── quantity
├── createdBy
└── occurredAt
```

Estado:

```text id="z5l7pj"
CREATED
```

---

### 8.4.2 InventoryTransferSent

Se genera cuando la mercancía sale de la bodega de origen.

```text id="m8s4dk"
InventoryTransferSent
├── transferId
├── sourceWarehouseId
├── destinationWarehouseId
├── quantity
├── movementId
├── sentBy
└── occurredAt
```

Este evento ocurre después de que el inventario de origen fue actualizado correctamente.

```text id="4s1z1f"
Source Inventory
      ↓
- quantity
      ↓
TRANSFER_OUT
      ↓
InventoryTransferSent
```

---

### 8.4.3 InventoryTransferPartiallyReceived

Se genera cuando la bodega destino recibe una cantidad menor a la enviada.

Ejemplo:

```text id="n4d0z4"
Sent:     20
Received: 18
```

```text id="m89f3a"
InventoryTransferPartiallyReceived
├── transferId
├── sentQuantity
├── receivedQuantity
├── difference
├── destinationWarehouseId
├── receivedBy
└── occurredAt
```

---

### 8.4.4 InventoryTransferReceived

Se genera cuando la transferencia ha sido recibida completamente.

```text id="k8k1k4"
InventoryTransferReceived
├── transferId
├── quantity
├── movementId
├── destinationWarehouseId
├── receivedBy
└── occurredAt
```

Flujo:

```text id="nq2x0m"
InventoryTransferSent
        ↓
Destination receives
        ↓
Inventory + quantity
        ↓
InventoryTransferReceived
```

---

# 8.5 Purchase Order Events

### 8.5.1 PurchaseOrderCreated

Se genera cuando se crea una orden de compra.

```text id="q6p7dd"
PurchaseOrderCreated
├── purchaseOrderId
├── supplierId
├── branchId
├── warehouseId
├── createdBy
└── occurredAt
```

No modifica inventario.

---

### 8.5.2 PurchaseOrderSubmitted

Se genera cuando una orden pasa de:

```text id="b3r3k8"
DRAFT
   ↓
ORDERED
```

```text id="q6x4n7"
PurchaseOrderSubmitted
├── purchaseOrderId
├── supplierId
├── submittedBy
└── occurredAt
```

---

### 8.5.3 PurchaseOrderPartiallyReceived

Se genera cuando se recibe solamente una parte de la orden.

```text id="u9h5s6"
PurchaseOrderPartiallyReceived
├── purchaseOrderId
├── receivedItems
├── receivedBy
└── occurredAt
```

La recepción debe generar también los eventos correspondientes de incremento de inventario.

---

### 8.5.4 PurchaseOrderReceived

Se genera cuando todos los productos de la orden fueron recibidos.

```text id="n1f4s7"
PurchaseOrderReceived
├── purchaseOrderId
├── receivedBy
└── occurredAt
```

---

### 8.5.5 PurchaseOrderCancelled

Se genera cuando una orden de compra es cancelada.

```text id="g2e8a4"
PurchaseOrderCancelled
├── purchaseOrderId
├── cancelledBy
├── reason
└── occurredAt
```

Una orden cancelada no puede recibir mercancía.

---

# 8.6 Product Events

### 8.6.1 ProductCreated

Se genera cuando se crea un producto.

```text id="b7r4m1"
ProductCreated
├── productId
├── sku
├── categoryId
├── createdBy
└── occurredAt
```

---

### 8.6.2 ProductUpdated

Se genera cuando se modifica información relevante del producto.

```text id="j2k6x8"
ProductUpdated
├── productId
├── updatedBy
├── changedFields
└── occurredAt
```

---

### 8.6.3 ProductDeactivated

Se genera cuando un producto deja de estar disponible para nuevas operaciones.

```text id="z4p1s9"
ProductDeactivated
├── productId
├── deactivatedBy
└── occurredAt
```

---

### 8.6.4 ProductActivated

Se genera cuando un producto previamente inactivo vuelve a estar disponible.

---

# 8.7 Supplier Events

### 8.7.1 SupplierCreated

Se genera cuando se crea un proveedor.

---

### 8.7.2 SupplierUpdated

Se genera cuando se modifica información relevante de un proveedor.

---

### 8.7.3 SupplierDeactivated

Se genera cuando un proveedor deja de estar disponible para nuevas órdenes de compra.

---

# 8.8 Organization Events

### 8.8.1 BranchCreated

Se genera cuando se crea una sucursal.

---

### 8.8.2 BranchDeactivated

Se genera cuando se desactiva una sucursal.

---

### 8.8.3 WarehouseCreated

Se genera cuando se crea una bodega.

---

### 8.8.4 WarehouseDeactivated

Se genera cuando se desactiva una bodega.

---

### 8.8.5 DefaultWarehouseChanged

Se genera cuando cambia la bodega predeterminada de una sucursal.

```text id="o5z4x1"
DefaultWarehouseChanged
├── branchId
├── previousWarehouseId
├── newWarehouseId
├── changedBy
└── occurredAt
```

---

# 8.9 Alert Events

### 8.9.1 LowStockDetected

Se genera cuando el inventario alcanza o cae por debajo del nivel mínimo.

```text id="f8p2r6"
currentStock <= minimumStock
           ↓
LowStockDetected
```

Payload conceptual:

```text id="u5t7x2"
LowStockDetected
├── inventoryId
├── productId
├── warehouseId
├── currentStock
├── minimumStock
└── occurredAt
```

---

### 8.9.2 LowStockResolved

Se genera cuando el stock vuelve a estar por encima del nivel mínimo.

```text id="d4v9q1"
currentStock > minimumStock
           ↓
LowStockResolved
```

---

# 8.10 Audit Events

La auditoría puede reaccionar a diferentes Domain Events.

Por ejemplo:

```text id="e8n4j2"
InventoryTransferSent
        ↓
Audit Event Handler
        ↓
AuditLog
```

```text id="r7k3m5"
InventoryAdjustmentApproved
        ↓
Audit Event Handler
        ↓
AuditLog
```

De esta manera, los casos de uso no necesitan contener directamente toda la lógica relacionada con auditoría.

---

# 8.11 Event Consumers

Los eventos pueden ser consumidos por diferentes módulos.

Ejemplo:

```text id="1p8x4k"
                    ┌──→ Audit
                    │
StockIncreased ─────┼──→ Alerts
                    │
                    ├──→ Reporting
                    │
                    └──→ Future Integrations
```

Otro ejemplo:

```text id="k4m8q2"
PurchaseOrderReceived
          │
          ├──→ Inventory
          │
          ├──→ Audit
          │
          └──→ Reporting
```

Los consumidores deben permanecer desacoplados del productor del evento siempre que sea posible.

---

# 8.12 Event Processing Strategy

Durante el MVP, los eventos serán procesados dentro del monolito modular.

Arquitectura inicial:

```text id="x9v3k7"
Use Case
   │
   ▼
Domain Entity
   │
   ▼
Domain Event
   │
   ▼
Event Dispatcher
   │
   ├──→ Audit Handler
   ├──→ Alert Handler
   └──→ Reporting Handler
```

No se utilizará inicialmente:

* Redis.
* RabbitMQ.
* Kafka.
* Event streaming externo.

Estos componentes podrán incorporarse posteriormente si los requisitos de escala o integración lo justifican.

---

# 8.13 Event Naming Convention

Los eventos utilizarán nombres en inglés y en pasado.

Formato:

```text id="c6j2v9"
<Entity><Action>
```

Ejemplos:

```text id="n2w7f4"
ProductCreated
ProductUpdated
ProductDeactivated

InventoryTransferCreated
InventoryTransferSent
InventoryTransferReceived

PurchaseOrderCreated
PurchaseOrderSubmitted
PurchaseOrderReceived

InventoryAdjustmentApproved
InventoryAdjustmentRejected

StockIncreased
StockDecreased

LowStockDetected
LowStockResolved
```

No se deben utilizar nombres que representen comandos:

```text id="m3k8p1"
❌ CreateProduct
❌ SendTransfer
❌ ReceivePurchaseOrder
```

Estos representan operaciones/comandos.

Los eventos representan hechos:

```text id="v7x2q5"
✅ ProductCreated
✅ InventoryTransferSent
✅ PurchaseOrderReceived
```

---

# 8.14 Domain Events and Transactions

Los eventos que representan cambios de dominio deben publicarse solamente cuando la operación correspondiente haya sido completada correctamente.

Ejemplo:

```text id="p4n8s2"
BEGIN TRANSACTION
        │
        ├── Update Inventory
        ├── Create InventoryMovement
        ├── Update Transfer
        │
        ▼
COMMIT
        │
        ▼
Publish Domain Events
```

No se debe publicar un evento indicando que una operación ocurrió si la transacción que la representa terminó en rollback.

En una futura evolución del sistema, se podrá implementar un patrón `Outbox` para garantizar una publicación confiable de eventos cuando StockFlow requiera procesamiento asíncrono o integraciones externas.

---

# 8.15 MVP Event Scope

Para evitar complejidad innecesaria, el MVP priorizará los siguientes eventos:

### Inventory

* `StockIncreased`
* `StockDecreased`
* `InventoryMovementRecorded`

### Adjustments

* `InventoryAdjustmentRequested`
* `InventoryAdjustmentApproved`
* `InventoryAdjustmentRejected`
* `InventoryAdjustmentApplied`

### Transfers

* `InventoryTransferCreated`
* `InventoryTransferSent`
* `InventoryTransferPartiallyReceived`
* `InventoryTransferReceived`

### Purchase Orders

* `PurchaseOrderCreated`
* `PurchaseOrderSubmitted`
* `PurchaseOrderPartiallyReceived`
* `PurchaseOrderReceived`
* `PurchaseOrderCancelled`

### Products

* `ProductCreated`
* `ProductUpdated`
* `ProductActivated`
* `ProductDeactivated`

### Alerts

* `LowStockDetected`
* `LowStockResolved`

Los demás eventos podrán incorporarse conforme evolucionen los módulos.

## 9. Open Questions

Esta sección contiene decisiones de negocio, arquitectura y producto que todavía no han sido definidas completamente.

Las preguntas abiertas deben resolverse antes de implementar la funcionalidad que dependa directamente de ellas. Las decisiones tomadas deben posteriormente actualizar las secciones correspondientes del Domain Model, Product Requirements u otros documentos técnicos.

---

### 9.1 Inventory

#### OQ-INV-001 — Inventory Valuation Method

¿Qué método utilizará StockFlow para calcular la valorización del inventario?

Posibles alternativas:

* Costo promedio ponderado.
* FIFO.
* Último costo de compra.
* Otro método definido por la empresa.

**Impact:** Alto

Afecta:

* Inventory.
* PurchaseOrder.
* Reporting.
* Cost management.

---

#### OQ-INV-002 — Decimal Quantities

¿Los productos pueden manejar cantidades decimales?

Ejemplos:

```text
1.5 kg
2.75 litros
0.5 unidades
```

¿O todos los productos utilizarán cantidades enteras?

**Impact:** Medio

Afecta:

* Inventory.
* InventoryMovement.
* PurchaseOrderItem.
* InventoryTransfer.
* Database types.

---

#### OQ-INV-003 — Unit of Measure

¿Cómo se manejarán las unidades de medida?

Ejemplo:

```text
UNIT
KG
GRAM
LITER
METER
BOX
PACKAGE
```

¿Cada producto tendrá una única unidad de medida o será necesario soportar conversiones?

Ejemplo:

```text
1 BOX = 12 UNIT
```

**Impact:** Alto

---

#### OQ-INV-004 — Inventory Reservation

¿StockFlow necesitará reservar inventario para operaciones futuras?

Ejemplo:

```text
Available: 100
Reserved: 20
Physical: 100
Available for sale: 80
```

Actualmente el MVP no contempla reservas.

**Impact:** Alto

**Current decision:** Fuera del MVP.

---

### 9.2 Transfers

#### OQ-TRF-001 — Transfer Approval

¿Las transferencias requieren aprobación antes de registrar la salida?

Opciones:

```text
Create
   ↓
Approve
   ↓
Send
   ↓
Receive
```

o:

```text
Create
   ↓
Send
   ↓
Receive
```

**Current decision:** Pendiente.

**Impact:** Alto

---

#### OQ-TRF-002 — Partial Reception

¿Las transferencias pueden recibirse parcialmente?

Ejemplo:

```text
Sent: 20
Received: 18
Difference: 2
```

**Current decision:** Sí.

Debe definirse posteriormente qué ocurre con la diferencia de unidades no recibidas.

**Impact:** Alto

---

#### OQ-TRF-003 — Transfer Difference

Cuando se envían 20 unidades y se reciben 18:

¿Qué debe ocurrir con las 2 unidades restantes?

Posibles alternativas:

* Registrar automáticamente una diferencia.
* Requerir un ajuste de inventario.
* Permitir cerrar la transferencia con diferencia.
* Requerir aprobación del gerente.

**Impact:** Alto

---

#### OQ-TRF-004 — Transfer Cancellation

¿Se podrán cancelar transferencias?

Si es así:

* ¿Antes de enviar?
* ¿Después de enviar?
* ¿Después de recibir?

**Impact:** Medio/Alto

---

### 9.3 Inventory Adjustments

#### OQ-ADJ-001 — Adjustment Approval Scope

Actualmente:

```text
Operator
   ↓
Requires approval

Manager
   ↓
Direct adjustment

Administrator
   ↓
Direct adjustment
```

Debe definirse si esta política será configurable por empresa.

**Current decision:** Inicialmente será una regla fija del sistema.

**Impact:** Medio

---

#### OQ-ADJ-002 — Adjustment Reason

¿La observación será suficiente para justificar un ajuste o se necesitará además un catálogo de motivos?

Ejemplo:

```text
DAMAGED
LOST
COUNT_DIFFERENCE
EXPIRATION
DATA_CORRECTION
OTHER
```

**Current decision:** MVP utilizará observación obligatoria.

Un catálogo de motivos podrá incorporarse posteriormente.

**Impact:** Medio

---

#### OQ-ADJ-003 — Adjustment Cancellation

¿Un ajuste `PENDING` podrá ser cancelado por el usuario que lo creó?

**Impact:** Bajo/Medio

---

### 9.4 Purchase Orders

#### OQ-PO-001 — Purchase Order Approval

¿Las órdenes de compra requieren aprobación antes de enviarse al proveedor?

Posible flujo:

```text
DRAFT
   ↓
PENDING_APPROVAL
   ↓
APPROVED
   ↓
ORDERED
```

Actualmente el MVP utiliza:

```text
DRAFT
   ↓
ORDERED
```

**Current decision:** No approval workflow en MVP.

**Impact:** Alto si se incorpora posteriormente.

---

#### OQ-PO-002 — Partial Purchase Reception

Cuando una orden se recibe parcialmente:

```text
Ordered: 100
Received: 60
Pending: 40
```

¿El proveedor puede entregar posteriormente las 40 unidades restantes?

**Current decision:** Sí.

---

#### OQ-PO-003 — Purchase Order Difference

¿Qué ocurre si el proveedor entrega una cantidad diferente a la solicitada?

Ejemplo:

```text
Ordered: 100
Received: 95
```

¿La orden queda abierta, se cierra con diferencia o requiere aprobación?

**Impact:** Alto

---

#### OQ-PO-004 — Purchase Price

¿La orden de compra almacenará el precio unitario de cada producto?

Ejemplo:

```text
Product
Quantity: 100
Unit Price: $15.50
Subtotal: $1550
```

**Current decision:** Se recomienda incluirlo.

Esto permitirá posteriormente calcular valorización y costos históricos.

**Impact:** Alto

---

#### OQ-PO-005 — Taxes and Discounts

¿Las órdenes de compra soportarán:

* Impuestos.
* Descuentos por línea.
* Descuentos generales.
* Costos adicionales.

**Current decision:** Fuera del MVP inicial.

**Impact:** Medio/Alto

---

### 9.5 Users and Permissions

#### OQ-AUTH-001 — Multiple Roles

¿Un usuario puede tener múltiples roles simultáneamente?

Ejemplo:

```text
Cristian
├── Manager
└── Buyer
```

**Current decision:** Sí.

El modelo `UserRole` permite esta posibilidad.

---

#### OQ-AUTH-002 — Branch Assignment

¿Un usuario puede pertenecer a múltiples sucursales?

Ejemplo:

```text
User
├── Branch A
└── Branch B
```

**Current decision:** Pendiente.

**Impact:** Alto

---

#### OQ-AUTH-003 — Warehouse Assignment

¿Un operador puede trabajar en múltiples bodegas?

Ejemplo:

```text
Operator
├── Warehouse A
└── Warehouse B
```

**Current decision:** Pendiente.

**Impact:** Alto

---

#### OQ-AUTH-004 — Permission Granularity

¿Los permisos estarán determinados únicamente por roles o se permitirá configurar permisos individualmente?

Ejemplo:

```text
Role
   ↓
Permissions

CREATE_PRODUCT
UPDATE_PRODUCT
APPROVE_ADJUSTMENT
SEND_TRANSFER
RECEIVE_TRANSFER
```

**Current decision:** RBAC basado en roles para MVP.

Permisos granulares podrán incorporarse posteriormente.

---

### 9.6 Alerts

#### OQ-ALERT-001 — Alert Generation

¿Las alertas se generan inmediatamente después de cada modificación de inventario o mediante un proceso periódico?

Opciones:

```text
Inventory change
      ↓
Event
      ↓
Check stock
      ↓
Alert
```

o:

```text
Scheduled Job
      ↓
Check all inventory
      ↓
Generate alerts
```

**Current recommendation:** Utilizar eventos para reaccionar inmediatamente a cambios de inventario.

---

#### OQ-ALERT-002 — Alert Types

Actualmente el MVP contempla principalmente:

```text
LOW_STOCK
```

Posteriormente podrían incorporarse:

```text
OUT_OF_STOCK
OVERSTOCK
EXPIRING_PRODUCT
PURCHASE_ORDER_DELAY
TRANSFER_DIFFERENCE
```

**Current decision:** Solo `LOW_STOCK` en MVP.

---

### 9.7 Audit

#### OQ-AUDIT-001 — Audit Detail

¿Qué información exacta debe almacenar `AuditLog`?

Posibles campos:

```text
userId
action
entityType
entityId
timestamp
ipAddress
userAgent
before
after
metadata
```

**Current recommendation:** Definir el esquema antes de implementar el módulo de auditoría.

---

#### OQ-AUDIT-002 — Audit Retention

¿Cuánto tiempo deben conservarse los registros de auditoría?

Ejemplo:

```text
1 year
3 years
5 years
Unlimited
```

**Impact:** Medio/Alto

---

### 9.8 Product Catalog

#### OQ-PROD-001 — Product Attributes

¿Los productos tendrán atributos adicionales?

Ejemplo:

```text
Brand
Model
Color
Size
Weight
Barcode
```

**Current decision:** MVP mantendrá un catálogo simple.

---

#### OQ-PROD-002 — Barcode

¿StockFlow soportará códigos de barras?

Esto sería especialmente útil para operaciones de bodega mediante tablets o lectores.

**Current decision:** No necesario para la primera versión.

**Future consideration:** Sí.

---

#### OQ-PROD-003 — Product Images

¿Los productos podrán tener imágenes?

**Current decision:** Fuera del MVP.

---

### 9.9 Sales

#### OQ-SALES-001 — Customer Sales

¿StockFlow permitirá registrar ventas a clientes?

**Current decision:** Sí, pero será una fase futura.

El MVP se concentrará en:

```text
Purchasing
Inventory
Transfers
Adjustments
Reporting
```

Posteriormente:

```text
Sales
   ↓
Customer
   ↓
Order
   ↓
Inventory Decrease
```

---

#### OQ-SALES-002 — Customer Management

Cuando se incorpore ventas:

¿Será necesario administrar:

* Clientes.
* Crédito.
* Límites de crédito.
* Historial de compras.
* Devoluciones?

**Current decision:** Fuera del MVP.

---

### 9.10 Reporting

#### OQ-REPORT-001 — Inventory Valuation

Los reportes de valorización dependen del método de valoración definido en `OQ-INV-001`.

---

#### OQ-REPORT-002 — Export Formats

¿Qué formatos deberán soportarse?

Posibles opciones:

```text
CSV
XLSX
PDF
```

**Current recommendation:** CSV y XLSX inicialmente.

---

### 9.11 Notifications

#### OQ-NOTIF-001 — Notification Channels

¿Cómo se notificarán las alertas?

Posibles canales:

```text
In-App
Email
Push
SMS
WhatsApp
```

**Current decision:** In-App inicialmente.

Email podrá agregarse posteriormente.

---

### 9.12 Architecture

#### OQ-ARCH-001 — Event Persistence

¿Los Domain Events serán únicamente eventos internos en memoria o se persistirán?

**Current decision:**

MVP:

```text
Domain Event
      ↓
Internal Event Dispatcher
```

Future:

```text
Domain Event
      ↓
Outbox
      ↓
Message Broker
```

---

#### OQ-ARCH-002 — Redis

¿Redis será incorporado posteriormente?

Posibles usos:

* Cache de consultas frecuentes.
* Rate limiting.
* Sesiones.
* Jobs.
* Distributed locking.
* Event processing.

**Current decision:** No utilizar Redis inicialmente.

Se incorporará únicamente cuando exista una necesidad técnica concreta.

---

#### OQ-ARCH-003 — External Integrations

¿StockFlow necesitará integrarse posteriormente con sistemas externos?

Posibles integraciones:

```text
ERP
Accounting
E-commerce
POS
Shipping
Payment
Supplier APIs
```

**Current decision:** Fuera del MVP.

---

### 9.13 Future Scalability

#### OQ-SCALE-001 — Multi-Tenant Architecture

¿StockFlow será utilizado por múltiples empresas dentro de una misma instalación?

Modelo posible:

```text
Company A
├── Users
├── Branches
└── Inventory

Company B
├── Users
├── Branches
└── Inventory
```

**Current direction:** El modelo de dominio contempla `Company`, por lo que el sistema podrá evolucionar hacia un modelo multi-tenant.

La estrategia exacta de aislamiento de datos queda pendiente.

---

#### OQ-SCALE-002 — High Availability

Si StockFlow crece significativamente, deberá definirse:

* Estrategia de múltiples instancias.
* Balanceo de carga.
* Database replication.
* Cache.
* Background jobs.
* Event processing.

Estas decisiones quedan fuera del MVP.

---

## 9.14 Decision Management

Cada pregunta abierta deberá convertirse posteriormente en una decisión documentada.

Cuando una decisión sea tomada:

1. Registrar la decisión.
2. Actualizar la sección correspondiente del Domain Model.
3. Actualizar el PRD si la decisión modifica requisitos.
4. Actualizar las reglas de negocio.
5. Actualizar las tareas de implementación.

Ejemplo:

```text
OQ-INV-002
     ↓
Decision: Decimal quantities supported
     ↓
Update Domain Model
     ↓
Update Business Rules
     ↓
Update Database Design
     ↓
Create Jira tasks
```

---

## 9.15 MVP Decision Summary

Las siguientes decisiones quedan establecidas para la primera versión:

| Área                       | Decisión                                     |
| -------------------------- | -------------------------------------------- |
| Architecture               | Modular Monolith                             |
| Backend                    | NestJS                                       |
| Database                   | MySQL                                        |
| Cache                      | No Redis inicialmente                        |
| Messaging                  | No external broker                           |
| Authentication             | JWT                                          |
| Authorization              | RBAC                                         |
| Inventory                  | Stock por bodega                             |
| Branches                   | Una sucursal puede tener múltiples bodegas   |
| Default Warehouse          | Una única bodega predeterminada por sucursal |
| Transfers                  | Sin estado `IN_TRANSIT`                      |
| Transfer Observation       | Obligatoria                                  |
| Partial Transfer Reception | Sí                                           |
| Adjustments                | Operator requiere aprobación                 |
| Manager/Admin Adjustments  | Directos con observación                     |
| Purchase Orders            | Recepción parcial                            |
| Purchase Approval          | No en MVP                                    |
| Low Stock                  | Alertas automáticas                          |
| Audit                      | Inmutable                                    |
| Sales                      | Futuro                                       |
| POS                        | Fuera del MVP                                |
| ERP Integration            | Fuera del MVP                                |
| Mobile App                 | Fuera del MVP                                |
| AI Forecasting             | Fuera del MVP                                |
| Redis                      | Futuro                                       |
| Kafka/RabbitMQ             | Futuro                                       |
| Outbox                     | Futuro                                       |
