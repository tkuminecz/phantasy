// @flow
import { Writer } from '../src/writer';
import test from 'tape';

function half(num): Writer<string, number> {
	return Writer.Tell(`I just halved ${ num }`)
		.andThen(() => Writer.of(num / 2));
}

test('Writer', t => {
	t.plan(6);

	t.deepEqual(half(8).runWriter(), [['I just halved 8'], 4]);
	t.deepEqual(half(8).getEnv(), ['I just halved 8']);
	t.deepEqual(half(8).getValue(), 4);

	t.deepEqual(half(8).andThen(n => half(n)).runWriter(), [['I just halved 8', 'I just halved 4'], 2]);
	t.deepEqual(half(8).andThen(n => half(n)).getEnv(), ['I just halved 8', 'I just halved 4']);
	t.deepEqual(half(8).andThen(n => half(n)).getValue(), 2);
});
