define(['jquery'], function($) {
	var tool = {
		//绑定附属信息点击事件
		bindUserInfoCilck: function() {
			$(".info-select").bind("click", function() {
				$(".info-select").removeClass("active");
				$(this).addClass("active");
				var addhtml = $(this).find("span").eq(1).html();
				$(".user-info-show p").html(addhtml);
			});
		},
		//绑定用户信息窗浮动定位
		bindUserBoxFixed: function() {
			//userbox距离顶端距离 - 50
			var userOffsetTop = $(".user-box").offset().top - 180;

			//窗口滚动监测
			window.onscroll = function() {
				var userOffsetLeft = $(".user-box").offset().left;
				//窗口滚动距离
				var moveTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
				var moveLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
				//变成fixed
				if(moveTop > userOffsetTop && $(".user-box").css("position").indexOf('absolute') != -1) {
					$(".user-box").css("position", "fixed");
					$(".user-box").css("top", "180px");
					$(".user-box").css("left", userOffsetLeft - moveLeft + "px");
					$(".user-box").css("right", "auto");
				}
				//变成absoulute
				if(moveTop <= userOffsetTop && $(".user-box").css("position").indexOf('fixed') != -1) {
					$(".user-box").css("position", "absolute");
					$(".user-box").css("top", "0");
					$(".user-box").css("right", "0px");
					$(".user-box").css("left", "auto");
				}
			}
		}

	}

	return tool;
});