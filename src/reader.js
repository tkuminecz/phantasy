// @flow

/**
 * The Reader monad
 */
export class Reader<E, A> {

	runReader: (e: E) => A

	/**
	 * 	Constructs a new Reader instance
	 */
	constructor(runReader: (e: E) => A) {
		this.runReader = runReader;
	}

	/**
	 * map :: Reader e a ~> (a -> b) -> Reader e b
	 */
	map<B>(f: (a: A) => B): Reader<E, B> {
		return this.andThen(a => Reader.of(f(a)));
	}

	/**
	 * andThen :: Reader e a ~> (a -> Reader e b) -> Reader e b
	 */
	andThen<B>(next: (a: A) => Reader<E, B>): Reader<E, B> {
		return new Reader(env => next(this.runReader(env)).runReader(env));
	}

	/**
	 * of :: a -> Reader e a
	 */
	static of<B>(val: B): Reader<*, B> {
		return Reader.Asks(() => val);
	}

	/**
	 * merge2 :: Reader e a -> Reader f b -> Reader (e & f) [a, b]
	 */
	static merge2<E: {}, F: {}, A, B>(r1: Reader<E, A>, r2: Reader<F, B>): Reader<E & F, [A, B]> {
		return Reader.Ask()
			.andThen(env => Reader.of([ r1.runReader(env), r2.runReader(env) ]));
	}

	/**
	 * merge3 :: Reader e a -> Reader f b -> Reader g c -> Reader (e & f & g) [a, b, c]
	 */
	static merge3<E, F, G, A, B, C>(r1: Reader<E, A>, r2: Reader<F, B>, r3: Reader<G, C>): Reader<E & F & G, [A, B, C]> {
		return Reader.Ask()
			.andThen(env => Reader.of([ r1.runReader(env), r2.runReader(env), r3.runReader(env) ]));
	}

	/**
	 * all :: [Reader e a] -> Reader e [a]
	 */
	static all<F>(...readers: Reader<F, A>[]): Reader<F, A[]> {
		return Reader.Asks(env => readers.map(r => r.runReader(env)));
	}

	/**
	 * Ask :: () -> Reader e e
	 */
	static Ask<F>(): Reader<F, F> {
		return Reader.Asks(env => env);
	}

	/**
	 * Asks :: (e -> a) -> Reader e a
	 */
	static Asks<F, B>(f: (f: F) => B): Reader<F, B> {
		return new Reader(f);
	}

	/**
	 * lift :: (a -> b) -> Reader e a -> Reader e b
	 */
	static lift<B, C>(f: (a: B) => C): (ra: Reader<E, B>) => Reader<E, C> {
		return (ra) => ra.andThen(a => Reader.of(f(a)));
	}

	/**
	 * lift2 :: (a -> b -> c) -> Reader e a -> Reader e b -> Reader e c
	 */
	static lift2<A, B, C>(f: (a: A, b: B) => C) {
		return (ra, rb) => ra.andThen(a => rb.andThen(b => Reader.of(f(a, b))));
	}

	/**
	 * lift3 :: (a -> b -> c -> d) -> Reader e a -> Reader e b -> Reader e c -> Reader e d
	 */
	static lift3<A, B, C, D>(f: (a: A, b: B, c: C) => D): * {
		return (ra, rb, rc) => ra.andThen(a => rb.andThen(b => rc.andThen(c => Reader.of(f(a, b, c)))));
	}

}
