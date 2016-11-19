// @flow

/**
 * The Writer monad
 */
export class Writer<E, A> {

	data: { value: A, env: E[] }

	constructor(data: { value: A, env: E[] }) {
		this.data = data;
	}

	/**
	 * runWriter :: Writer e a -> () -> [e[], a]
	 */
	runWriter(): [E[], A] {
		return [ this.data.env, this.data.value ];
	}

	/**
	 * getEnv :: Writer e a ~> e[]
	 */
	getEnv(): E[] {
		return this.data.env;
	}

	/**
	 * getValue :: Writer e a -> a
	 */
	getValue(): A {
		return this.data.value;
	}

	/**
	 * andThen :: Write e a ~> (a -> Writer e b) -> Writer e b
	 */
	andThen<B>(next: (a: A) => Writer<E, B>): Writer<E, B> {
		const { value, env } = this.data,
			nextData = next(value).data;

		return new Writer({
			value: nextData.value,
			env: env.concat(nextData.env)
		});
	}

	/**
	 * of :: a -> Writer a a
	 */
	static of<B>(val: B): Writer<any, B> {
		return new Writer({ value: val, env: [] });
	}

	/**
	 * Tell ::
	 */
	static Tell<F>(msg: F): Writer<F, any> {
		return new Writer({ value: null, env: [ msg ] });
	}
}
