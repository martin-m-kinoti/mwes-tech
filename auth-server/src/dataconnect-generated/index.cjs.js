const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const OrderStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
}
exports.OrderStatus = OrderStatus;

const PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
}
exports.PaymentStatus = PaymentStatus;

const connectorConfig = {
  connector: 'connector',
  service: 'mwestech-service',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const upsertCurrentUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCurrentUser');
}
upsertCurrentUserRef.operationName = 'UpsertCurrentUser';
exports.upsertCurrentUserRef = upsertCurrentUserRef;

exports.upsertCurrentUser = function upsertCurrentUser(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(upsertCurrentUserRef(dcInstance, inputVars));
}
;

const createOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateOrder', inputVars);
}
createOrderRef.operationName = 'CreateOrder';
exports.createOrderRef = createOrderRef;

exports.createOrder = function createOrder(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createOrderRef(dcInstance, inputVars));
}
;

const updateMyOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMyOrder', inputVars);
}
updateMyOrderRef.operationName = 'UpdateMyOrder';
exports.updateMyOrderRef = updateMyOrderRef;

exports.updateMyOrder = function updateMyOrder(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateMyOrderRef(dcInstance, inputVars));
}
;

const adminCreateOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateOrder', inputVars);
}
adminCreateOrderRef.operationName = 'AdminCreateOrder';
exports.adminCreateOrderRef = adminCreateOrderRef;

exports.adminCreateOrder = function adminCreateOrder(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminCreateOrderRef(dcInstance, inputVars));
}
;

const deleteMyOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMyOrder', inputVars);
}
deleteMyOrderRef.operationName = 'DeleteMyOrder';
exports.deleteMyOrderRef = deleteMyOrderRef;

exports.deleteMyOrder = function deleteMyOrder(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteMyOrderRef(dcInstance, inputVars));
}
;

const adminDeleteUserDataRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminDeleteUserData', inputVars);
}
adminDeleteUserDataRef.operationName = 'AdminDeleteUserData';
exports.adminDeleteUserDataRef = adminDeleteUserDataRef;

exports.adminDeleteUserData = function adminDeleteUserData(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminDeleteUserDataRef(dcInstance, inputVars));
}
;

const createMyPaymentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMyPayment', inputVars);
}
createMyPaymentRef.operationName = 'CreateMyPayment';
exports.createMyPaymentRef = createMyPaymentRef;

exports.createMyPayment = function createMyPayment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createMyPaymentRef(dcInstance, inputVars));
}
;

const adminAddPaymentEventRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminAddPaymentEvent', inputVars);
}
adminAddPaymentEventRef.operationName = 'AdminAddPaymentEvent';
exports.adminAddPaymentEventRef = adminAddPaymentEventRef;

exports.adminAddPaymentEvent = function adminAddPaymentEvent(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminAddPaymentEventRef(dcInstance, inputVars));
}
;

const adminFinalizePaymentSuccessRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminFinalizePaymentSuccess', inputVars);
}
adminFinalizePaymentSuccessRef.operationName = 'AdminFinalizePaymentSuccess';
exports.adminFinalizePaymentSuccessRef = adminFinalizePaymentSuccessRef;

exports.adminFinalizePaymentSuccess = function adminFinalizePaymentSuccess(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminFinalizePaymentSuccessRef(dcInstance, inputVars));
}
;

const adminCorrectFailedPaymentSuccessRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCorrectFailedPaymentSuccess', inputVars);
}
adminCorrectFailedPaymentSuccessRef.operationName = 'AdminCorrectFailedPaymentSuccess';
exports.adminCorrectFailedPaymentSuccessRef = adminCorrectFailedPaymentSuccessRef;

exports.adminCorrectFailedPaymentSuccess = function adminCorrectFailedPaymentSuccess(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminCorrectFailedPaymentSuccessRef(dcInstance, inputVars));
}
;

const adminFinalizePaymentFailureRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminFinalizePaymentFailure', inputVars);
}
adminFinalizePaymentFailureRef.operationName = 'AdminFinalizePaymentFailure';
exports.adminFinalizePaymentFailureRef = adminFinalizePaymentFailureRef;

exports.adminFinalizePaymentFailure = function adminFinalizePaymentFailure(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminFinalizePaymentFailureRef(dcInstance, inputVars));
}
;

const adminUpdateOrderStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminUpdateOrderStatus', inputVars);
}
adminUpdateOrderStatusRef.operationName = 'AdminUpdateOrderStatus';
exports.adminUpdateOrderStatusRef = adminUpdateOrderStatusRef;

exports.adminUpdateOrderStatus = function adminUpdateOrderStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminUpdateOrderStatusRef(dcInstance, inputVars));
}
;

const adminDeleteOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminDeleteOrder', inputVars);
}
adminDeleteOrderRef.operationName = 'AdminDeleteOrder';
exports.adminDeleteOrderRef = adminDeleteOrderRef;

exports.adminDeleteOrder = function adminDeleteOrder(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminDeleteOrderRef(dcInstance, inputVars));
}
;

const listMyOrdersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyOrders');
}
listMyOrdersRef.operationName = 'ListMyOrders';
exports.listMyOrdersRef = listMyOrdersRef;

exports.listMyOrders = function listMyOrders(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyOrdersRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMyOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyOrder', inputVars);
}
getMyOrderRef.operationName = 'GetMyOrder';
exports.getMyOrderRef = getMyOrderRef;

exports.getMyOrder = function getMyOrder(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMyOrderRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const adminListOrdersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListOrders');
}
adminListOrdersRef.operationName = 'AdminListOrders';
exports.adminListOrdersRef = adminListOrdersRef;

exports.adminListOrders = function adminListOrders(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListOrdersRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const adminListOrdersByUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListOrdersByUser', inputVars);
}
adminListOrdersByUserRef.operationName = 'AdminListOrdersByUser';
exports.adminListOrdersByUserRef = adminListOrdersByUserRef;

exports.adminListOrdersByUser = function adminListOrdersByUser(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(adminListOrdersByUserRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const adminGetOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminGetOrder', inputVars);
}
adminGetOrderRef.operationName = 'AdminGetOrder';
exports.adminGetOrderRef = adminGetOrderRef;

exports.adminGetOrder = function adminGetOrder(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(adminGetOrderRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyPaymentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyPayments');
}
listMyPaymentsRef.operationName = 'ListMyPayments';
exports.listMyPaymentsRef = listMyPaymentsRef;

exports.listMyPayments = function listMyPayments(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyPaymentsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMyPaymentByKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyPaymentByKey', inputVars);
}
getMyPaymentByKeyRef.operationName = 'GetMyPaymentByKey';
exports.getMyPaymentByKeyRef = getMyPaymentByKeyRef;

exports.getMyPaymentByKey = function getMyPaymentByKey(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMyPaymentByKeyRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const adminGetPaymentByKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminGetPaymentByKey', inputVars);
}
adminGetPaymentByKeyRef.operationName = 'AdminGetPaymentByKey';
exports.adminGetPaymentByKeyRef = adminGetPaymentByKeyRef;

exports.adminGetPaymentByKey = function adminGetPaymentByKey(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(adminGetPaymentByKeyRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const adminListPaymentEventsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListPaymentEvents', inputVars);
}
adminListPaymentEventsRef.operationName = 'AdminListPaymentEvents';
exports.adminListPaymentEventsRef = adminListPaymentEventsRef;

exports.adminListPaymentEvents = function adminListPaymentEvents(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(adminListPaymentEventsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const adminListPaymentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListPayments');
}
adminListPaymentsRef.operationName = 'AdminListPayments';
exports.adminListPaymentsRef = adminListPaymentsRef;

exports.adminListPayments = function adminListPayments(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListPaymentsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
