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
	 * ap :: Maybe (a -> b) ~> Maybe a -> Maybe b
	 */
	ap<B>(arg: Maybe<B>): Maybe<*> {
		if (this instanceof MaybeFn) {
			return this.cases({
				Just: (f) => arg.andThen(arg => {
					const result = f(arg);
					if (typeof result === 'function') {
						return Maybe.lift(result);
					}
					else {
						return Maybe.Just(result);
					}
				}),
				Nothing: () => Maybe.Nothing
			});
		}
		else {
			console.error(this);
			throw new TypeError(this.data);
		}
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
	static Nothing = (new Maybe(new Nothing()): Maybe<any>);

	/**
	 * lift :: (a -> b) -> Maybe (a -> b)
	 *
	 * Takes an unary function and returns a function
	 * that takes a maybe and applies the value to the
	 * given function
	 */
	static lift<T, U>(f: (t: T) => U): MaybeFn<T, U> {
		return new MaybeFn(new Just(f));
	}

}

type Unary<A, B> = (a: A) => B
export class MaybeFn<A, B> extends Maybe<Unary<A, B>> {}
