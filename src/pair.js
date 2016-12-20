// @flow

/**
 * The `Pair` functor
 *
 * Represents a pair of values.
 */
export class Pair<A, B> {

	data: [A, B]

	/**
	 * Constructs a new `Pair` instance.
	 *
	 * @private
	 */
	constructor(data: [A, B]): void {
		this.data = data;
	}

	/**
	 * `toTuple :: Pair a b ~> [a, b]`
	 *
	 * Returns the tuple contained in the `Pair`
	 */
	toTuple(): [A, B] {
		return this.data;
	}

	/**
	 * `left :: Pair a b ~> a`
	 *
	 * Returns the left (first) value in the `Pair`.
	 */
	left(): A {
		const [ a] = this.data;
		return a;
	}

	/**
	 * right :: Pair a b ~> b
	 *
	 * Returns the right (second) value in the `Pair`.
	 */
	right(): B {
		const [ , b ] = this.data;
		return b;
	}

	/**
	 * `map :: Pair a b ~> (b -> c) -> Pair a c`
	 *
	 * Transforms the right (second) value in the `Pair` instance.
	 */
	map<C>(f: (b: B) => C): Pair<A, C> {
		const [ a, b ] = this.data;
		return Pair.of([ a, f(b) ]);
	}

	/**
	 * `from :: a -> b -> Pair a b`
	 *
	 * Returns a `Pair` containing the given two values.
	 */
	static from<A, B>(a: A, b: B): Pair<A, B> {
		return Pair.of([a, b]);
	}

	/**
	 * `of :: [a, b] -> Pair a b`
	 *
	 * Returns a `Pair` containing the given tuple of values.
	 */
	static of<A, B>(tuple: [A, B]): Pair<A, B> {
		const [ a, b ] = tuple,
			pairData =  [ a, b ];

		return new Pair(pairData);
	}

}
