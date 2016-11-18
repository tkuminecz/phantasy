'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MaybeFn = exports.Maybe = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ramda = require('ramda');

var _util = require('util');

var _util2 = require('./util');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class representing a present value
 */
var _Just = function Just(value) {
	_classCallCheck(this, Just);

	this.value = value;
};

/**
 * Class representing a missing value
 */


var Nothing = function Nothing() {
	_classCallCheck(this, Nothing);
};

/**
 * The Maybe monad
 */
var Maybe = exports.Maybe = function () {

	/**
  * Constructs a new Maybe instance
  */
	function Maybe(data) {
		_classCallCheck(this, Maybe);

		this.data = data;
	}

	/**
  * cases ::
  */


	_createClass(Maybe, [{
		key: 'cases',
		value: function cases(patterns) {
			if (this.data instanceof _Just) {
				return patterns.Just(this.data.value);
			} else {
				return patterns.Nothing();
			}
		}

		/**
   * isJust :: Maybe a ~> () -> Bool
   */

	}, {
		key: 'isJust',
		value: function isJust() {
			return this.cases({
				Just: function Just() {
					return true;
				},
				Nothing: function Nothing() {
					return false;
				}
			});
		}

		/**
   * isNothing :: Maybe a ~> () -> Bool
   */

	}, {
		key: 'isNothing',
		value: function isNothing() {
			return !this.isJust();
		}

		/**
   * getOrElse :: Maybe a ~> a -> a
   */

	}, {
		key: 'getOrElse',
		value: function getOrElse(dflt) {
			return this.cases({
				Just: function Just(a) {
					return a;
				},
				Nothing: function Nothing() {
					return dflt;
				}
			});
		}

		/**
   * eq :: Maybe a ~> Maybe a -> Bool
   */

	}, {
		key: 'eq',
		value: function eq(other) {
			return this.cases({
				Just: function Just(a) {
					return other.cases({
						Just: function Just(b) {
							return a === b;
						},
						Nothing: function Nothing() {
							return false;
						}
					});
				},
				Nothing: function Nothing() {
					return other.cases({
						Just: function Just() {
							return false;
						},
						Nothing: function Nothing() {
							return true;
						}
					});
				}
			});
		}
	}, {
		key: 'notEq',
		value: function notEq(other) {
			return !this.eq(other);
		}

		/**
   * map :: Maybe a ~> (a -> b) -> Maybe b
   */

	}, {
		key: 'map',
		value: function map(f) {
			return this.data instanceof _Just ? Maybe.Just(f(this.data.value)) : Maybe.Nothing;
		}

		/**
   * ap :: Maybe (a -> b) ~> Maybe a -> Maybe b
   */

	}, {
		key: 'ap',
		value: function ap(arg) {
			if (this instanceof MaybeFn) {
				return this.cases({
					Just: function Just(f) {
						return arg.andThen(function (arg) {
							var result = f(arg);
							if (typeof result === 'function') {
								return Maybe.lift(result);
							} else {
								return Maybe.Just(result);
							}
						});
					},
					Nothing: function Nothing() {
						return Maybe.Nothing;
					}
				});
			} else {
				console.error(this);
				throw new TypeError(this.data);
			}
		}

		/**
   * andThen :: Maybe a ~> (a -> Maybe b) -> Maybe b
   */

	}, {
		key: 'andThen',
		value: function andThen(next) {
			return this.data instanceof _Just ? next(this.data.value) : Maybe.Nothing;
		}

		/**
   * toString :: Maybe a ~> () -> String
   */

	}, {
		key: 'toString',
		value: function toString() {
			return this.cases({
				Just: function Just(a) {
					return 'Just ' + (0, _util.inspect)(a);
				},
				Nothing: function Nothing() {
					return 'Nothing';
				}
			});
		}

		/**
   * of :: a -> Maybe a
   */

	}], [{
		key: 'of',
		value: function of(a) {
			return a == null ? Maybe.Nothing : Maybe.Just(a);
		}

		/**
   * Just :: a -> Maybe a
   */

	}, {
		key: 'Just',
		value: function Just(a) {
			return new Maybe(new _Just(a));
		}

		/**
   * Nothing :: Maybe a
   */

	}, {
		key: 'lift',


		/**
   * lift :: (a -> b) -> Maybe (a -> b)
   *
   * Takes an unary function and returns a function
   * that takes a maybe and applies the value to the
   * given function
   */
		value: function lift(f) {
			return new MaybeFn(new _Just(f));
		}
	}]);

	return Maybe;
}();

Maybe.Nothing = new Maybe(new Nothing());

var MaybeFn = exports.MaybeFn = function (_Maybe) {
	_inherits(MaybeFn, _Maybe);

	function MaybeFn() {
		_classCallCheck(this, MaybeFn);

		return _possibleConstructorReturn(this, (MaybeFn.__proto__ || Object.getPrototypeOf(MaybeFn)).apply(this, arguments));
	}

	return MaybeFn;
}(Maybe);
