// @flow
import { Pair } from '../src/pair';
import test from 'tape';

test('Pair', t => {
	t.plan(7);

	let pair = Pair.of([ 'foo', 42 ]);

	t.deepEqual(pair, new Pair([ 'foo', 42 ]), 'Pair.of');

	t.deepEqual(Pair.from('foo', 42), pair, 'Pair.from');

	t.deepEqual(
		pair.map(a => a),
		pair,
		'functor identity'
	);

	t.deepEqual(
		pair.map(n => n * 2),
		Pair.of([ 'foo', 84 ]),
		'Pair.map'
	);

	t.deepEqual(pair.toTuple(), [ 'foo', 42 ], 'pair.toTuple');
	t.equal(pair.left(), 'foo', 'pair.left');
	t.equal(pair.right(), 42, 'pair.right');
});
