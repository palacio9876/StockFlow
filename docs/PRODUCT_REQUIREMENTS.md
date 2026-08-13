# StockFlow — Product Requirements Document

**Versión:** 1.0
**Estado:** Draft — Requirements Refinement
**Producto:** StockFlow
**Tipo:** Plataforma de gestión de inventario multi-sucursal

---

## 1. Product Vision

StockFlow es una plataforma de gestión de inventario para empresas de distribución y operaciones de bodega con múltiples sucursales.

La plataforma centraliza la visibilidad del inventario, permite administrar productos y existencias por bodega, facilita las transferencias entre sucursales, mejora el proceso de reabastecimiento y proporciona trazabilidad completa de las operaciones mediante auditoría.

El objetivo principal es convertir StockFlow en una fuente única y confiable de información sobre el inventario de la organización, reduciendo errores humanos, quiebres de stock, sobre-stock y procesos manuales.

---

## 2. Problem Statement

Las empresas de distribución con múltiples bodegas o sucursales suelen administrar su inventario mediante hojas de cálculo, sistemas independientes o procesos manuales.

Esto puede generar:

* Falta de visibilidad consolidada del inventario.
* Dificultad para conocer el stock disponible en cada ubicación.
* Errores humanos en entradas, salidas y transferencias.
* Dificultad para detectar diferencias entre el inventario físico y el registrado.
* Reabastecimiento manual y basado en información incompleta.
* Falta de trazabilidad sobre quién modificó el inventario.
* Dificultad para controlar las operaciones realizadas por diferentes usuarios.
* Riesgo de inconsistencias cuando varias operaciones modifican simultáneamente el mismo inventario.

StockFlow busca resolver estos problemas mediante una plataforma centralizada, controlada por roles y con trazabilidad completa de las operaciones.

---

## 3. Target Users

StockFlow está dirigido principalmente a:

* Empresas de distribución y comercialización con múltiples sucursales.
* Empresas mayoristas con varias bodegas.
* Operadores de bodega.
* Gerentes o responsables de sucursales.
* Personal encargado de compras y reabastecimiento.
* Personal administrativo.
* Auditores.

Una empresa puede administrar múltiples sucursales y cada sucursal puede administrar múltiples bodegas.

---

## 4. User Roles

### 4.1 Administrador

Responsable de la administración global de StockFlow.

Permisos principales:

* Gestionar usuarios.
* Gestionar roles.
* Gestionar sucursales.
* Gestionar bodegas.
* Gestionar productos.
* Gestionar categorías.
* Gestionar proveedores.
* Consultar y gestionar inventario.
* Aprobar ajustes realizados por operadores.
* Gestionar transferencias.
* Consultar reportes.
* Consultar auditoría.
* Realizar ajustes de inventario sin aprobación adicional.
* Configurar parámetros globales.

---

### 4.2 Gerente de sucursal

Responsable de la operación de una o más sucursales asignadas.

Permisos principales:

* Consultar inventario de sus sucursales.
* Gestionar operaciones permitidas sobre las bodegas de sus sucursales.
* Aprobar ajustes solicitados por operadores.
* Aprobar transferencias según las reglas establecidas.
* Realizar ajustes de inventario directamente.
* Consultar movimientos.
* Consultar reportes de sus sucursales.

Un gerente no debe acceder a operaciones de sucursales que no estén dentro de su alcance.

---

### 4.3 Operador de bodega

Responsable de registrar las operaciones diarias de inventario.

Permisos principales:

* Registrar entradas.
* Registrar salidas.
* Registrar transferencias.
* Realizar conteos físicos.
* Solicitar ajustes de inventario.
* Consultar inventario de las bodegas a las que tenga acceso.
* Consultar movimientos.

Los ajustes realizados por un operador requieren aprobación de un gerente o administrador.

---

### 4.4 Comprador / Encargado de reabastecimiento

Responsable de gestionar la reposición de inventario.

Permisos principales:

* Consultar niveles de stock.
* Consultar alertas de stock bajo.
* Consultar sugerencias de reabastecimiento.
* Gestionar proveedores.
* Crear órdenes de compra.
* Consultar órdenes de compra.
* Registrar y gestionar recepciones de órdenes de compra.

Un comprador puede tener alcance sobre una o varias sucursales.

---

### 4.5 Auditor / Solo lectura

Usuario destinado a consulta y supervisión.

Permisos principales:

* Consultar productos.
* Consultar sucursales y bodegas.
* Consultar inventario.
* Consultar movimientos.
* Consultar órdenes de compra.
* Consultar reportes.
* Consultar registros de auditoría.

No puede modificar información operativa.

---

## 5. Organizational Structure

StockFlow utilizará la siguiente estructura:

```text
Empresa
│
├── Usuarios
│
└── Sucursales
      │
      ├── Bodega Principal
      ├── Bodega
      └── Bodega
```

### Reglas

* Una empresa puede tener múltiples sucursales.
* Una sucursal puede tener múltiples bodegas.
* Una bodega pertenece únicamente a una sucursal.
* Cada sucursal debe tener al menos una bodega activa.
* Cada sucursal debe tener exactamente una bodega marcada como predeterminada.
* Una sucursal no puede tener más de una bodega predeterminada.
* Una bodega no puede pertenecer simultáneamente a varias sucursales.
* La bodega predeterminada no puede desactivarse sin establecer previamente otra bodega como predeterminada.

---

## 6. Core Features

StockFlow tendrá las siguientes funcionalidades principales:

* Gestión de usuarios y roles.
* Gestión de sucursales.
* Gestión de bodegas.
* Gestión de catálogo de productos.
* Gestión de categorías.
* Gestión de proveedores.
* Control de inventario por bodega.
* Registro de entradas y salidas.
* Transferencias entre bodegas.
* Conteos físicos.
* Ajustes de inventario.
* Sistema de aprobación de ajustes.
* Alertas de stock bajo.
* Sugerencias de reabastecimiento.
* Órdenes de compra.
* Recepción parcial o total de órdenes de compra.
* Historial de movimientos.
* Auditoría de operaciones.
* Reportes consolidados de inventario.

---

# 7. Product Management

## 7.1 Products

Cada producto debe tener como mínimo:

* SKU.
* Nombre.
* Descripción.
* Categoría.
* Unidad de medida.
* Estado.

Estados:

```text
ACTIVE
INACTIVE
```

### Reglas

* El SKU debe ser único.
* Un producto puede estar asociado a una categoría.
* Un producto inactivo no puede utilizarse en nuevas operaciones que modifiquen inventario.
* Los productos con historial de operaciones no deben eliminarse físicamente.
* La desactivación de un producto debe conservar su historial.

---

## 7.2 Categories

Las categorías permitirán organizar el catálogo.

En el MVP las categorías serán planas y no tendrán subcategorías.

Ejemplo:

```text
Tecnología
Oficina
Hogar
Herramientas
```

---

# 8. Inventory Management

El inventario representa la cantidad físicamente disponible de un producto dentro de una bodega.

Cada combinación:

```text
Producto + Bodega
```

representa un inventario independiente.

Ejemplo:

```text
Producto: LAP-001

Bodega Armenia:
Stock: 100

Bodega Bogotá:
Stock: 50
```

El stock no tendrá un estado `IN_TRANSIT` en el MVP.

El sistema manejará únicamente el inventario que se encuentre registrado como disponible en cada bodega.

---

## 8.1 Inventory Rules

* El stock nunca puede ser negativo.
* Toda salida debe validar disponibilidad.
* Toda entrada debe incrementar el inventario correspondiente.
* Toda salida debe disminuir el inventario correspondiente.
* Toda modificación manual del inventario debe generar un registro de movimiento.
* Toda modificación manual debe incluir una observación.
* Las operaciones de inventario deben registrar al usuario responsable.
* Las operaciones deben registrar fecha y hora.
* Las operaciones concurrentes no deben generar inconsistencias en el inventario.

---

# 9. Inventory Movements

Todo cambio de inventario debe quedar registrado como un movimiento.

Tipos iniciales de movimiento:

```text
PURCHASE_RECEIPT
TRANSFER_OUT
TRANSFER_IN
INTERNAL_CONSUMPTION
STOCK_ADJUSTMENT
RETURN
```

El tipo `SALE` queda fuera del MVP porque las ventas a clientes no forman parte de la primera versión.

En una versión futura podrá incorporarse:

```text
SALE
```

sin modificar el concepto central de inventario.

---

# 10. Inventory Adjustments

Los ajustes permiten corregir diferencias entre el inventario físico y el inventario registrado.

Ejemplo:

```text
Stock registrado: 100
Stock físico:      97

Ajuste: -3
```

El ajuste debe registrar:

* Usuario.
* Producto.
* Bodega.
* Cantidad anterior.
* Cantidad ajustada.
* Cantidad resultante.
* Observación.
* Fecha.
* Estado.
* Usuario que aprobó, cuando aplique.

---

## 10.1 Adjustments by Operators

Cuando un operador solicita un ajuste:

```text
PENDING
   ↓
APPROVED
```

o:

```text
PENDING
   ↓
REJECTED
```

El inventario solamente se modifica cuando el ajuste es aprobado.

Los ajustes rechazados deben permanecer registrados para auditoría.

---

## 10.2 Adjustments by Managers and Administrators

Los gerentes y administradores pueden realizar ajustes directamente.

Estos ajustes:

* No requieren aprobación adicional.
* Deben incluir una observación.
* Deben generar un movimiento de inventario.
* Deben quedar registrados en auditoría.

---

# 11. Inventory Transfers

StockFlow permitirá transferir productos entre bodegas.

Una transferencia tendrá:

* Bodega de origen.
* Bodega de destino.
* Producto.
* Cantidad.
* Usuario que realiza la transferencia.
* Fecha.
* Estado.
* Observación.

Las transferencias no tendrán estado `IN_TRANSIT`.

El sistema solamente registrará:

```text
Salida del origen
       ↓
Recepción en destino
```

---

## 11.1 Transfer Flow

Ejemplo:

```text
Bodega A
Stock: 100

Transferencia: 20
       ↓
Stock Bodega A: 80
```

Posteriormente:

```text
Bodega B
Stock: 50

Recepción: 20
       ↓
Stock Bodega B: 70
```

---

## 11.2 Transfer Observations

Toda transferencia debe tener una observación obligatoria.

La observación debe registrarse tanto al momento de generar la salida como cuando sea necesario registrar información adicional durante la recepción.

---

## 11.3 Partial Reception

Una transferencia puede recibirse parcialmente.

Ejemplo:

```text
Cantidad enviada: 20
Cantidad recibida: 18
Diferencia: 2
```

La diferencia debe quedar registrada y requerirá una observación.

El sistema no debe asumir que las cantidades enviadas y recibidas son necesariamente iguales.

---

# 12. Stock Replenishment

StockFlow permitirá definir niveles mínimos y máximos de inventario por producto y bodega.

Ejemplo:

```text
Producto: LAP-001

Stock mínimo: 20
Stock máximo: 100
Stock actual: 15
```

Cuando:

```text
Stock actual <= Stock mínimo
```

el sistema generará una alerta de stock bajo.

También podrá generar una sugerencia de reabastecimiento.

---

## 12.1 Replenishment Suggestion

La cantidad sugerida inicialmente será calculada con base en el nivel máximo:

```text
Cantidad sugerida =
Stock máximo - Stock actual
```

Ejemplo:

```text
Máximo: 100
Actual: 15

Sugerencia: 85
```

La sugerencia no crea automáticamente una orden de compra.

El comprador debe revisar la sugerencia y decidir si genera una orden.

El pronóstico de demanda y los modelos de inteligencia artificial quedan fuera del MVP.

---

# 13. Suppliers

StockFlow permitirá administrar proveedores.

Información mínima:

* Nombre.
* Identificación.
* Información de contacto.
* Estado.

Estados:

```text
ACTIVE
INACTIVE
```

Los proveedores podrán asociarse a órdenes de compra.

---

# 14. Purchase Orders

Los compradores podrán crear órdenes de compra dirigidas a proveedores.

Cada orden estará asociada a:

* Proveedor.
* Sucursal.
* Bodega de destino.
* Usuario creador.
* Fecha.
* Productos.
* Cantidades.
* Estado.

---

## 14.1 Purchase Order Status

Estados iniciales:

```text
DRAFT
ORDERED
PARTIALLY_RECEIVED
RECEIVED
CANCELLED
```

---

## 14.2 Partial Reception

Las órdenes podrán recibirse parcial o totalmente.

Ejemplo:

```text
Producto A
Solicitado: 100
Recibido:    70
Pendiente:   30
```

El inventario solamente se incrementará por la cantidad realmente recibida.

Una recepción parcial debe permitir posteriormente completar la recepción.

---

# 15. Alerts

StockFlow generará alertas cuando:

* El stock alcance o esté por debajo del mínimo.
* Existan sugerencias de reabastecimiento.
* Existan operaciones pendientes de aprobación.
* Existan diferencias relevantes durante recepciones.

Las alertas deberán estar asociadas al contexto correspondiente, como producto, bodega o sucursal.

---

# 16. Audit Trail

La auditoría es un componente fundamental del sistema.

Las operaciones relevantes deben conservar información suficiente para reconstruir qué ocurrió.

Un registro de auditoría debe incluir, cuando corresponda:

* Usuario.
* Acción.
* Entidad afectada.
* Identificador de la entidad.
* Valor anterior.
* Valor nuevo.
* Observación.
* Fecha y hora.

Ejemplo:

```text
Usuario: Cristian
Acción: STOCK_ADJUSTMENT
Producto: LAP-001
Bodega: Armenia Principal

Valor anterior: 100
Ajuste: -3
Valor nuevo: 97

Observación:
"Diferencia encontrada durante conteo físico."

Fecha:
2026-08-08 14:32
```

Los registros de auditoría son inmutables y no deben eliminarse como parte de las operaciones normales del sistema.

---

# 17. Reports

StockFlow permitirá consultar reportes consolidados.

Reportes iniciales:

* Stock por bodega.
* Stock por sucursal.
* Stock global.
* Movimientos de inventario.
* Productos con stock bajo.
* Historial de ajustes.
* Transferencias.
* Órdenes de compra.
* Valorización de inventario.
* Rotación de inventario.

Los reportes podrán filtrarse según el alcance del usuario.

---

# 18. Access Control

El sistema debe aplicar control de acceso basado en roles.

Además del rol, ciertas operaciones estarán limitadas por el alcance organizacional del usuario.

Ejemplo:

```text
Administrador
→ Todas las sucursales

Gerente Armenia
→ Sucursal Armenia

Operador Bodega Principal
→ Bodega Principal

Comprador
→ Sucursales asignadas

Auditor
→ Consulta según alcance asignado
```

Un usuario no debe poder consultar o modificar información fuera de su alcance.

---

# 19. Business Rules

### BR-001 — Unique SKU

Cada producto debe tener un SKU único.

### BR-002 — Non-negative Stock

El inventario nunca puede ser negativo.

### BR-003 — Warehouse Ownership

Una bodega pertenece a una única sucursal.

### BR-004 — Default Warehouse

Cada sucursal debe tener exactamente una bodega predeterminada.

### BR-005 — Auditability

Toda modificación de inventario debe quedar registrada.

### BR-006 — Adjustment Observation

Todo ajuste debe incluir una observación.

### BR-007 — Operator Approval

Los ajustes realizados por operadores requieren aprobación de un gerente o administrador.

### BR-008 — Manager/Admin Adjustment

Los ajustes realizados por gerentes o administradores no requieren aprobación adicional.

### BR-009 — Transfer Observation

Toda transferencia debe incluir una observación.

### BR-010 — Transfer Consistency

Una transferencia debe descontar inventario del origen y posteriormente incrementar el inventario del destino de acuerdo con la cantidad realmente recibida.

### BR-011 — Partial Reception

Una transferencia o una orden de compra puede recibirse parcialmente.

### BR-012 — Inactive Products

Los productos inactivos no pueden utilizarse en nuevas operaciones que modifiquen inventario.

### BR-013 — Historical Integrity

Los productos, bodegas y demás entidades que posean historial operativo no deben eliminarse físicamente si esto compromete la trazabilidad.

### BR-014 — Concurrent Operations

Las operaciones concurrentes sobre un mismo inventario deben mantener la consistencia de los datos.

### BR-015 — Replenishment Alert

Cuando el stock sea menor o igual al mínimo configurado, debe generarse una alerta.

---

# 20. Inventory Lifecycle

El ciclo principal del inventario será:

```text
                   ┌───────────────┐
                   │     Stock     │
                   └───────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
       Entrada           Salida        Transferencia
          │                │                │
          ▼                ▼                ▼
       Aumenta          Disminuye       Sale origen
                                           │
                                           ▼
                                      Recibe destino
```

Las principales fuentes de entrada serán:

* Recepción de órdenes de compra.
* Transferencias recibidas.
* Devoluciones.
* Ajustes positivos.

Las principales fuentes de salida serán:

* Transferencias.
* Consumo interno.
* Ajustes negativos.

Las ventas a clientes se incorporarán posteriormente.

---

# 21. Functional Requirements

### Product Management

* **FR1:** El sistema debe permitir crear productos.
* **FR2:** El sistema debe permitir editar productos.
* **FR3:** El sistema debe permitir desactivar productos.
* **FR4:** El sistema debe garantizar SKU único.
* **FR5:** El sistema debe permitir gestionar categorías.

### Branches and Warehouses

* **FR6:** El sistema debe permitir crear sucursales.
* **FR7:** El sistema debe permitir crear múltiples bodegas por sucursal.
* **FR8:** El sistema debe permitir establecer una única bodega predeterminada por sucursal.
* **FR9:** El sistema debe permitir consultar las bodegas de una sucursal.
* **FR10:** El sistema debe controlar el acceso según sucursal y bodega.

### Inventory

* **FR11:** El sistema debe mostrar el stock disponible por producto y bodega.
* **FR12:** El sistema debe permitir registrar entradas.
* **FR13:** El sistema debe permitir registrar salidas.
* **FR14:** El sistema debe impedir stock negativo.
* **FR15:** El sistema debe registrar todos los movimientos de inventario.
* **FR16:** El sistema debe permitir consultar el historial de movimientos.

### Transfers

* **FR17:** El sistema debe permitir crear transferencias entre bodegas.
* **FR18:** El sistema debe descontar el inventario de la bodega de origen al realizar la salida.
* **FR19:** El sistema debe permitir registrar la recepción en la bodega destino.
* **FR20:** El sistema debe permitir recepciones parciales.
* **FR21:** El sistema debe registrar las diferencias entre cantidades enviadas y recibidas.
* **FR22:** Toda transferencia debe requerir una observación.

### Adjustments

* **FR23:** El sistema debe permitir a los operadores solicitar ajustes.
* **FR24:** El sistema debe permitir aprobar o rechazar ajustes.
* **FR25:** El sistema debe permitir a gerentes y administradores realizar ajustes directamente.
* **FR26:** Todo ajuste debe requerir una observación.
* **FR27:** El sistema debe conservar los ajustes rechazados para auditoría.

### Replenishment

* **FR28:** El sistema debe permitir configurar niveles mínimos y máximos por producto y bodega.
* **FR29:** El sistema debe generar alertas de stock bajo.
* **FR30:** El sistema debe generar sugerencias de reabastecimiento.
* **FR31:** El comprador debe poder convertir una sugerencia en una orden de compra.

### Purchase Orders

* **FR32:** El sistema debe permitir crear órdenes de compra.
* **FR33:** Las órdenes deben estar asociadas a un proveedor.
* **FR34:** Las órdenes deben estar asociadas a una sucursal y bodega de destino.
* **FR35:** El sistema debe permitir recepción parcial.
* **FR36:** El sistema debe permitir recepción total.
* **FR37:** El sistema debe actualizar el inventario únicamente por las cantidades realmente recibidas.

### Audit

* **FR38:** El sistema debe registrar las operaciones relevantes.
* **FR39:** El sistema debe conservar información del usuario que realizó cada operación.
* **FR40:** El sistema debe conservar fecha y hora de las operaciones.
* **FR41:** El sistema debe conservar observaciones cuando sean requeridas.
* **FR42:** Los registros de auditoría no deben modificarse mediante operaciones normales del sistema.

### Reports

* **FR43:** El sistema debe permitir consultar stock consolidado.
* **FR44:** El sistema debe permitir consultar movimientos.
* **FR45:** El sistema debe permitir consultar productos con stock bajo.
* **FR46:** El sistema debe permitir consultar transferencias.
* **FR47:** El sistema debe permitir consultar órdenes de compra.
* **FR48:** El sistema debe permitir exportar reportes.

---

# 22. Non-Functional Requirements

## Performance

* Las consultas habituales de inventario deben responder en menos de 1 segundo bajo carga normal.
* Las operaciones críticas de inventario deben ejecutarse de forma transaccional.
* Las consultas deberán utilizar mecanismos adecuados de paginación cuando exista un volumen elevado de información.

## Consistency

* El inventario nunca debe quedar en valores negativos.
* Las operaciones concurrentes deben mantener la consistencia.
* Las operaciones de inventario deben garantizar integridad transaccional.

## Availability

Objetivo inicial de disponibilidad:

**99.5%**

---

## Security

El sistema debe implementar:

* Autenticación.
* Autorización.
* Control de acceso basado en roles.
* Control de alcance por sucursal/bodega.
* Protección de información sensible.
* Auditoría de operaciones relevantes.

---

## Auditability

Las operaciones de inventario deben ser completamente trazables.

Debe ser posible determinar:

```text
Qué ocurrió
Quién lo hizo
Cuándo ocurrió
Sobre qué entidad
Cuál era el valor anterior
Cuál fue el nuevo valor
Por qué ocurrió
```

---

## Scalability

El sistema debe soportar el crecimiento en:

* Número de empresas.
* Número de sucursales.
* Número de bodegas.
* Número de productos.
* Número de movimientos.
* Número de usuarios.

El crecimiento no debe requerir rediseñar completamente el sistema.

---

## Usability

La interfaz debe ser sencilla para usuarios operativos de bodega y requerir una capacitación mínima.

Las operaciones frecuentes deben requerir pocos pasos.

---

## Compatibility

El sistema será accesible mediante una interfaz web responsive.

El MVP debe poder utilizarse desde:

* Computadores.
* Tablets.
* Dispositivos móviles mediante navegador.

No se desarrollará una aplicación móvil nativa en el MVP.

---

# 23. MVP Scope

El MVP incluirá:

### Organización

* Empresas.
* Sucursales.
* Bodegas.
* Bodega predeterminada.
* Usuarios.
* Roles.
* Alcance de usuarios.

### Catálogo

* Productos.
* Categorías.
* Estados de producto.

### Inventario

* Stock por bodega.
* Entradas.
* Salidas.
* Movimientos.
* Conteos.
* Ajustes.
* Aprobaciones.

### Transferencias

* Transferencias entre bodegas.
* Salida de origen.
* Recepción en destino.
* Recepción parcial.
* Diferencias.
* Observaciones.

### Reabastecimiento

* Stock mínimo.
* Stock máximo.
* Alertas.
* Sugerencias.

### Compras

* Proveedores.
* Órdenes de compra.
* Recepción parcial.
* Recepción total.

### Auditoría

* Registro de operaciones.
* Historial.
* Trazabilidad.

### Reportes

* Stock consolidado.
* Movimientos.
* Stock bajo.
* Transferencias.
* Órdenes de compra.

---

# 24. Out of Scope

Las siguientes funcionalidades quedan fuera del MVP:

* Punto de venta (POS).
* Ventas a clientes finales.
* Facturación electrónica.
* Gestión completa de clientes.
* Integraciones con ERP externos.
* Integraciones con proveedores externos.
* Aplicación móvil nativa.
* Pronóstico de demanda mediante IA/ML.
* Automatización completa de compras.
* Gestión de transporte o logística.
* Seguimiento GPS de transferencias.
* Inventario en tránsito.
* Microservicios.
* Arquitectura distribuida.

Estas funcionalidades pueden considerarse para futuras versiones.

---

# 25. Future Features

Después del MVP, StockFlow podrá evolucionar hacia una plataforma más completa.

Posibles funcionalidades:

* Gestión de clientes.
* Ventas.
* Pedidos de clientes.
* POS.
* Facturación.
* Integración con ERP.
* Integración con proveedores.
* Gestión de transporte.
* Inventario en tránsito.
* Aplicación móvil.
* Notificaciones.
* Automatización avanzada de compras.
* Pronóstico de demanda.
* Inteligencia artificial.
* Arquitectura distribuida.

Las futuras funcionalidades relacionadas con ventas deberán utilizar el módulo de inventario como responsable de las operaciones de stock.

Ejemplo:

```text
Venta
   ↓
Solicita salida de inventario
   ↓
Inventory
   ↓
Valida disponibilidad
   ↓
Descuenta stock
   ↓
Registra movimiento
```

---

# 26. Success Criteria

El MVP será considerado exitoso si cumple los siguientes criterios:

* El sistema mantiene la consistencia del inventario bajo operaciones concurrentes.
* El inventario nunca puede quedar negativo.
* El 100% de las modificaciones de inventario quedan registradas.
* Todos los ajustes tienen una observación.
* Los ajustes de operadores requieren aprobación.
* Los ajustes de gerentes y administradores pueden realizarse directamente.
* Las transferencias registran correctamente las salidas y recepciones.
* Las diferencias entre cantidades enviadas y recibidas quedan registradas.
* Los usuarios solamente pueden acceder a información correspondiente a su rol y alcance.
* Las alertas de stock bajo se generan correctamente.
* Las órdenes de compra actualizan el inventario únicamente por cantidades realmente recibidas.
* Las consultas habituales de inventario cumplen el objetivo de rendimiento establecido.
* El sistema permite consultar el historial completo de operaciones.

---

# 27. MVP Success Metrics

Durante una futura etapa piloto podrán medirse:

* Reducción de quiebres de stock.
* Reducción del tiempo utilizado para generar órdenes de compra.
* Precisión del inventario físico frente al inventario registrado.
* Porcentaje de sucursales utilizando StockFlow como fuente principal de información.
* Tiempo promedio de resolución de diferencias de inventario.
* Número de operaciones realizadas sin errores.
* Tiempo promedio de consulta de inventario.

Un objetivo inicial de precisión de inventario podría establecerse en:

**≥ 98%**

El porcentaje de adopción de sucursales y demás métricas de negocio deberán definirse posteriormente con datos reales del escenario empresarial.

---

# 28. Product Principles

StockFlow seguirá los siguientes principios:

### 1. Inventory is the source of truth

El inventario registrado debe representar de forma confiable la existencia física conocida.

### 2. Every change leaves a trace

Toda modificación relevante debe poder ser auditada.

### 3. No silent changes

No deben existir modificaciones de inventario sin motivo, usuario y registro correspondiente.

### 4. Consistency over convenience

Ante operaciones concurrentes, el sistema debe priorizar la consistencia del inventario.

### 5. Modular by domain

Las funcionalidades deben mantenerse separadas por dominio para permitir la evolución futura del sistema.

### 6. Build for the MVP, design for evolution

No se implementarán funcionalidades futuras prematuramente, pero el diseño deberá evitar bloquear su incorporación posterior.
