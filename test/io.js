// @flow
import { IO } from '../src/io';
import test from 'tape';
import * as Util from './test-util';

const ioMapper = <A>(ia: IO<A>): A => ia.runIO();

test('IO', t => {
	t.plan(6);

	const tIO = { t, mapper: ioMapper };

	Util.testFunctor(t, tIO, IO);
	Util.testMonad(tIO, IO);
	Util.testLift(tIO, IO);
	Util.testLift2(tIO, IO);
	Util.testLift3(tIO, IO);

	t.equal(IO.from(() => 42).runIO(), 42, 'IO.from');
});
