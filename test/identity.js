// @flow
import { Identity } from '../src/identity';
import test from 'tape';

test('Identity', t => {
	t.plan(5);

	t.deepEqual(Identity.of(42).map(a => a), Identity.of(42), 'map');
	t.deepEqual(Identity.of(42).andThen(a => Identity.of(a * 2)), Identity.of(84), 'andThen');

	// lift
	t.deepEqual(Identity.lift(a => a + 3)(Identity.of(2)), Identity.of(5), 'lift');
	t.deepEqual(Identity.lift2((a, b) => a + b)(Identity.of(2), Identity.of(3)), Identity.of(5), 'lift2');
	t.deepEqual(Identity.lift3((a, b, c) => a + b * c)(Identity.of(2), Identity.of(3), Identity.of(5)), Identity.of(17), 'lift3');
});
