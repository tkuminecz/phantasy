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
		t.equal(err.message, 'an error!');
		t.equal(err.constructor.name, 'Error');
	}

	try {
		Util.invalid(((null: any): empty));
		t.fail('should have thrown an exception');
	}
	catch (err) {
		t.equal(err.message, '');
		t.equal(err.constructor.name, 'TypeError');
	}

});
