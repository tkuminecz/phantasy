// @flow
import { inspect } from 'util';

/**
 * The Identity monad
 */
export class Identity<A> {

	data: A

	/**
	 * Constructs a new Maybe instance
	 */
	constructor(data: A): void {
		this.data = data;
	}

	/**
	 * eq :: Identity a ~> Identity a -> Bool
	 */
	eq(other: Identity<A>): bool {
		return this.data === other.data;
	}

	/**
	 * notEq :: Identity a ~> Identity a -> Bool
	 */
	notEq(other: Identity<A>): bool {
		return !this.eq(other);
	}

	/**
	 * map :: Identity a ~> (a -> b) -> Identity b
	 */
	map<B>(f: (a: A) => B): Identity<B> {
		return Identity.of(f(this.data));
	}

	/**
	 * andThen :: Identity a ~> (a -> Identity b) -> Identity b
	 */
	andThen<B>(next: (a: A) => Identity<B>): Identity<B> {
		return next(this.data);
	}

	/**
	 * toString :: Identity a ~> () -> String
	 */
	toString(): string {
		return `Identity ${ inspect(this.data) }`;
	}

	/**
	 * of :: a -> Identity a
	 */
	static of(a: A): Identity<A> {
		return new Identity(a);
	}

	/**
	 * lift :: (a -> b) -> Identity a -> Identity b
	 */
	static lift<A, B>(f: (a: A) => B): * {
		return (ma) => ma.andThen(a => Identity.of(f(a)));
	}

	/**
	 * lift2 :: (a -> b -> c) -> Identity a -> Identity b -> Identity c
	 */
	static lift2<A, B, C>(f: (a: A, b: B) => C): * {
		return (ma, mb) => ma.andThen(a => mb.andThen(b => Identity.of(f(a, b))));
	}

	/**
	 * lift3 :: (a -> b -> c -> d) -> Identity a -> Identity b -> Identity c -> Identity d
	 */
	static lift3<A, B, C, D>(f: (a: A, b: B, c: C) => D): * {
		return (ma: Identity<A>, mb: Identity<B>, mc: Identity<C>) => ma.andThen(a => mb.andThen(b => mc.andThen(c => Identity.of(f(a, b, c)))));
	}

}
