import webpack from 'webpack'

export default {
	mode: 'universal',
	/*
	 ** Headers of the page
	 */
	head: {
		title: 'Chessalyzer',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: process.env.npm_package_description || ''
			}
		],
		link: [
			{
				rel: 'icon',
				type: 'image/png',
				href: '/logo_b.png',
				sizes: 'any'
			}
		]
	},
	/*
	 ** Customize the progress-bar color
	 */
	loading: false,
	/*
	 ** Global CSS
	 */
	css: [],
	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: [],
	/*
	 ** Nuxt.js modules
	 */
	modules: [
		// Doc: https://bootstrap-vue.js.org/docs/
		'bootstrap-vue/nuxt',
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios',
		'@nuxtjs/eslint-module'
	],
	/*
	 ** Axios module configuration
	 ** See https://axios.nuxtjs.org/options
	 */
	axios: {},
	/*
	 ** Build configuration
	 */
	build: {
		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) {
			// include jquery-color
			config.resolve.alias['jquery-color'] =
				this.buildContext.options.rootDir +
				'/node_modules/jquery-color/dist/jquery.color.js'
		},
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
				'window.jQuery': 'jquery'
			})
		]
	}
}
