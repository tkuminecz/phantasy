// @flow
import { IO } from '@/io';
import test from 'tape';

function deepEqualIO(t, a, b) {
	t.deepEqual(a.runIO(), b.runIO());
}

test('IO', t => {
	t.plan(6);

	deepEqualIO(t, new IO(() => 4), IO.of(4));

	deepEqualIO(t, IO.of(2).map(a => a + 3), IO.of(5));

	deepEqualIO(t, IO.of(2).andThen(a => IO.of(a + 3)), IO.of(5));

	deepEqualIO(t, IO.lift(a => a + 3)(IO.of(2)), IO.of(5));

	deepEqualIO(t, IO.lift2((a, b) => a + b)(IO.of(2), IO.of(3)), IO.of(5));
	deepEqualIO(t, IO.lift2((a, b) => a + b)(IO.of(2))(IO.of(3)), IO.of(5));
});