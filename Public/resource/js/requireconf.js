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
		'jquery.form': 'jquery.form',
		'highlight': 'highlight/highlight.pack',
		'jquery.jcrop':'jquery.Jcrop',
		
	},
	shim: {
		'viewer': {
			deps: ["jquery"]
		},
		'ueditor': ['ueditor.config'],
		'jquery.form': {
			deps: ["jquery"]
		},
		'jquery.jcrop': {
			deps: ["jquery"]
		}
		/*'underscore': {
			export: '_'
		},*/
	}
});