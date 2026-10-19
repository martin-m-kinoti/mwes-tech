import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
};



export interface AdminCreateOrderData {
  user_upsert: User_Key;
  order_insert: Order_Key;
}

export interface AdminCreateOrderVariables {
  userId: string;
  userEmail?: string | null;
  service: string;
  deliveryDuration: string;
  deliveryDate: TimestampString;
  comments?: string | null;
}

export interface AdminDeleteOrderData {
  order_delete?: Order_Key | null;
}

export interface AdminDeleteOrderVariables {
  id: UUIDString;
}

export interface AdminDeleteUserOrdersData {
  order_deleteMany: number;
  user_deleteMany: number;
}

export interface AdminDeleteUserOrdersVariables {
  uid: string;
}

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

export interface AdminGetOrderVariables {
  id: UUIDString;
}

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

export interface AdminListOrdersByUserVariables {
  userId: string;
}

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

export interface AdminUpdateOrderStatusData {
  order_update?: Order_Key | null;
}

export interface AdminUpdateOrderStatusVariables {
  id: UUIDString;
  status: OrderStatus;
}

export interface CreateOrderData {
  order_insert: Order_Key;
}

export interface CreateOrderVariables {
  service: string;
  deliveryDuration: string;
  deliveryDate: TimestampString;
  comments?: string | null;
}

export interface DeleteMyOrderData {
  order_deleteMany: number;
}

export interface DeleteMyOrderVariables {
  id: UUIDString;
}

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

export interface GetMyOrderVariables {
  id: UUIDString;
}

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

export interface Order_Key {
  id: UUIDString;
  __typename?: 'Order_Key';
}

export interface UpdateMyOrderData {
  order_updateMany: number;
}

export interface UpdateMyOrderVariables {
  id: UUIDString;
  service?: string | null;
  deliveryDuration?: string | null;
  deliveryDate?: TimestampString | null;
  comments?: string | null;
}

export interface UpsertCurrentUserData {
  user_upsert: User_Key;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface UpsertCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpsertCurrentUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<UpsertCurrentUserData, undefined>;
  operationName: string;
}
export const upsertCurrentUserRef: UpsertCurrentUserRef;

export function upsertCurrentUser(): MutationPromise<UpsertCurrentUserData, undefined>;
export function upsertCurrentUser(dc: DataConnect): MutationPromise<UpsertCurrentUserData, undefined>;

interface CreateOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrderVariables): MutationRef<CreateOrderData, CreateOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateOrderVariables): MutationRef<CreateOrderData, CreateOrderVariables>;
  operationName: string;
}
export const createOrderRef: CreateOrderRef;

export function createOrder(vars: CreateOrderVariables): MutationPromise<CreateOrderData, CreateOrderVariables>;
export function createOrder(dc: DataConnect, vars: CreateOrderVariables): MutationPromise<CreateOrderData, CreateOrderVariables>;

interface UpdateMyOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMyOrderVariables): MutationRef<UpdateMyOrderData, UpdateMyOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMyOrderVariables): MutationRef<UpdateMyOrderData, UpdateMyOrderVariables>;
  operationName: string;
}
export const updateMyOrderRef: UpdateMyOrderRef;

export function updateMyOrder(vars: UpdateMyOrderVariables): MutationPromise<UpdateMyOrderData, UpdateMyOrderVariables>;
export function updateMyOrder(dc: DataConnect, vars: UpdateMyOrderVariables): MutationPromise<UpdateMyOrderData, UpdateMyOrderVariables>;

interface AdminCreateOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateOrderVariables): MutationRef<AdminCreateOrderData, AdminCreateOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminCreateOrderVariables): MutationRef<AdminCreateOrderData, AdminCreateOrderVariables>;
  operationName: string;
}
export const adminCreateOrderRef: AdminCreateOrderRef;

export function adminCreateOrder(vars: AdminCreateOrderVariables): MutationPromise<AdminCreateOrderData, AdminCreateOrderVariables>;
export function adminCreateOrder(dc: DataConnect, vars: AdminCreateOrderVariables): MutationPromise<AdminCreateOrderData, AdminCreateOrderVariables>;

interface DeleteMyOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMyOrderVariables): MutationRef<DeleteMyOrderData, DeleteMyOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteMyOrderVariables): MutationRef<DeleteMyOrderData, DeleteMyOrderVariables>;
  operationName: string;
}
export const deleteMyOrderRef: DeleteMyOrderRef;

export function deleteMyOrder(vars: DeleteMyOrderVariables): MutationPromise<DeleteMyOrderData, DeleteMyOrderVariables>;
export function deleteMyOrder(dc: DataConnect, vars: DeleteMyOrderVariables): MutationPromise<DeleteMyOrderData, DeleteMyOrderVariables>;

interface AdminDeleteUserOrdersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminDeleteUserOrdersVariables): MutationRef<AdminDeleteUserOrdersData, AdminDeleteUserOrdersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminDeleteUserOrdersVariables): MutationRef<AdminDeleteUserOrdersData, AdminDeleteUserOrdersVariables>;
  operationName: string;
}
export const adminDeleteUserOrdersRef: AdminDeleteUserOrdersRef;

export function adminDeleteUserOrders(vars: AdminDeleteUserOrdersVariables): MutationPromise<AdminDeleteUserOrdersData, AdminDeleteUserOrdersVariables>;
export function adminDeleteUserOrders(dc: DataConnect, vars: AdminDeleteUserOrdersVariables): MutationPromise<AdminDeleteUserOrdersData, AdminDeleteUserOrdersVariables>;

interface AdminUpdateOrderStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdateOrderStatusVariables): MutationRef<AdminUpdateOrderStatusData, AdminUpdateOrderStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminUpdateOrderStatusVariables): MutationRef<AdminUpdateOrderStatusData, AdminUpdateOrderStatusVariables>;
  operationName: string;
}
export const adminUpdateOrderStatusRef: AdminUpdateOrderStatusRef;

export function adminUpdateOrderStatus(vars: AdminUpdateOrderStatusVariables): MutationPromise<AdminUpdateOrderStatusData, AdminUpdateOrderStatusVariables>;
export function adminUpdateOrderStatus(dc: DataConnect, vars: AdminUpdateOrderStatusVariables): MutationPromise<AdminUpdateOrderStatusData, AdminUpdateOrderStatusVariables>;

interface AdminDeleteOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminDeleteOrderVariables): MutationRef<AdminDeleteOrderData, AdminDeleteOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminDeleteOrderVariables): MutationRef<AdminDeleteOrderData, AdminDeleteOrderVariables>;
  operationName: string;
}
export const adminDeleteOrderRef: AdminDeleteOrderRef;

export function adminDeleteOrder(vars: AdminDeleteOrderVariables): MutationPromise<AdminDeleteOrderData, AdminDeleteOrderVariables>;
export function adminDeleteOrder(dc: DataConnect, vars: AdminDeleteOrderVariables): MutationPromise<AdminDeleteOrderData, AdminDeleteOrderVariables>;

interface ListMyOrdersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyOrdersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyOrdersData, undefined>;
  operationName: string;
}
export const listMyOrdersRef: ListMyOrdersRef;

export function listMyOrders(options?: ExecuteQueryOptions): QueryPromise<ListMyOrdersData, undefined>;
export function listMyOrders(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyOrdersData, undefined>;

interface GetMyOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyOrderVariables): QueryRef<GetMyOrderData, GetMyOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMyOrderVariables): QueryRef<GetMyOrderData, GetMyOrderVariables>;
  operationName: string;
}
export const getMyOrderRef: GetMyOrderRef;

export function getMyOrder(vars: GetMyOrderVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyOrderData, GetMyOrderVariables>;
export function getMyOrder(dc: DataConnect, vars: GetMyOrderVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyOrderData, GetMyOrderVariables>;

interface AdminListOrdersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListOrdersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListOrdersData, undefined>;
  operationName: string;
}
export const adminListOrdersRef: AdminListOrdersRef;

export function adminListOrders(options?: ExecuteQueryOptions): QueryPromise<AdminListOrdersData, undefined>;
export function adminListOrders(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListOrdersData, undefined>;

interface AdminListOrdersByUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminListOrdersByUserVariables): QueryRef<AdminListOrdersByUserData, AdminListOrdersByUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminListOrdersByUserVariables): QueryRef<AdminListOrdersByUserData, AdminListOrdersByUserVariables>;
  operationName: string;
}
export const adminListOrdersByUserRef: AdminListOrdersByUserRef;

export function adminListOrdersByUser(vars: AdminListOrdersByUserVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListOrdersByUserData, AdminListOrdersByUserVariables>;
export function adminListOrdersByUser(dc: DataConnect, vars: AdminListOrdersByUserVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListOrdersByUserData, AdminListOrdersByUserVariables>;

interface AdminGetOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminGetOrderVariables): QueryRef<AdminGetOrderData, AdminGetOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminGetOrderVariables): QueryRef<AdminGetOrderData, AdminGetOrderVariables>;
  operationName: string;
}
export const adminGetOrderRef: AdminGetOrderRef;

export function adminGetOrder(vars: AdminGetOrderVariables, options?: ExecuteQueryOptions): QueryPromise<AdminGetOrderData, AdminGetOrderVariables>;
export function adminGetOrder(dc: DataConnect, vars: AdminGetOrderVariables, options?: ExecuteQueryOptions): QueryPromise<AdminGetOrderData, AdminGetOrderVariables>;

