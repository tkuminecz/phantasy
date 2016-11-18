'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Task = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ramda = require('ramda');

var _maybe = require('./maybe');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The Task monad
 */
var Task = exports.Task = function () {

	/**
  * Constructs a new Task instance
  */
	function Task(runTask) {
		_classCallCheck(this, Task);

		this.runTask = runTask;
	}

	/**
  * map :: Task a x ~> (a -> b) -> Task b x
  *
  * Transforms the result of this task if successful
  */


	_createClass(Task, [{
		key: 'map',
		value: function map(f) {
			var _this = this;

			return new Task(function (succ, fail) {
				_this.runTask(function (val) {
					return succ(f(val));
				}, function (err) {
					return fail(err);
				});
			});
		}

		/**
   * andThen :: Task a x ~> (a -> Task b x) -> Task b x
   *
   * Passes the result of this task into another task-producing
   * function if successful
   */

	}, {
		key: 'andThen',
		value: function andThen(next) {
			var _this2 = this;

			return new Task(function (succ, fail) {
				_this2.runTask(function (val) {
					return next(val).runTask(function (val) {
						return succ(val);
					}, function (err) {
						return fail(err);
					});
				}, function (err) {
					return fail(err);
				});
			});
		}

		/**
   * handleError :: Task a x ~> (x -> Task a x) -> Task a x
   *
   * Handles a failed task result
   */

	}, {
		key: 'handleError',
		value: function handleError(handle) {
			var _this3 = this;

			return new Task(function (succ, fail) {
				_this3.runTask(function (val) {
					return succ(val);
				}, function (err) {
					return handle(err).runTask(function (val) {
						return succ(val);
					}, function (err) {
						return fail(err);
					});
				});
			});
		}
	}, {
		key: 'toMaybe',
		value: function toMaybe() {
			return this.andThen(function (val) {
				return Task.Success(_maybe.Maybe.Just(val));
			}).handleError(function () {
				return Task.Success(_maybe.Maybe.Nothing);
			});
		}

		/**
   * of :: a -> Task a x
   */

	}], [{
		key: 'of',
		value: function of(a) {
			return Task.Success(a);
		}

		/**
   * Success :: a -> Task a x
   *
   * Returns a Task that always succeeds with the given value
   */

	}, {
		key: 'Success',
		value: function Success(a) {
			return new Task(function (succ) {
				return succ(a);
			});
		}

		/**
   * Fail :: x -> Task a x
   *
   * Returns a Task that always fails with the given value
   */

	}, {
		key: 'Fail',
		value: function Fail(x) {
			return new Task(function (_, fail) {
				return fail(x);
			});
		}

		/**
   * fromPromise :: Promise a -> Task a Error
   *
   * Converts a promise to a task
   */

	}, {
		key: 'fromPromise',
		value: function fromPromise(promise) {
			return new Task(function (succ, fail) {
				promise.then(succ).catch(fail);
			});
		}

		/**
   * fromPromiseFunc :: (() -> Promise a) -> Task a Error
   */

	}, {
		key: 'fromPromiseFunc',
		value: function fromPromiseFunc(promiseFn) {
			return new Task(function (succ, fail) {
				promiseFn().then(succ).catch(fail);
			});
		}

		/**
   * fromCallback :: (x -> a -> ()) -> Task a x
   */

	}, {
		key: 'fromCallback',
		value: function fromCallback(fn) {
			return new Task(function (succ, fail) {
				fn(function (err, val) {
					if (err) {
						fail(err);
					} else {
						succ(val);
					}
				});
			});
		}

		/**
   * lift :: (a -> b) -> Task a x -> Task b x
   */

	}, {
		key: 'lift',
		value: function lift(f) {
			return function (tt) {
				return tt.map(f);
			};
		}

		/**
   * lift2 :: (a -> b -> c) -> Task a x -> Task b x -> Task c x
   */

	}, {
		key: 'lift2',
		value: function lift2(f) {
			return (0, _ramda.curry)(function (tt, tu) {
				return tt.andThen(function (tt) {
					return tu.map(function (tu) {
						return f(tt, tu);
					});
				});
			});
		}
	}]);

	return Task;
}();
