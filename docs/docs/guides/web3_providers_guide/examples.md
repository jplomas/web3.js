---
sidebar_label: Examples
---

# Example usage

## Prerequisites

Before we get started, make sure you have a basic understanding of JavaScript and QRL. Additionally, we need to set up our environment by installing the following:

1. **Gqrl**

    Run a local Gqrl development node with HTTP JSON-RPC enabled on `http://localhost:8545` and WebSocket JSON-RPC enabled on `ws://localhost:8546`.

2. **Node.js**

    Node.js is a JavaScript runtime environment that enables you to run JavaScript on the server-side. You can download it from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

3. **npm**

    npm (Node Package Manager) is used to publish and install packages to and from the public npm registry or a private npm registry. You can install it by following the instructions here: [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

    Alternatively, you can use **pnpm** instead of **npm** by following the instructions here: [https://pnpm.io/installation](https://pnpm.io/installation).

4. **Gqrl IPC** (Optional, used only at the IPC provider example)

    If you want to use IPC, start Gqrl with an IPC path and use that path in the IPC example below.

## Types of Providers

web3.js supports several types of providers, each with its own unique features or specific use cases. Here are the main types:

1. [HTTP Provider](#http-provider)
2. [WebSocket Provider](#websocket-provider)
3. [IPC Provider (for Node.js)](#websocket-provider)
4. [Third-party Providers (Compliant with EIP 1193)](#third-party-providers-compliant-with-eip-1193)

### HTTP Provider

The HTTP Provider allows you to connect to a publicly available QRL node, making it easy and straightforward to communicate with the QRL network from your web application.

To connect to the QRL network using the HTTP provider, follow these steps:

1. Open a command prompt or terminal window and navigate to the directory where you want to create the folder for this example.
2. Create a new folder and navigate to it:

    ```bash
    mkdir web3-providers-tutorial
    cd web3-providers-tutorial
    ```

3. Install web3.js using npm:

    ```bash
    npm install @theqrl/web3
    ```

4. Create a new JavaScript file called `web3-http-provider.js` in your code editor.

5. Copy and paste the following code into your `web3-http-provider.js` file and save it:

    ```js
    const { Web3 } = require('@theqrl/web3');

    // Connect to the QRL network using the HTTP provider
    const gqrlUrl = 'http://localhost:8545';
    const httpProvider = new Web3.providers.HttpProvider(gqrlUrl);
    const web3 = new Web3(httpProvider);

    async function main() {
    	try {
    		// Get the current block number from the network
    		const currentBlockNumber = await web3.qrl.getBlockNumber();
    		console.log('Current block number:', currentBlockNumber);

    		const accounts = await web3.qrl.getAccounts();

    		// Send a transaction to the network and wait for the transaction to be mined.
    		const transactionReceipt = await web3.qrl.sendTransaction({
    			from: accounts[0],
    			to: accounts[1],
    			value: web3.utils.toPlanck('0.001', 'quanta'),
    		});
    		console.log('Transaction Receipt:', transactionReceipt);

    		// Get the updated block number
    		const updatedBlockNumber = await web3.qrl.getBlockNumber();
    		console.log('Updated block number:', updatedBlockNumber);
    	} catch (error) {
    		console.error('An error occurred:', error);
    	}
    }

    main();
    ```

6. Ensure that Gqrl is running locally as mentioned in the [Prerequisites](#prerequisites) section.

7. In the command prompt or terminal window, type `node web3-http-provider.js` and press Enter. This will run your JavaScript file and connect to the local Gqrl node using the HTTP provider.

If everything is set up properly, you should see the current block number, the transaction receipt, and the updated block number printed in the console:

```bash
Current block number: 0n
Transaction Receipt: {
  transactionHash: '0x0578672e97d072b4b91773c8bfc710e4f777616398b82b276323408e59d11362',
  transactionIndex: 0n,
  blockNumber: 1n,
  blockHash: '0x348a6706e7cce6547fae2c06b3e8eff1f58e4669aff88f0af7ca250ffdcdeef5',
  from: 'Q6e599da0bff7a6598ac1224e4985430bf16458a4',
  to: 'Q6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
  cumulativeGasUsed: 21000n,
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 1n,
  effectiveGasPrice: 2000000000n,
  type: 2n
}
Updated block number: 1n
```

### WebSocket Provider

WebSocket Provider allows us to communicate with the QRL node via WebSocket protocol, which is useful when we want continuous updates on our subscribed items. This provider is ideal for real-time applications that require constant updates from the QRL network.

Follow these steps to connect to the QRL network using WebSocket provider:

:::tip
The first 3 steps are the same as in the pervious section. So, you may skip them if you already executed the previous section.
:::

1. Open a command prompt or terminal window and navigate to where you would like to create the folder for this example.
2. Create a new folder and navigate to it:

    ```bash
    mkdir web3-providers-tutorial
    cd web3-providers-tutorial
    ```

3. Install web3.js using npm:

    ```bash
     npm install @theqrl/web3
    ```

4. Create a new JavaScript file called `web3-websocket-provider.js` in your code editor.

5. Copy and paste the following code into your `web3-websocket-provider.js` file and save it:

```js
const { Web3 } = require('@theqrl/web3');

// Connect to the QRL network using WebSocket provider
const gqrlWsUrl = 'ws://localhost:8546';
const wsProvider = new Web3.providers.WebsocketProvider(gqrlWsUrl);
const web3 = new Web3(wsProvider);

async function main() {
	try {
		console.log(
			'Does the provider support subscriptions?:',
			wsProvider.supportsSubscriptions(),
		);

		// Subscribe to new block headers
		const subscription = await web3.qrl.subscribe('newBlockHeaders');

		subscription.on('data', async blockhead => {
			console.log('New block header: ', blockhead);

			// You do not need the next line if you like to keep notified for every new block
			await subscription.unsubscribe();
			console.log('Unsubscribed from new block headers.');
		});
		subscription.on('error', error =>
			console.log('Error when subscribing to New block header: ', error),
		);

		// Get the list of accounts in the connected local Gqrl node.
		const accounts = await web3.qrl.getAccounts();
		// Send a transaction to the network
		const transactionReceipt = await web3.qrl.sendTransaction({
			from: accounts[0],
			to: accounts[1],
			value: web3.utils.toPlanck('0.001', 'quanta'),
		});
		console.log('Transaction Receipt:', transactionReceipt);
	} catch (error) {
		console.error(error);
	}
}

main();
```

6. Ensure that Gqrl is running locally as mentioned in the [Prerequisites](#prerequisites) section.

7. Type `node web3-websocket-provider.js` in the command prompt or terminal window and press Enter. This will run your JavaScript file.

If everything is set up properly, you should see the new block headers, transaction hash, and pending transaction printed in the console. The unique feature of WebSocket provider highlighted in this example is that it can subscribe to new block headers and pending transactions to get them in real-time. And by running the sample, you will get something similar to this in your console:

```bash
Do the provider supports subscription?: true
New block header: {
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  miner: 'Q0000000000000000000000000000000000000000',
  extraData: '0x',
  gasLimit: 6721975,
  gasUsed: 21000,
  hash: '0xd315cecf3336640bcd1301930805370b7fe7528c894b931dcf8a3b1c833b68c8',
  mixHash: '0x1304070fde1c7bee383f3a59da8bb94d515cbd033b2638046520fb6fb596d827',
  nonce: '0x0000000000000000',
  number: 40,
  parentHash: '0xeb7ce3260911db2596ac843df11dbcbef302e813e1922db413f6f0b2a54d584d',
  receiptsRoot: '0xf78dfb743fbd92ade140711c8bbc542b5e307f0ab7984eff35d751969fe57efa',
  stateRoot: '0x95e416eec0932e725ec253779a4e28b3d014d05e41e63c3369f5da42d26d1240',
  timestamp: 1684165088,
  transactionsRoot: '0x8f87380cc7acfb6d10633e10f72567136492cb8301f52a41742eaca9449bb378',
  baseFeePerGas: 4959456,
  size: undefined
}
Transaction Receipt: {
  transactionHash: '0x0578672e97d072b4b91773c8bfc710e4f777616398b82b276323408e59d11362',
  transactionIndex: 0n,
  blockNumber: 1n,
  blockHash: '0x5c05248fe0fb8f45a8c9b9600904a36c0e5c74dce01495cfc72278c185fe7838',
  from: 'Q6e599da0bff7a6598ac1224e4985430bf16458a4',
  to: 'Q6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
  cumulativeGasUsed: 21000n,
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 1n,
  effectiveGasPrice: 2000000000n,
  type: 2n
}
Unsubscribed from new block headers.
```

### IPC Provider (for Node.js)

The IPC Provider allows you to connect to a QRL node using Inter-Process Communication (IPC) in a Node.js environment. This provider is useful when you have a local QRL node running on your machine and want to interact with it using Node.js.

In the following steps you will run `gqrl` in development mode and you will run a piece of code that reads the QRL accounts and sends a transaction:

To connect to the QRL network using the IPC provider, follow these steps:

1. Start a `gqrl` node in development mode by opening a terminal window and navigating to the `gqrl` executable file. Then, run the following command to create a development chain:

```bash
gqrl --dev --ipcpath <path>
```

Make sure to replace `<path>` with the desired IPC path. For example:

```bash
gqrl --dev --ipcpath /Users/username/Library/QRL/Execution/gqrl.ipc
```

This will start a `gqrl` node in development mode with IPC enabled and an IPC path specified. If the command is successful, the `gqrl` node will be running, and you should see output similar to the following:

```bash
INFO [12-10|15:10:37.121] IPC endpoint opened		 	url=<path>
INFO [12-10|15:10:37.122] HTTP endpoint opened		 	url=http://localhost:8545
INFO [12-10|15:10:37.122] WebSocket endpoint opened		url=ws://localhost:8546
INFO [12-10|15:10:37.127] Mapped network port		  	proto=udp extport=0 intport=30303 interface=UPnP(UDP)
```

2. Open a command prompt or terminal window and navigate to where you would like to create the folder for this example.
3. Create a new folder and navigate to it:

    ```bash
    mkdir web3-providers-tutorial
    cd web3-providers-tutorial
    ```

4. Install web3.js using npm:

    ```bash
    npm install @theqrl/web3
    ```

5. Create a new JavaScript file called `web3-ipc-provider.js` in your code editor.

6. Copy and paste the following code into your `web3-ipc-provider.js` file and save it:

    ```js
    const { Web3 } = require('@theqrl/web3');
    const { IpcProvider } = require('@theqrl/web3-providers-ipc');

    // Connect to the QRL network using IPC provider
    const ipcPath = '<path>'; // Replace with your actual IPC path
    const ipcProvider = new IpcProvider(ipcPath);

    const web3 = new Web3(ipcProvider);

    async function main() {
    	try {
    		console.log(
    			'Do the provider supports subscription?:',
    			ipcProvider.supportsSubscriptions(),
    		);

    		// Get the list of accounts in the connected node which is in this case: gqrl in dev mode.
    		const accounts = await web3.qrl.getAccounts();
    		console.log('Accounts:', accounts);

    		// Send a transaction to the network
    		const transactionReceipt = await web3.qrl.sendTransaction({
    			from: accounts[0],
    			to: accounts[0], // sending a self-transaction
    			value: web3.utils.toPlanck('0.001', 'quanta'),
    		});
    		console.log('Transaction Receipt:', transactionReceipt);
    	} catch (error) {
    		console.error('An error occurred:', error);
    	}
    }

    main();
    ```

7. replace `<path>` with the `ipcPath` that you had specified, when starting the `gqrl` node, in the first step.

8. Type `node web3-ipc-provider.js` in the command prompt or terminal window and press Enter. This will run your JavaScript file.

If everything is set up properly, you should see the list of accounts and transaction receipt printed in the console, similar to the following:

```bash
Do the provider supports subscription?: true
Accounts: [ 'Q82333ED0FAA7a883297C4d8e0FDE1E1CFABAeB7D' ]
Transaction Receipt: {
  blockHash: '0xd1220a9b6f86083e420da025179593f5aad3732165a687019a89528a4ab2bcd8',
  blockNumber: 1n,
  cumulativeGasUsed: 21000n,
  effectiveGasPrice: 1000000001n,
  from: 'Q82333ed0faa7a883297c4d8e0fde1e1cfabaeb7d',
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 1n,
  to: 'Q82333ed0faa7a883297c4d8e0fde1e1cfabaeb7d',
  transactionHash: '0x76c05df78dc5dbfade0d11322b3cadc894c17efe36851856aca29488b47c3fbd',
  transactionIndex: 0n,
  type: 2n
}
```

Keep in mind that using IPC Provider with `gqrl` in development mode in a production environment is not recommended as it can pose a security risk.

### Third-party Providers (Compliant with EIP 1193)

web3.js accepts provider objects that comply with [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) and speak QRL-compatible JSON-RPC. The following example shows the shape of a minimal external provider by forwarding requests to a local Gqrl HTTP endpoint.

Open a command prompt or terminal window in a new folder, then initialize the project and install web3.js:

```bash
npm init -y
npm install @theqrl/web3
```

Create a new JavaScript file called `index.js`, copy the following code into it, and save the file:

```js
const { Web3 } = require('@theqrl/web3');

const provider = {
	async request({ method, params = [] }) {
		const response = await fetch('http://localhost:8545', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method,
				params,
			}),
		});
		const payload = await response.json();
		if (payload.error) throw new Error(payload.error.message);
		return payload.result;
	},
};

const web3 = new Web3(provider);

web3.qrl
	.getBlockNumber()
	.then(function (blockNumber) {
		console.log('Current block number:', blockNumber);
	})
	.catch(function (error) {
		console.log('Error:', error);
	});
```

Make sure your local Gqrl node is running and exposes HTTP JSON-RPC on `http://localhost:8545`.

In the command prompt, run `node index.js` and press Enter. This will execute your JavaScript file and connect to the local Gqrl node through the custom provider.

If everything is set up properly, you should see the current block number printed in the console similar to the following.

```bash
Current block number: 1n
```

The sample above connected you to the local Gqrl node using a custom EIP-1193 provider object. You can modify the provider to route requests to another QRL-compatible endpoint.

## Practical ways of connecting to a provider

1. Browser Injected QRL Provider
2. Setting Web3 Provider using a string URL

### Browser Injected QRL Provider

It is easy to connect to the QRL network using a QRL-compatible browser wallet or QRL-enabled browser that injects a provider object into the browser's JavaScript context. This enables direct interaction with the QRL network from your web application while wallet management is handled by the wallet.

Technically, you use `window.qrl` when it is injected by the QRL browser wallet or QRL-enabled browser. Before using this provider, check that it is available and request access to the user's QRL account.

Before you start coding:

-   Ensure that a local Gqrl node is running as mentioned in the [Prerequisites](#prerequisites) section.
-   Install or configure a QRL-compatible browser wallet that injects `window.qrl`.

Follow these steps to connect to the QRL network with an injected provider and web3.js, including the steps to create a local web server using Node.js:

1. Open a command prompt or terminal window and navigate to where you would like to create the folder for this example.
2. Create a new folder and navigate to it:

    ```bash
    mkdir web3-browser-injected-providers
    cd web3-browser-injected-providers
    ```

3. Use npm to initialize the folder. This will simply create a `package.json` file:

    ```bash
    npm init -y
    ```

4. Install the Express module and add it to your project's dependencies:

    ```bash
    npm install --save express
    ```

5. Create a new HTML file named `index.html` in your code editor (inside `web3-browser-injected-providers`).

6. Copy and paste the following code into `index.html`, and save it after:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Connecting to the QRL network with Web3.js</title>
	</head>
	<body>
		<h1>Connecting to the QRL network with Web3.js</h1>
		<pre id="log">
  You need to approve connecting this website to your QRL wallet.
  Open your QRL browser wallet if it did not show a popup already.
  </pre
		>

		<script src="https://cdn.jsdelivr.net/npm/@theqrl/web3/dist/web3.min.js"></script>
		<script>
			window.addEventListener('load', async function () {
				// Check if web3 is available
				if (typeof window.qrl !== 'undefined') {
					// Use the browser injected QRL provider
					web3 = new Web3(window.qrl);
					// Request access to the user's QRL account.
					// Note: Even though, you can also get the accounts from `await web3.qrl.getAccounts()`,
					// 	you still need to make a wallet RPC call to request user consent.
					const accounts = await window.qrl.request({
						method: 'qrl_requestAccounts',
					});
					console.log('Accounts requested from wallet RPC: ', accounts);

					document.getElementById('log').textContent =
						'Sending a self transaction... Follow the instructions in your QRL wallet.';

					try {
						// Send a transaction to the network and wait for the transaction to be mined.
						const transactionReceipt = await web3.qrl.sendTransaction({
							from: accounts[0],
							to: accounts[0], // sending a self-transaction
							value: web3.utils.toPlanck('0.001', 'quanta'),
						});

						document.getElementById('log').textContent =
							'Sending a self transaction succeeded';
						document.getElementById(
							'log',
						).textContent += `\n  Transaction hash: ${transactionReceipt.transactionHash}`;
						document.getElementById(
							'log',
						).textContent += `\n  Gas Used: ${transactionReceipt.gasUsed} shor`;
					} catch (error) {
						console.log('error', error);
						document.getElementById('log').textContent =
							'Error happened: ' + JSON.stringify(error, null, '  ');
					}
				} else {
					// If the provider is not available, give instructions to install a QRL-compatible wallet.
					document.getElementById('log').innerHTML =
						'Please install a QRL-compatible browser wallet to connect to the QRL network.';
				}
			});
		</script>
	</body>
</html>
```

7. Create a new file called `server.js` (inside `web3-browser-injected-providers`).
8. Copy and paste the following code into `server.js`, and save it after:

    ```js
    const express = require('express');
    const app = express();
    const path = require('path');

    app.use(express.static(path.join(__dirname, '.')));

    app.listen(8097, () => {
    	console.log('Server started on port 8097');
    });
    ```

9. Start the Node.js server by executing the following command. This will execute the content of `server.js` which will run the server on port 8097:

    ```bash
    node server.js
    ```

10. Open your web browser and navigate to `http://localhost:8097/`. Your QRL wallet should ask for your approval to connect to your website. Follow the steps and give your consent.
11. If everything is set up properly, you should be able to connect to the QRL network with the injected provider and see the logged account address.

Note that in the above steps you had created a local web server using Node.js and Express, serving your HTML file from the root directory of your project. You needs this local server because many browser does not allow extensions to inject objects for static files located on your machine. However, you can customize the port number and the root directory if needed.

Now you can start building your QRL application with web3.js and a QRL-compatible browser wallet.

### Setting Web3 Provider using a String URL

web3.js allows you to set the QRL network provider, easily, by passing a string URL containing either the `http`, `https`, `ws`, or `wss` protocol. This provider can be used to connect to a remote server or node.

And when a string is passed, an instance of the compatible class above will be created accordingly. ex. WebSocketProvider instance will be created for string containing `ws` or `wss`. And you access this instance by calling `web3.provider` to read the provider and possibly register an event listener.

To set the Web3 provider from a URL, you can use the following code snippet:

```js
const web3 = new Web3('http://localhost:8545');
```

This code snippet sets the provider to a local node running on port 8545.

You can also use the `WebSocket` protocol to connect to a local or remote QRL node that supports it:

```js
const web3 = new Web3('ws://localhost:8546');
```

A few points to consider:

-   Make sure the URL you are using is correct, including the protocol and port if necessary.
-   If you are using a remote node, make sure your firewall allows access to the specified port.
-   It is recommended to use encrypted protocols `https` and `wss` when connecting to QRL network using a string URL.

## Conclusion

In this tutorial, we explored different types of providers available in web3.js and learned how to set them up and use them in our code. Depending on your application's needs, you can choose the provider that best suits your requirements. The HTTP Provider is the simplest and most widely used provider, while the Websocket Provider and IPC Provider offer real-time communication and faster performance, respectively. With these providers, you can connect your web application to the QRL network and start building decentralized applications.
