---
sidebar_position: 1
sidebar_label: 'Supported Subscriptions'
---

# Supported Subscriptions

web3.js supports the standard QRL subscriptions out of the box. And they are the ones registered inside [registeredSubscriptions](/api/@theqrl/web3-qrl/variables/registeredSubscriptions) object. Here are a list of them:

-   `logs`: implemented in the class [`LogsSubscription`](/api/@theqrl/web3-qrl/classes/LogsSubscription).
-   `newBlockHeaders`: implemented in the class [`NewHeadsSubscription`](/api/@theqrl/web3-qrl/classes/NewHeadsSubscription).
-   `newHeads` same as `newBlockHeaders`.
-   `newPendingTransactions`: implemented in the class [`NewPendingTransactionsSubscription`](/api/@theqrl/web3-qrl/classes/NewPendingTransactionsSubscription).
-   `pendingTransactions`: same as `newPendingTransactions`.
-   `syncing`: implemented in the class [`SyncingSubscription`](/api/@theqrl/web3-qrl/classes/SyncingSubscription)
