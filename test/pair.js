// @flow
import { Pair } from '../src/pair';
import test from 'tape';

test('Pair', t => {
	t.plan(3);

	let pair = Pair.of([ 'foo', 42 ]);

	t.deepEqual(pair, new Pair([ 'foo', 42 ]), 'Pair.of');

	t.deepEqual(
		pair.map(a => a),
		pair,
		'functor identity'
	);

	t.deepEqual(
		pair.map(([ s, n ]) => [s.toUpperCase(), n * 2]),
		Pair.of([ 'FOO', 84 ]),
		'Pair.map'
	);

});
