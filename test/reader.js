// @flow
import { Reader } from '../src/reader';
import test from 'tape';

function greet(name: string) {
	return Reader.Ask()
		.andThen(greeting => Reader.of(`${ greeting } ${ name }`));
}

function sayInfo() {
	return Reader.Ask()
		.andThen((person: { name: string, age: number }) => Reader.of(`hey ${ person.name }, you're ${ person.age } years old!`));
}

function getName(): Reader<{ name: string }, string> {
	return Reader.Asks(p => p.name)
		.andThen(name => Reader.of(name));
}

function getAge(): Reader<{ age: number }, number> {
	return Reader.Asks(p => p.age)
		.andThen(age => Reader.of(age));
}

test('Reader', t => {
	t.plan(11);

	const person = { name: 'person', age: 29 };

	t.equal(greet('tim').runReader('hello'), 'hello tim');
	t.equal(sayInfo().runReader(person), `hey person, you're 29 years old!`);

	t.equal(getName().runReader(person), 'person');
	t.equal(getAge().runReader(person), 29);

	t.equal(getName().map(n => n.length).runReader({ name: 'tim' }), 3, 'map');

	t.deepEqual(Reader.all(getName(), getName()).runReader({ name: 'tim' }), [ 'tim', 'tim' ], 'Reader.all');

	t.deepEqual(Reader.merge2(getName(), getAge()).runReader({ name: 'tim', age: 24 }), [ 'tim', 24 ], 'Reader.merge2');
	t.deepEqual(Reader.merge3(getName(), getAge(), (Reader.Asks(e => e.foo): Reader<{ foo: bool }, bool>)).runReader({ name: 'tim', age: 29, foo: true }), [ 'tim', 29, true ], 'Reader.merge3');

	t.equal(Reader.lift(a => a + 1)(Reader.of(2)).runReader(), 3, 'lift');
	t.equal(Reader.lift2((a, b) => a + b)(Reader.of(2), Reader.of(3)).runReader(), 5, 'lift2');
	t.equal(Reader.lift3((a, b, c) => a + b * c)(Reader.of(2), Reader.of(3), Reader.of(4)).runReader(), 14, 'lift3');
});
