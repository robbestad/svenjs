export default {
	input:  "src/index.js",
	output: {
		file:    'examples/browser/src/assets/sven.browser.js',
		format:  'es',
		globals: {
			svenjs: 'Svenjs'
		}
	}
}
