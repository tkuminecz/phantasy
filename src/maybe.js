// @flow
import { inspect } from 'util';
import { raise } from './util';
import { Task } from './task';

/**
 * Class representing a present value
 *
 * @private
 */
class Just<A> {

	value: A

	constructor(value: A): void {
		this.value = value;
	}

}

/**
 * Class representing a missing value
 *
 * @private
 */
class  Nothing {}

type MaybeData<A> = Just<A> | Nothing

/**
 * The `Maybe` monad
 *
 * Represents the possibility of a value or nothing. Commonly used
 * to safely deal with nullable values because it is composable and
 * forces the developer to explicitly handle the null case.
 */
export class Maybe<A> {

	data: MaybeData<A>

	/**
	 * Constructs a new Maybe instance
	 *
	 * @private
	 */
	constructor(data: MaybeData<A>): void {
		this.data = data;
	}

	/**
	 * `cases :: { Just: a -> b, Nothing: () -> b } -> b`
	 *
	 * Performs a match against the possible `Maybe` cases
	 * and returns a value by executing the appropriate function
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
	 * `isJust :: Maybe a ~> () -> Bool`
	 *
	 * Returns `true` if the instance contains a value
	 */
	isJust(): bool {
		return this.cases({
			Just: () => true,
			Nothing: () => false
		});
	}

	/**
	 * `isNothing :: Maybe a ~> () -> Bool`
	 *
	 * Returns `true` if the instance is absent of value
	 */
	isNothing(): bool {
		return !this.isJust();
	}

	/**
	 * `getOrElse :: Maybe a ~> a -> a`
	 *
	 * Returns the contained value if `Just`,
	 * otherwise returns the given default value.
	 */
	getOrElse(defaultVal: A): A {
		return this.cases({
			Just: (a) => a,
			Nothing: () => defaultVal
		});
	}

	/**
	 * `map :: Maybe a ~> (a -> b) -> Maybe b`
	 *
	 * If `Just`, returns `Just` the value transformed by
	 * the given function, otherwise returns `Nothing`
	 */
	map<B>(transform: (a: A) => B): Maybe<B> {
		return (this.data instanceof Just)
			? Maybe.Just(transform(this.data.value))
			: Maybe.Nothing;
	}

	/**
	 * `andThen :: Maybe a ~> (a -> Maybe b) -> Maybe b`
	 *
	 * If `Just`, returns the `Maybe` instance resulting from passing the
	 * contained value into the given function, otherwise returns `Nothing`
	 */
	andThen<B>(next: (a: A) => Maybe<B>): Maybe<B> {
		return (this.data instanceof Just)
			? next(this.data.value)
			: Maybe.Nothing;
	}

	/**
	 * `toString :: Maybe a ~> () -> string`
	 *
	 * Returns the string representation of the `Maybe` instance
	 */
	toString(): string {
		return this.cases({
			Just: (a) => `Just ${ inspect(a) }`,
			Nothing: () => `Nothing`
		});
	}

	/**
	 * `of :: a -> Maybe a`
	 *
	 * Takes a nullable value and constructs a new `Maybe` instance containing it
	 */
	static of(a: ?A): Maybe<A> {
		return (a == null)
			? Maybe.Nothing
			: Maybe.Just(a);
	}

	/**
	 * `Just :: a -> Maybe a`
	 *
	 * Data constructor for indicating the presence of a value
	 */
	static Just<A>(a: A): Maybe<A> {
		return new Maybe(new Just(a));
	}

	/**
	 * `Nothing :: Maybe a`
	 *
	 * Data constructor for indicating the absence of a value
	 */
	static Nothing = (new Maybe(new Nothing()): any);

	/**
	 * `fromThrowable :: (() -> a) -> Maybe a`
	 *
	 * Takes a function which may throw an exception, and
	 * returns either `Maybe.Just` the value returned,
	 * or `Maybe.Nothing` if an exception is thrown.
	 */
	static fromThrowable<A>(throwFn: () => A): Maybe<A> {
		try {
			return Maybe.Just(throwFn());
		}
		catch (e) {
			return Maybe.Nothing;
		}
	}

	/**
	 * `lift :: (a -> b) -> Maybe a -> Maybe b`
	 *
	 * Takes an unary function and returns an equivalent unary function which operates on `Maybe` values
	 */
	static lift<A, B>(f: (a: A) => B): * {
		return (ma) => ma.andThen(a => Maybe.of(f(a)));
	}

	/**
	 * `lift2 :: (a -> b -> c) -> Maybe a -> Maybe b -> Maybe c`
	 *
	 * Takes an binary function and returns an equivalent binary function which operates on `Maybe` values
	 */
	static lift2<A, B, C>(f: (a: A, b: B) => C): * {
		return (ma, mb) => ma.andThen(a => mb.andThen(b => Maybe.of(f(a, b))));
	}

	/**
	 * `lift3 :: (a -> b -> c -> d) -> Maybe a -> Maybe b -> Maybe c -> Maybe d`
	 *
	 * Takes an ternary function and returns an equivalent ternary function which operates on `Maybe` values
	 */
	static lift3<A, B, C, D>(f: (a: A, b: B, c: C) => D): * {
		return (ma, mb, mc) => ma.andThen(a => mb.andThen(b => mc.andThen(c => Maybe.of(f(a, b, c)))));
	}

}
