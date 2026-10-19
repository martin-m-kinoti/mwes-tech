# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertCurrentUser, createOrder, updateMyOrder, adminCreateOrder, deleteMyOrder, adminDeleteUserData, createMyPayment, adminAddPaymentEvent, adminFinalizePaymentSuccess, adminCorrectFailedPaymentSuccess } from '@dataconnect/generated';


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

// Operation AdminDeleteUserData:  For variables, look at type AdminDeleteUserDataVars in ../index.d.ts
const { data } = await AdminDeleteUserData(dataConnect, adminDeleteUserDataVars);

// Operation CreateMyPayment:  For variables, look at type CreateMyPaymentVars in ../index.d.ts
const { data } = await CreateMyPayment(dataConnect, createMyPaymentVars);

// Operation AdminAddPaymentEvent:  For variables, look at type AdminAddPaymentEventVars in ../index.d.ts
const { data } = await AdminAddPaymentEvent(dataConnect, adminAddPaymentEventVars);

// Operation AdminFinalizePaymentSuccess:  For variables, look at type AdminFinalizePaymentSuccessVars in ../index.d.ts
const { data } = await AdminFinalizePaymentSuccess(dataConnect, adminFinalizePaymentSuccessVars);

// Operation AdminCorrectFailedPaymentSuccess:  For variables, look at type AdminCorrectFailedPaymentSuccessVars in ../index.d.ts
const { data } = await AdminCorrectFailedPaymentSuccess(dataConnect, adminCorrectFailedPaymentSuccessVars);


```