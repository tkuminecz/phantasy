// @flow
import { IO } from './io';
import { Maybe } from './maybe';
import Promise from 'bluebird';
import { Result } from './result';

type TaskExecutor<A, X> = (res: (a: A) => void, rej: (x: X) => void) => void;

/**
 * The `Task` monad
 *
 * Represents an asynchronous computation which may succeed or fail. They are very similar to `Promise`s.
 */
export class Task<A, X> {

	_runTask: TaskExecutor<A, X>

	/**
	 * Constructs a new Task instance.
	 *
	 * @private
	 */
	constructor(runTask: TaskExecutor<A, X>) {
		this._runTask = runTask;
	}

	/**
	 * `runTask:: Task a x ~> ((a -> void) -> (x -> void)) -> void`
	 *
	 * Takes success and error callbacks and executes the `Task`. The appropriate
	 * callback is called with produced value depending on the resolution of the `Task`.
	 */
	runTask(onSuccess: (a: A) => void, onFailure: (x: X) => void): void {
		return this._runTask(onSuccess, onFailure);
	}

	/**
	 * `map :: Task a x ~> (a -> b) -> Task b x`
	 *
	 * Transforms the result of the `Task` if successful.
	 */
	map<B>(f: (a: A) => B): Task<B, X> {
		return new Task((succ, fail) => {
			this.runTask(
				val => succ(f(val)),
				err => fail(err)
			);
		});
	}

	/**
	 * `andThen :: Task a x ~> (a -> Task b x) -> Task b x`
	 *
	 * Passes the result of the `Task` instance into
	 * another task-producing function if successful.
	 */
	andThen<B>(next: (a: A) => Task<B, X>): Task<B, X> {
		return new Task((succ, fail) => {
			this.runTask(
				val => next(val).runTask(
					val => succ(val),
					err => fail(err)
				),
				err => fail(err)
			);
		});
	}

	/**
	 * `handleError :: Task a x ~> (x -> Task a x) -> Task a x`
	 *
	 * Handles a failed task result.
	 */
	handleError(handle: (x: X) => Task<A, *>): Task<A, *> {
		return new Task((succ, fail) => {
			this.runTask(
				val => succ(val),
				err => handle(err).runTask(
					val => succ(val),
					err => fail(err)
				)
			)
		});
	}

	/**
	 * `toMaybe :: Task a x ~> Task (Maybe a) x`
	 *
	 * Converts the `Task` instance into a `Task`
	 * that always succeeds with a `Maybe` value.
	 */
	toMaybe(): Task<Maybe<A>, any> {
		return this.andThen(val => Task.Success(Maybe.Just(val)))
			.handleError(() => Task.Success(Maybe.Nothing));
	}

	/**
	 * `of :: a -> Task a x`
	 *
	 * Alias of `Task.Success`.
	 */
	static of<B>(a: B): Task<B, *> {
		return Task.Success(a);
	}

	/**
	 * `Success :: a -> Task a x`
	 *
	 * Returns a `Task` that always succeeds with the given value.
	 */
	static Success<B>(a: B): Task<B, any> {
		return new Task(succ => succ(a));
	}

	/**
	 * `Fail :: x -> Task a x`
	 *
	 * Returns a `Task` that always fails with the given value.
	 */
	static Fail<Y>(x: Y): Task<any, Y> {
		return new Task((_, fail) => fail(x));
	}

	/**
	 * `fromResult :: Result a x -> Task a x`
	 *
	 * Returns a `Task` equivalent to the given `Result` instance.
	 */
	static fromResult<A, X>(result: Result<A, X>): Task<A, X> {
		return new Task((succ, fail) => {
			result.cases({
				Val: a => succ(a),
				Err: x => fail(x)
			});
		});
	}

	/**
	 * `fromIO :: IO a -> Task a x`
	 *
	 * Returns a `Task` which always succeeds with
	 * the value produced by the given `IO` instance.
	 */
	static fromIO<B>(io: IO<B>): Task<B, any> {
		return new Task(succ => succ(io.runIO()));
	}

	/**
	 * `fromPromise :: Promise a -> Task a Error`
	 *
	 * Returns a `Task` which is resolved to the same resolution as the given `Promise`.
	 */
	static fromPromise<A>(promise: Promise<A>): Task<A, ?Error> {
		return new Task((succ, fail) => { promise.then(succ).catch(fail); });
	}

	/**
	 * `fromPromiseFunc :: (() -> Promise a) -> Task a Error`
	 *
	 * Returns a `Task` which is resolved to the same resolution
	 * as the `Promise` produced by the given function.
	 */
	static fromPromiseFunc<A>(promiseFn: () => Promise<A>): Task<A, ?Error> {
		return Task.fromPromise(promiseFn());
	}

	/**
	 * `fromCallback :: (x -> a -> ()) -> Task a x`
	 */
	static fromCallback<B, Y>(callbackFn: (cb: (e: Y, v: B) => void) => void): Task<B, Y> {
		return new Task((succ, fail) => {
			callbackFn((err, val) => {
				if (err) {
					fail(err);
				}
				else {
					succ(val);
				}
			});
		});
	}

	/**
	 * `fromThrowable :: (() -> a) -> Task a Error`
	 *
	 * Takes a function which may throw an exception and returns a `Task` that
	 * either succeeds with the produced value or fails with the thrown exception.
	 */
	static fromThrowable<A>(throwFn: () => A): Task<A, Error> {
		return new Task((succ, fail) => {
			try {
				succ(throwFn());
			}
			catch (err) {
				fail(err);
			}
		});
	}

	/**
	 * `lift :: (a -> b) -> Task a x -> Task b x`
	 *
	 * Takes an unary function an returns an equivalent function that operates on `Task` instances
	 */
	static lift<A, B, X>(f: (t: A) => B): (ta: Task<A, X>) => Task<B, X> {
		return (taskA) => taskA.andThen(a => Task.of(f(a)));
	}

	/**
	 * `lift2 :: (a -> b -> c) -> Task a x -> Task b x -> Task c x`
	 *
	 * Takes an binary function an returns an equivalent function that operates on `Task` instances
	 */
	static lift2<A, B, C, X>(f: (t: A, u: B) => C): (ta: Task<A, X>, tb: Task<B, X>) => Task<C, X> {
		return (taskA, taskB) => taskA.andThen(a => taskB.map(b => f(a, b)));
	}

	/**
	 * `lift3 :: (a -> b -> c -> d) -> Task a x -> Task b x -> Task c x -> Task d x`
	 *
	 * Takes an ternary function an returns an equivalent function that operates on `Task` instances
	 */
	static lift3<A, B, C, D>(f: (a: A, b: B, c: C) => D): * {
		return (taskA, taskB, taskC) => taskA.andThen(a => taskB.andThen(b => taskC.andThen(c => Task.of(f(a, b, c)))));
	}

}
