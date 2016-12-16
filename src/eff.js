// @flow
import { IO } from './io';
import { Result } from './result';
import { Task } from './task';

/**
 * EffIO monad
 */
export class EffIO<E: {}, A> {

	runEff: (e: E) => IO<A>

	constructor(runEff: (e: E) => IO<A>): void {
		this.runEff = runEff;
	}

	/**
	 * map :: EffIO e a ~> (a -> b) -> EffIO e b
	 */
	map<B>(f: (a: A) => B): EffIO<E, B> {
		return new EffIO(env => this.runEff(env).map(f));
	}

	/**
	 * andThen :: EffIO e a ~> (a -> EffIO f b) -> EffIO (e & f) b
	 */
	andThen<F: {}, B>(next: (a: A) => EffIO<E, B>): EffIO<E & F, B> {
		return new EffIO(env => this.runEff(env).andThen(a => next(a).runEff(env)));
	}

	/**
	 * of :: a -> EffIO e a
	 */
	static of(a: A): EffIO<{}, A> {
		return new EffIO(() => IO.of(a));
	}

}

/**
 * EffResult monad
 */
export class EffResult<E: {}, A, X> {

	runEff: (e: E) => Result<A, X>

	constructor(runEff: (e: E) => Result<A, X>): void {
		this.runEff = runEff;
	}

	/**
	 * map :: EffResult e a x ~> (a -> b) -> EffResult e b x
	 */
	map<B>(f: (a: A) => B): EffResult<E, B, X> {
		return new EffResult(env => this.runEff(env).map(f));
	}

	/**
	 * andThen :: EffResult e a x ~> (a -> EffResult f b x) -> EffResult (e & f) b x
	 */
	andThen<F: {}, B>(next: (a: A) => EffResult<F, B, X>): EffResult<E & F, B, X> {
		return new EffResult(env => this.runEff(env).andThen(a => next(a).runEff(env)));
	}

	/**
	 * of :: a -> EffResult {} a x
	 */
	static of(a: A): EffResult<{}, A, any> {
		return new EffResult(() => Result.of(a));
	}

}

/**
 * EffTask monad
 */
export class EffTask<E: {}, A, X> {

	runEff: (e: E) => Task<A, X>

	constructor(runEff: (e: E) => Task<A, X>): void {
		this.runEff = runEff;
	}

	/**
	 * map :: EffTask e a x ~> (a -> b) -> EffTask e b x
	 */
	map<B>(f: (a: A) => B): EffTask<E, B, X> {
		return new EffTask(env => this.runEff(env).map(f));
	}

	/**
	 * andThen :: EffTask e a x ~> (a -> EffTask f b x) -> EffTask e b x
	 */
	andThen<F: {}, B>(next: (a: A) => EffTask<F, B, X>): EffTask<E & F, B, X> {
		return new EffTask(env => this.runEff(env).andThen(a => next(a).runEff(env)));
	}

	/**
	 * of :: a -> EffTask {} a x
	 */
	static of(a: A): EffTask<{}, A, any> {
		return new EffTask(() => Task.of(a));
	}

}
