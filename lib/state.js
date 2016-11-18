"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The State monad
 */
var State = exports.State = function () {
	function State(runState) {
		_classCallCheck(this, State);

		this.runState = runState;
	}

	/**
  * getState :: State s a ~> s -> s
  */


	_createClass(State, [{
		key: "getState",
		value: function getState(initState) {
			return this.runState(initState).state;
		}

		/**
   * getValue :: State s a -> s -> a
   */

	}, {
		key: "getValue",
		value: function getValue(initState) {
			return this.runState(initState).value;
		}

		/**
   * map :: State s a -> (a -> b) -> State s b
   */

	}, {
		key: "map",
		value: function map(f) {
			var _this = this;

			return new State(function (s) {
				var prev = _this.runState(s);
				return { value: f(prev.value), state: prev.state };
			});
		}

		/**
   * andThen :: State s a ~> (a -> State s b) -> State s b
   */

	}, {
		key: "andThen",
		value: function andThen(next) {
			return State.join(this.map(next));
		}

		/**
   * join :: State s (State s a) -> State s a
   */

	}], [{
		key: "join",
		value: function join(state) {
			return new State(function (s) {
				var prev = state.runState(s);
				return prev.value.runState(prev.state);
			});
		}

		/**
   * of :: a -> State a a
   */

	}, {
		key: "of",
		value: function of(val) {
			return new State(function () {
				return { value: val, state: val };
			});
		}

		/**
   * Get :: () -> State a a
   */

	}, {
		key: "Get",
		value: function Get() {
			return new State(function (s) {
				return { value: s, state: s };
			});
		}

		/**
   * Put :: s -> State s a
   */

	}, {
		key: "Put",
		value: function Put(s) {
			return new State(function () {
				return { value: null, state: s };
			});
		}

		/**
   * Modify :: (s -> s) -> State s a
   */

	}, {
		key: "Modify",
		value: function Modify(f) {
			return State.Get().andThen(function (s) {
				return State.Put(f(s));
			});
		}
	}]);

	return State;
}();
