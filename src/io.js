// @flow

/**
 * The `IO` monad
 *
 * Represents a potentially-effectful synchronous computation
 */
export class IO<A> {

	runIO: () => A

	/**
	 * Constructs a new IO instance
	 *
	 * @private
	 */
	constructor(runIO: () => A): void {
		this.runIO = runIO;
	}

	/**
	 * `map :: IO a ~> (a -> b) -> IO b`
	 *
	 * Transforms the result of the `IO` instance
	 */
	map<B>(transform: (a: A) => B): IO<B> {
		return IO.of(transform(this.runIO()));
	}

	/**
	 * `andThen :: IO a ~> (a -> IO b) -> IO b`
	 *
	 * Chains the result of the `IO` instance with another `IO`-producing function
	 */
	andThen<B>(next: (a: A) => IO<B>): IO<B> {
		return next(this.runIO());
	}

	/**
	 * `of :: a -> IO a`
	 *
	 * Returns an `IO` instance that always produces the given value
	 */
	static of(value: A): IO<A> {
		return new IO(() => value);
	}

	/**
	 * `lift :: (a -> b) -> IO a -> IO b`
	 *
	 * Takes an unary function an returns an equivalent unary function which operates on `IO` values
	 */
	static lift<A, B>(f: (t: A) => B): (t: IO<A>) => IO<B> {
		return (ioA) => ioA.andThen(a => IO.of(f(a)));
	}

	/**
	 * `lift2 :: (a -> b -> c) -> IO a -> IO b -> IO c`
	 *
	 * Takes an binary function an returns an equivalent binary function which operates on `IO` values
	 */
	static lift2<A, B, C>(f: (a: A, b: B) => C): (a: IO<A>, b: IO<B>) => IO<C> {
		return (ioA, ioB) => ioA.andThen(a => ioB.map(b => f(a, b)));
	}

	/**
	 * `lift3 :: (a -> b -> c -> d) -> IO a -> IO b -> IO c -> IO d`
	 *
	 * Takes an ternary function an returns an equivalent ternary function which operates on `IO` values
	 */
	static lift3<A, B, C, D>(f: (a: A, b: B, c: C) => D): (a: IO<A>, b: IO<B>, c: IO<C>) => IO<D> {
		return (ioA, ioB, ioC) => ioA.andThen(a => ioB.andThen(b => ioC.map(c => f(a, b, c))));
	}

}
