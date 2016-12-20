// @flow
import { IO } from './io';
import { Result } from './result';
import { Task } from './task';

/**
 * The `Eff` monad
 *
 * Represents synchronous computations which are both dependency-injected and explicitly effectful
 */
export class Eff<E: {}, A> {

	runEff: (e: E) => A

	/**
	 * Constructs a new Eff instance
	 *
	 * @private
	 */
	constructor(runEff: (e: E) => A): void {
		this.runEff = runEff;
	}

	/**
	 * `map :: Eff e a ~> (a -> b) -> Eff e b`
	 *
	 * Transforms the result of the `Eff` instance
	 */
	map<B>(transform: (a: A) => B): Eff<E, B> {
		return new Eff(env => transform(this.runEff(env)));
	}

	/**
	 * `andThen :: Eff e a ~> (a -> Eff f b) -> Eff (e & f) b`
	 *
	 * Chains the result of the `Eff` instance to another `Eff`-producing function
	 */
	andThen<F: {}, B>(next: (a: A) => Eff<F, B>): Eff<E & F, B> {
		return new Eff(env => next(this.runEff(env)).runEff(env));
	}

	/**
	 * `toEffResult :: Eff e a ~> () -> EffResult e a x`
	 *
	 * Returns the `Eff` instance converted to an `EffResult`
	 */
	toEffResult(): EffResult<E, A, any> {
		return EffResult.fromEff(this);
	}

	/**
	 * `toEffTask :: Eff e a ~> () -> EffTask e a x`
	 *
	 * Returns the `Eff` instance converted to an `EffTask`
	 */
	toEffTask(): EffTask<E, A, any> {
		return EffTask.fromEff(this);
	}

	/**
	 * `of :: a -> Eff e a`
	 */
	static of<A>(a: A): Eff<any, A> {
		return new Eff(() => a);
	}

	/**
	 * `Require :: () -> Eff e e`
	 */
	static Require(): Eff<E, E> {
		return new Eff(e => e);
	}

	/**
	 * `Requires :: (e -> a) -> Eff e a`
	 */
	static Requires<E: {}>(f: (e: E) => A): Eff<E, A> {
		return new Eff(f);
	}

}

/**
 * The `EffResult` monad
 */
export class EffResult<E: {}, A, X> {

	runEff: (e: E) => Result<A, X>

	/**
	 * Constructs a new `EffResult` instance
	 *
	 * @private
	 */
	constructor(runEff: (e: E) => Result<A, X>): void {
		this.runEff = runEff;
	}

	/**
	 * `map :: EffResult e a x ~> (a -> b) -> EffResult e b x`
	 */
	map<B>(f: (a: A) => B): EffResult<E, B, X> {
		return new EffResult(env => this.runEff(env).map(f));
	}

	/**
	 * `andThen :: EffResult e a x ~> (a -> EffResult f b x) -> EffResult (e & f) b x`
	 */
	andThen<F: {}, B>(next: (a: A) => EffResult<F, B, X>): EffResult<E & F, B, X> {
		return new EffResult(env => this.runEff(env).andThen(a => next(a).runEff(env)));
	}

	/**
	 * `toEffTask :: EffResult e a x ~> () -> EffTask e a x`
	 */
	toEffTask(): EffTask<E, A, X> {
		return EffTask.fromEffResult(this);
	}

	/**
	 * `fromEff :: Eff e a -> EffResult e a x`
	 */
	static fromEff<E: {}, A>(eff: Eff<E, A>): EffResult<E, A, any> {
		return new EffResult(env => Result.Val(eff.runEff(env)));
	}

	/**
	 * `fromResult :: Result a x -> EffResult {} a x`
	 */
	static fromResult<A, X>(result: Result<A, X>): EffResult<{}, A, X> {
		return new EffResult(() => result);
	}

	/**
	 * `of :: a -> EffResult {} a x`
	 */
	static of<A>(a: A): EffResult<any, A, any> {
		return new EffResult(() => Result.of(a));
	}

	/**
	 * `Require :: () -> EffResult e e x`
	 */
	static Require(): EffResult<E, E, any> {
		return new EffResult(e => Result.of(e));
	}

	/**
	 * `Requires :: (e -> Result a x ) -> EffResult e a x`
	 */
	static Requires<E: {}, A, X>(f: (e: E) => Result<A, X>): EffResult<E, A, X> {
		return new EffResult(f);
	}

	/**
	 * `Val :: a -> Result e a x`
	 */
	static Val<A>(a: A): EffResult<any, A, any> {
		return EffResult.fromResult(Result.Val(a));
	}

	/**
	 * `Err :: x -> Result e a x`
	 */
	static Err<X>(x: X): EffResult<any, any, X> {
		return EffResult.fromResult(Result.Err(x));
	}

}

/**
 * The `EffTask` monad
 */
export class EffTask<E: {}, A, X> {

	runEff: (e: E) => Task<A, X>

	constructor(runEff: (e: E) => Task<A, X>): void {
		this.runEff = runEff;
	}

	/**
	 * `map :: EffTask e a x ~> (a -> b) -> EffTask e b x`
	 *
	 * Transforms the result of the `EffTask` instance if successful,
	 * and otherwise propagates the failure
	 */
	map<B>(f: (a: A) => B): EffTask<E, B, X> {
		return new EffTask(env => this.runEff(env).map(f));
	}

	/**
	 * `andThen :: EffTask e a x ~> (a -> EffTask f b x) -> EffTask e b x`
	 */
	andThen<F: {}, B>(next: (a: A) => EffTask<F, B, X>): EffTask<E & F, B, X> {
		return new EffTask(env => this.runEff(env).andThen(a => next(a).runEff(env)));
	}

	/**
	 * `fromEff :: Eff e a -> EffTask e a x`
	 *
	 * Returns the given `Eff` converted to an `EffTask`
	 */
	static fromEff<E: {}, A>(eff: Eff<E, A>): EffTask<E, A, any> {
		return new EffTask(env => Task.Success(eff.runEff(env)));
	}

	/**
	 * `fromEffResult :: EffResult e a x -> EffTask e a x`
	 *
	 * Returns the given `EffResult` converted to an `EffTask`
	 */
	static fromEffResult<E: {}, A, X>(eff: EffResult<E, A, X>): EffTask<E, A, X> {
		return new EffTask(env => {
			return eff.runEff(env)
				.cases({
					Val: a => Task.Success(a),
					Err: x => Task.Fail(x)
				});
		});
	}

	/**
	 * `fromTask :: Task a x -> EffTask {} a x`
	 *
	 * Returns the given `Task` converted to an `EffTask`
	 */
	static fromTask<A, X>(task: Task<A, X>): EffTask<{}, A, X> {
		return new EffTask(() => task);
	}

	/**
	 * `of :: a -> EffTask {} a x`
	 */
	static of<A>(a: A): EffTask<any, A, any> {
		return new EffTask(() => Task.of(a));
	}

	/**
	 * `Require :: () -> EffTask e e x`
	 */
	static Require(): EffTask<E, E, any> {
		return new EffTask(e => Task.of(e));
	}

	/**
	 * `Requires :: (e -> Task a x) -> EffTask e a x`
	 */
	static Requires<E: {}, A, X>(f: (e: E) => Task<A, X>): EffTask<E, A, X> {
		return new EffTask(f);
	}

	/**
	 * `Success :: a -> EffTask e a x`
	 *
	 * Returns an `EffTask` that always succeeds with the given value
	 */
	static Success<A>(a: A): EffTask<any, A, any> {
		return EffTask.fromTask(Task.Success(a));
	}

	/**
	 * `Fail :: x -> EffTask e a x`
	 *
	 * Returns an `EffTask` that always fails with the given value
	 */
	static Fail<X>(x: X): EffTask<any, any, X> {
		return EffTask.fromTask(Task.Fail(x));
	}

}
