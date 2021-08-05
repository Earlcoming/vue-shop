
module.exports = {
	
	chainWebpack: config => {
		// 发布模式
		config.when(process.env.NODE_ENV === 'production', config => {
			config
				.entry('app')
				.clear()
				.add('./src/main-prod.js');

			// 设置过滤包的名,不打包这些包,在public/index.html中加入cdn
			config.set('externals', {
				vue: 'Vue',
				vuex: 'Vuex',
				'vue-router': 'VueRouter',
				axios: 'axios',
				'vue-quill-editor': 'VueQuillEditor',
				nprogress: 'NProgress',
				echarts: 'echarts',
				lodash: '_',
				'vue-router': 'VueRouter',
			})

			// 给html属性添加isProd属性为true;
			config.plugin('html').tap(args => {
				args[0].isProd = true;
				return args;
			});
			
		});

		// 开发模式
		config.when(process.env.NODE_ENV === 'development', config => {
			config
				.entry('app')
				.clear()
				.add('./src/main-dev.js');
				
			// 给html属性添加isProd为false
			config.plugin('html').tap(args => {
				args[0].isProd = false;
				return args;
			});
			
		});

	}
}