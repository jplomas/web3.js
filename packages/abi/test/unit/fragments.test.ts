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

import {
	ConstructorFragment,
	ErrorFragment,
	EventFragment,
	FormatTypes,
	Fragment,
	FunctionFragment,
} from '../../src/fragments.js';

// ---------------------------------------------------------------------------
// KNOWN DEFECT (reported, not fixed)
//
// EventFragment, ConstructorFragment and FunctionFragment cannot be
// instantiated at all -- every construction path throws
// "TypeError: Cannot redefine property: <field>".
//
// Cause: Fragment's constructor calls populate() (which defineReadOnly's each
// param as non-configurable) and then Object.freeze(this). Under
// `target: es2022`, useDefineForClassFields defaults to true, so a derived
// class's bare field declarations (`stateMutability;`, `payable;`, `gas;`,
// `constant;`, `outputs;`, `anonymous;`) emit Object.defineProperty(this, ...)
// which runs *after* super() has already frozen the instance.
//
// ParamType and ErrorFragment are unaffected: ParamType is a base class (its
// field initializers run before its constructor body) and ErrorFragment
// declares no fields of its own.
//
// The `it.failing` blocks below assert the *intended* behaviour. Jest passes a
// `failing` test only while it still throws -- so each one flips to a hard
// failure the moment the defect is fixed, forcing them to be un-marked.
// ---------------------------------------------------------------------------

const REDEFINE = /Cannot redefine property/;

describe('Fragment dispatch', () => {
	it('routes "error ..." to an ErrorFragment', () => {
		const fragment = Fragment.from('error Unauthorized(address caller)');
		expect(fragment).toBeInstanceOf(ErrorFragment);
		expect(fragment.type).toBe('error');
		expect(fragment.name).toBe('Unauthorized');
	});

	it('rejects an unsupported fragment string', () => {
		expect(() => Fragment.from('modifier onlyOwner()')).toThrow(/unsupported fragment/);
	});

	it('returns null for fallback and receive objects', () => {
		expect(Fragment.from({ type: 'fallback' } as any)).toBeNull();
		expect(Fragment.from({ type: 'receive' } as any)).toBeNull();
	});

	it('rejects an unknown fragment object', () => {
		expect(() => Fragment.from({ type: 'nonsense' } as any)).toThrow(/invalid fragment object/);
	});

	it('recognises and passes through an existing fragment', () => {
		const fragment = Fragment.from('error Foo()');
		expect(Fragment.isFragment(fragment)).toBe(true);
		expect(Fragment.from(fragment)).toBe(fragment);
	});

	it('does not recognise a plain object as a fragment', () => {
		expect(Fragment.isFragment({ type: 'function' })).toBe(false);
		// eslint-disable-next-line no-null/no-null
		expect(Fragment.isFragment(null)).toBe(false);
		expect(Fragment.isFragment(undefined)).toBe(false);
	});

	it('cannot be constructed directly', () => {
		// eslint-disable-next-line no-null/no-null
		expect(() => new (ErrorFragment as any)(null, {})).toThrow(/static from method/);
	});
});

describe('ErrorFragment', () => {
	it('parses inputs', () => {
		const fragment = ErrorFragment.from('InsufficientBalance(uint256 available)');
		expect(fragment.type).toBe('error');
		expect(fragment.name).toBe('InsufficientBalance');
		expect(fragment.inputs).toHaveLength(1);
		expect(fragment.inputs[0].type).toBe('uint256');
		expect(fragment.inputs[0].name).toBe('available');
	});

	it('parses an error with no inputs', () => {
		expect(ErrorFragment.from('Unauthorized()').inputs).toHaveLength(0);
	});

	it('is frozen', () => {
		expect(Object.isFrozen(ErrorFragment.from('Foo()'))).toBe(true);
	});

	it('produces the canonical sighash form, dropping names', () => {
		expect(
			ErrorFragment.from('Unauthorized(address caller, uint256 code)').format(
				FormatTypes.sighash,
			),
		).toBe('Unauthorized(address,uint256)');
	});

	it('keeps the "error" keyword and names in the full form', () => {
		expect(ErrorFragment.from('Unauthorized(address caller)').format(FormatTypes.full)).toBe(
			'error Unauthorized(address caller)',
		);
	});

	it('keeps the "error" keyword but drops names in the minimal form', () => {
		expect(ErrorFragment.from('Unauthorized(address caller)').format(FormatTypes.minimal)).toBe(
			'error Unauthorized(address)',
		);
	});

	it('defaults to the sighash format', () => {
		const fragment = ErrorFragment.from('Foo(address a)');
		expect(fragment.format()).toBe(fragment.format(FormatTypes.sighash));
	});

	it('round-trips string -> full -> string', () => {
		// The full form carries the "error" keyword, so it re-parses via
		// Fragment.from (which dispatches on the keyword) rather than
		// ErrorFragment.from (which expects the keyword already stripped).
		const once = ErrorFragment.from('Unauthorized(address caller, uint256 code)').format(
			FormatTypes.full,
		);
		expect(once).toBe('error Unauthorized(address caller, uint256 code)');
		expect(Fragment.from(once).format(FormatTypes.full)).toBe(once);
	});

	it('round-trips string -> JSON -> object -> string', () => {
		const fragment = ErrorFragment.from('Unauthorized(address caller)');
		const json = JSON.parse(fragment.format(FormatTypes.json));
		expect(json.type).toBe('error');
		expect(json.name).toBe('Unauthorized');
		expect(ErrorFragment.fromObject(json).format(FormatTypes.full)).toBe(
			fragment.format(FormatTypes.full),
		);
	});

	it('handles a tuple input', () => {
		const fragment = ErrorFragment.from('Foo(tuple(address a, uint256 b) order)');
		expect(fragment.inputs[0].baseType).toBe('tuple');
		expect(fragment.inputs[0].components).toHaveLength(2);
		expect(fragment.format(FormatTypes.sighash)).toBe('Foo((address,uint256))');
	});

	it('rejects an invalid error name', () => {
		expect(() => ErrorFragment.fromString('9Bad(uint256)')).toThrow(/invalid identifier/);
	});

	it('rejects an object with the wrong type', () => {
		expect(() => ErrorFragment.fromObject({ type: 'function', name: 'foo' } as any)).toThrow();
	});

	it('rejects an unknown format type', () => {
		expect(() => ErrorFragment.from('Foo()').format('bogus')).toThrow(/invalid format/);
	});
});

describe('EventFragment (blocked by the class-fields defect)', () => {
	it('currently throws "Cannot redefine property: anonymous" on every construction', () => {
		expect(() => EventFragment.from('Foo(uint256 a)')).toThrow(REDEFINE);
		expect(() => Fragment.from('event Foo(uint256 a)')).toThrow(REDEFINE);
		expect(() =>
			EventFragment.fromObject({ type: 'event', name: 'Foo', inputs: [] } as any),
		).toThrow(REDEFINE);
	});

	it.failing('should parse indexed inputs', () => {
		const fragment = EventFragment.from(
			'Transfer(address indexed from, address indexed to, uint256 value)',
		);
		expect(fragment.inputs).toHaveLength(3);
		expect(fragment.inputs[0].indexed).toBe(true);
		expect(fragment.inputs[2].indexed).toBe(false);
		expect(fragment.anonymous).toBe(false);
	});

	it.failing('should parse the anonymous modifier', () => {
		expect(EventFragment.from('Foo(uint256 a) anonymous').anonymous).toBe(true);
	});

	it.failing('should produce the canonical sighash form', () => {
		expect(
			EventFragment.from('Transfer(address indexed from, uint256 value)').format(
				FormatTypes.sighash,
			),
		).toBe('Transfer(address,uint256)');
	});

	it.failing('should keep indexed and names in the full form', () => {
		expect(EventFragment.from('Foo(uint256 indexed a)').format(FormatTypes.full)).toBe(
			'Foo(uint256 indexed a)',
		);
	});

	it.failing('should round-trip string -> JSON -> object -> string', () => {
		const fragment = EventFragment.from('Transfer(address indexed from, uint256 value)');
		const json = JSON.parse(fragment.format(FormatTypes.json));
		expect(EventFragment.fromObject(json).format(FormatTypes.full)).toBe(
			fragment.format(FormatTypes.full),
		);
	});
});

describe('ConstructorFragment (blocked by the class-fields defect)', () => {
	it('currently throws "Cannot redefine property: stateMutability" on every construction', () => {
		expect(() => ConstructorFragment.from('constructor()')).toThrow(REDEFINE);
		expect(() => Fragment.from('constructor(address owner)')).toThrow(REDEFINE);
		expect(() =>
			ConstructorFragment.fromObject({ type: 'constructor', inputs: [] } as any),
		).toThrow(REDEFINE);
	});

	it.failing('should parse inputs and default to nonpayable', () => {
		const fragment = ConstructorFragment.from('constructor(address owner, uint256 supply)');
		expect(fragment.type).toBe('constructor');
		expect(fragment.inputs).toHaveLength(2);
		expect(fragment.stateMutability).toBe('nonpayable');
		expect(fragment.payable).toBe(false);
	});

	it.failing('should parse the payable modifier', () => {
		const fragment = ConstructorFragment.from('constructor(address owner) payable');
		expect(fragment.payable).toBe(true);
		expect(fragment.stateMutability).toBe('payable');
	});

	it.failing('should format without a name', () => {
		expect(
			ConstructorFragment.from('constructor(address owner)').format(FormatTypes.full),
		).toBe('constructor(address owner)');
	});
});

describe('FunctionFragment (blocked by the class-fields defect)', () => {
	it('currently throws "Cannot redefine property: stateMutability" on every construction', () => {
		expect(() => FunctionFragment.from('foo()')).toThrow(REDEFINE);
		expect(() => Fragment.from('function transfer(address to)')).toThrow(REDEFINE);
		expect(() =>
			FunctionFragment.fromObject({
				type: 'function',
				name: 'foo',
				inputs: [],
				stateMutability: 'nonpayable',
			} as any),
		).toThrow(REDEFINE);
	});

	it('rejects an invalid function name before it ever reaches the constructor', () => {
		// This validation runs pre-construction, so it survives the defect.
		expect(() => FunctionFragment.fromString('9bad(uint256)')).toThrow(/invalid identifier/);
	});

	it('rejects an object with no determinable stateMutability', () => {
		expect(() =>
			FunctionFragment.fromObject({ type: 'function', name: 'foo', inputs: [] } as any),
		).toThrow(/unable to determine stateMutability/);
	});

	it.failing('should parse inputs, outputs and state mutability', () => {
		const fragment = FunctionFragment.from(
			'transfer(address to, uint256 value) returns (bool success)',
		);
		expect(fragment.name).toBe('transfer');
		expect(fragment.inputs).toHaveLength(2);
		expect(fragment.outputs).toHaveLength(1);
		expect(fragment.outputs[0].type).toBe('bool');
	});

	it.failing('should default to nonpayable with no outputs', () => {
		const fragment = FunctionFragment.from('foo()');
		expect(fragment.stateMutability).toBe('nonpayable');
		expect(fragment.constant).toBe(false);
		expect(fragment.payable).toBe(false);
		expect(fragment.outputs).toHaveLength(0);
	});

	it.failing('should mark view/pure functions as constant', () => {
		expect(FunctionFragment.from('foo() view').constant).toBe(true);
		expect(FunctionFragment.from('foo() pure').constant).toBe(true);
		expect(FunctionFragment.from('foo() payable').payable).toBe(true);
	});

	it.failing('should produce the canonical sighash form', () => {
		expect(
			FunctionFragment.from('transfer(address to, uint256 value) returns (bool)').format(
				FormatTypes.sighash,
			),
		).toBe('transfer(address,uint256)');
	});

	it.failing('should produce the full form including returns', () => {
		expect(
			FunctionFragment.from(
				'transfer(address to, uint256 value) view returns (bool success)',
			).format(FormatTypes.full),
		).toBe('transfer(address to, uint256 value) view returns (bool success)');
	});

	it.failing('should round-trip string -> JSON -> object -> string', () => {
		const fragment = FunctionFragment.from('balanceOf(address owner) view returns (uint256)');
		const json = JSON.parse(fragment.format(FormatTypes.json));
		expect(FunctionFragment.fromObject(json).format(FormatTypes.full)).toBe(
			fragment.format(FormatTypes.full),
		);
	});
});
