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

import fetch from 'cross-fetch';
import {
	QRLExecutionAPI,
	JsonRpcResponseWithResult,
	Web3APIMethod,
	Web3APIPayload,
	Web3APIReturnType,
	Web3APISpec,
	Web3BaseProvider,
	Web3ProviderStatus,
} from '@theqrl/web3-types';
import { InvalidClientError, MethodNotImplementedError, ResponseError } from '@theqrl/web3-errors';
import { HttpProviderOptions } from './types.js';

export { HttpProviderOptions } from './types.js';

const DEFAULT_MAX_RESPONSE_BYTES = 10 * 1024 * 1024;

export default class HttpProvider<
	API extends Web3APISpec = QRLExecutionAPI,
> extends Web3BaseProvider<API> {
	private readonly clientUrl: string;
	private readonly httpProviderOptions: HttpProviderOptions | undefined;
	private readonly maxResponseBytes: number;

	public constructor(clientUrl: string, httpProviderOptions?: HttpProviderOptions) {
		super();
		if (!HttpProvider.validateClientUrl(clientUrl)) throw new InvalidClientError(clientUrl);
		HttpProvider.warnIfCleartext(clientUrl);
		this.clientUrl = clientUrl;
		this.httpProviderOptions = httpProviderOptions;
		this.maxResponseBytes =
			httpProviderOptions?.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES;
	}

	private static warnIfCleartext(clientUrl: string): void {
		if (!/^http:\/\//i.test(clientUrl)) return;
		const host = clientUrl.replace(/^http:\/\//i, '').split(/[/?#]/)[0].split(':')[0];
		const loopbacks = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0']);
		if (loopbacks.has(host.toLowerCase())) return;
		// eslint-disable-next-line no-console
		console.warn(
			`web3-providers-http: cleartext http:// URL to non-loopback host "${host}". Use https:// for production.`,
		);
	}

	private async parseBoundedJson<T>(response: Response): Promise<T> {
		const contentLength = response.headers.get('content-length') ?? '';
		if (contentLength) {
			const declared = Number(contentLength);
			if (Number.isFinite(declared) && declared > this.maxResponseBytes) {
				throw new ResponseError(
					{} as never,
					`HTTP response exceeds maxResponseBytes (${declared} > ${this.maxResponseBytes})`,
				);
			}
		}
		const text = await response.text();
		if (text.length > this.maxResponseBytes) {
			throw new ResponseError(
				{} as never,
				`HTTP response exceeds maxResponseBytes (${text.length} > ${this.maxResponseBytes})`,
			);
		}
		try {
			return JSON.parse(text) as T;
		} catch (err) {
			throw new ResponseError({} as never, `Failed to parse HTTP response: ${String(err)}`);
		}
	}

	private static validateClientUrl(clientUrl: string): boolean {
		return typeof clientUrl === 'string' ? /^http(s)?:\/\//i.test(clientUrl) : false;
	}

	/* eslint-disable class-methods-use-this */
	public getStatus(): Web3ProviderStatus {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public supportsSubscriptions() {
		return false;
	}

	public async request<
		Method extends Web3APIMethod<API>,
		ResultType = Web3APIReturnType<API, Method>,
	>(
		payload: Web3APIPayload<API, Method>,
		requestOptions?: RequestInit,
	): Promise<JsonRpcResponseWithResult<ResultType>> {
		const providerOptionsCombined = {
			...this.httpProviderOptions?.providerOptions,
			...requestOptions,
		};
		const response = await fetch(this.clientUrl, {
			...providerOptionsCombined,
			method: 'POST',
			headers: {
				...providerOptionsCombined.headers,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			throw new ResponseError(
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				(await this.parseBoundedJson(response)) as never,
			);
		}

		return this.parseBoundedJson<JsonRpcResponseWithResult<ResultType>>(response);
	}

	/* eslint-disable class-methods-use-this */
	public on() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public removeListener() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public once() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public removeAllListeners() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public connect() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public disconnect() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public reset() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public reconnect() {
		throw new MethodNotImplementedError();
	}
}

export { HttpProvider };
