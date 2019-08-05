require(['jquery', 'tool', 'viewer'], function($, tool) {
	//图片展示初始化
	$('.article-img-list').viewer({
		url: 'data-original'
	});
	//绑定用户信息窗浮动定位
	tool.bindUserBoxFixed();
	//绑定附属信息点击事件
	tool.bindUserInfoCilck();
	//用户信息初始化
	tool.initUserInfo();
	//绑定阅读全文事件
	bindReadMore();

	//绑定阅读全文事件
	function bindReadMore() {
		$("body").on("click", ".article-more .btn", function() {
			if($(this).attr("data-toggle") == "hidden") {
				$(this).parent().prev().css("max-height", "none");
				$(this).html('收起<span>&lt;</span>');
				$(this).attr("data-toggle", "show");
			} else if($(this).attr("data-toggle") == "show") {
				$(this).parent().prev().css("max-height", "250px");
				$(this).html('显示全文<span>&gt;</span>');
				$(this).attr("data-toggle", "hidden");
				$("body,html").animate({
					"scrollTop": ($(this).parent().parent().offset().top - 60) + "px"
				});
			}
		});
	}

	//获取说说和日志列表
	function getDataListByPage() {
		
	}

});