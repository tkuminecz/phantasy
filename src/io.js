// @flow
import { compose, curry } from 'ramda';

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

	/**
	 * lift :: (a -> b) -> IO a -> IO b
	 */
	static lift<T, U>(f: (t: T) => U): (t: IO<T>) => IO<U> {
		return (iot) => iot.map(f);
	}

	/**
	 * lift2 :: (a -> b -> c) -> IO a -> IO b -> IO c
	 */
	static lift2<T, U, V>(f: (t: T, u: U) => V): * {
		return curry((iot, iou) => iot.andThen(iot => iou.map(iou => f(iot, iou))));
	}

}
