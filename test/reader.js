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

function getName() {
	return Reader.Asks(p => p.name)
		.andThen(name => Reader.of(name));
}

function getAge() {
	return Reader.Asks(p => p.age)
		.andThen(age => Reader.of(age));
}

test('Reader', t => {
	t.plan(7);

	const person = { name: 'person', age: 29 };

	t.equal(greet('tim').runReader('hello'), 'hello tim');
	t.equal(sayInfo().runReader(person), `hey person, you're 29 years old!`);

	t.equal(getName().runReader(person), 'person');
	t.equal(getAge().runReader(person), 29);

	t.equal(Reader.lift(a => a + 1)(Reader.of(2)).runReader(), 3);
	t.equal(Reader.lift2((a, b) => a + b)(Reader.getProp('a'), Reader.getProp('b')).runReader({ a: 2, b: 4 }), 6);
	t.equal(Reader.lift2((a, b) => a + b)(Reader.getProp('a'))(Reader.getProp('b')).runReader({ a: 2, b: 4 }), 6);
});
