// @flow
import { curry } from 'ramda';
import { Maybe } from '../src/maybe';
import test from 'tape';

const { Just, Nothing } = Maybe;

test('Maybe', t => {
	t.plan(23);

	// constructors
	t.deepEqual(Just(2), Just(2));
	t.deepEqual(Nothing, Nothing);
	t.deepEqual(Maybe.of(2), Just(2));
	t.deepEqual(Maybe.of(null), Nothing);

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

	// ap
	t.deepEqual(Maybe.lift(a => a + 2).ap(Just(3)), Just(5));
	t.deepEqual(Maybe.lift(curry((a, b) => a + b)).ap(Just(3)).ap(Just(2)), Just(5));
	t.deepEqual(Maybe.lift(add3).ap(Just(1)).ap(Just(2)).ap(Just(3)), Just(6));

	// andThen
	t.deepEqual(Just(2).andThen((a: number) => Just(a + 2)), Just(4));
	t.deepEqual(Nothing.andThen(a => Just(a + 2)), Nothing);


});

const add3 = curry((a: number, b: number, c: number) => a + b + c);
