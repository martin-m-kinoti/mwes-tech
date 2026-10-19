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

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
};



export interface AdminAddPaymentEventData {
  paymentEvent_insert: PaymentEvent_Key;
}

export interface AdminAddPaymentEventVariables {
  paymentId: UUIDString;
  eventCode: string;
  message: string;
}

export interface AdminCorrectFailedPaymentSuccessData {
  payment_updateMany: number;
}

export interface AdminCorrectFailedPaymentSuccessVariables {
  key: string;
  receipt?: string | null;
  amountPaid?: number | null;
  transactionDate?: string | null;
  payerPhone?: string | null;
}

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

export interface AdminDeleteUserDataData {
  paymentEvent_deleteMany: number;
  payment_deleteMany: number;
  order_deleteMany: number;
  user_deleteMany: number;
}

export interface AdminDeleteUserDataVariables {
  uid: string;
}

export interface AdminFinalizePaymentFailureData {
  payment_updateMany: number;
}

export interface AdminFinalizePaymentFailureVariables {
  key: string;
  failReason?: string | null;
}

export interface AdminFinalizePaymentSuccessData {
  payment_updateMany: number;
}

export interface AdminFinalizePaymentSuccessVariables {
  key: string;
  receipt?: string | null;
  amountPaid?: number | null;
  transactionDate?: string | null;
  payerPhone?: string | null;
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

export interface AdminGetPaymentByKeyData {
  payments: ({
    id: UUIDString;
    checkoutRequestId: string;
    status: PaymentStatus;
  } & Payment_Key)[];
}

export interface AdminGetPaymentByKeyVariables {
  key: string;
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

export interface AdminListPaymentEventsData {
  paymentEvents: ({
    eventCode: string;
    message: string;
    createdAt: TimestampString;
  })[];
}

export interface AdminListPaymentEventsVariables {
  paymentId: UUIDString;
}

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

export interface AdminUpdateOrderStatusData {
  order_update?: Order_Key | null;
}

export interface AdminUpdateOrderStatusVariables {
  id: UUIDString;
  status: OrderStatus;
}

export interface CreateMyPaymentData {
  payment_insert: Payment_Key;
}

export interface CreateMyPaymentVariables {
  checkoutRequestId: string;
  merchantRequestId?: string | null;
  serviceId: string;
  phone: string;
  amount: number;
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

export interface GetMyPaymentByKeyVariables {
  key: string;
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

export interface Order_Key {
  id: UUIDString;
  __typename?: 'Order_Key';
}

export interface PaymentEvent_Key {
  id: UUIDString;
  __typename?: 'PaymentEvent_Key';
}

export interface Payment_Key {
  id: UUIDString;
  __typename?: 'Payment_Key';
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

interface AdminDeleteUserDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminDeleteUserDataVariables): MutationRef<AdminDeleteUserDataData, AdminDeleteUserDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminDeleteUserDataVariables): MutationRef<AdminDeleteUserDataData, AdminDeleteUserDataVariables>;
  operationName: string;
}
export const adminDeleteUserDataRef: AdminDeleteUserDataRef;

export function adminDeleteUserData(vars: AdminDeleteUserDataVariables): MutationPromise<AdminDeleteUserDataData, AdminDeleteUserDataVariables>;
export function adminDeleteUserData(dc: DataConnect, vars: AdminDeleteUserDataVariables): MutationPromise<AdminDeleteUserDataData, AdminDeleteUserDataVariables>;

interface CreateMyPaymentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMyPaymentVariables): MutationRef<CreateMyPaymentData, CreateMyPaymentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMyPaymentVariables): MutationRef<CreateMyPaymentData, CreateMyPaymentVariables>;
  operationName: string;
}
export const createMyPaymentRef: CreateMyPaymentRef;

export function createMyPayment(vars: CreateMyPaymentVariables): MutationPromise<CreateMyPaymentData, CreateMyPaymentVariables>;
export function createMyPayment(dc: DataConnect, vars: CreateMyPaymentVariables): MutationPromise<CreateMyPaymentData, CreateMyPaymentVariables>;

interface AdminAddPaymentEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminAddPaymentEventVariables): MutationRef<AdminAddPaymentEventData, AdminAddPaymentEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminAddPaymentEventVariables): MutationRef<AdminAddPaymentEventData, AdminAddPaymentEventVariables>;
  operationName: string;
}
export const adminAddPaymentEventRef: AdminAddPaymentEventRef;

export function adminAddPaymentEvent(vars: AdminAddPaymentEventVariables): MutationPromise<AdminAddPaymentEventData, AdminAddPaymentEventVariables>;
export function adminAddPaymentEvent(dc: DataConnect, vars: AdminAddPaymentEventVariables): MutationPromise<AdminAddPaymentEventData, AdminAddPaymentEventVariables>;

interface AdminFinalizePaymentSuccessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminFinalizePaymentSuccessVariables): MutationRef<AdminFinalizePaymentSuccessData, AdminFinalizePaymentSuccessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminFinalizePaymentSuccessVariables): MutationRef<AdminFinalizePaymentSuccessData, AdminFinalizePaymentSuccessVariables>;
  operationName: string;
}
export const adminFinalizePaymentSuccessRef: AdminFinalizePaymentSuccessRef;

export function adminFinalizePaymentSuccess(vars: AdminFinalizePaymentSuccessVariables): MutationPromise<AdminFinalizePaymentSuccessData, AdminFinalizePaymentSuccessVariables>;
export function adminFinalizePaymentSuccess(dc: DataConnect, vars: AdminFinalizePaymentSuccessVariables): MutationPromise<AdminFinalizePaymentSuccessData, AdminFinalizePaymentSuccessVariables>;

interface AdminCorrectFailedPaymentSuccessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCorrectFailedPaymentSuccessVariables): MutationRef<AdminCorrectFailedPaymentSuccessData, AdminCorrectFailedPaymentSuccessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminCorrectFailedPaymentSuccessVariables): MutationRef<AdminCorrectFailedPaymentSuccessData, AdminCorrectFailedPaymentSuccessVariables>;
  operationName: string;
}
export const adminCorrectFailedPaymentSuccessRef: AdminCorrectFailedPaymentSuccessRef;

export function adminCorrectFailedPaymentSuccess(vars: AdminCorrectFailedPaymentSuccessVariables): MutationPromise<AdminCorrectFailedPaymentSuccessData, AdminCorrectFailedPaymentSuccessVariables>;
export function adminCorrectFailedPaymentSuccess(dc: DataConnect, vars: AdminCorrectFailedPaymentSuccessVariables): MutationPromise<AdminCorrectFailedPaymentSuccessData, AdminCorrectFailedPaymentSuccessVariables>;

interface AdminFinalizePaymentFailureRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminFinalizePaymentFailureVariables): MutationRef<AdminFinalizePaymentFailureData, AdminFinalizePaymentFailureVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminFinalizePaymentFailureVariables): MutationRef<AdminFinalizePaymentFailureData, AdminFinalizePaymentFailureVariables>;
  operationName: string;
}
export const adminFinalizePaymentFailureRef: AdminFinalizePaymentFailureRef;

export function adminFinalizePaymentFailure(vars: AdminFinalizePaymentFailureVariables): MutationPromise<AdminFinalizePaymentFailureData, AdminFinalizePaymentFailureVariables>;
export function adminFinalizePaymentFailure(dc: DataConnect, vars: AdminFinalizePaymentFailureVariables): MutationPromise<AdminFinalizePaymentFailureData, AdminFinalizePaymentFailureVariables>;

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

interface ListMyPaymentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyPaymentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyPaymentsData, undefined>;
  operationName: string;
}
export const listMyPaymentsRef: ListMyPaymentsRef;

export function listMyPayments(options?: ExecuteQueryOptions): QueryPromise<ListMyPaymentsData, undefined>;
export function listMyPayments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyPaymentsData, undefined>;

interface GetMyPaymentByKeyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyPaymentByKeyVariables): QueryRef<GetMyPaymentByKeyData, GetMyPaymentByKeyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMyPaymentByKeyVariables): QueryRef<GetMyPaymentByKeyData, GetMyPaymentByKeyVariables>;
  operationName: string;
}
export const getMyPaymentByKeyRef: GetMyPaymentByKeyRef;

export function getMyPaymentByKey(vars: GetMyPaymentByKeyVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyPaymentByKeyData, GetMyPaymentByKeyVariables>;
export function getMyPaymentByKey(dc: DataConnect, vars: GetMyPaymentByKeyVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyPaymentByKeyData, GetMyPaymentByKeyVariables>;

interface AdminGetPaymentByKeyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminGetPaymentByKeyVariables): QueryRef<AdminGetPaymentByKeyData, AdminGetPaymentByKeyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminGetPaymentByKeyVariables): QueryRef<AdminGetPaymentByKeyData, AdminGetPaymentByKeyVariables>;
  operationName: string;
}
export const adminGetPaymentByKeyRef: AdminGetPaymentByKeyRef;

export function adminGetPaymentByKey(vars: AdminGetPaymentByKeyVariables, options?: ExecuteQueryOptions): QueryPromise<AdminGetPaymentByKeyData, AdminGetPaymentByKeyVariables>;
export function adminGetPaymentByKey(dc: DataConnect, vars: AdminGetPaymentByKeyVariables, options?: ExecuteQueryOptions): QueryPromise<AdminGetPaymentByKeyData, AdminGetPaymentByKeyVariables>;

interface AdminListPaymentEventsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminListPaymentEventsVariables): QueryRef<AdminListPaymentEventsData, AdminListPaymentEventsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminListPaymentEventsVariables): QueryRef<AdminListPaymentEventsData, AdminListPaymentEventsVariables>;
  operationName: string;
}
export const adminListPaymentEventsRef: AdminListPaymentEventsRef;

export function adminListPaymentEvents(vars: AdminListPaymentEventsVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListPaymentEventsData, AdminListPaymentEventsVariables>;
export function adminListPaymentEvents(dc: DataConnect, vars: AdminListPaymentEventsVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListPaymentEventsData, AdminListPaymentEventsVariables>;

interface AdminListPaymentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListPaymentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListPaymentsData, undefined>;
  operationName: string;
}
export const adminListPaymentsRef: AdminListPaymentsRef;

export function adminListPayments(options?: ExecuteQueryOptions): QueryPromise<AdminListPaymentsData, undefined>;
export function adminListPayments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListPaymentsData, undefined>;

