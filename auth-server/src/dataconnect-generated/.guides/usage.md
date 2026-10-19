# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertCurrentUser, createOrder, updateMyOrder, adminCreateOrder, deleteMyOrder, adminDeleteUserOrders, adminUpdateOrderStatus, adminDeleteOrder, listMyOrders, getMyOrder } from '@dataconnect/generated';


// Operation UpsertCurrentUser: 
const { data } = await UpsertCurrentUser(dataConnect);

// Operation CreateOrder:  For variables, look at type CreateOrderVars in ../index.d.ts
const { data } = await CreateOrder(dataConnect, createOrderVars);

// Operation UpdateMyOrder:  For variables, look at type UpdateMyOrderVars in ../index.d.ts
const { data } = await UpdateMyOrder(dataConnect, updateMyOrderVars);

// Operation AdminCreateOrder:  For variables, look at type AdminCreateOrderVars in ../index.d.ts
const { data } = await AdminCreateOrder(dataConnect, adminCreateOrderVars);

// Operation DeleteMyOrder:  For variables, look at type DeleteMyOrderVars in ../index.d.ts
const { data } = await DeleteMyOrder(dataConnect, deleteMyOrderVars);

// Operation AdminDeleteUserOrders:  For variables, look at type AdminDeleteUserOrdersVars in ../index.d.ts
const { data } = await AdminDeleteUserOrders(dataConnect, adminDeleteUserOrdersVars);

// Operation AdminUpdateOrderStatus:  For variables, look at type AdminUpdateOrderStatusVars in ../index.d.ts
const { data } = await AdminUpdateOrderStatus(dataConnect, adminUpdateOrderStatusVars);

// Operation AdminDeleteOrder:  For variables, look at type AdminDeleteOrderVars in ../index.d.ts
const { data } = await AdminDeleteOrder(dataConnect, adminDeleteOrderVars);

// Operation ListMyOrders: 
const { data } = await ListMyOrders(dataConnect);

// Operation GetMyOrder:  For variables, look at type GetMyOrderVars in ../index.d.ts
const { data } = await GetMyOrder(dataConnect, getMyOrderVars);


```