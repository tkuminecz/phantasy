// @flow
import { Maybe } from '../src/maybe';
import { Result } from '../src/result';
import test from 'tape';
import * as Util from './test-util';

const { Val, Err } = Result;

const doThrow = <A>(val: A, shouldThrow: bool): A => {
	if (shouldThrow) {
		throw new Error('error!');
	}
	return val;
};

test('Result', t => {
	t.plan(12);

	const tResult = { t };

	Util.testFunctor(tResult, Result);
	Util.testMonad(tResult, Result);
	// Util.testLift(tResult, Result);
	// Util.testLift2(tResult, Result);
	// Util.testLift3(tResult, Result);

	t.deepEqual(Result.of(42), Val(42), 'Result.of alias of Result.Val');

	t.deepEqual(Err('err!').map(a => a), Err('err!'), 'Result.Err propogates');
	t.deepEqual(Err('outer err').andThen(a => Val(a + 2)), Err('outer err'), 'Result.Err propogates');
	t.deepEqual(Val(42).andThen(a => Err('inner err')), Err('inner err'), 'Result.Err propogates');

	t.deepEqual(Result.fromThrowable(() => doThrow('foo', false)), Val('foo'), 'Result.fromThrowable');
	t.deepEqual(Result.fromThrowable(() => doThrow('foo', true)), Err(new Error('error!')), 'Result.fromThrowable');

	t.deepEqual(Val(42).toMaybe(), Maybe.Just(42), 'result.toMaybe');
	t.deepEqual(Err('err!').toMaybe(), Maybe.Nothing, 'result.toMaybe');

	t.deepEqual(
		Val('never was an err!').handleError(x => Val(`was ${ x }`)),
		Val('never was an err!'),
		'result.handleError'
	);

	t.deepEqual(
		Err('err!').handleError(x => Val(`was ${ x }`)),
		Val('was err!'),
		'result.handleError'
	);
});
