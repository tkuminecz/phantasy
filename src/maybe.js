// @flow
import { curry } from 'ramda';
import { inspect } from 'util';
import { raise } from '@/util';

/**
 * Class representing a present value
 */
class Just<A> {

	value: A

	constructor(value: A): void {
		this.value = value;
	}

}

/**
 * Class representing a missing value
 */
class  Nothing {}

type MaybeData<A> = Just<A> | Nothing

/**
 * The Maybe monad
 */
export class Maybe<A> {

	data: MaybeData<A>

	/**
	 * Constructs a new Maybe instance
	 */
	constructor(data: MaybeData<A>): void {
		this.data = data;
	}

	/**
	 * cases ::
	 */
	cases<B>(patterns: { Just: (a: A) => B, Nothing: () => B }): B {
		if (this.data instanceof Just) {
			return patterns.Just(this.data.value);
		}
		else {
			return patterns.Nothing();
		}
	}

	/**
	 * isJust :: Maybe a ~> () -> Bool
	 */
	isJust(): bool {
		return this.cases({
			Just: () => true,
			Nothing: () => false
		});
	}

	/**
	 * isNothing :: Maybe a ~> () -> Bool
	 */
	isNothing(): bool {
		return !this.isJust();
	}

	/**
	 * getOrElse :: Maybe a ~> a -> a
	 */
	getOrElse(dflt: A): A {
		return this.cases({
			Just: (a) => a,
			Nothing: () => dflt
		});
	}

	/**
	 * eq :: Maybe a ~> Maybe a -> Bool
	 */
	eq(other: Maybe<A>): bool {
		return this.cases({
			Just: (a) => other.cases({
				Just: (b) => a === b,
				Nothing: () => false
			}),
			Nothing: () => other.cases({
				Just: () => false,
				Nothing: () => true
			})
		});
	}

	notEq(other: Maybe<A>): bool {
		return !this.eq(other);
	}

	/**
	 * map :: Maybe a ~> (a -> b) -> Maybe b
	 */
	map<B>(f: (a: A) => B): Maybe<B> {
		return (this.data instanceof Just)
			? Maybe.Just(f(this.data.value))
			: Maybe.Nothing;
	}

	/**
	 * andThen :: Maybe a ~> (a -> Maybe b) -> Maybe b
	 */
	andThen<B>(next: (a: A) => Maybe<B>): Maybe<B> {
		return (this.data instanceof Just)
			? next(this.data.value)
			: Maybe.Nothing;
	}

	/**
	 * toString :: Maybe a ~> () -> String
	 */
	toString(): string {
		return this.cases({
			Just: (a) => `Just ${ inspect(a) }`,
			Nothing: () => `Nothing`
		});
	}

	/**
	 * of :: a -> Maybe a
	 */
	static of(a: ?A): Maybe<A> {
		return (a == null)
			? Maybe.Nothing
			: Maybe.Just(a);
	}

	/**
	 * Just :: a -> Maybe a
	 */
	static Just<B>(a: B): Maybe<B> {
		return new Maybe(new Just(a));
	}

	/**
	 * Nothing :: Maybe a
	 */
	static Nothing = (new Maybe(new Nothing()): any);

	/**
	 * lift :: (a -> b) -> Maybe a -> Maybe b
	 *
	 * Takes an unary function and returns a function
	 * that takes a maybe and applies the value to the
	 * given function
	 */
	static lift<T, U>(f: (t: T) => U): (mt: Maybe<T>) => Maybe<U> {
		return (mt) => mt.map(f);
	}

	/**
	 * lift2 :: (a -> b -> c) -> Maybe a -> Maybe b -> Maybe c
	 *
	 * Takes an binary function and returns a function
	 * that takes two maybes and applies the values to the
	 * given function
	 */
	static lift2<T, U, V>(f: (t: T, u: U) => V): * {
		return curry((mt, mu) => mt.andThen(t => mu.map(u => f(t, u))));
	}

}
