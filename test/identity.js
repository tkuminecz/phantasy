// @flow
import { Identity } from '../src/identity';
import test from 'tape';
import  * as Util from './test-util';

test('Identity', t => {
	t.plan(6);

	const tId = { t };

	Util.testFunctor(tId, Identity);
	Util.testMonad(tId, Identity);
	Util.testLift(tId, Identity);
	Util.testLift2(tId, Identity);
	Util.testLift3(tId, Identity);

	t.equal(Identity.of(42).toString(), 'Identity 42', 'toString');
});
