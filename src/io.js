// @flow
import { compose } from 'ramda';

/**
 * The IO monad
 */
export class IO<A> {

	runIO: () => A

	/**
	 * Constructs a new IO instance
	 */
	constructor(runIO: () => A): void {
		this.runIO = runIO;
	}

	/**
	 * map :: IO a ~> (a -> b) -> IO b
	 */
	map<B>(f: (a: A) => B): IO<B> {
		return IO.of(f(this.runIO()));
	}

	ap() {}

	/**
	 * andThen :: IO a ~> (a -> IO b) -> IO b
	 */
	andThen<B>(next: (a: A) => IO<B>): IO<B> {
		return next(this.runIO());
	}

	/**
	 * of :: a -> IO a
	 */
	static of(val: A): IO<A> {
		return new IO(() => val);
	}

}
