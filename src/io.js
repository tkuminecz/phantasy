// @flow

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
		return (iot) => iot.andThen(t => IO.of(f(t)));
	}

	/**
	 * lift2 :: (a -> b -> c) -> IO a -> IO b -> IO c
	 */
	static lift2<T, U, V>(f: (t: T, u: U) => V): (t: IO<T>, u: IO<U>) => IO<V> {
		return (iot, iou) => iot.andThen(iot => iou.map(iou => f(iot, iou)));
	}

	/**
	 * lift3 :: (a -> b -> c -> d) -> IO a -> IO b -> IO c -> IO d
	 */
	static lift3<T, U, V, W>(f: (t: T, u: U, v: V) => W): (t: IO<T>, u: IO<U>, v: IO<V>) => IO<W> {
		return (iot, iou, iov) => iot.andThen(iot => iou.andThen(iou => iov.map(iov => f(iot, iou, iov))));
	}

}
