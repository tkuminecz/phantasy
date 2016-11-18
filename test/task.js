// @flow
import { Maybe } from '@/maybe';
import Promise from 'bluebird';
import { Task } from '@/task';
import test from 'tape';

const { Success, Fail } = Task;

function deepEqualTask(t, a, b) {
	a.runTask(
		va => b.runTask(
			vb => t.deepEqual(va, vb),
			eb => t.fail(eb)
		),
		ea => t.fail(ea)
	);
}

function cbSuccess(cb) {
	cb(null, 'success!');
}

function cbErr(cb) {
	cb('err!', null);
}

test('Task', t => {
	t.plan(12);

	// constructors
	deepEqualTask(t, Success(42), Success(42));

	Fail('err').runTask(
		va => t.fail(va),
		ea => Fail('err').runTask(
			vb => t.fail(vb, vb),
			eb => t.deepEqual(ea, eb)
		)
	);

	deepEqualTask(t, Task.fromPromise(Promise.resolve('foo')), Success('foo'));

	deepEqualTask(t, Task.fromPromiseFunc(() => Promise.resolve('foo')), Success('foo'));

	deepEqualTask(t, Task.fromCallback(cb => cbSuccess(cb)), Success('success!'));
	Task.fromCallback(cb => cbErr(cb))
		.runTask(
			val => t.fail('should have failed'),
			errA => Fail('err!').runTask(
				val => t.fail('should have failed'),
				errB => t.deepEqual(errA, errB)
			)
		);

	// map
	deepEqualTask(t, Success(42).map(a => a + 3), Success(45));

	// andThen
	deepEqualTask(t, Success(42).andThen(a => Success(a + 3)), Success(45));

	// handleError
	deepEqualTask(t, Success(42).handleError(e => Success(e)), Success(42));
	deepEqualTask(t, Fail('err').handleError(e => Success(e)), Success('err'));

	// toMaybe
	deepEqualTask(t, Success(42).toMaybe(), Success(Maybe.Just(42)));
	deepEqualTask(t, Fail('err').toMaybe(), Success(Maybe.Nothing));

});
