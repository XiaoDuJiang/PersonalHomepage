/*require配置文件*/
require.config({
	paths: {
		'jquery': 'jquery-2.1.0',
		'layer': 'layer/layer.min',
		'viewer': 'viewer-jquery.min',
		'ueditor': 'ueditor/ueditor.all',
		'ueditor.config': 'ueditor/ueditor.config',
		'zeroclipboard': 'ueditor/third-party/zeroclipboard/ZeroClipboard.min',
		'tool': 'tool',
		'dropdownmenu': 'dropdownmenu/dropdownmenu',
	},
	shim: {
		'viewer': {
			deps: ["jquery"]
		},
		'ueditor': ['ueditor.config']
		/*'underscore': {
			export: '_'
		},*/
	}
});