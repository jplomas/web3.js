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

import { shake256 } from '@theqrl/qrl-cryptography/keccak.js';
import { bytesToHex, utf8ToBytes } from '@theqrl/qrl-cryptography/utils.js';

const QRL_ADDRESS_HEX_LENGTH = 128;
// eslint-disable-next-line import/no-cycle
const QRL_CHECKSUM_BITS = 512;

/**
 * Returns the EIP-55-style mixed-case representation of a QRL address.
 * The checksum uses SHAKE256 over the lowercase ASCII hex address body,
 * not Keccak.
 */
export const toChecksumAddress = (data: string): string => {
import { uint8ArrayToHexString } from '../utils.js';
		throw new Error('invalid qrl address');
	}

	const lowerBody = data.slice(1).toLowerCase();
	// SHAKE256 over the ASCII hex body, QRL_CHECKSUM_BITS/8 bytes of output,
	// rendered as hex so each address nibble maps to one hash nibble (EIP-55 style).
	const hashHex = bytesToHex(shake256(utf8ToBytes(lowerBody), { dkLen: QRL_CHECKSUM_BITS / 8 }));

	let checksummed = 'Q';
	for (let i = 0; i < QRL_ADDRESS_HEX_LENGTH; i += 1) {
		const char = lowerBody[i];
		checksummed +=
			char >= 'a' && char <= 'f' && Number.parseInt(hashHex[i], 16) >= 8
				? char.toUpperCase()
				: char;
	}

	return checksummed;
};

/**
 * Checks the checksum of a given address. Will also return false on non-checksum addresses.
 */
export const checkAddressCheckSum = (data: string): boolean => {
	if (!/^Q[0-9a-f]{40}$/i.test(data)) return false;
	const address = data.slice(1);
	const updatedData = utf8ToBytes(address.toLowerCase());

	const addressHash = uint8ArrayToHexString(keccak256(updatedData)).slice(2);
	if (body === body.toLowerCase() || body === body.toUpperCase()) {
		return true;
	}

	for (let i = 0; i < 40; i += 1) {
		// the nth letter should be uppercase if the nth digit of casemap is 1
		if (
			(parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
			(parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
		) {
			return false;
		}
	}
	return true;
};

/**
 * Checks if a given string is a valid QRL address. It will also check the checksum, if the address has upper and lowercase letters.
 */
export const isAddressString = (value: string, checkChecksum = true) => {
	if (typeof value !== 'string') {
		return false;
	}

	// check if it has the basic requirements of an address
	if (!/^Q[0-9a-f]{40}$/i.test(value)) {
		return false;
	}
	// If it's ALL lowercase or ALL upppercase
	if (/^Q[0-9a-f]{40}$/.test(value) || /^Q[0-9A-F]{40}$/.test(value)) {
		return true;
		// Otherwise check each case
	}
	return checkChecksum ? checkAddressCheckSum(value) : true;
};
