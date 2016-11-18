'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.IO = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ramda = require('ramda');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The IO monad
 */
var IO = exports.IO = function () {

	/**
  * Constructs a new IO instance
  */
	function IO(runIO) {
		_classCallCheck(this, IO);

		this.runIO = runIO;
	}

	/**
  * map :: IO a ~> (a -> b) -> IO b
  */


	_createClass(IO, [{
		key: 'map',
		value: function map(f) {
			return IO.of(f(this.runIO()));
		}

		/**
   * andThen :: IO a ~> (a -> IO b) -> IO b
   */

	}, {
		key: 'andThen',
		value: function andThen(next) {
			return next(this.runIO());
		}

		/**
   * of :: a -> IO a
   */

	}], [{
		key: 'of',
		value: function of(val) {
			return new IO(function () {
				return val;
			});
		}

		/**
   * lift :: (a -> b) -> IO a -> IO b
   */

	}, {
		key: 'lift',
		value: function lift(f) {
			return function (iot) {
				return iot.map(f);
			};
		}

		/**
   * lift2 :: (a -> b -> c) -> IO a -> IO b -> IO c
   */

	}, {
		key: 'lift2',
		value: function lift2(f) {
			return (0, _ramda.curry)(function (iot, iou) {
				return iot.andThen(function (iot) {
					return iou.map(function (iou) {
						return f(iot, iou);
					});
				});
			});
		}
	}]);

	return IO;
}();
