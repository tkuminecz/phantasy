// @flow
import * as Util from '../src/util';
import test from 'tape';

test('util', t => {
	t.plan(4);

	try {
		Util.raise(Error, 'an error!');
		t.fail('should have thrown an exception');
	}
	catch (err) {
		t.equal(err.message, 'an error!', 'raise()');
		t.equal(err.constructor.name, 'Error', 'raise()');
	}

	try {
		Util.invalid(((null: any): empty));
		t.fail('should have thrown an exception');
	}
	catch (err) {
		t.equal(err.message, '', 'invalid()');
		t.equal(err.constructor.name, 'TypeError', 'invalid()');
	}

});
