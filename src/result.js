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
 * The Result monad
 */
export class Result<A, X> {

	data: Val<A> | Err<X>

	constructor(data: Val<A> | Err<X>) {
		this.data = data;
	}

	cases<B>(patterns: { Val: (a: A) => B, Err: (x: X) => B}): B {
		if (this.data instanceof Val) {
			return patterns.Val(this.data.val);
		}
		else {
			return patterns.Err(this.data.err);
		}
	}

	/**
	 * map :: Result a x ~> (a -> b) -> Result b x
	 */
	map<B>(f: (a: A) => B): Result<B, X> {
		return this.cases({
			Val: (v) => Result.Val(f(v)),
			Err: (e) => Result.Err(e)
		});
	}

	/**
	 * andThen :: Result a x ~> (a -> Result b x) -> Result b x
	 */
	andThen<B>(next: (a: A) => Result<B, X>): Result<B, X> {
		return this.cases({
			Val: (v) => next(v),
			Err: (e) => Result.Err(e)
		});
	}

	/**
	 * handleError :: Result a x ~> (x -> Result a y) -> Result a y
	 */
	handleError<Y>(handle: (x: X) => Result<A, Y>): Result<A, Y> {
		return this.cases({
			Val: (a) => Result.Val(a),
			Err: (x) => handle(x)
		});
	}

	/**
	 * toMaybe :: Result a x ~> Maybe a
	 */
	toMaybe(): Maybe<A> {
		return this.cases({
			Val: a => Maybe.Just(a),
			Err: () => Maybe.Nothing
		});
	}

	/**
	 * of :: a -> Result a x
	 */
	static of<B>(v: B): Result<B, any> {
		return Result.Val(v);
	}

	/**
	 * Val :: a -> Result a x
	 */
	static Val<B>(v: B): Result<B, any> {
		return new Result(new Val(v));
	}

	/**
	 * Err :: x -> Result a x
	 */
	static Err<Y>(e: Y): Result<any, Y> {
		return new Result(new Err(e));
	}

	/**
	 * fromThrowable :: (() -> a) -> Result a Error
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
