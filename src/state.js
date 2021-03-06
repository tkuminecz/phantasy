// @flow

/**
 * The State monad
 */
export class State<S, A> {

	runState: (s: S) => { state: S, value: A }

	constructor(runState: (s: S) => { state: S, value: A }): void {
		this.runState = runState;
	}

	/**
	 * getState :: State s a ~> s -> s
	 */
	getState(initState: S): S {
		return this.runState(initState).state;
	}

	/**
	 * getValue :: State s a -> s -> a
	 */
	getValue(initState: S): A {
		return this.runState(initState).value;
	}

	/**
	 * map :: State s a -> (a -> b) -> State s b
	 */
	map<B>(f: (a: A) => B): State<S, B> {
		return new State(s => {
			const prev = this.runState(s);
			return { value: f(prev.value), state: prev.state };
		});
	}

	/**
	 * andThen :: State s a ~> (a -> State s b) -> State s b
	 */
	andThen<B>(next: (a: A) => State<S, B>): State<S, B> {
		return State.join(this.map(next));
	}

	/**
	 * join :: State s (State s a) -> State s a
	 */
	static join<T, B>(state: State<T, State<T, B>>): State<T, B> {
		return new State(s => {
			const prev = state.runState(s);
			return prev.value.runState(prev.state);
		});
	}

	/**
	 * of :: a -> State a a
	 */
	static of<T>(val: T): State<T, T> {
		return new State(() => ({ value: val, state: val }));
	}

	/**
	 * Get :: () -> State a a
	 */
	static Get<T>(): State<T, T> {
		return new State(s => ({ value: s, state: s }));
	}

	/**
	 * Put :: s -> State s a
	 */
	static Put<T>(s: T): State<T, any> {
		return new State(() => ({ value: null, state: s }));
	}

	/**
	 * Modify :: (s -> s) -> State s a
	 */
	static Modify<T>(f: (s: T) => T): State<T, any> {
		return State.Get()
			.andThen(s => State.Put(f(s)));
	}

}
