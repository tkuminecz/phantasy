// @flow
import { Maybe } from '../src/maybe';
import test from 'tape';

const { Just, Nothing } = Maybe;

const doThrow = <A>(val: A, shouldThrow: bool): A => {
	if (shouldThrow) {
		throw new Error();
	}
	return val;
};

test('Maybe', t => {
	t.plan(27);

	// constructors
	t.deepEqual(Just(2), Just(2));
	t.deepEqual(Nothing, Nothing);
	t.deepEqual(Maybe.of(2), Just(2));
	t.deepEqual(Maybe.of(null), Nothing);
	t.deepEqual(Maybe.fromThrowable(() => doThrow('foo', false)), Just('foo'));
	t.deepEqual(Maybe.fromThrowable(() => doThrow('foo', true)), Nothing);

	// toString
	t.equal(Just(2).toString(), 'Just 2');
	t.equal(Nothing.toString(), 'Nothing');

	// eq & notEq
	t.ok(Just(2).eq(Just(2)));
	t.ok(Nothing.eq(Nothing));
	t.ok(Just(2).notEq(Nothing));
	t.ok(Nothing.notEq(Just(2)));

	// isJust & isNothing
	t.ok(Just(2).isJust());
	t.notOk(Just(2).isNothing());
	t.ok(Nothing.isNothing());
	t.notOk(Nothing.isJust());

	// cases
	t.equal(Just(2).cases({
		Just: a => `Just ${ a }`,
		Nothing: () => `Nothing`
	}), `Just 2`);
	t.equal(Nothing.cases({
		Just: a => `Just ${ a }`,
		Nothing: () => `Nothing`
	}), `Nothing`);

	// getOrElse
	t.equal(Just(2).getOrElse(3), 2);
	t.equal(Nothing.getOrElse(3), 3);

	// map
	t.deepEqual(Just(2).map(a => a + 3), Just(5));
	t.deepEqual(Nothing.map(a => a + 2), Nothing);

	// andThen
	t.deepEqual(Just(2).andThen((a: number) => Just(a + 2)), Just(4));
	t.deepEqual(Nothing.andThen(a => Just(a + 2)), Nothing);

	// lift
	t.deepEqual(Maybe.lift(a => a + 2)(Just(3)), Just(5), 'lift');
	t.deepEqual(Maybe.lift2((a, b) => a + b)(Just(3), Just(2)), Just(5), 'lift2');
	t.deepEqual(Maybe.lift3((a, b, c) => a + b + c)(Just(1), Just(2), Just(3)), Just(6), 'lift3');
});
