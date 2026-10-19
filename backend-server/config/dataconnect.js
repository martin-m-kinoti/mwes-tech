const fs = require('fs');
const path = require('path');
const { getDataConnect } = require('firebase-admin/data-connect');

// Ensures the default Firebase app is initialised before Data Connect is used.
require('./firebaseAdmin');

const CONNECTOR_DIR = path.join(__dirname, '..', 'dataconnect', 'connector');

const QUERIES = fs.readFileSync(path.join(CONNECTOR_DIR, 'queries.gql'), 'utf8');
const MUTATIONS = fs.readFileSync(path.join(CONNECTOR_DIR, 'mutations.gql'), 'utf8');

// Both files are combined so a single document can be executed by operation
// name (Data Connect requires `operationName` when a request has more than one
// operation).
const OPERATIONS = `${QUERIES}\n${MUTATIONS}`;

// Keep in sync with dataconnect/dataconnect.yaml.
const CONNECTOR_CONFIG = {
  location: process.env.FIREBASE_DATACONNECT_LOCATION || 'us-east4',
  serviceId: process.env.FIREBASE_DATACONNECT_SERVICE_ID || 'mwestech-service',
  connector: process.env.FIREBASE_DATACONNECT_CONNECTOR || 'connector',
};

let service = null;

function getDataConnectService() {
  if (!service) {
    service = getDataConnect(CONNECTOR_CONFIG);
  }
  return service;
}

// Builds the impersonation context so Data Connect evaluates the connector's
// `@auth` rules and resolves `auth.uid` / `auth.token.email` from the verified
// Firebase token. When omitted, Data Connect bypasses auth policies (used for
// admin-level operations).
function impersonateFor(user) {
  if (!user || !user.uid) return undefined;
  return {
    authClaims: {
      uid: user.uid,
      sub: user.uid,
      email: user.email,
      email_verified: Boolean(user.email),
    },
  };
}

// Executes a connector operation by name and returns its `data` payload.
async function execute(operationName, { variables, user } = {}) {
  const options = { operationName };
  if (variables) options.variables = variables;

  const impersonate = impersonateFor(user);
  if (impersonate) options.impersonate = impersonate;

  const response = await getDataConnectService().executeGraphql(OPERATIONS, options);
  return response.data || {};
}

// Inserts return the new primary key; normalise the different possible shapes.
function insertedId(payload, field = 'order_insert') {
  const value = payload ? payload[field] : null;
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value.id || null;
}

// The API exchanges display strings ('Pending', 'In progress', 'Completed')
// while the schema stores the OrderStatus enum; GraphQL enums cannot contain
// spaces, so values are translated at this boundary.
const ORDER_STATUSES = {
  Pending: 'PENDING',
  'In progress': 'IN_PROGRESS',
  Completed: 'COMPLETED',
};

function toOrderStatusEnum(status) {
  return ORDER_STATUSES[status] || null;
}

// Rewrites an order payload's enum status back to its display string.
function normalizeOrder(order) {
  if (!order) return order;
  const display = Object.keys(ORDER_STATUSES).find(
    (label) => ORDER_STATUSES[label] === order.status
  );
  return { ...order, status: display || order.status };
}

module.exports = {
  CONNECTOR_CONFIG,
  QUERIES,
  MUTATIONS,
  execute,
  insertedId,
  toOrderStatusEnum,
  normalizeOrder,
};
