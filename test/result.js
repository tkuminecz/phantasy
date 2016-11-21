// @flow
import { Maybe } from '../src/maybe';
import { Result } from '../src/result';
import test from 'tape';

const { Val, Err } = Result;

const doThrow = <A>(val: A, shouldThrow: bool): A => {
	if (shouldThrow) {
		throw new Error('error!');
	}
	return val;
};

test('Result', t => {
	t.plan(13);

	t.deepEqual(Val(42), Val(42));
	t.deepEqual(Err('err!'), Err('err!'));

	t.deepEqual(Val(42).map(a => a), Val(42));
	t.deepEqual(Err('err!').map(a => a), Err('err!'));

	t.deepEqual(Result.fromThrowable(() => doThrow('foo', false)), Val('foo'));
	t.deepEqual(Result.fromThrowable(() => doThrow('foo', true)), Err(new Error('error!')));

	t.deepEqual(Val(42).toMaybe(), Maybe.Just(42));
	t.deepEqual(Err('err!').toMaybe(), Maybe.Nothing);

	t.deepEqual(Val(42).map(a => a + 1), Val(43));
	t.deepEqual(Err('err!').map(a => a + 1), Err('err!'));

	t.deepEqual(Val(42).andThen(a => Val(a + 2)), Val(44));
	t.deepEqual(Err('outer err').andThen(a => Val(a + 2)), Err('outer err'));
	t.deepEqual(Val(42).andThen(a => Err('inner err')), Err('inner err'));
});
