// @flow
import { IO } from './io';
import { Maybe } from './maybe';
import Promise from 'bluebird';
import { Result } from './result';

type TaskExecutor<A, X> = (res: (a: A) => void, rej: (x: X) => void) => void;

/**
 * The Task monad
 */
export class Task<A, X> {

	runTask: TaskExecutor<A, X>

	/**
	 * Constructs a new Task instance
	 */
	constructor(runTask: TaskExecutor<A, X>) {
		this.runTask = runTask;
	}

	/**
	 * map :: Task a x ~> (a -> b) -> Task b x
	 *
	 * Transforms the result of this task if successful
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
	 * andThen :: Task a x ~> (a -> Task b x) -> Task b x
	 *
	 * Passes the result of this task into another task-producing
	 * function if successful
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
	 * handleError :: Task a x ~> (x -> Task a x) -> Task a x
	 *
	 * Handles a failed task result
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
	 * toMaybe :: Task a x ~> Task (Maybe a) x
	 */
	toMaybe(): Task<Maybe<A>, any> {
		return this.andThen(val => Task.Success(Maybe.Just(val)))
			.handleError(() => Task.Success(Maybe.Nothing));
	}

	/**
	 * of :: a -> Task a x
	 */
	static of<B>(a: B): Task<B, *> {
		return Task.Success(a);
	}

	/**
	 * Success :: a -> Task a x
	 *
	 * Returns a Task that always succeeds with the given value
	 */
	static Success<B>(a: B): Task<B, any> {
		return new Task(succ => succ(a));
	}

	/**
	 * Fail :: x -> Task a x
	 *
	 * Returns a Task that always fails with the given value
	 */
	static Fail<Y>(x: Y): Task<any, Y> {
		return new Task((_, fail) => fail(x));
	}

	/**
	 * fromResult :: Result a x -> Task a x
	 */
	static fromResult<B, Y>(res: Result<B, Y>): Task<B, Y> {
		return new Task((succ, fail) => {
			res.cases({
				Val: a => succ(a),
				Err: x => fail(x)
			});
		});
	}

	/**
	 * fromIO :: IO a -> Task a x
	 */
	static fromIO<B>(io: IO<B>): Task<B, any> {
		return new Task(succ => succ(io.runIO()));
	}

	/**
	 * fromPromise :: Promise a -> Task a Error
	 *
	 * Converts a promise to a task
	 */
	static fromPromise<A>(promise: Promise<A>): Task<A, ?Error> {
		return new Task((succ, fail) => { promise.then(succ).catch(fail); });
	}

	/**
	 * fromPromiseFunc :: (() -> Promise a) -> Task a Error
	 */
	static fromPromiseFunc<A>(promiseFn: () => Promise<A>): Task<A, ?Error> {
		return Task.fromPromise(promiseFn());
	}

	/**
	 * fromCallback :: (x -> a -> ()) -> Task a x
	 */
	static fromCallback<B, Y>(fn: (cb: (e: Y, v: B) => void) => void): Task<B, Y> {
		return new Task((succ, fail) => {
			fn((err, val) => {
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
	 * fromThrowable :: (() -> a) -> Task a Error
	 */
	static fromThrowable<A>(fn: () => A): Task<A, Error> {
		return new Task((succ, fail) => {
			try {
				succ(fn());
			}
			catch (err) {
				fail(err);
			}
		});
	}

	/**
	 * lift :: (a -> b) -> Task a x -> Task b x
	 */
	static lift<T, U, X>(f: (t: T) => U): (tt: Task<T, X>) => Task<U, X> {
		return (tt) => tt.andThen(t => Task.of(f(t)));
	}

	/**
	 * lift2 :: (a -> b -> c) -> Task a x -> Task b x -> Task c x
	 */
	static lift2<T, U, V, X>(f: (t: T, u: U) => V): * {
		return (tt, tu) => tt.andThen(tt => tu.map(tu => f(tt, tu)));
	}

	/**
	 * lift3 :: (a -> b -> c -> d) -> Task a x -> Task b x -> Task c x -> Task d x
	 */
	static lift3<A, B, C, D>(f: (a: A, b: B, c: C) => D): * {
		return (ta, tb, tc) => ta.andThen(a => tb.andThen(b => tc.andThen(c => Task.of(f(a, b, c)))));
	}

}
