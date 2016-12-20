// @flow
import * as Util from './test-util';
import { Eff, EffResult, EffTask } from '../src/eff';
import { Result } from '../src/result';
import { Task } from '../src/task';
import test from 'tape';

const identity = a => a;

function testEffTask(t, method: 'equal'|'deepEqual', a, b, msg) {
	a.runTask(
		a => b.runTask(
			b => (method === 'equal' ? t.equal : t.deepEqual)(a, b, msg),
			y => t.fail(y)
		),
		x => t.fail(x)
	);
}

/**
 * Eff tests
 */
test('Eff', t => {
	t.plan(7);

	const tEff = { t, mapper: (eff) => eff.runEff({}) };

	Util.testFunctor(t, tEff, Eff);
	Util.testMonad(tEff, Eff);

	const effFoo: Eff<{ foo: string }, string> = new Eff(({ foo }) => foo),
		effBar: Eff<{ bar: number }, number> = new Eff(({ bar }) => bar);

	t.deepEqual(
		effFoo.andThen(s => new Eff(({ bar }) => bar * s.length))
			.runEff({
				foo: 'foobar',
				bar: 2
			}),
		12,
		'effect types merge'
	);

	t.deepEqual(
		Eff.Require()
			.map(({ foo }) => foo.length)
			.runEff({ foo: 'foobarbazbat' }),
		Eff.of(12).runEff({}),
		'Eff.Require'
	);

	t.deepEqual(
		Eff.Requires(deps => deps.foo)
			.map(foo => foo.length)
			.runEff({ foo: 'foobarbazbat' }),
		Eff.of(12).runEff({}),
		'Eff.Requires'
	);

	t.deepEqual(
		Eff.of(42).toEffResult().runEff({}),
		EffResult.of(42).runEff({}),
		'eff.toEffResult'
	);

	testEffTask(
		t,
		'equal',
		Eff.of(42).toEffTask().runEff({}),
		EffTask.of(42).runEff({}),
		'eff.toEffTask'
	);
});

/**
 * EffResult tests
 */
test('EffResult', t => {
	t.plan(8);

	const tEff = { t, mapper: (eff) => eff.runEff({}) };

	Util.testFunctor(t, tEff, EffResult);
	Util.testMonad(tEff, Eff);

	t.deepEqual(
		EffResult.of(42).andThen(n => new EffResult(({ num }) => Result.Val(n * num)))
			.runEff({ num: 3 }),
		EffResult.of(126).runEff({}),
		'effect types merge'
	);

	testEffTask(
		t,
		'equal',
		EffResult.of(42).toEffTask().runEff({}),
		EffTask.of(42).runEff({}),
		'effResult.toEffTask'
	);

	t.deepEqual(
		EffResult.Require()
			.map(({ foo }) => foo.length)
			.runEff({ foo: 'foobarbazbat' }),
		EffResult.of(12).runEff({}),
		'Eff.Require'
	);

	t.deepEqual(
		EffResult.Requires(deps => Result.of(deps.foo))
			.map(foo => foo.length)
			.runEff({ foo: 'foobarbazbat' }),
		EffResult.of(12).runEff({}),
		'Eff.Requires'
	);

	t.deepEqual(
		EffResult.fromResult(Result.Val(42)).runEff({}),
		EffResult.Val(42).runEff({}),
		'EffResult.fromResult'
	);

	t.deepEqual(
		EffResult.fromResult(Result.Err('err')).runEff({}),
		EffResult.Err('err').runEff({}),
		'EffResult.fromResult'
	);

});

/**
 * EffTask tests
 */
test('EffTask', t => {
	t.plan(7);

	const tEff = {
		mapper: eff => eff.runEff({}),
		tester: (t, a, b, msg) => testEffTask(t, 'equal', a, b, msg)
	};

	Util.testFunctor(t, tEff, EffTask);

	EffTask.of(42).andThen(EffTask.of)
		.runEff({})
		.runTask(
			a => t.deepEqual(a, 42, 'monad identity'),
			x => t.fail(x)
		);

	testEffTask(
		t,
		'equal',
		new EffTask(({ num }) => Task.Success(num))
			.andThen(num => new EffTask(({ factor }) => Task.Success(num * factor)))
			.runEff({ num: 42, factor: 2 }),
		EffTask.of(84).runEff({}),
		'effect types merge'
	);

	testEffTask(
		t,
		'equal',
		EffTask.Require()
			.map(({ foo }) => foo.length)
			.runEff({ foo: 'foobarbazbat' }),
		EffTask.of(12).runEff({}),
		'EffTask.Require'
	);

	testEffTask(
		t,
		'equal',
		EffTask.Requires(deps => Task.of(deps.foo))
			.map(foo => foo.length)
			.runEff({ foo: 'foobarbazbat' }),
		EffTask.of(12).runEff({}),
		'EffTask.Requires'
	);

	testEffTask(
		t,
		'equal',
		EffTask.fromEffResult(EffResult.Val(42)).runEff({}),
		EffTask.Success(42).runEff({}),
		'EffTask.fromEffResult'
	);

	EffTask.fromEffResult(EffResult.Err('err'))
		.runEff({})
		.runTask(
			a => t.fail(a),
			x => EffTask.Fail('err')
				.runEff({})
				.runTask(
					b => t.fail(b),
					y => t.equal(x, y, 'EffTask.fromResult')
				)
		);

});
