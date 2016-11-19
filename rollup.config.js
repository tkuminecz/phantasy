import babel from 'rollup-plugin-babel';

export default {
	entry: 'src/main.js',
	format: 'umd',
	moduleName: 'Phantasy',
	plugins: [ babel() ],
	dest: 'lib/main.js'
}
