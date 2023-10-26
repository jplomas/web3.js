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
import { Web3Context } from '@theqrl/web3-core';
import { Web3ZondExecutionAPI } from '@theqrl/web3-types';
import { zondRpcMethods } from '@theqrl/web3-rpc-methods';

import { getCoinbase } from '../../../src/rpc_method_wrappers';

jest.mock('@theqrl/web3-rpc-methods');

describe('getCoinbase', () => {
	let web3Context: Web3Context<Web3ZondExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it('should call rpcMethods.getCoinbase with expected parameters', async () => {
		await getCoinbase(web3Context);
		expect(zondRpcMethods.getCoinbase).toHaveBeenCalledWith(web3Context.requestManager);
	});
});