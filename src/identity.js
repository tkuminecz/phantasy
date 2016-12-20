// @flow
import { inspect } from 'util';

/**
 * The `Identity` monad
 *
 * Simply acts a container for values without any additional behavior
 *
 * @example let a = Identity.of(42)
 */
export class Identity<A> {

	data: A

	/**
	 * Constructs a new Maybe instance
	 *
	 * @private
	 */
	constructor(data: A): void {
		this.data = data;
	}

	/**
	 * `map :: Identity a ~> (a -> b) -> Identity b`
	 *
	 * Transforms the value in the `Identity` instance
	 */
	map<B>(transform: (a: A) => B): Identity<B> {
		return Identity.of(transform(this.data));
	}

	/**
	 * `andThen :: Identity a ~> (a -> Identity b) -> Identity b`
	 *
	 * Chains the value of the `Identity` instance
	 * with another `Identity`-producing function
	 */
	andThen<B>(next: (a: A) => Identity<B>): Identity<B> {
		return next(this.data);
	}

	/**
	 * `toString :: Identity a ~> () -> String`
	 *
	 * Returns a string representation of the `Identity` instance
	 */
	toString(): string {
		return `Identity ${ inspect(this.data) }`;
	}

	/**
	 * `of :: a -> Identity a`
	 *
	 * Returns an `Identity` instance wrapping the giving value
	 */
	static of(a: A): Identity<A> {
		return new Identity(a);
	}

	/**
	 * `lift :: (a -> b) -> Identity a -> Identity b`
	 */
	static lift<A, B>(f: (a: A) => B): (a: Identity<A>) => Identity<B> {
		return (ma) => ma.andThen(a => Identity.of(f(a)));
	}

	/**
	 * `lift2 :: (a -> b -> c) -> (Identity a -> Identity b) -> Identity c`
	 */
	static lift2<A, B, C>(f: (a: A, b: B) => C): (a: Identity<A>, b: Identity<B>) => Identity<C> {
		return (ma, mb) => ma.andThen(a => mb.andThen(b => Identity.of(f(a, b))));
	}

	/**
	 * `lift3 :: (a -> b -> c -> d) -> (Identity a -> Identity b -> Identity c) -> Identity d`
	 */
	static lift3<A, B, C, D>(f: (a: A, b: B, c: C) => D): (a: Identity<A>, b: Identity<B>, c: Identity<C>) => Identity<D> {
		return (ma: Identity<A>, mb: Identity<B>, mc: Identity<C>) => ma.andThen(a => mb.andThen(b => mc.andThen(c => Identity.of(f(a, b, c)))));
	}

}
