// @flow
import * as Util from './test-util';
import { State } from '../src/state';
import test from 'tape';

test('State', t => {
	t.plan(7);

	Util.testFunctor(t, { mapper: s => s.runState() }, State);

	t.deepEqual(State.of(42).runState('foo'), { state: 42, value: 42 }, 'runState');

	t.equal(State.of(42).getValue('foo'), 42, 'getValue');

	t.equal(State.Get()
		.andThen(s => State.Put(s + 2))
		.getState(3), 5);

	t.equal(State.Get()
		.andThen(s => State.Put(s + 2))
		.getValue(3), null);

	t.equal(State.Get()
		.andThen(s => State.of(s + 2))
		.getValue(3), 5);

	t.equal(State.Modify(s => s + 1).getState(2), 3, 'State.Modify');
});
