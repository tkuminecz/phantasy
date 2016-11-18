// @flow
import { State } from '@/state';
import test from 'tape';

test('State', t => {
	t.plan(2);

	t.equal(State.Get()
		.andThen(s => State.Put(s + 2))
		.getState(3), 5);

	t.equal(State.Modify(s => s + 1).getState(2), 3);
});
