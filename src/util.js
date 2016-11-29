// @flow

/**
 * invalid :: void -> void
 */
export const invalid =
	(value: empty) => {
		throw new TypeError();
	};

/**
 * raise :: Class<Error> -> String -> void
 */
export const raise =
	(Error: Class<Error>, msg: string) => {
		throw new Error(msg);
	};
