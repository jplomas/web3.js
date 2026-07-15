/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
import { Eip712TypedData } from '@theqrl/web3-types';

/**
 * string is the test title
 * Eip712TypedData is the entire EIP-712 typed data object
 * boolean is whether the EIP-712 encoded data is keccak256 hashed
 * string is the encoded data expected to be returned by getEncodedEip712Data
 */
export const testData: [string, Eip712TypedData, boolean | undefined, string][] = [
	[
		'should get encoded message without hashing, hash = undefined',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				Person: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'wallet',
						type: 'address',
					},
				],
				Mail: [
					{
						name: 'from',
						type: 'Person',
					},
					{
						name: 'to',
						type: 'Person',
					},
					{
						name: 'contents',
						type: 'string',
					},
				],
			},
			primaryType: 'Mail',
			domain: {
				name: 'Ether Mail',
				version: '1',
				chainId: 1,
				verifyingContract: 'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				from: {
					name: 'Cow',
					wallet: 'QCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
				},
				to: {
					name: 'Bob',
					wallet: 'QbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				},
				contents: 'Hello, Bob!',
			},
		},
		undefined,
		'0x1901c4292df31a4b083c63ac304014bbf0b5c92d4cbfa49236741a61983d8f50b39a9241a9b6d7ba63f111704b0a0c473ba4ec6a22f92910499b4fe3be572b8af4a3',
	],
	[
		'should get encoded message without hashing, hash = false',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				Person: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'wallet',
						type: 'address',
					},
				],
				Mail: [
					{
						name: 'from',
						type: 'Person',
					},
					{
						name: 'to',
						type: 'Person',
					},
					{
						name: 'contents',
						type: 'string',
					},
				],
			},
			primaryType: 'Mail',
			domain: {
				name: 'Ether Mail',
				version: '1',
				chainId: 1,
				verifyingContract: 'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				from: {
					name: 'Cow',
					wallet: 'QCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
				},
				to: {
					name: 'Bob',
					wallet: 'QbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				},
				contents: 'Hello, Bob!',
			},
		},
		false,
		'0x1901c4292df31a4b083c63ac304014bbf0b5c92d4cbfa49236741a61983d8f50b39a9241a9b6d7ba63f111704b0a0c473ba4ec6a22f92910499b4fe3be572b8af4a3',
	],
	[
		'should get the hashed encoded message, hash = true',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				Person: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'wallet',
						type: 'address',
					},
				],
				Mail: [
					{
						name: 'from',
						type: 'Person',
					},
					{
						name: 'to',
						type: 'Person',
					},
					{
						name: 'contents',
						type: 'string',
					},
				],
			},
			primaryType: 'Mail',
			domain: {
				name: 'Ether Mail',
				version: '1',
				chainId: 1,
				verifyingContract: 'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				from: {
					name: 'Cow',
					wallet: 'QCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
				},
				to: {
					name: 'Bob',
					wallet: 'QbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				},
				contents: 'Hello, Bob!',
			},
		},
		true,
		'0x53597a24fb7435a8a123ec6805f1a756556caeca40f5d7227bd824b653672e67',
	],
	[
		'should get encoded message with array types',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: 'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: [
					'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
					'QCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
					'QbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				],
				array3: [123456, 654321, 42],
			},
		},
		false,
		'0x190170b207a94826d759c38a47ff9847ec4c58382f880d9a0197e56cac61ddf71d8ebfbfee60e0db19750c51575413f7f9bbcee61a6287f9c8767086e4d77a19e501',
	],
	[
		'should get encoded message with array types',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: 'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: [
					'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
					'QCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
					'QbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				],
				array3: [123456, 654321, 42],
			},
		},
		true,
		'0x6962563647bc198632c7531401c1f2989200fe3add3727ae4944b8ab0307d219',
	],
	[
		'should get encoded message with fixed array',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[3]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: 'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: [
					'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
					'QCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
					'QbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				],
				array3: [123456, 654321, 42],
			},
		},
		false,
		'0x190170b207a94826d759c38a47ff9847ec4c58382f880d9a0197e56cac61ddf71d8ee87bbfaeeee3cb05c1ffe0ec4fd3c63fba3b250514e2df5896c5c2049068d578',
	],
	[
		'should get encoded message with fixed array',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[3]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: 'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: [
					'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
					'QCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
					'QbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				],
				array3: [123456, 654321, 42],
			},
		},
		true,
		'0xe2bf720fbca129f558a740a5c805300e5995f52c39509ad8a17eb04f05f060ad',
	],
	[
		'should get encoded message with bytes32',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'bytes32',
						type: 'bytes32',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: 'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				bytes32: '0x133d00e67f2390ce846a631aeb6718a674a3923f5320b79b6d3e2f5bf146319e',
			},
		},
		false,
		'0x190170b207a94826d759c38a47ff9847ec4c58382f880d9a0197e56cac61ddf71d8ebc5be4b6d5ef8cde54a896425544471fbba4990dee3749713466ec82f1a412dc',
	],
	[
		'should get encoded message with bytes32',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'bytes32',
						type: 'bytes',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: 'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				bytes32: '0x133d00e67f2390ce846a631aeb6718a674a3923f5320b79b6d3e2f5bf146319e',
			},
		},
		false,
		'0x190170b207a94826d759c38a47ff9847ec4c58382f880d9a0197e56cac61ddf71d8e5823e155044288a8c7aeea2e0c77e8469c23cf6b13fd48c98da0d4bd6561221c',
	],
	[
		'should get encoded message with bytes32',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'bytes32',
						type: 'bytes32',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: 'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				bytes32: '0x133d00e67f2390ce846a631aeb6718a674a3923f5320b79b6d3e2f5bf146319e',
			},
		},
		true,
		'0xcf24927faa9a50200af067d30ce0f021c494593b0197fd2095351a95ddfd717e',
	],
];

/**
 * string is the test title
 * Eip712TypedData is the entire EIP-712 typed data object
 * boolean is whether the EIP-712 encoded data is keccak256 hashed
 * string is the encoded data expected to be returned by getEncodedEip712Data
 */
export const erroneousTestData: [string, Eip712TypedData, boolean | undefined, Error][] = [
	[
		'should throw error: Cannot encode data: value is not of array type',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: 'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: 'QbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				array3: [123456, 654321, 42],
			},
		},
		false,
		new Error('Cannot encode data: value is not of array type'),
	],
	[
		'should throw error: Cannot encode data: expected length of 3, but got 1',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[3]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: 'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: ['QbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'],
				array3: [123456, 654321, 42],
			},
		},
		false,
		new Error('Cannot encode data: expected length of 3, but got 1'),
	],
	[
		"should throw error: Cannot encode data: missing data for 'array3'",
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: 'QCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: ['QbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'],
				array3: undefined,
			},
		},
		false,
		new Error("Cannot encode data: missing data for 'array3'"),
	],
];
