module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parserOptions: {
		parser: 'babel-eslint'
	},
	extends: ['@nuxtjs', 'plugin:nuxt/recommended'],
	// add your custom rules here
	rules: {
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'no-tabs': 0,
		'vue/html-indent': 0,
		'vue/singleline-html-element-content-newline': 0,
		'no-console': 0,
		'space-before-function-paren': 0,
		'vue/html-self-closing': 0
	}
}
