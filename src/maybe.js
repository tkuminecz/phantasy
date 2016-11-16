// @flow
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
	 * equals :: Maybe a ~> Maybe a -> Bool
	 */
	equals(other: Maybe<A>): bool {
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

	/**
	 * map :: Maybe a ~> (a -> b) -> Maybe b
	 */
	map<B>(f: (a: A) => B): Maybe<B> {
		return (this.data instanceof Just)
			? Maybe.Just(f(this.data.value))
			: Maybe.Nothing;
	}

	/**
	 * ap ::
	 */
	ap<B, C>(arg: B): Maybe<C> {
		return (this.data instanceof Just)
			? (typeof this.data.value === 'function')
				? this.data.value(arg)
				: raise(Error, ``)
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
	static Just(a: A): Maybe<A> {
		return new Maybe(new Just(a));
	}

	/**
	 * Nothing :: Maybe a
	 */
	static Nothing = (new Maybe(new Nothing()): any);

}
