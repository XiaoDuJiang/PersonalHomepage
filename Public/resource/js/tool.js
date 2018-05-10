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
		},
		initUserInfo: function() {
			$.ajax({
				type: "post",
				url: "/Home/Index/getUserInfo",
				async: true,
				beforeSend: function() {
					loadLayer = layer.load(1);
				},
				success: function(data) {
					if(data.status == 1) {
						data = data.list.data.Data[0];
						$("title").text(data.title);
						if(data.headpic) {
							$(".user-img-circle img").attr("src", data.headpic);
							$(".user-box .user-img img").attr("src", data.headpic);
						} else {
							$(".user-img-circle img").attr("src", '../../../../Public/resource/img/login-bg2.jpg');
							$(".user-box .user-img img").attr("src", '../../../../Public/resource/img/login-bg2.jpg');
						}
						$(".user-resume p").text(data.resume);
						if(data.bgpic) {
							$(".header").css({
								"background": 'url(' + data.bgpic + ') no-repeat',
								"background-size": "100% auto"
							});
						}
						$(".user-box .user-name p").text(data.username);
						if(data.qq) {
							$(".user-box .user-qq span").eq(1).text(data.qq);
						} else {
							$(".user-box .user-qq span").eq(1).text('暂无');
						}
						if(data.github) {
							$(".user-box .user-github span").eq(1).html(
								'<a target="_blank" href="' + data.github + '">' + data.github.split('github.com/')[1] + '</a>'
							);
						} else {
							$(".user-box .user-github span").eq(1).html(
								'<a href="javascript:void(0)">暂无</a>'
							);
						}
						if(data.email) {
							$(".user-box .user-email span").eq(1).text(data.email);
						} else {
							$(".user-box .user-email span").eq(1).text('暂无');
						}
						if(data.tel) {
							$(".user-box .user-tel span").eq(1).text(data.tel);
						} else {
							$(".user-box .user-tel span").eq(1).text('暂无');
						}
						$(".user-box .user-info-show p").text(
							$(".user-box .user-qq span").eq(1).text()
						);
						layer.close(loadLayer);
					} else {
						layer.close(loadLayer);
						layer.alert("用户信息获取失败:" + data.msg);
					}
				}
			});
		}
	}

	return tool;
});