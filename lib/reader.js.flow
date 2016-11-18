// @flow
import { curry } from 'ramda';

/**
 * The Reader monad
 */
export class Reader<E, A> {

	runReader: (e: E) => A

	constructor(runReader: (e: E) => A) {
		this.runReader = runReader;
	}

	andThen<B>(next: (a: A) => Reader<E, B>): Reader<E, B> {
		return new Reader(env => next(this.runReader(env)).runReader(env));
	}

	static of<B>(val: B): Reader<any, B> {
		return Reader.Asks(() => val);
	}

	static Ask<F>(): Reader<F, F> {
		return Reader.Asks(env => env);
	}

	static Asks<F, B>(f: (f: F) => B): Reader<F, B> {
		return new Reader(f);
	}

	static getProp<B, F: { [k: string]: B }>(prop: string): Reader<F, B> {
		return Reader.Asks(obj => obj[prop]);
	}

	static lift<B, C>(f: (a: B) => C): (ra: Reader<E, B>) => Reader<E, C> {
		return (ra) => ra.andThen(a => Reader.of(f(a)));
	}

	static lift2<B, C, D>(f: (a: B, b: C) => D): * {
		return curry((ra, rb) => ra.andThen(a => rb.andThen(b => Reader.of(f(a, b)))));
	}

}
