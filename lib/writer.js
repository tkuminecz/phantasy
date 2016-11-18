"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The Writer monad
 */
var Writer = exports.Writer = function () {
	function Writer(data) {
		_classCallCheck(this, Writer);

		this.data = data;
	}

	/**
  * runWriter :: Writer e a -> () -> [e[], a]
  */


	_createClass(Writer, [{
		key: "runWriter",
		value: function runWriter() {
			return [this.data.env, this.data.value];
		}

		/**
   * getEnv :: Writer e a ~> e[]
   */

	}, {
		key: "getEnv",
		value: function getEnv() {
			return this.data.env;
		}

		/**
   * getValue :: Writer e a -> a
   */

	}, {
		key: "getValue",
		value: function getValue() {
			return this.data.value;
		}

		/**
   * andThen :: Write e a ~> (a -> Writer e b) -> Writer e b
   */

	}, {
		key: "andThen",
		value: function andThen(next) {
			var _data = this.data,
			    value = _data.value,
			    env = _data.env,
			    nextData = next(value).data;


			return new Writer({
				value: nextData.value,
				env: env.concat(nextData.env)
			});
		}

		/**
   * of :: a -> Writer a a
   */

	}], [{
		key: "of",
		value: function of(val) {
			return new Writer({ value: val, env: [] });
		}

		/**
   * Tell ::
   */

	}, {
		key: "Tell",
		value: function Tell(msg) {
			return new Writer({ value: null, env: [msg] });
		}
	}]);

	return Writer;
}();
