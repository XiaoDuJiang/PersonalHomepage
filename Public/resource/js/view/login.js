require(['jquery', 'layer'], function($, Layer) {
	//加载遮罩
	var loadingLayer;

	//绑定点击事件
	$(".input-to").bind("click", function() {
		var toClass = $(this).attr("data-to");
		//隐藏其他的节点
		$(".input-to").parent().addClass("displaynone");
		$("." + toClass).css("opacity", 0);
		$("." + toClass).removeClass("displaynone");
		$("." + toClass).animate({
			"opacity": 1
		});
	});

	//点击登录事件
	$("#login-in").bind("click", function() {
		loginIn();
	});

	$('#login-password').bind('keydown', function(event) {
		if(event.keyCode == "13") {
			loginIn();
		}
	});
	
	$("#register").bind("click",function() {
		register();
	});
	
	//登录方法
	function loginIn() {
		//获取数据
		var account = $("#login-account").val();
		var pwd = $("#login-password").val();

		if(account) {
			if(pwd) {
				$.ajax({
					type: "post",
					url: "/Home/Login/loginIn",
					async: true,
					data: {
						"account": account,
						"password": pwd
					},
					beforeSend: function() {
						loadingLayer = Layer.load(1);
					},
					success: function(data) {
						data = eval("(" + data + ")");
						Layer.close(loadingLayer);
						if(data.status == 1) {
							Layer.msg(data.msg, {
								time: 2000
							});
						} else {
							Layer.msg(data.msg, {
								time: 2000
							});
						}

					}
				});

			} else {
				Layer.msg("密码不能为空", {
					time: 1500
				});
			}
		} else {
			Layer.msg("账号不能为空", {
				time: 1500
			});
		}

	}

	//注册方法
	function register() {
		//获取数据
		var account = $("#account").val();
		var pwd = $("#password").val();
		var name = $("#username").val();
		var testcode = $("#testcode").val();

		//正则验证
		var accountRegExp = /^[a-z|A-Z|0-9]{6,12}$/;
		var usernameRegExp = /^([\u4e00-\u9fa5]|[0-9]){0,8}$/;

		//验证
		if(!pwd || !testcode || !name || !account) {
			Layer.msg("请将信息填写完整", {
				time: 1500
			});
			return false;
		}

		if(!accountRegExp.test(account)) {
			Layer.msg("账号需要为6~12位的数字和英文组合", {
				time: 1500
			});
			return false;
		}

		if(!usernameRegExp.test(name)) {
			Layer.msg("昵称需要为数字或者汉字组合，最多八个字符", {
				time: 1500
			});
			return false;
		}

		//提交
		$.ajax({
			type: "post",
			url: "/Home/Login/registerAccount",
			async: true,
			data: {
				'repwd': pwd,
				'testcode': testcode,
				'username': name,
				'password': pwd,
				'account': account
			},
			beforeSend: function() {
				loadingLayer = Layer.load(1);
			},
			success: function(data) {
				data = eval("(" + data + ")");
				Layer.close(loadingLayer);
				if(data.status == 1) {
					Layer.msg(data.msg, {
						time: 2000
					});
				} else {
					Layer.msg(data.msg, {
						time: 2000
					});
				}
			}
		});

	}

});