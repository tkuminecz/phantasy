// @flow

/**
 * Pair functor
 */
export class Pair<A, B> {

	data: [A, B]

	constructor(data: [A, B]): void {
		this.data = data;
	}

	/**
	 * map :: Pair a b ~> ([a, b] -> [x, y]) -> Pair x y
	 */
	map<X, Y>(f: (p: [A, B]) => [X, Y]): Pair<X, Y> {
		return Pair.of(f(this.data));
	}

	/**
	 * from :: a -> b -> Pair a b
	 */
	static from<A, B>(a: A, b: B): Pair<A, B> {
		return Pair.of([a, b]);
	}

	/**
	 * of :: [a, b] -> Pair a b
	 */
	static of<A, B>(data: [A, B]): Pair<A, B> {
		return new Pair(data);
	}

}
