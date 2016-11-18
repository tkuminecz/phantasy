// @flow
import { IO } from '@/io';
import test from 'tape';

test('IO', t => {
	t.plan(6);

	t.deepEqual(new IO(() => 4).runIO(), IO.of(4).runIO());

	t.deepEqual(IO.of(2).map(a => a + 3).runIO(), IO.of(5).runIO());

	t.deepEqual(IO.of(2).andThen(a => IO.of(a + 3)).runIO(), IO.of(5).runIO());

	t.deepEqual(IO.lift(a => a + 3)(IO.of(2)).runIO(), IO.of(5).runIO());

	t.deepEqual(IO.lift2((a, b) => a + b)(IO.of(2), IO.of(3)).runIO(), IO.of(5).runIO());
	t.deepEqual(IO.lift2((a, b) => a + b)(IO.of(2))(IO.of(3)).runIO(), IO.of(5).runIO());
});
