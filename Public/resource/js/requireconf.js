/*require配置文件*/
require.config({
	paths: {
		'jquery': 'jquery-2.1.0',
		'layer': 'layer/layer.min',
		'viewer': 'viewer-jquery.min',
	},
	shim: {
		'viewer': {
			deps: ["jquery"]
		},
		/*'underscore': {
			export: '_'
		},*/
	}
});