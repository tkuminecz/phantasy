// @flow
import { IO } from '../src/io';
import { Maybe } from '../src/maybe';
import Promise from 'bluebird';
import { Result } from '../src/result';
import { Task } from '../src/task';
import test from 'tape';

const { Success, Fail } = Task;

function deepEqualTask(t, a, b, msg) {
	a.runTask(
		va => b.runTask(
			vb => t.deepEqual(va, vb, msg),
			eb => t.fail(eb)
		),
		ea => t.fail(ea && ea.message || 'default error')
	);
}

function cbSuccess(cb) {
	cb(null, 'success!');
}

function cbErr(cb) {
	cb('err!', null);
}

test('Task', t => {
	t.plan(23);

	// constructors
	deepEqualTask(t, Success(42), Success(42), 'Task.Success');
	deepEqualTask(t, Task.of(42), Success(42), 'Task.of');

	Fail('err').runTask(
		va => t.fail(va),
		ea => Fail('err').runTask(
			vb => t.fail(vb),
			eb => t.deepEqual(ea, eb, 'Task.Fail')
		)
	);

	deepEqualTask(t, Task.fromIO(IO.of(42)), Success(42), 'fromIO success');

	deepEqualTask(t, Task.fromResult(Result.Val(42)), Success(42), 'fromResult success');

	Task.fromResult(Result.Err('err!'))
		.runTask(
			v => t.fail('fromResult should have failed'),
			e => t.equal(e, 'err!', 'fromResult failure')
		);

	deepEqualTask(t, Task.fromPromise(Promise.resolve('foo')), Success('foo'), 'fromPromise success');

	deepEqualTask(t, Task.fromPromiseFunc(() => Promise.resolve('foo')), Success('foo'), 'fromPromiseFunc success');

	deepEqualTask(t, Task.fromCallback(cb => cbSuccess(cb)), Success('success!'), 'fromCallback success');
	Task.fromCallback(cb => cbErr(cb))
		.runTask(
			val => t.fail('fromCallback should have failed'),
			errA => Fail('err!').runTask(
				val => t.fail('should have failed'),
				errB => t.deepEqual(errA, errB)
			)
		);

	deepEqualTask(t, Task.fromThrowable(() => 42), Success(42), 'fromThrowable success');
	Task.fromThrowable(() => { throw new Error('foo'); })
		.runTask(
			v => t.fail('fromThrowable should have failed'),
			e => t.equal(e.message, 'foo', 'fromThrowable failure')
		);

	// map
	deepEqualTask(t, Success(42).map(a => a + 3), Success(45), 'map success');
	Fail('err').map(a => a + 3)
		.runTask(
			v => t.fail('map should have failed'),
			e => t.equal(e, 'err', 'map failure')
		);

	// andThen
	deepEqualTask(t, Success(42).andThen(a => Success(a + 3)), Success(45), 'andThen success');
	Success(42).andThen(a => Fail(a + 3))
		.runTask(
			v => t.fail('andThen should have failed'),
			e => t.equal(e, 45, 'andThen failure')
		);

	// handleError
	deepEqualTask(t, Success(42).handleError(e => Success(e)), Success(42), 'handleError success');
	Fail(42).handleError(e => Fail(e))
		.runTask(
			v => t.fail('handleError should have failed'),
			e => t.equal(e, 42, 'handleError failure')
		);

	// toMaybe
	Success(42).toMaybe()
		.runTask(
			v => t.deepEqual(v, Maybe.Just(42), 'toMaybe success'),
			e => t.fail(`toMaybe should have converted to Just`)
		);

	Fail('err').toMaybe()
		.runTask(
			v => t.deepEqual(v, Maybe.Nothing, 'toMaybe failure'),
			e => t.fail(`toMaybe should have converted to Nothing`)
		);

	// lift
	deepEqualTask(t, Task.lift(a => a + 2)(Success(3)), Success(5), 'lift');
	deepEqualTask(t, Task.lift2((a, b) => a + b)(Success(3), Success(4)), Success(7), 'lift2');
	deepEqualTask(t, Task.lift3((a, b, c) => a + b * c)(Success(3), Success(4), Success(5)), Success(23), 'lift3');

});
