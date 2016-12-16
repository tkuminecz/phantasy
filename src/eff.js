// @flow
import { IO } from './io';
import { Result } from './result';
import { Task } from './task';

/**
 * Eff monad
 */
export class Eff<E: {}, A> {

	runEff: (e: E) => A

	constructor(runEff: (e: E) => A): void {
		this.runEff = runEff;
	}

	/**
	 * map :: Eff e a ~> (a -> b) -> Eff e b
	 */
	map<B>(f: (a: A) => B): Eff<E, B> {
		return new Eff(env => f(this.runEff(env)));
	}

	/**
	 * andThen :: Eff e a ~> (a -> Eff f b) -> Eff (e & f) b
	 */
	andThen<F: {}, B>(next: (a: A) => Eff<E, B>): Eff<E & F, B> {
		return new Eff(env => next(this.runEff(env)).runEff(env));
	}

	/**
	 * of :: a -> Eff e a
	 */
	static of(a: A): Eff<{}, A> {
		return new Eff(() => a);
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
