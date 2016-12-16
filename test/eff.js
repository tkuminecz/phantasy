// @flow
import { Eff, EffResult, EffTask } from '../src/eff';
import test from 'tape';

const identity = a => a;

test('Eff', t => {
	t.plan(3);

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
});

test('EffResult', t => {
	t.plan(3);

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
});

test('EffTask', t => {
	t.plan(2);

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
});
