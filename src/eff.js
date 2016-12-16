// @flow
import { Reader } from './reader';

/**
 * EffIO monad
 */
export class EffIO<E: {}, A> {

	runEffIO: (e: E) => A

	constructor(runEffIO: (e: E) => A): void {
		this.runEffIO = runEffIO;
	}

	/**
	 * map :: EffIO e a ~> (a -> b) -> EffIO e b
	 */
	map<B>(f: (a: A) => B): EffIO<E, B> {
		return new EffIO(env => f(this.runEffIO(env)));
	}

	/**
	 * andThen :: EffIO e a ~> (a -> EffIO e b) -> EffIO e b
	 */
	andThen<F: {}, B>(next: (a: A) => EffIO<E, B>): EffIO<E & F, B> {
		return new EffIO(env => next(this.runEffIO(env)).runEffIO(env));
	}

}

export class EffResult {}

export class EffTask {}
