// @flow
import { curry} from 'ramda';
import { Maybe } from '@/maybe';

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
	 * toMaybe :: Task a x ~> () -> Task (Maybe a) x
	 *
	 * Transforms the task into a task that always
	 * succeeds with a Maybe
	 */
	toMaybe(): Task<Maybe<A>, *> {
		return this.andThen(a => Task.Success(Maybe.Just(a)))
			.handleError(() => Task.Success(Maybe.Nothing()));
	}

	/**
	 * Success :: a -> Task a x
	 *
	 * Returns a Task that always succeeds with the given value
	 */
	static Success(a: A): Task<A, *> {
		return new Task(succ => succ(a));
	}

	/**
	 * Fail :: x -> Task a x
	 *
	 * Returns a Task that always fails with the given value
	 */
	static Fail(x: X): Task<*, X> {
		return new Task((_, fail) => fail(x));
	}

	/**
	 * lift :: (a -> b) -> Task a x -> Task b x
	 */
	static lift<T, U, X>(f: (t: T) => U): (tt: Task<T, X>) => Task<U, X> {
		return (tt) => tt.map(f);
	}

	/**
	 * lift2 :: (a -> b -> c) -> Task a x -> Task b x -> Task c x
	 */
	static lift2<T, U, V, X>(f: (t: T, u: U) => V): * {
		return curry((tt, tu) => tt.andThen(tt => tu.map(tu => f(tt, tu))));
	}

}
