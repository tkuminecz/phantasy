// @flow

const testVals = [
	'foo',
	'BAR',
	'',
	42,
	-2,
	3.14,
	-923.234232,
	true,
	false,
	[ 1, 2, 3 ],
	{ foo: { bar: 'baz' } },
];

/**
 * testFunctor
 *
 * Tests that the given class obeys the functor laws
 */
export function testFunctor(o: { t: any, mapper?: Function }, FunctorClass: Class<*>) {
	const {
		t,
		mapper = a => a
	} = o;

	const fa = FunctorClass.of('foo');
	t.deepEqual(
		mapper(fa.map(a => a)),
		mapper(fa),
		'functor identity'
	);
}

/**
 * testMonad
 *
 * Tests that the give class obeys the monad laws
 */
export function testMonad(o: { t: any, mapper?: Function }, MonadClass: Class<*>) {
	const {
		t,
		mapper = a => a
	} = o;

	const ma = MonadClass.of('foo');
	t.deepEqual(
		mapper(ma.andThen(a => MonadClass.of(a))),
		mapper(ma),
		'monad identity'
	);
}

/**
 * testLift
 *
 * tests lift() functionality
 */
export function testLift(o: { t: any, mapper?: Function }, Liftable: Class<*>) {
	const {
		t,
		mapper = a => a
	} = o;

	const lifted = Liftable.lift(a => a);
	t.deepEqual(
		mapper(lifted(Liftable.of('foo'))),
		mapper(Liftable.of('foo')),
		'lift'
	);
}

/**
 * testLift2
 *
 * tests lift2() functionality
 */
export function testLift2(o: { t: any, mapper?: Function }, Liftable: Class<*>) {
	const {
		t,
		mapper = a => a
	} = o;

	const lifted = Liftable.lift2((a, b) => a + b);
	t.deepEqual(
		mapper(lifted(Liftable.of('foo'), Liftable.of('bar'))),
		mapper(Liftable.of('foobar')),
		'lift2'
	);
}

/**
 * testLift3
 *
 * Tests lift3() functionality
 */
export function testLift3(o: { t: any, mapper?: Function }, Liftable: Class<*>) {
	const {
		t,
		mapper = a => a
	} = o;

	const lifted = Liftable.lift3((a, b, c) => a + b * c);

	t.deepEqual(
		mapper(lifted(Liftable.of(2), Liftable.of(3), Liftable.of(4))),
		mapper(Liftable.of(14)),
		'lift3'
	);
}
