// @flow

/**
 * The `IO` monad
 *
 * Represents a potentially-effectful synchronous computation.
 */
export class IO<A> {

	_runIO: () => A

	/**
	 * Constructs a new IO instance.
	 *
	 * @private
	 */
	constructor(runIO: () => A): void {
		this._runIO = runIO;
	}

	/**
	 * `runIO :: IO a ~> () -> a`
	 *
	 * Executes the function contained in the `IO` instance and returns the produced value. Note that any side-effects in the `IO` would be performed at this time.
	 *
	 * @example let a = IO.of(42);
	 *
	 * a.runIO() === 42;
	 */
	runIO(): A {
		return this._runIO();
	}

	/**
	 * `map :: IO a ~> (a -> b) -> IO b`
	 *
	 * Transforms the result of the `IO` instance.
	 *
	 * @example let a = IO.of(2);
	 *
	 * a.map(a => a * 2) === IO.of(4);
	 */
	map<B>(f: (a: A) => B): IO<B> {
		return IO.of(f(this.runIO()));
	}

	/**
	 * `andThen :: IO a ~> (a -> IO b) -> IO b`
	 *
	 * Chains the result of the `IO` instance with another `IO`-producing function.
	 *
	 * @example let a = IO.of(42);
	 *
	 * a.andThen(a => IO.of(a / 2)) == IO.of(24);
	 */
	andThen<B>(next: (a: A) => IO<B>): IO<B> {
		return next(this.runIO());
	}

	/**
	 * `from :: (() -> a) -> IO a`
	 *
	 * Returns a `IO` instance wrapping the given function.
	 */
	static from<A>(f: () => A): IO<A> {
		return new IO(f);
	}

	/**
	 * `of :: a -> IO a`
	 *
	 * Returns an `IO` instance that always produces the given value.
	 *
	 * @example let a = IO.of(42);
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
