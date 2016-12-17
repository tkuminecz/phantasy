// @flow
import { Eff, EffResult, EffTask } from '../src/eff';
import { Result } from '../src/result';
import { Task } from '../src/task';
import test from 'tape';

const identity = a => a;

test('Eff', t => {
	t.plan(4);

	const eff = Eff.of(42);

	t.deepEqual(
		eff.map(identity).runEff({}),
		eff.runEff({}),
		'functor identity'
	);

	t.deepEqual(
		Eff.of(42).map(a => a * 2).runEff({}),
		Eff.of(84).runEff({}),
		'map',
	);

	t.deepEqual(
		eff.andThen(Eff.of).runEff({}),
		eff.runEff({}),
		'monad identity'
	);

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

});

test('EffResult', t => {
	t.plan(4);

	const eff = EffResult.of(42);

	t.deepEqual(
		eff.map(identity).runEff({}),
		eff.runEff({}),
		'functor identity'
	);

	t.deepEqual(
		EffResult.of(42).map(a => a * 2).runEff({}),
		EffResult.of(84).runEff({}),
		'map'
	);

	t.deepEqual(
		eff.andThen(EffResult.of).runEff({}),
		eff.runEff({}),
		'monad identity'
	);

	t.deepEqual(
		eff.andThen(n => new EffResult(({ num }) => Result.Val(n * num)))
			.runEff({ num: 3 }),
		Result.Val(126),
		'effect types merge'
	);
});

test('EffTask', t => {
	t.plan(3);

	const eff = EffTask.of(42);

	eff.map(identity)
		.runEff({})
		.runTask(
			a => t.deepEqual(a, 42, 'functor identity'),
			x => t.fail(x)
		);

	eff.andThen(EffTask.of)
		.runEff({})
		.runTask(
			a => t.deepEqual(a, 42, 'monad identity'),
			x => t.fail(x)
		);

	new EffTask(({ num }) => Task.Success(num))
		.andThen(num => new EffTask(({ factor }) => Task.Success(num * factor)))
		.runEff({ num: 42, factor: 2 })
		.runTask(
			a => t.deepEqual(a, 84, 'effect types merge'),
			x => t.fail(x)
		);
});
