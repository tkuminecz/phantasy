// @flow

/**
 * `invalid :: void -> void`
 *
 * Used to convince flow of exhaustiveness
 *
 * @private
 */
export const invalid =
	(value: empty) => {
		throw new TypeError();
	};

/**
 * `raise :: Class<Error> -> String -> void`
 *
 * Throws an exception of the given `Error` class with the given message
 *
 * @private
 */
export const raise =
	(Error: Class<Error>, msg: string) => {
		throw new Error(msg);
	};
