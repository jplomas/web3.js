---
sidebar_position: 0
sidebar_label: 'Local wallet'
---

# Using Local Wallet

The simplest way to sign and send transactions is using a local wallet:

## Zond Transaction

```ts
// First step: initialize `web3` instance
import Web3 from '@theqrl/web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to wallet
const seedString = '0x1f953dc9b6437fb94fcafa5dabe3faa0c34315b954dd66f41bf53273339c6d26';
const account = web3.zond.accounts.wallet.add(seedString).get(0);

// Make sure the account has enough zond on balance to send the transaction

// Third step: sign and send the transaction
// Magic happens behind sendTransaction. If a transaction is sent from an account that exists in a wallet, it will be automatically signed.
try {
	const receipt = await web3.zond.sendTransaction({
		from: account?.address,
		to: 'Ze4beef667408b99053dc147ed19592ada0d77f59',
		value: '0x1',
		gas: '300000',
		// other transaction's params
	});
} catch (error) {
	// catch transaction error
	console.error(error);
}
```

List of references:

-   [zond.accounts.wallet.add](/api/web3-zond-accounts/class/Wallet#add)
-   [zond.sendTransaction](/api/web3-zond/class/Web3Zond#sendTransaction)

## Contract Transaction

```ts
// First step: initialize `web3` instance
import Web3 from '@theqrl/web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to wallet
const seedString = '0x1f953dc9b6437fb94fcafa5dabe3faa0c34315b954dd66f41bf53273339c6d26';
const account = web3.zond.accounts.wallet.add(seedString).get(0);

// Make sure the account has enough zond on balance to send the transaction

// Third step: sign and send the transaction
// In any function where you can pass from the address set address of the account that exists in a wallet, it will be automatically signed.

try {
	// deploy
	const contract = new web3.zond.Contract(ContractAbi);
	const contractDeployed = await contract
		.deploy({
			input: ContractBytecode,
			arguments: ['Constructor param1', 'Constructor param2'],
		})
		.send({
			from: account?.address,
			gas: '1000000',
			// other transaction's params
		});

	// call method
	await contractDeployed.methods
		.transfer('Ze2597eb05cf9a87eb1309e86750c903ec38e527e', '0x1')
		.send({
			from: account?.address,
			gas: '1000000',
			// other transaction's params
		});
} catch (error) {
	// catch transaction error
	console.error(error);
}
```

List of references:

-   [zond.accounts.wallet.add](/api/web3-zond-accounts/class/Wallet#add)
-   [zond.Contract](/api/web3-zond-contract/class/Contract)
-   [contract.deploy](/api/web3-zond-contract/class/Contract#deploy)
-   [contract.methods](/api/web3-zond-contract/class/Contract#methods)
