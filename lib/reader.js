'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Reader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ramda = require('ramda');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The Reader monad
 */
var Reader = exports.Reader = function () {
	function Reader(runReader) {
		_classCallCheck(this, Reader);

		this.runReader = runReader;
	}

	_createClass(Reader, [{
		key: 'andThen',
		value: function andThen(next) {
			var _this = this;

			return new Reader(function (env) {
				return next(_this.runReader(env)).runReader(env);
			});
		}
	}], [{
		key: 'of',
		value: function of(val) {
			return Reader.Asks(function () {
				return val;
			});
		}
	}, {
		key: 'Ask',
		value: function Ask() {
			return Reader.Asks(function (env) {
				return env;
			});
		}
	}, {
		key: 'Asks',
		value: function Asks(f) {
			return new Reader(f);
		}
	}, {
		key: 'getProp',
		value: function getProp(prop) {
			return Reader.Asks(function (obj) {
				return obj[prop];
			});
		}
	}, {
		key: 'lift',
		value: function lift(f) {
			return function (ra) {
				return ra.andThen(function (a) {
					return Reader.of(f(a));
				});
			};
		}
	}, {
		key: 'lift2',
		value: function lift2(f) {
			return (0, _ramda.curry)(function (ra, rb) {
				return ra.andThen(function (a) {
					return rb.andThen(function (b) {
						return Reader.of(f(a, b));
					});
				});
			});
		}
	}]);

	return Reader;
}();
