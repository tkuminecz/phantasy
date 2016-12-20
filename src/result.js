// @flow
import { Maybe } from './maybe';

class Val<A> {
	val: A
	constructor(val: A) {
		this.val = val;
	}
}

class Err<X> {
	err: X
	constructor(err: X) {
		this.err = err;
	}
}

/**
 * The `Result` monad
 *
 * Represents the possiblity of either a success value or an error value.
 *
 * @example // create a "success" value
 * let a = Result.Val(42),
 * 	b = Result.of(42);
 *
 * // create an "error" value
 * let x = Result.Error('error!');
 */
export class Result<A, X> {

	data: Val<A> | Err<X>

	/**
	 * Constructs a new `Result` instance.
	 *
	 * @private
	 */
	constructor(data: Val<A> | Err<X>) {
		this.data = data;
	}

	/**
	 * `cases :: Result a ~> { Val: a -> b, Err: x -> b } -> b`
	 *
	 * Performs a match against the possible `Result` cases and returns a value by executing the appropriate function.
	 */
	cases<B>(patterns: { Val: (a: A) => B, Err: (x: X) => B}): B {
		if (this.data instanceof Val) {
			return patterns.Val(this.data.val);
		}
		else {
			return patterns.Err(this.data.err);
		}
	}

	/**
	 * `map :: Result a x ~> (a -> b) -> Result b x`
	 */
	map<B>(f: (a: A) => B): Result<B, X> {
		return this.cases({
			Val: (v) => Result.Val(f(v)),
			Err: (e) => Result.Err(e)
		});
	}

	/**
	 * `andThen :: Result a x ~> (a -> Result b x) -> Result b x`
	 *
	 * Chains the success value of the `Result` instance
	 * with another `Result`-producing function.
	 */
	andThen<B>(next: (a: A) => Result<B, X>): Result<B, X> {
		return this.cases({
			Val: (v) => next(v),
			Err: (e) => Result.Err(e)
		});
	}

	/**
	 * `handleError :: Result a x ~> (x -> Result a y) -> Result a y`
	 *
	 * Chains the error value of the `Result` instance
	 * with another `Result`-producing function.
	 */
	handleError<Y>(handle: (x: X) => Result<A, Y>): Result<A, Y> {
		return this.cases({
			Val: (a) => Result.Val(a),
			Err: (x) => handle(x)
		});
	}

	/**
	 * `toMaybe :: Result a x ~> Maybe a`
	 *
	 * Returns the `Result` instance converted to a `Maybe`.
	 */
	toMaybe(): Maybe<A> {
		return this.cases({
			Val: a => Maybe.Just(a),
			Err: () => Maybe.Nothing
		});
	}

	/**
	 * `of :: a -> Result a x`
	 *
	 * Alias of `Result.Val`.
	 */
	static of<B>(value: B): Result<B, any> {
		return Result.Val(value);
	}

	/**
	 * `Val :: a -> Result a x`
	 *
	 * Returns a `Result` which succeeds with the given value.
	 */
	static Val<B>(value: B): Result<B, any> {
		return new Result(new Val(value));
	}

	/**
	 * `Err :: x -> Result a x`
	 *
	 * Returns a `Result` which fails with the given error value.
	 */
	static Err<Y>(error: Y): Result<any, Y> {
		return new Result(new Err(error));
	}

	/**
	 * `fromThrowable :: (() -> a) -> Result a Error`
	 *
	 * Takes a function which may throw an exception and returns a `Result` which
	 * either succeeds with the return value or fails with the thrown exception.
	 */
	static fromThrowable<B>(throwFn: () => B): Result<B, Error> {
		try {
			return Result.Val(throwFn());
		}
		catch (e) {
			return Result.Err(e);
		}
	}

}
