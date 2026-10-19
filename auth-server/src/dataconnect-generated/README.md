# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `connector`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListMyOrders*](#listmyorders)
  - [*GetMyOrder*](#getmyorder)
  - [*AdminListOrders*](#adminlistorders)
  - [*AdminListOrdersByUser*](#adminlistordersbyuser)
  - [*AdminGetOrder*](#admingetorder)
  - [*ListMyPayments*](#listmypayments)
  - [*GetMyPaymentByKey*](#getmypaymentbykey)
  - [*AdminGetPaymentByKey*](#admingetpaymentbykey)
  - [*AdminListPaymentEvents*](#adminlistpaymentevents)
  - [*AdminListPayments*](#adminlistpayments)
- [**Mutations**](#mutations)
  - [*UpsertCurrentUser*](#upsertcurrentuser)
  - [*CreateOrder*](#createorder)
  - [*UpdateMyOrder*](#updatemyorder)
  - [*AdminCreateOrder*](#admincreateorder)
  - [*DeleteMyOrder*](#deletemyorder)
  - [*AdminDeleteUserData*](#admindeleteuserdata)
  - [*CreateMyPayment*](#createmypayment)
  - [*AdminAddPaymentEvent*](#adminaddpaymentevent)
  - [*AdminFinalizePaymentSuccess*](#adminfinalizepaymentsuccess)
  - [*AdminCorrectFailedPaymentSuccess*](#admincorrectfailedpaymentsuccess)
  - [*AdminFinalizePaymentFailure*](#adminfinalizepaymentfailure)
  - [*AdminUpdateOrderStatus*](#adminupdateorderstatus)
  - [*AdminDeleteOrder*](#admindeleteorder)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `connector`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `connector` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListMyOrders
You can execute the `ListMyOrders` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyOrders(options?: ExecuteQueryOptions): QueryPromise<ListMyOrdersData, undefined>;

interface ListMyOrdersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyOrdersData, undefined>;
}
export const listMyOrdersRef: ListMyOrdersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyOrders(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyOrdersData, undefined>;

interface ListMyOrdersRef {
  ...
  (dc: DataConnect): QueryRef<ListMyOrdersData, undefined>;
}
export const listMyOrdersRef: ListMyOrdersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyOrdersRef:
```typescript
const name = listMyOrdersRef.operationName;
console.log(name);
```

### Variables
The `ListMyOrders` query has no variables.
### Return Type
Recall that executing the `ListMyOrders` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyOrdersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyOrdersData {
  orders: ({
    id: UUIDString;
    service: string;
    deliveryDuration: string;
    deliveryDate: TimestampString;
    comments: string;
    status: OrderStatus;
    userEmail?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Order_Key)[];
}
```
### Using `ListMyOrders`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyOrders } from '@dataconnect/generated';


// Call the `listMyOrders()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyOrders();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyOrders(dataConnect);

console.log(data.orders);

// Or, you can use the `Promise` API.
listMyOrders().then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

### Using `ListMyOrders`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyOrdersRef } from '@dataconnect/generated';


// Call the `listMyOrdersRef()` function to get a reference to the query.
const ref = listMyOrdersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyOrdersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.orders);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

## GetMyOrder
You can execute the `GetMyOrder` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyOrder(vars: GetMyOrderVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyOrderData, GetMyOrderVariables>;

interface GetMyOrderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyOrderVariables): QueryRef<GetMyOrderData, GetMyOrderVariables>;
}
export const getMyOrderRef: GetMyOrderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyOrder(dc: DataConnect, vars: GetMyOrderVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyOrderData, GetMyOrderVariables>;

interface GetMyOrderRef {
  ...
  (dc: DataConnect, vars: GetMyOrderVariables): QueryRef<GetMyOrderData, GetMyOrderVariables>;
}
export const getMyOrderRef: GetMyOrderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyOrderRef:
```typescript
const name = getMyOrderRef.operationName;
console.log(name);
```

### Variables
The `GetMyOrder` query requires an argument of type `GetMyOrderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMyOrderVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetMyOrder` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyOrderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyOrderData {
  orders: ({
    id: UUIDString;
    service: string;
    deliveryDuration: string;
    deliveryDate: TimestampString;
    comments: string;
    status: OrderStatus;
    userEmail?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Order_Key)[];
}
```
### Using `GetMyOrder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyOrder, GetMyOrderVariables } from '@dataconnect/generated';

// The `GetMyOrder` query requires an argument of type `GetMyOrderVariables`:
const getMyOrderVars: GetMyOrderVariables = {
  id: ..., 
};

// Call the `getMyOrder()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyOrder(getMyOrderVars);
// Variables can be defined inline as well.
const { data } = await getMyOrder({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyOrder(dataConnect, getMyOrderVars);

console.log(data.orders);

// Or, you can use the `Promise` API.
getMyOrder(getMyOrderVars).then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

### Using `GetMyOrder`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyOrderRef, GetMyOrderVariables } from '@dataconnect/generated';

// The `GetMyOrder` query requires an argument of type `GetMyOrderVariables`:
const getMyOrderVars: GetMyOrderVariables = {
  id: ..., 
};

// Call the `getMyOrderRef()` function to get a reference to the query.
const ref = getMyOrderRef(getMyOrderVars);
// Variables can be defined inline as well.
const ref = getMyOrderRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyOrderRef(dataConnect, getMyOrderVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.orders);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

## AdminListOrders
You can execute the `AdminListOrders` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminListOrders(options?: ExecuteQueryOptions): QueryPromise<AdminListOrdersData, undefined>;

interface AdminListOrdersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListOrdersData, undefined>;
}
export const adminListOrdersRef: AdminListOrdersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListOrders(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListOrdersData, undefined>;

interface AdminListOrdersRef {
  ...
  (dc: DataConnect): QueryRef<AdminListOrdersData, undefined>;
}
export const adminListOrdersRef: AdminListOrdersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListOrdersRef:
```typescript
const name = adminListOrdersRef.operationName;
console.log(name);
```

### Variables
The `AdminListOrders` query has no variables.
### Return Type
Recall that executing the `AdminListOrders` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListOrdersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListOrdersData {
  orders: ({
    id: UUIDString;
    service: string;
    deliveryDuration: string;
    deliveryDate: TimestampString;
    comments: string;
    status: OrderStatus;
    userEmail?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    user: {
      id: string;
      email?: string | null;
    } & User_Key;
  } & Order_Key)[];
}
```
### Using `AdminListOrders`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListOrders } from '@dataconnect/generated';


// Call the `adminListOrders()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListOrders();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListOrders(dataConnect);

console.log(data.orders);

// Or, you can use the `Promise` API.
adminListOrders().then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

### Using `AdminListOrders`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListOrdersRef } from '@dataconnect/generated';


// Call the `adminListOrdersRef()` function to get a reference to the query.
const ref = adminListOrdersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListOrdersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.orders);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

## AdminListOrdersByUser
You can execute the `AdminListOrdersByUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminListOrdersByUser(vars: AdminListOrdersByUserVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListOrdersByUserData, AdminListOrdersByUserVariables>;

interface AdminListOrdersByUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminListOrdersByUserVariables): QueryRef<AdminListOrdersByUserData, AdminListOrdersByUserVariables>;
}
export const adminListOrdersByUserRef: AdminListOrdersByUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListOrdersByUser(dc: DataConnect, vars: AdminListOrdersByUserVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListOrdersByUserData, AdminListOrdersByUserVariables>;

interface AdminListOrdersByUserRef {
  ...
  (dc: DataConnect, vars: AdminListOrdersByUserVariables): QueryRef<AdminListOrdersByUserData, AdminListOrdersByUserVariables>;
}
export const adminListOrdersByUserRef: AdminListOrdersByUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListOrdersByUserRef:
```typescript
const name = adminListOrdersByUserRef.operationName;
console.log(name);
```

### Variables
The `AdminListOrdersByUser` query requires an argument of type `AdminListOrdersByUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminListOrdersByUserVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `AdminListOrdersByUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListOrdersByUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListOrdersByUserData {
  orders: ({
    id: UUIDString;
    service: string;
    deliveryDuration: string;
    deliveryDate: TimestampString;
    comments: string;
    status: OrderStatus;
    userEmail?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Order_Key)[];
}
```
### Using `AdminListOrdersByUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListOrdersByUser, AdminListOrdersByUserVariables } from '@dataconnect/generated';

// The `AdminListOrdersByUser` query requires an argument of type `AdminListOrdersByUserVariables`:
const adminListOrdersByUserVars: AdminListOrdersByUserVariables = {
  userId: ..., 
};

// Call the `adminListOrdersByUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListOrdersByUser(adminListOrdersByUserVars);
// Variables can be defined inline as well.
const { data } = await adminListOrdersByUser({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListOrdersByUser(dataConnect, adminListOrdersByUserVars);

console.log(data.orders);

// Or, you can use the `Promise` API.
adminListOrdersByUser(adminListOrdersByUserVars).then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

### Using `AdminListOrdersByUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListOrdersByUserRef, AdminListOrdersByUserVariables } from '@dataconnect/generated';

// The `AdminListOrdersByUser` query requires an argument of type `AdminListOrdersByUserVariables`:
const adminListOrdersByUserVars: AdminListOrdersByUserVariables = {
  userId: ..., 
};

// Call the `adminListOrdersByUserRef()` function to get a reference to the query.
const ref = adminListOrdersByUserRef(adminListOrdersByUserVars);
// Variables can be defined inline as well.
const ref = adminListOrdersByUserRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListOrdersByUserRef(dataConnect, adminListOrdersByUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.orders);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

## AdminGetOrder
You can execute the `AdminGetOrder` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminGetOrder(vars: AdminGetOrderVariables, options?: ExecuteQueryOptions): QueryPromise<AdminGetOrderData, AdminGetOrderVariables>;

interface AdminGetOrderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminGetOrderVariables): QueryRef<AdminGetOrderData, AdminGetOrderVariables>;
}
export const adminGetOrderRef: AdminGetOrderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminGetOrder(dc: DataConnect, vars: AdminGetOrderVariables, options?: ExecuteQueryOptions): QueryPromise<AdminGetOrderData, AdminGetOrderVariables>;

interface AdminGetOrderRef {
  ...
  (dc: DataConnect, vars: AdminGetOrderVariables): QueryRef<AdminGetOrderData, AdminGetOrderVariables>;
}
export const adminGetOrderRef: AdminGetOrderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminGetOrderRef:
```typescript
const name = adminGetOrderRef.operationName;
console.log(name);
```

### Variables
The `AdminGetOrder` query requires an argument of type `AdminGetOrderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminGetOrderVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `AdminGetOrder` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminGetOrderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminGetOrderData {
  orders: ({
    id: UUIDString;
    service: string;
    deliveryDuration: string;
    deliveryDate: TimestampString;
    comments: string;
    status: OrderStatus;
    userEmail?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    user: {
      id: string;
      email?: string | null;
    } & User_Key;
  } & Order_Key)[];
}
```
### Using `AdminGetOrder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminGetOrder, AdminGetOrderVariables } from '@dataconnect/generated';

// The `AdminGetOrder` query requires an argument of type `AdminGetOrderVariables`:
const adminGetOrderVars: AdminGetOrderVariables = {
  id: ..., 
};

// Call the `adminGetOrder()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminGetOrder(adminGetOrderVars);
// Variables can be defined inline as well.
const { data } = await adminGetOrder({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminGetOrder(dataConnect, adminGetOrderVars);

console.log(data.orders);

// Or, you can use the `Promise` API.
adminGetOrder(adminGetOrderVars).then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

### Using `AdminGetOrder`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminGetOrderRef, AdminGetOrderVariables } from '@dataconnect/generated';

// The `AdminGetOrder` query requires an argument of type `AdminGetOrderVariables`:
const adminGetOrderVars: AdminGetOrderVariables = {
  id: ..., 
};

// Call the `adminGetOrderRef()` function to get a reference to the query.
const ref = adminGetOrderRef(adminGetOrderVars);
// Variables can be defined inline as well.
const ref = adminGetOrderRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminGetOrderRef(dataConnect, adminGetOrderVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.orders);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

## ListMyPayments
You can execute the `ListMyPayments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyPayments(options?: ExecuteQueryOptions): QueryPromise<ListMyPaymentsData, undefined>;

interface ListMyPaymentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyPaymentsData, undefined>;
}
export const listMyPaymentsRef: ListMyPaymentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyPayments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyPaymentsData, undefined>;

interface ListMyPaymentsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyPaymentsData, undefined>;
}
export const listMyPaymentsRef: ListMyPaymentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyPaymentsRef:
```typescript
const name = listMyPaymentsRef.operationName;
console.log(name);
```

### Variables
The `ListMyPayments` query has no variables.
### Return Type
Recall that executing the `ListMyPayments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyPaymentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyPaymentsData {
  payments: ({
    id: UUIDString;
    checkoutRequestId: string;
    serviceId: string;
    phone: string;
    amount: number;
    status: PaymentStatus;
    mpesaReceipt?: string | null;
    amountPaid?: number | null;
    transactionDate?: string | null;
    failReason?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Payment_Key)[];
}
```
### Using `ListMyPayments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyPayments } from '@dataconnect/generated';


// Call the `listMyPayments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyPayments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyPayments(dataConnect);

console.log(data.payments);

// Or, you can use the `Promise` API.
listMyPayments().then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

### Using `ListMyPayments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyPaymentsRef } from '@dataconnect/generated';


// Call the `listMyPaymentsRef()` function to get a reference to the query.
const ref = listMyPaymentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyPaymentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

## GetMyPaymentByKey
You can execute the `GetMyPaymentByKey` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyPaymentByKey(vars: GetMyPaymentByKeyVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyPaymentByKeyData, GetMyPaymentByKeyVariables>;

interface GetMyPaymentByKeyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyPaymentByKeyVariables): QueryRef<GetMyPaymentByKeyData, GetMyPaymentByKeyVariables>;
}
export const getMyPaymentByKeyRef: GetMyPaymentByKeyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyPaymentByKey(dc: DataConnect, vars: GetMyPaymentByKeyVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyPaymentByKeyData, GetMyPaymentByKeyVariables>;

interface GetMyPaymentByKeyRef {
  ...
  (dc: DataConnect, vars: GetMyPaymentByKeyVariables): QueryRef<GetMyPaymentByKeyData, GetMyPaymentByKeyVariables>;
}
export const getMyPaymentByKeyRef: GetMyPaymentByKeyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyPaymentByKeyRef:
```typescript
const name = getMyPaymentByKeyRef.operationName;
console.log(name);
```

### Variables
The `GetMyPaymentByKey` query requires an argument of type `GetMyPaymentByKeyVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMyPaymentByKeyVariables {
  key: string;
}
```
### Return Type
Recall that executing the `GetMyPaymentByKey` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyPaymentByKeyData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyPaymentByKeyData {
  payments: ({
    id: UUIDString;
    checkoutRequestId: string;
    serviceId: string;
    phone: string;
    amount: number;
    status: PaymentStatus;
    mpesaReceipt?: string | null;
    amountPaid?: number | null;
    transactionDate?: string | null;
    failReason?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Payment_Key)[];
}
```
### Using `GetMyPaymentByKey`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyPaymentByKey, GetMyPaymentByKeyVariables } from '@dataconnect/generated';

// The `GetMyPaymentByKey` query requires an argument of type `GetMyPaymentByKeyVariables`:
const getMyPaymentByKeyVars: GetMyPaymentByKeyVariables = {
  key: ..., 
};

// Call the `getMyPaymentByKey()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyPaymentByKey(getMyPaymentByKeyVars);
// Variables can be defined inline as well.
const { data } = await getMyPaymentByKey({ key: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyPaymentByKey(dataConnect, getMyPaymentByKeyVars);

console.log(data.payments);

// Or, you can use the `Promise` API.
getMyPaymentByKey(getMyPaymentByKeyVars).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

### Using `GetMyPaymentByKey`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyPaymentByKeyRef, GetMyPaymentByKeyVariables } from '@dataconnect/generated';

// The `GetMyPaymentByKey` query requires an argument of type `GetMyPaymentByKeyVariables`:
const getMyPaymentByKeyVars: GetMyPaymentByKeyVariables = {
  key: ..., 
};

// Call the `getMyPaymentByKeyRef()` function to get a reference to the query.
const ref = getMyPaymentByKeyRef(getMyPaymentByKeyVars);
// Variables can be defined inline as well.
const ref = getMyPaymentByKeyRef({ key: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyPaymentByKeyRef(dataConnect, getMyPaymentByKeyVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

## AdminGetPaymentByKey
You can execute the `AdminGetPaymentByKey` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminGetPaymentByKey(vars: AdminGetPaymentByKeyVariables, options?: ExecuteQueryOptions): QueryPromise<AdminGetPaymentByKeyData, AdminGetPaymentByKeyVariables>;

interface AdminGetPaymentByKeyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminGetPaymentByKeyVariables): QueryRef<AdminGetPaymentByKeyData, AdminGetPaymentByKeyVariables>;
}
export const adminGetPaymentByKeyRef: AdminGetPaymentByKeyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminGetPaymentByKey(dc: DataConnect, vars: AdminGetPaymentByKeyVariables, options?: ExecuteQueryOptions): QueryPromise<AdminGetPaymentByKeyData, AdminGetPaymentByKeyVariables>;

interface AdminGetPaymentByKeyRef {
  ...
  (dc: DataConnect, vars: AdminGetPaymentByKeyVariables): QueryRef<AdminGetPaymentByKeyData, AdminGetPaymentByKeyVariables>;
}
export const adminGetPaymentByKeyRef: AdminGetPaymentByKeyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminGetPaymentByKeyRef:
```typescript
const name = adminGetPaymentByKeyRef.operationName;
console.log(name);
```

### Variables
The `AdminGetPaymentByKey` query requires an argument of type `AdminGetPaymentByKeyVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminGetPaymentByKeyVariables {
  key: string;
}
```
### Return Type
Recall that executing the `AdminGetPaymentByKey` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminGetPaymentByKeyData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminGetPaymentByKeyData {
  payments: ({
    id: UUIDString;
    checkoutRequestId: string;
    status: PaymentStatus;
  } & Payment_Key)[];
}
```
### Using `AdminGetPaymentByKey`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminGetPaymentByKey, AdminGetPaymentByKeyVariables } from '@dataconnect/generated';

// The `AdminGetPaymentByKey` query requires an argument of type `AdminGetPaymentByKeyVariables`:
const adminGetPaymentByKeyVars: AdminGetPaymentByKeyVariables = {
  key: ..., 
};

// Call the `adminGetPaymentByKey()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminGetPaymentByKey(adminGetPaymentByKeyVars);
// Variables can be defined inline as well.
const { data } = await adminGetPaymentByKey({ key: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminGetPaymentByKey(dataConnect, adminGetPaymentByKeyVars);

console.log(data.payments);

// Or, you can use the `Promise` API.
adminGetPaymentByKey(adminGetPaymentByKeyVars).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

### Using `AdminGetPaymentByKey`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminGetPaymentByKeyRef, AdminGetPaymentByKeyVariables } from '@dataconnect/generated';

// The `AdminGetPaymentByKey` query requires an argument of type `AdminGetPaymentByKeyVariables`:
const adminGetPaymentByKeyVars: AdminGetPaymentByKeyVariables = {
  key: ..., 
};

// Call the `adminGetPaymentByKeyRef()` function to get a reference to the query.
const ref = adminGetPaymentByKeyRef(adminGetPaymentByKeyVars);
// Variables can be defined inline as well.
const ref = adminGetPaymentByKeyRef({ key: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminGetPaymentByKeyRef(dataConnect, adminGetPaymentByKeyVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

## AdminListPaymentEvents
You can execute the `AdminListPaymentEvents` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminListPaymentEvents(vars: AdminListPaymentEventsVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListPaymentEventsData, AdminListPaymentEventsVariables>;

interface AdminListPaymentEventsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminListPaymentEventsVariables): QueryRef<AdminListPaymentEventsData, AdminListPaymentEventsVariables>;
}
export const adminListPaymentEventsRef: AdminListPaymentEventsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListPaymentEvents(dc: DataConnect, vars: AdminListPaymentEventsVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListPaymentEventsData, AdminListPaymentEventsVariables>;

interface AdminListPaymentEventsRef {
  ...
  (dc: DataConnect, vars: AdminListPaymentEventsVariables): QueryRef<AdminListPaymentEventsData, AdminListPaymentEventsVariables>;
}
export const adminListPaymentEventsRef: AdminListPaymentEventsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListPaymentEventsRef:
```typescript
const name = adminListPaymentEventsRef.operationName;
console.log(name);
```

### Variables
The `AdminListPaymentEvents` query requires an argument of type `AdminListPaymentEventsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminListPaymentEventsVariables {
  paymentId: UUIDString;
}
```
### Return Type
Recall that executing the `AdminListPaymentEvents` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListPaymentEventsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListPaymentEventsData {
  paymentEvents: ({
    eventCode: string;
    message: string;
    createdAt: TimestampString;
  })[];
}
```
### Using `AdminListPaymentEvents`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListPaymentEvents, AdminListPaymentEventsVariables } from '@dataconnect/generated';

// The `AdminListPaymentEvents` query requires an argument of type `AdminListPaymentEventsVariables`:
const adminListPaymentEventsVars: AdminListPaymentEventsVariables = {
  paymentId: ..., 
};

// Call the `adminListPaymentEvents()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListPaymentEvents(adminListPaymentEventsVars);
// Variables can be defined inline as well.
const { data } = await adminListPaymentEvents({ paymentId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListPaymentEvents(dataConnect, adminListPaymentEventsVars);

console.log(data.paymentEvents);

// Or, you can use the `Promise` API.
adminListPaymentEvents(adminListPaymentEventsVars).then((response) => {
  const data = response.data;
  console.log(data.paymentEvents);
});
```

### Using `AdminListPaymentEvents`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListPaymentEventsRef, AdminListPaymentEventsVariables } from '@dataconnect/generated';

// The `AdminListPaymentEvents` query requires an argument of type `AdminListPaymentEventsVariables`:
const adminListPaymentEventsVars: AdminListPaymentEventsVariables = {
  paymentId: ..., 
};

// Call the `adminListPaymentEventsRef()` function to get a reference to the query.
const ref = adminListPaymentEventsRef(adminListPaymentEventsVars);
// Variables can be defined inline as well.
const ref = adminListPaymentEventsRef({ paymentId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListPaymentEventsRef(dataConnect, adminListPaymentEventsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.paymentEvents);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.paymentEvents);
});
```

## AdminListPayments
You can execute the `AdminListPayments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminListPayments(options?: ExecuteQueryOptions): QueryPromise<AdminListPaymentsData, undefined>;

interface AdminListPaymentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListPaymentsData, undefined>;
}
export const adminListPaymentsRef: AdminListPaymentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListPayments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListPaymentsData, undefined>;

interface AdminListPaymentsRef {
  ...
  (dc: DataConnect): QueryRef<AdminListPaymentsData, undefined>;
}
export const adminListPaymentsRef: AdminListPaymentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListPaymentsRef:
```typescript
const name = adminListPaymentsRef.operationName;
console.log(name);
```

### Variables
The `AdminListPayments` query has no variables.
### Return Type
Recall that executing the `AdminListPayments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListPaymentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListPaymentsData {
  payments: ({
    id: UUIDString;
    checkoutRequestId: string;
    serviceId: string;
    phone: string;
    amount: number;
    status: PaymentStatus;
    mpesaReceipt?: string | null;
    amountPaid?: number | null;
    transactionDate?: string | null;
    payerPhone?: string | null;
    failReason?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    user: {
      id: string;
      email?: string | null;
    } & User_Key;
  } & Payment_Key)[];
}
```
### Using `AdminListPayments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListPayments } from '@dataconnect/generated';


// Call the `adminListPayments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListPayments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListPayments(dataConnect);

console.log(data.payments);

// Or, you can use the `Promise` API.
adminListPayments().then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

### Using `AdminListPayments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListPaymentsRef } from '@dataconnect/generated';


// Call the `adminListPaymentsRef()` function to get a reference to the query.
const ref = adminListPaymentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListPaymentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `connector` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertCurrentUser
You can execute the `UpsertCurrentUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertCurrentUser(): MutationPromise<UpsertCurrentUserData, undefined>;

interface UpsertCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpsertCurrentUserData, undefined>;
}
export const upsertCurrentUserRef: UpsertCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertCurrentUser(dc: DataConnect): MutationPromise<UpsertCurrentUserData, undefined>;

interface UpsertCurrentUserRef {
  ...
  (dc: DataConnect): MutationRef<UpsertCurrentUserData, undefined>;
}
export const upsertCurrentUserRef: UpsertCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertCurrentUserRef:
```typescript
const name = upsertCurrentUserRef.operationName;
console.log(name);
```

### Variables
The `UpsertCurrentUser` mutation has no variables.
### Return Type
Recall that executing the `UpsertCurrentUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertCurrentUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertCurrentUser } from '@dataconnect/generated';


// Call the `upsertCurrentUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertCurrentUser(dataConnect);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertCurrentUser().then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertCurrentUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertCurrentUserRef } from '@dataconnect/generated';


// Call the `upsertCurrentUserRef()` function to get a reference to the mutation.
const ref = upsertCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertCurrentUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## CreateOrder
You can execute the `CreateOrder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createOrder(vars: CreateOrderVariables): MutationPromise<CreateOrderData, CreateOrderVariables>;

interface CreateOrderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrderVariables): MutationRef<CreateOrderData, CreateOrderVariables>;
}
export const createOrderRef: CreateOrderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createOrder(dc: DataConnect, vars: CreateOrderVariables): MutationPromise<CreateOrderData, CreateOrderVariables>;

interface CreateOrderRef {
  ...
  (dc: DataConnect, vars: CreateOrderVariables): MutationRef<CreateOrderData, CreateOrderVariables>;
}
export const createOrderRef: CreateOrderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createOrderRef:
```typescript
const name = createOrderRef.operationName;
console.log(name);
```

### Variables
The `CreateOrder` mutation requires an argument of type `CreateOrderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateOrderVariables {
  service: string;
  deliveryDuration: string;
  deliveryDate: TimestampString;
  comments?: string | null;
}
```
### Return Type
Recall that executing the `CreateOrder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateOrderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateOrderData {
  order_insert: Order_Key;
}
```
### Using `CreateOrder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createOrder, CreateOrderVariables } from '@dataconnect/generated';

// The `CreateOrder` mutation requires an argument of type `CreateOrderVariables`:
const createOrderVars: CreateOrderVariables = {
  service: ..., 
  deliveryDuration: ..., 
  deliveryDate: ..., 
  comments: ..., // optional
};

// Call the `createOrder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createOrder(createOrderVars);
// Variables can be defined inline as well.
const { data } = await createOrder({ service: ..., deliveryDuration: ..., deliveryDate: ..., comments: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createOrder(dataConnect, createOrderVars);

console.log(data.order_insert);

// Or, you can use the `Promise` API.
createOrder(createOrderVars).then((response) => {
  const data = response.data;
  console.log(data.order_insert);
});
```

### Using `CreateOrder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createOrderRef, CreateOrderVariables } from '@dataconnect/generated';

// The `CreateOrder` mutation requires an argument of type `CreateOrderVariables`:
const createOrderVars: CreateOrderVariables = {
  service: ..., 
  deliveryDuration: ..., 
  deliveryDate: ..., 
  comments: ..., // optional
};

// Call the `createOrderRef()` function to get a reference to the mutation.
const ref = createOrderRef(createOrderVars);
// Variables can be defined inline as well.
const ref = createOrderRef({ service: ..., deliveryDuration: ..., deliveryDate: ..., comments: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createOrderRef(dataConnect, createOrderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.order_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.order_insert);
});
```

## UpdateMyOrder
You can execute the `UpdateMyOrder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateMyOrder(vars: UpdateMyOrderVariables): MutationPromise<UpdateMyOrderData, UpdateMyOrderVariables>;

interface UpdateMyOrderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMyOrderVariables): MutationRef<UpdateMyOrderData, UpdateMyOrderVariables>;
}
export const updateMyOrderRef: UpdateMyOrderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMyOrder(dc: DataConnect, vars: UpdateMyOrderVariables): MutationPromise<UpdateMyOrderData, UpdateMyOrderVariables>;

interface UpdateMyOrderRef {
  ...
  (dc: DataConnect, vars: UpdateMyOrderVariables): MutationRef<UpdateMyOrderData, UpdateMyOrderVariables>;
}
export const updateMyOrderRef: UpdateMyOrderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMyOrderRef:
```typescript
const name = updateMyOrderRef.operationName;
console.log(name);
```

### Variables
The `UpdateMyOrder` mutation requires an argument of type `UpdateMyOrderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMyOrderVariables {
  id: UUIDString;
  service?: string | null;
  deliveryDuration?: string | null;
  deliveryDate?: TimestampString | null;
  comments?: string | null;
}
```
### Return Type
Recall that executing the `UpdateMyOrder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMyOrderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMyOrderData {
  order_updateMany: number;
}
```
### Using `UpdateMyOrder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMyOrder, UpdateMyOrderVariables } from '@dataconnect/generated';

// The `UpdateMyOrder` mutation requires an argument of type `UpdateMyOrderVariables`:
const updateMyOrderVars: UpdateMyOrderVariables = {
  id: ..., 
  service: ..., // optional
  deliveryDuration: ..., // optional
  deliveryDate: ..., // optional
  comments: ..., // optional
};

// Call the `updateMyOrder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMyOrder(updateMyOrderVars);
// Variables can be defined inline as well.
const { data } = await updateMyOrder({ id: ..., service: ..., deliveryDuration: ..., deliveryDate: ..., comments: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMyOrder(dataConnect, updateMyOrderVars);

console.log(data.order_updateMany);

// Or, you can use the `Promise` API.
updateMyOrder(updateMyOrderVars).then((response) => {
  const data = response.data;
  console.log(data.order_updateMany);
});
```

### Using `UpdateMyOrder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMyOrderRef, UpdateMyOrderVariables } from '@dataconnect/generated';

// The `UpdateMyOrder` mutation requires an argument of type `UpdateMyOrderVariables`:
const updateMyOrderVars: UpdateMyOrderVariables = {
  id: ..., 
  service: ..., // optional
  deliveryDuration: ..., // optional
  deliveryDate: ..., // optional
  comments: ..., // optional
};

// Call the `updateMyOrderRef()` function to get a reference to the mutation.
const ref = updateMyOrderRef(updateMyOrderVars);
// Variables can be defined inline as well.
const ref = updateMyOrderRef({ id: ..., service: ..., deliveryDuration: ..., deliveryDate: ..., comments: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMyOrderRef(dataConnect, updateMyOrderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.order_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.order_updateMany);
});
```

## AdminCreateOrder
You can execute the `AdminCreateOrder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminCreateOrder(vars: AdminCreateOrderVariables): MutationPromise<AdminCreateOrderData, AdminCreateOrderVariables>;

interface AdminCreateOrderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateOrderVariables): MutationRef<AdminCreateOrderData, AdminCreateOrderVariables>;
}
export const adminCreateOrderRef: AdminCreateOrderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminCreateOrder(dc: DataConnect, vars: AdminCreateOrderVariables): MutationPromise<AdminCreateOrderData, AdminCreateOrderVariables>;

interface AdminCreateOrderRef {
  ...
  (dc: DataConnect, vars: AdminCreateOrderVariables): MutationRef<AdminCreateOrderData, AdminCreateOrderVariables>;
}
export const adminCreateOrderRef: AdminCreateOrderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCreateOrderRef:
```typescript
const name = adminCreateOrderRef.operationName;
console.log(name);
```

### Variables
The `AdminCreateOrder` mutation requires an argument of type `AdminCreateOrderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminCreateOrderVariables {
  userId: string;
  userEmail?: string | null;
  service: string;
  deliveryDuration: string;
  deliveryDate: TimestampString;
  comments?: string | null;
}
```
### Return Type
Recall that executing the `AdminCreateOrder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCreateOrderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCreateOrderData {
  user_upsert: User_Key;
  order_insert: Order_Key;
}
```
### Using `AdminCreateOrder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCreateOrder, AdminCreateOrderVariables } from '@dataconnect/generated';

// The `AdminCreateOrder` mutation requires an argument of type `AdminCreateOrderVariables`:
const adminCreateOrderVars: AdminCreateOrderVariables = {
  userId: ..., 
  userEmail: ..., // optional
  service: ..., 
  deliveryDuration: ..., 
  deliveryDate: ..., 
  comments: ..., // optional
};

// Call the `adminCreateOrder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCreateOrder(adminCreateOrderVars);
// Variables can be defined inline as well.
const { data } = await adminCreateOrder({ userId: ..., userEmail: ..., service: ..., deliveryDuration: ..., deliveryDate: ..., comments: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCreateOrder(dataConnect, adminCreateOrderVars);

console.log(data.user_upsert);
console.log(data.order_insert);

// Or, you can use the `Promise` API.
adminCreateOrder(adminCreateOrderVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
  console.log(data.order_insert);
});
```

### Using `AdminCreateOrder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminCreateOrderRef, AdminCreateOrderVariables } from '@dataconnect/generated';

// The `AdminCreateOrder` mutation requires an argument of type `AdminCreateOrderVariables`:
const adminCreateOrderVars: AdminCreateOrderVariables = {
  userId: ..., 
  userEmail: ..., // optional
  service: ..., 
  deliveryDuration: ..., 
  deliveryDate: ..., 
  comments: ..., // optional
};

// Call the `adminCreateOrderRef()` function to get a reference to the mutation.
const ref = adminCreateOrderRef(adminCreateOrderVars);
// Variables can be defined inline as well.
const ref = adminCreateOrderRef({ userId: ..., userEmail: ..., service: ..., deliveryDuration: ..., deliveryDate: ..., comments: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCreateOrderRef(dataConnect, adminCreateOrderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);
console.log(data.order_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
  console.log(data.order_insert);
});
```

## DeleteMyOrder
You can execute the `DeleteMyOrder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteMyOrder(vars: DeleteMyOrderVariables): MutationPromise<DeleteMyOrderData, DeleteMyOrderVariables>;

interface DeleteMyOrderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMyOrderVariables): MutationRef<DeleteMyOrderData, DeleteMyOrderVariables>;
}
export const deleteMyOrderRef: DeleteMyOrderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteMyOrder(dc: DataConnect, vars: DeleteMyOrderVariables): MutationPromise<DeleteMyOrderData, DeleteMyOrderVariables>;

interface DeleteMyOrderRef {
  ...
  (dc: DataConnect, vars: DeleteMyOrderVariables): MutationRef<DeleteMyOrderData, DeleteMyOrderVariables>;
}
export const deleteMyOrderRef: DeleteMyOrderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteMyOrderRef:
```typescript
const name = deleteMyOrderRef.operationName;
console.log(name);
```

### Variables
The `DeleteMyOrder` mutation requires an argument of type `DeleteMyOrderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteMyOrderVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteMyOrder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteMyOrderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteMyOrderData {
  order_deleteMany: number;
}
```
### Using `DeleteMyOrder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteMyOrder, DeleteMyOrderVariables } from '@dataconnect/generated';

// The `DeleteMyOrder` mutation requires an argument of type `DeleteMyOrderVariables`:
const deleteMyOrderVars: DeleteMyOrderVariables = {
  id: ..., 
};

// Call the `deleteMyOrder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteMyOrder(deleteMyOrderVars);
// Variables can be defined inline as well.
const { data } = await deleteMyOrder({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteMyOrder(dataConnect, deleteMyOrderVars);

console.log(data.order_deleteMany);

// Or, you can use the `Promise` API.
deleteMyOrder(deleteMyOrderVars).then((response) => {
  const data = response.data;
  console.log(data.order_deleteMany);
});
```

### Using `DeleteMyOrder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteMyOrderRef, DeleteMyOrderVariables } from '@dataconnect/generated';

// The `DeleteMyOrder` mutation requires an argument of type `DeleteMyOrderVariables`:
const deleteMyOrderVars: DeleteMyOrderVariables = {
  id: ..., 
};

// Call the `deleteMyOrderRef()` function to get a reference to the mutation.
const ref = deleteMyOrderRef(deleteMyOrderVars);
// Variables can be defined inline as well.
const ref = deleteMyOrderRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteMyOrderRef(dataConnect, deleteMyOrderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.order_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.order_deleteMany);
});
```

## AdminDeleteUserData
You can execute the `AdminDeleteUserData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminDeleteUserData(vars: AdminDeleteUserDataVariables): MutationPromise<AdminDeleteUserDataData, AdminDeleteUserDataVariables>;

interface AdminDeleteUserDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminDeleteUserDataVariables): MutationRef<AdminDeleteUserDataData, AdminDeleteUserDataVariables>;
}
export const adminDeleteUserDataRef: AdminDeleteUserDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminDeleteUserData(dc: DataConnect, vars: AdminDeleteUserDataVariables): MutationPromise<AdminDeleteUserDataData, AdminDeleteUserDataVariables>;

interface AdminDeleteUserDataRef {
  ...
  (dc: DataConnect, vars: AdminDeleteUserDataVariables): MutationRef<AdminDeleteUserDataData, AdminDeleteUserDataVariables>;
}
export const adminDeleteUserDataRef: AdminDeleteUserDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminDeleteUserDataRef:
```typescript
const name = adminDeleteUserDataRef.operationName;
console.log(name);
```

### Variables
The `AdminDeleteUserData` mutation requires an argument of type `AdminDeleteUserDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminDeleteUserDataVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `AdminDeleteUserData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminDeleteUserDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminDeleteUserDataData {
  paymentEvent_deleteMany: number;
  payment_deleteMany: number;
  order_deleteMany: number;
  user_deleteMany: number;
}
```
### Using `AdminDeleteUserData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminDeleteUserData, AdminDeleteUserDataVariables } from '@dataconnect/generated';

// The `AdminDeleteUserData` mutation requires an argument of type `AdminDeleteUserDataVariables`:
const adminDeleteUserDataVars: AdminDeleteUserDataVariables = {
  uid: ..., 
};

// Call the `adminDeleteUserData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminDeleteUserData(adminDeleteUserDataVars);
// Variables can be defined inline as well.
const { data } = await adminDeleteUserData({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminDeleteUserData(dataConnect, adminDeleteUserDataVars);

console.log(data.paymentEvent_deleteMany);
console.log(data.payment_deleteMany);
console.log(data.order_deleteMany);
console.log(data.user_deleteMany);

// Or, you can use the `Promise` API.
adminDeleteUserData(adminDeleteUserDataVars).then((response) => {
  const data = response.data;
  console.log(data.paymentEvent_deleteMany);
  console.log(data.payment_deleteMany);
  console.log(data.order_deleteMany);
  console.log(data.user_deleteMany);
});
```

### Using `AdminDeleteUserData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminDeleteUserDataRef, AdminDeleteUserDataVariables } from '@dataconnect/generated';

// The `AdminDeleteUserData` mutation requires an argument of type `AdminDeleteUserDataVariables`:
const adminDeleteUserDataVars: AdminDeleteUserDataVariables = {
  uid: ..., 
};

// Call the `adminDeleteUserDataRef()` function to get a reference to the mutation.
const ref = adminDeleteUserDataRef(adminDeleteUserDataVars);
// Variables can be defined inline as well.
const ref = adminDeleteUserDataRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminDeleteUserDataRef(dataConnect, adminDeleteUserDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.paymentEvent_deleteMany);
console.log(data.payment_deleteMany);
console.log(data.order_deleteMany);
console.log(data.user_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.paymentEvent_deleteMany);
  console.log(data.payment_deleteMany);
  console.log(data.order_deleteMany);
  console.log(data.user_deleteMany);
});
```

## CreateMyPayment
You can execute the `CreateMyPayment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createMyPayment(vars: CreateMyPaymentVariables): MutationPromise<CreateMyPaymentData, CreateMyPaymentVariables>;

interface CreateMyPaymentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMyPaymentVariables): MutationRef<CreateMyPaymentData, CreateMyPaymentVariables>;
}
export const createMyPaymentRef: CreateMyPaymentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMyPayment(dc: DataConnect, vars: CreateMyPaymentVariables): MutationPromise<CreateMyPaymentData, CreateMyPaymentVariables>;

interface CreateMyPaymentRef {
  ...
  (dc: DataConnect, vars: CreateMyPaymentVariables): MutationRef<CreateMyPaymentData, CreateMyPaymentVariables>;
}
export const createMyPaymentRef: CreateMyPaymentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMyPaymentRef:
```typescript
const name = createMyPaymentRef.operationName;
console.log(name);
```

### Variables
The `CreateMyPayment` mutation requires an argument of type `CreateMyPaymentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMyPaymentVariables {
  checkoutRequestId: string;
  merchantRequestId?: string | null;
  serviceId: string;
  phone: string;
  amount: number;
}
```
### Return Type
Recall that executing the `CreateMyPayment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMyPaymentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMyPaymentData {
  payment_insert: Payment_Key;
}
```
### Using `CreateMyPayment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMyPayment, CreateMyPaymentVariables } from '@dataconnect/generated';

// The `CreateMyPayment` mutation requires an argument of type `CreateMyPaymentVariables`:
const createMyPaymentVars: CreateMyPaymentVariables = {
  checkoutRequestId: ..., 
  merchantRequestId: ..., // optional
  serviceId: ..., 
  phone: ..., 
  amount: ..., 
};

// Call the `createMyPayment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMyPayment(createMyPaymentVars);
// Variables can be defined inline as well.
const { data } = await createMyPayment({ checkoutRequestId: ..., merchantRequestId: ..., serviceId: ..., phone: ..., amount: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMyPayment(dataConnect, createMyPaymentVars);

console.log(data.payment_insert);

// Or, you can use the `Promise` API.
createMyPayment(createMyPaymentVars).then((response) => {
  const data = response.data;
  console.log(data.payment_insert);
});
```

### Using `CreateMyPayment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMyPaymentRef, CreateMyPaymentVariables } from '@dataconnect/generated';

// The `CreateMyPayment` mutation requires an argument of type `CreateMyPaymentVariables`:
const createMyPaymentVars: CreateMyPaymentVariables = {
  checkoutRequestId: ..., 
  merchantRequestId: ..., // optional
  serviceId: ..., 
  phone: ..., 
  amount: ..., 
};

// Call the `createMyPaymentRef()` function to get a reference to the mutation.
const ref = createMyPaymentRef(createMyPaymentVars);
// Variables can be defined inline as well.
const ref = createMyPaymentRef({ checkoutRequestId: ..., merchantRequestId: ..., serviceId: ..., phone: ..., amount: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMyPaymentRef(dataConnect, createMyPaymentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payment_insert);
});
```

## AdminAddPaymentEvent
You can execute the `AdminAddPaymentEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminAddPaymentEvent(vars: AdminAddPaymentEventVariables): MutationPromise<AdminAddPaymentEventData, AdminAddPaymentEventVariables>;

interface AdminAddPaymentEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminAddPaymentEventVariables): MutationRef<AdminAddPaymentEventData, AdminAddPaymentEventVariables>;
}
export const adminAddPaymentEventRef: AdminAddPaymentEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminAddPaymentEvent(dc: DataConnect, vars: AdminAddPaymentEventVariables): MutationPromise<AdminAddPaymentEventData, AdminAddPaymentEventVariables>;

interface AdminAddPaymentEventRef {
  ...
  (dc: DataConnect, vars: AdminAddPaymentEventVariables): MutationRef<AdminAddPaymentEventData, AdminAddPaymentEventVariables>;
}
export const adminAddPaymentEventRef: AdminAddPaymentEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminAddPaymentEventRef:
```typescript
const name = adminAddPaymentEventRef.operationName;
console.log(name);
```

### Variables
The `AdminAddPaymentEvent` mutation requires an argument of type `AdminAddPaymentEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminAddPaymentEventVariables {
  paymentId: UUIDString;
  eventCode: string;
  message: string;
}
```
### Return Type
Recall that executing the `AdminAddPaymentEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminAddPaymentEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminAddPaymentEventData {
  paymentEvent_insert: PaymentEvent_Key;
}
```
### Using `AdminAddPaymentEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminAddPaymentEvent, AdminAddPaymentEventVariables } from '@dataconnect/generated';

// The `AdminAddPaymentEvent` mutation requires an argument of type `AdminAddPaymentEventVariables`:
const adminAddPaymentEventVars: AdminAddPaymentEventVariables = {
  paymentId: ..., 
  eventCode: ..., 
  message: ..., 
};

// Call the `adminAddPaymentEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminAddPaymentEvent(adminAddPaymentEventVars);
// Variables can be defined inline as well.
const { data } = await adminAddPaymentEvent({ paymentId: ..., eventCode: ..., message: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminAddPaymentEvent(dataConnect, adminAddPaymentEventVars);

console.log(data.paymentEvent_insert);

// Or, you can use the `Promise` API.
adminAddPaymentEvent(adminAddPaymentEventVars).then((response) => {
  const data = response.data;
  console.log(data.paymentEvent_insert);
});
```

### Using `AdminAddPaymentEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminAddPaymentEventRef, AdminAddPaymentEventVariables } from '@dataconnect/generated';

// The `AdminAddPaymentEvent` mutation requires an argument of type `AdminAddPaymentEventVariables`:
const adminAddPaymentEventVars: AdminAddPaymentEventVariables = {
  paymentId: ..., 
  eventCode: ..., 
  message: ..., 
};

// Call the `adminAddPaymentEventRef()` function to get a reference to the mutation.
const ref = adminAddPaymentEventRef(adminAddPaymentEventVars);
// Variables can be defined inline as well.
const ref = adminAddPaymentEventRef({ paymentId: ..., eventCode: ..., message: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminAddPaymentEventRef(dataConnect, adminAddPaymentEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.paymentEvent_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.paymentEvent_insert);
});
```

## AdminFinalizePaymentSuccess
You can execute the `AdminFinalizePaymentSuccess` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminFinalizePaymentSuccess(vars: AdminFinalizePaymentSuccessVariables): MutationPromise<AdminFinalizePaymentSuccessData, AdminFinalizePaymentSuccessVariables>;

interface AdminFinalizePaymentSuccessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminFinalizePaymentSuccessVariables): MutationRef<AdminFinalizePaymentSuccessData, AdminFinalizePaymentSuccessVariables>;
}
export const adminFinalizePaymentSuccessRef: AdminFinalizePaymentSuccessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminFinalizePaymentSuccess(dc: DataConnect, vars: AdminFinalizePaymentSuccessVariables): MutationPromise<AdminFinalizePaymentSuccessData, AdminFinalizePaymentSuccessVariables>;

interface AdminFinalizePaymentSuccessRef {
  ...
  (dc: DataConnect, vars: AdminFinalizePaymentSuccessVariables): MutationRef<AdminFinalizePaymentSuccessData, AdminFinalizePaymentSuccessVariables>;
}
export const adminFinalizePaymentSuccessRef: AdminFinalizePaymentSuccessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminFinalizePaymentSuccessRef:
```typescript
const name = adminFinalizePaymentSuccessRef.operationName;
console.log(name);
```

### Variables
The `AdminFinalizePaymentSuccess` mutation requires an argument of type `AdminFinalizePaymentSuccessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminFinalizePaymentSuccessVariables {
  key: string;
  receipt?: string | null;
  amountPaid?: number | null;
  transactionDate?: string | null;
  payerPhone?: string | null;
}
```
### Return Type
Recall that executing the `AdminFinalizePaymentSuccess` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminFinalizePaymentSuccessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminFinalizePaymentSuccessData {
  payment_updateMany: number;
}
```
### Using `AdminFinalizePaymentSuccess`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminFinalizePaymentSuccess, AdminFinalizePaymentSuccessVariables } from '@dataconnect/generated';

// The `AdminFinalizePaymentSuccess` mutation requires an argument of type `AdminFinalizePaymentSuccessVariables`:
const adminFinalizePaymentSuccessVars: AdminFinalizePaymentSuccessVariables = {
  key: ..., 
  receipt: ..., // optional
  amountPaid: ..., // optional
  transactionDate: ..., // optional
  payerPhone: ..., // optional
};

// Call the `adminFinalizePaymentSuccess()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminFinalizePaymentSuccess(adminFinalizePaymentSuccessVars);
// Variables can be defined inline as well.
const { data } = await adminFinalizePaymentSuccess({ key: ..., receipt: ..., amountPaid: ..., transactionDate: ..., payerPhone: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminFinalizePaymentSuccess(dataConnect, adminFinalizePaymentSuccessVars);

console.log(data.payment_updateMany);

// Or, you can use the `Promise` API.
adminFinalizePaymentSuccess(adminFinalizePaymentSuccessVars).then((response) => {
  const data = response.data;
  console.log(data.payment_updateMany);
});
```

### Using `AdminFinalizePaymentSuccess`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminFinalizePaymentSuccessRef, AdminFinalizePaymentSuccessVariables } from '@dataconnect/generated';

// The `AdminFinalizePaymentSuccess` mutation requires an argument of type `AdminFinalizePaymentSuccessVariables`:
const adminFinalizePaymentSuccessVars: AdminFinalizePaymentSuccessVariables = {
  key: ..., 
  receipt: ..., // optional
  amountPaid: ..., // optional
  transactionDate: ..., // optional
  payerPhone: ..., // optional
};

// Call the `adminFinalizePaymentSuccessRef()` function to get a reference to the mutation.
const ref = adminFinalizePaymentSuccessRef(adminFinalizePaymentSuccessVars);
// Variables can be defined inline as well.
const ref = adminFinalizePaymentSuccessRef({ key: ..., receipt: ..., amountPaid: ..., transactionDate: ..., payerPhone: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminFinalizePaymentSuccessRef(dataConnect, adminFinalizePaymentSuccessVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payment_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payment_updateMany);
});
```

## AdminCorrectFailedPaymentSuccess
You can execute the `AdminCorrectFailedPaymentSuccess` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminCorrectFailedPaymentSuccess(vars: AdminCorrectFailedPaymentSuccessVariables): MutationPromise<AdminCorrectFailedPaymentSuccessData, AdminCorrectFailedPaymentSuccessVariables>;

interface AdminCorrectFailedPaymentSuccessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCorrectFailedPaymentSuccessVariables): MutationRef<AdminCorrectFailedPaymentSuccessData, AdminCorrectFailedPaymentSuccessVariables>;
}
export const adminCorrectFailedPaymentSuccessRef: AdminCorrectFailedPaymentSuccessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminCorrectFailedPaymentSuccess(dc: DataConnect, vars: AdminCorrectFailedPaymentSuccessVariables): MutationPromise<AdminCorrectFailedPaymentSuccessData, AdminCorrectFailedPaymentSuccessVariables>;

interface AdminCorrectFailedPaymentSuccessRef {
  ...
  (dc: DataConnect, vars: AdminCorrectFailedPaymentSuccessVariables): MutationRef<AdminCorrectFailedPaymentSuccessData, AdminCorrectFailedPaymentSuccessVariables>;
}
export const adminCorrectFailedPaymentSuccessRef: AdminCorrectFailedPaymentSuccessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCorrectFailedPaymentSuccessRef:
```typescript
const name = adminCorrectFailedPaymentSuccessRef.operationName;
console.log(name);
```

### Variables
The `AdminCorrectFailedPaymentSuccess` mutation requires an argument of type `AdminCorrectFailedPaymentSuccessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminCorrectFailedPaymentSuccessVariables {
  key: string;
  receipt?: string | null;
  amountPaid?: number | null;
  transactionDate?: string | null;
  payerPhone?: string | null;
}
```
### Return Type
Recall that executing the `AdminCorrectFailedPaymentSuccess` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCorrectFailedPaymentSuccessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCorrectFailedPaymentSuccessData {
  payment_updateMany: number;
}
```
### Using `AdminCorrectFailedPaymentSuccess`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCorrectFailedPaymentSuccess, AdminCorrectFailedPaymentSuccessVariables } from '@dataconnect/generated';

// The `AdminCorrectFailedPaymentSuccess` mutation requires an argument of type `AdminCorrectFailedPaymentSuccessVariables`:
const adminCorrectFailedPaymentSuccessVars: AdminCorrectFailedPaymentSuccessVariables = {
  key: ..., 
  receipt: ..., // optional
  amountPaid: ..., // optional
  transactionDate: ..., // optional
  payerPhone: ..., // optional
};

// Call the `adminCorrectFailedPaymentSuccess()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCorrectFailedPaymentSuccess(adminCorrectFailedPaymentSuccessVars);
// Variables can be defined inline as well.
const { data } = await adminCorrectFailedPaymentSuccess({ key: ..., receipt: ..., amountPaid: ..., transactionDate: ..., payerPhone: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCorrectFailedPaymentSuccess(dataConnect, adminCorrectFailedPaymentSuccessVars);

console.log(data.payment_updateMany);

// Or, you can use the `Promise` API.
adminCorrectFailedPaymentSuccess(adminCorrectFailedPaymentSuccessVars).then((response) => {
  const data = response.data;
  console.log(data.payment_updateMany);
});
```

### Using `AdminCorrectFailedPaymentSuccess`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminCorrectFailedPaymentSuccessRef, AdminCorrectFailedPaymentSuccessVariables } from '@dataconnect/generated';

// The `AdminCorrectFailedPaymentSuccess` mutation requires an argument of type `AdminCorrectFailedPaymentSuccessVariables`:
const adminCorrectFailedPaymentSuccessVars: AdminCorrectFailedPaymentSuccessVariables = {
  key: ..., 
  receipt: ..., // optional
  amountPaid: ..., // optional
  transactionDate: ..., // optional
  payerPhone: ..., // optional
};

// Call the `adminCorrectFailedPaymentSuccessRef()` function to get a reference to the mutation.
const ref = adminCorrectFailedPaymentSuccessRef(adminCorrectFailedPaymentSuccessVars);
// Variables can be defined inline as well.
const ref = adminCorrectFailedPaymentSuccessRef({ key: ..., receipt: ..., amountPaid: ..., transactionDate: ..., payerPhone: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCorrectFailedPaymentSuccessRef(dataConnect, adminCorrectFailedPaymentSuccessVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payment_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payment_updateMany);
});
```

## AdminFinalizePaymentFailure
You can execute the `AdminFinalizePaymentFailure` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminFinalizePaymentFailure(vars: AdminFinalizePaymentFailureVariables): MutationPromise<AdminFinalizePaymentFailureData, AdminFinalizePaymentFailureVariables>;

interface AdminFinalizePaymentFailureRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminFinalizePaymentFailureVariables): MutationRef<AdminFinalizePaymentFailureData, AdminFinalizePaymentFailureVariables>;
}
export const adminFinalizePaymentFailureRef: AdminFinalizePaymentFailureRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminFinalizePaymentFailure(dc: DataConnect, vars: AdminFinalizePaymentFailureVariables): MutationPromise<AdminFinalizePaymentFailureData, AdminFinalizePaymentFailureVariables>;

interface AdminFinalizePaymentFailureRef {
  ...
  (dc: DataConnect, vars: AdminFinalizePaymentFailureVariables): MutationRef<AdminFinalizePaymentFailureData, AdminFinalizePaymentFailureVariables>;
}
export const adminFinalizePaymentFailureRef: AdminFinalizePaymentFailureRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminFinalizePaymentFailureRef:
```typescript
const name = adminFinalizePaymentFailureRef.operationName;
console.log(name);
```

### Variables
The `AdminFinalizePaymentFailure` mutation requires an argument of type `AdminFinalizePaymentFailureVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminFinalizePaymentFailureVariables {
  key: string;
  failReason?: string | null;
}
```
### Return Type
Recall that executing the `AdminFinalizePaymentFailure` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminFinalizePaymentFailureData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminFinalizePaymentFailureData {
  payment_updateMany: number;
}
```
### Using `AdminFinalizePaymentFailure`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminFinalizePaymentFailure, AdminFinalizePaymentFailureVariables } from '@dataconnect/generated';

// The `AdminFinalizePaymentFailure` mutation requires an argument of type `AdminFinalizePaymentFailureVariables`:
const adminFinalizePaymentFailureVars: AdminFinalizePaymentFailureVariables = {
  key: ..., 
  failReason: ..., // optional
};

// Call the `adminFinalizePaymentFailure()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminFinalizePaymentFailure(adminFinalizePaymentFailureVars);
// Variables can be defined inline as well.
const { data } = await adminFinalizePaymentFailure({ key: ..., failReason: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminFinalizePaymentFailure(dataConnect, adminFinalizePaymentFailureVars);

console.log(data.payment_updateMany);

// Or, you can use the `Promise` API.
adminFinalizePaymentFailure(adminFinalizePaymentFailureVars).then((response) => {
  const data = response.data;
  console.log(data.payment_updateMany);
});
```

### Using `AdminFinalizePaymentFailure`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminFinalizePaymentFailureRef, AdminFinalizePaymentFailureVariables } from '@dataconnect/generated';

// The `AdminFinalizePaymentFailure` mutation requires an argument of type `AdminFinalizePaymentFailureVariables`:
const adminFinalizePaymentFailureVars: AdminFinalizePaymentFailureVariables = {
  key: ..., 
  failReason: ..., // optional
};

// Call the `adminFinalizePaymentFailureRef()` function to get a reference to the mutation.
const ref = adminFinalizePaymentFailureRef(adminFinalizePaymentFailureVars);
// Variables can be defined inline as well.
const ref = adminFinalizePaymentFailureRef({ key: ..., failReason: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminFinalizePaymentFailureRef(dataConnect, adminFinalizePaymentFailureVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payment_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payment_updateMany);
});
```

## AdminUpdateOrderStatus
You can execute the `AdminUpdateOrderStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminUpdateOrderStatus(vars: AdminUpdateOrderStatusVariables): MutationPromise<AdminUpdateOrderStatusData, AdminUpdateOrderStatusVariables>;

interface AdminUpdateOrderStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdateOrderStatusVariables): MutationRef<AdminUpdateOrderStatusData, AdminUpdateOrderStatusVariables>;
}
export const adminUpdateOrderStatusRef: AdminUpdateOrderStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminUpdateOrderStatus(dc: DataConnect, vars: AdminUpdateOrderStatusVariables): MutationPromise<AdminUpdateOrderStatusData, AdminUpdateOrderStatusVariables>;

interface AdminUpdateOrderStatusRef {
  ...
  (dc: DataConnect, vars: AdminUpdateOrderStatusVariables): MutationRef<AdminUpdateOrderStatusData, AdminUpdateOrderStatusVariables>;
}
export const adminUpdateOrderStatusRef: AdminUpdateOrderStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminUpdateOrderStatusRef:
```typescript
const name = adminUpdateOrderStatusRef.operationName;
console.log(name);
```

### Variables
The `AdminUpdateOrderStatus` mutation requires an argument of type `AdminUpdateOrderStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminUpdateOrderStatusVariables {
  id: UUIDString;
  status: OrderStatus;
}
```
### Return Type
Recall that executing the `AdminUpdateOrderStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminUpdateOrderStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminUpdateOrderStatusData {
  order_update?: Order_Key | null;
}
```
### Using `AdminUpdateOrderStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminUpdateOrderStatus, AdminUpdateOrderStatusVariables } from '@dataconnect/generated';

// The `AdminUpdateOrderStatus` mutation requires an argument of type `AdminUpdateOrderStatusVariables`:
const adminUpdateOrderStatusVars: AdminUpdateOrderStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `adminUpdateOrderStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminUpdateOrderStatus(adminUpdateOrderStatusVars);
// Variables can be defined inline as well.
const { data } = await adminUpdateOrderStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminUpdateOrderStatus(dataConnect, adminUpdateOrderStatusVars);

console.log(data.order_update);

// Or, you can use the `Promise` API.
adminUpdateOrderStatus(adminUpdateOrderStatusVars).then((response) => {
  const data = response.data;
  console.log(data.order_update);
});
```

### Using `AdminUpdateOrderStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminUpdateOrderStatusRef, AdminUpdateOrderStatusVariables } from '@dataconnect/generated';

// The `AdminUpdateOrderStatus` mutation requires an argument of type `AdminUpdateOrderStatusVariables`:
const adminUpdateOrderStatusVars: AdminUpdateOrderStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `adminUpdateOrderStatusRef()` function to get a reference to the mutation.
const ref = adminUpdateOrderStatusRef(adminUpdateOrderStatusVars);
// Variables can be defined inline as well.
const ref = adminUpdateOrderStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminUpdateOrderStatusRef(dataConnect, adminUpdateOrderStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.order_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.order_update);
});
```

## AdminDeleteOrder
You can execute the `AdminDeleteOrder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminDeleteOrder(vars: AdminDeleteOrderVariables): MutationPromise<AdminDeleteOrderData, AdminDeleteOrderVariables>;

interface AdminDeleteOrderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminDeleteOrderVariables): MutationRef<AdminDeleteOrderData, AdminDeleteOrderVariables>;
}
export const adminDeleteOrderRef: AdminDeleteOrderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminDeleteOrder(dc: DataConnect, vars: AdminDeleteOrderVariables): MutationPromise<AdminDeleteOrderData, AdminDeleteOrderVariables>;

interface AdminDeleteOrderRef {
  ...
  (dc: DataConnect, vars: AdminDeleteOrderVariables): MutationRef<AdminDeleteOrderData, AdminDeleteOrderVariables>;
}
export const adminDeleteOrderRef: AdminDeleteOrderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminDeleteOrderRef:
```typescript
const name = adminDeleteOrderRef.operationName;
console.log(name);
```

### Variables
The `AdminDeleteOrder` mutation requires an argument of type `AdminDeleteOrderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminDeleteOrderVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `AdminDeleteOrder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminDeleteOrderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminDeleteOrderData {
  order_delete?: Order_Key | null;
}
```
### Using `AdminDeleteOrder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminDeleteOrder, AdminDeleteOrderVariables } from '@dataconnect/generated';

// The `AdminDeleteOrder` mutation requires an argument of type `AdminDeleteOrderVariables`:
const adminDeleteOrderVars: AdminDeleteOrderVariables = {
  id: ..., 
};

// Call the `adminDeleteOrder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminDeleteOrder(adminDeleteOrderVars);
// Variables can be defined inline as well.
const { data } = await adminDeleteOrder({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminDeleteOrder(dataConnect, adminDeleteOrderVars);

console.log(data.order_delete);

// Or, you can use the `Promise` API.
adminDeleteOrder(adminDeleteOrderVars).then((response) => {
  const data = response.data;
  console.log(data.order_delete);
});
```

### Using `AdminDeleteOrder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminDeleteOrderRef, AdminDeleteOrderVariables } from '@dataconnect/generated';

// The `AdminDeleteOrder` mutation requires an argument of type `AdminDeleteOrderVariables`:
const adminDeleteOrderVars: AdminDeleteOrderVariables = {
  id: ..., 
};

// Call the `adminDeleteOrderRef()` function to get a reference to the mutation.
const ref = adminDeleteOrderRef(adminDeleteOrderVars);
// Variables can be defined inline as well.
const ref = adminDeleteOrderRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminDeleteOrderRef(dataConnect, adminDeleteOrderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.order_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.order_delete);
});
```

