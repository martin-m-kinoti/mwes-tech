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
- [**Mutations**](#mutations)
  - [*UpsertCurrentUser*](#upsertcurrentuser)
  - [*CreateOrder*](#createorder)
  - [*UpdateMyOrder*](#updatemyorder)
  - [*AdminCreateOrder*](#admincreateorder)
  - [*DeleteMyOrder*](#deletemyorder)
  - [*AdminDeleteUserOrders*](#admindeleteuserorders)
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

## AdminDeleteUserOrders
You can execute the `AdminDeleteUserOrders` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminDeleteUserOrders(vars: AdminDeleteUserOrdersVariables): MutationPromise<AdminDeleteUserOrdersData, AdminDeleteUserOrdersVariables>;

interface AdminDeleteUserOrdersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminDeleteUserOrdersVariables): MutationRef<AdminDeleteUserOrdersData, AdminDeleteUserOrdersVariables>;
}
export const adminDeleteUserOrdersRef: AdminDeleteUserOrdersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminDeleteUserOrders(dc: DataConnect, vars: AdminDeleteUserOrdersVariables): MutationPromise<AdminDeleteUserOrdersData, AdminDeleteUserOrdersVariables>;

interface AdminDeleteUserOrdersRef {
  ...
  (dc: DataConnect, vars: AdminDeleteUserOrdersVariables): MutationRef<AdminDeleteUserOrdersData, AdminDeleteUserOrdersVariables>;
}
export const adminDeleteUserOrdersRef: AdminDeleteUserOrdersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminDeleteUserOrdersRef:
```typescript
const name = adminDeleteUserOrdersRef.operationName;
console.log(name);
```

### Variables
The `AdminDeleteUserOrders` mutation requires an argument of type `AdminDeleteUserOrdersVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminDeleteUserOrdersVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `AdminDeleteUserOrders` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminDeleteUserOrdersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminDeleteUserOrdersData {
  order_deleteMany: number;
  user_deleteMany: number;
}
```
### Using `AdminDeleteUserOrders`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminDeleteUserOrders, AdminDeleteUserOrdersVariables } from '@dataconnect/generated';

// The `AdminDeleteUserOrders` mutation requires an argument of type `AdminDeleteUserOrdersVariables`:
const adminDeleteUserOrdersVars: AdminDeleteUserOrdersVariables = {
  uid: ..., 
};

// Call the `adminDeleteUserOrders()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminDeleteUserOrders(adminDeleteUserOrdersVars);
// Variables can be defined inline as well.
const { data } = await adminDeleteUserOrders({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminDeleteUserOrders(dataConnect, adminDeleteUserOrdersVars);

console.log(data.order_deleteMany);
console.log(data.user_deleteMany);

// Or, you can use the `Promise` API.
adminDeleteUserOrders(adminDeleteUserOrdersVars).then((response) => {
  const data = response.data;
  console.log(data.order_deleteMany);
  console.log(data.user_deleteMany);
});
```

### Using `AdminDeleteUserOrders`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminDeleteUserOrdersRef, AdminDeleteUserOrdersVariables } from '@dataconnect/generated';

// The `AdminDeleteUserOrders` mutation requires an argument of type `AdminDeleteUserOrdersVariables`:
const adminDeleteUserOrdersVars: AdminDeleteUserOrdersVariables = {
  uid: ..., 
};

// Call the `adminDeleteUserOrdersRef()` function to get a reference to the mutation.
const ref = adminDeleteUserOrdersRef(adminDeleteUserOrdersVars);
// Variables can be defined inline as well.
const ref = adminDeleteUserOrdersRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminDeleteUserOrdersRef(dataConnect, adminDeleteUserOrdersVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.order_deleteMany);
console.log(data.user_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.order_deleteMany);
  console.log(data.user_deleteMany);
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

