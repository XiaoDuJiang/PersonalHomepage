require(['layer', 'tool', 'jquery', 'jquery.form', 'jquery.jcrop'], function(layer, tool, $) {
	//加载
	var loadLayer;
	//用户信息初始化
	tool.initUserInfo();
	//绑定用户信息窗浮动定位
	tool.bindUserBoxFixed();
	//绑定附属信息点击事件
	tool.bindUserInfoCilck();
	//修改头像初始化
	alertHeadpic();
	//修改背景初始化
	alertBg();
	//用户默认信息初始化
	userInfoInit();

	/**
	 * 用户信息初始化获取
	 */
	function userInfoInit() {
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
					$("#username").val(data.username);
					$("#qq").val(data.qq);
					$("#email").val(data.email);
					$("#tel").val(data.tel);
					$("#github").val(data.github);
					$("#resume").val(data.resume);
					$("#title").val(data.title);
					layer.close(loadLayer);
				} else {
					layer.close(loadLayer);
					layer.msg("用户信息获取失败:" + data.msg, {
						time: 1500
					});
				}
			}
		});

		//保存用户信息
		$("#userinfo-submit").bind("click", function() {
			username = $("#username").val();
			qq = $("#qq").val();
			email = $("#email").val();
			tel = $("#tel").val();
			github = $("#github").val();
			resume = $("#resume").val();
			title = $("#title").val();

			if(username && resume && title) {
				$.ajax({
					type: "post",
					url: "/Home/Index/alertUserInfo",
					async: true,
					data: {
						username: username,
						qq: qq,
						email: email,
						tel: tel,
						github: github,
						resume: resume,
						title: title
					},
					beforeSend: function() {
						loadLayer = layer.load(1);
					},
					success: function(data) {
						if(data.status == 1) {
							$("#username").val(username);
							$("#qq").val(qq);
							$("#email").val(email);
							$("#tel").val(tel);
							$("#github").val(github);
							$("#resume").val(resume);
							$("#title").val(title);

							$("title").text(title);
							$(".user-resume p").text(resume);

							$(".user-box .user-name p").text(username);
							if(qq) {
								$(".user-box .user-qq span").eq(1).text(qq);
							} else {
								$(".user-box .user-qq span").eq(1).text('暂无');
							}
							if(github) {
								$(".user-box .user-github span").eq(1).html(
									'<a target="_blank" href="' + github + '">' + github.split('github.com/')[1] + '</a>'
								);
							} else {
								$(".user-box .user-github span").eq(1).html(
									'<a href="javascript:void(0)">暂无</a>'
								);
							}
							if(email) {
								$(".user-box .user-email span").eq(1).text(email);
							} else {
								$(".user-box .user-email span").eq(1).text('暂无');
							}
							if(tel) {
								$(".user-box .user-tel span").eq(1).text(tel);
							} else {
								$(".user-box .user-tel span").eq(1).text('暂无');
							}
							$(".info-select").eq(1).trigger("click");

							layer.close(loadLayer);
							layer.msg("保存成功", {
								time: 1500
							});
						} else {
							layer.close(loadLayer);
							layer.msg(data.msg, {
								time: 1500
							});
						}
					}

				});

			} else {
				layer.alert("昵称、简介、标题为必填项");
			}
		});
	}

	//修改头像
	function alertHeadpic() {
		//图片裁剪信息
		var headPicInfo = {
			h: 0,
			w: 0,
			x: 0,
			x2: 0,
			y: 0,
			y2: 0
		}

		//保存图片信息
		function savePicInfo(c) {
			headPicInfo = c;
		}

		//修改头像事件
		$("#alert-headpic").bind("click", function() {
			$("#headpic-file").trigger("click");
		});
		//绑定change事件
		$("#headpic-file").bind("change", function() {
			//获取文件路径
			var files = this.files;
			var file;
			if(files && files.length == 1) {
				file = files[0];
				if(/^image\/png$|jpeg$|jpg$/.test(file.type)) {
					$(".alert-pic").html('<img id="headpic" src="' + URL.createObjectURL(file) + '" />');
					//显示遮罩和修改框
					$(".shadow-box").removeClass("displaynone");
					$(".alert-pic-box").removeClass("displaynone");
					//按钮
					$(".alert-pic-ipt").html(
						'<div class="btn btn-md btn-color-blue2" id="save-headpic">保存</div>' +
						'<div class="btn btn-md btn-color-red2" id="cancel-headpic">取消</div>'
					);
					//初始化裁剪方法
					$('#headpic').Jcrop({
						setSelect: [0, 0, 120, 60],
						onChange: savePicInfo,
						onSelect: savePicInfo,
						bgFade: true,
						bgColor: "#000",
						aspectRatio: 120 / 60,
						bgOpacity: .5,
						minSize: [120, 60],
						maxSize: [400, 200]
					});
				} else {
					$(this).val("");
					Layer.alert("请选择jpg或者png格式的图片");
				}
			} else {
				$(this).val("");
				layer.alert("已取消");
			}

		});

		//点击取消
		$(".alert-pic-ipt").on("click", "#cancel-headpic", function() {
			$("#headpic-file").val("");
			$(".shadow-box").addClass("displaynone");
			$(".alert-pic-box").addClass("displaynone");
		});

		//点击保存
		$(".alert-pic-ipt").on("click", "#save-headpic", function() {
			//计算图片的真实裁剪坐标
			if(headPicInfo.x != headPicInfo.x2 && headPicInfo.y != headPicInfo.y2) {
				var headImg = new Image();
				headImg.src = $("#headpic").attr("src");
				if(headImg.height && headImg.width) {
					var y1 = headPicInfo.y * headImg.height / parseInt($("#headpic").css("height"));
					var y2 = headPicInfo.y2 * headImg.height / parseInt($("#headpic").css("height"));
					var x1 = headPicInfo.x * headImg.width / parseInt($("#headpic").css("width"));
					var x2 = headPicInfo.x2 * headImg.width / parseInt($("#headpic").css("width"));
					$("#x1").val(x1);
					$("#x2").val(x2);
					$("#y1").val(y1);
					$("#y2").val(y2);
					//表单提交
					$("#headpic-form").ajaxSubmit({
						beforeSubmit: function() {
							loadLayer = layer.load(1);
						},
						success: function(data) {
							if(data.status == 1) {
								$("#headpic-file").val("");
								$(".shadow-box").addClass("displaynone");
								$(".alert-pic-box").addClass("displaynone");
								$(".user-img-circle img").attr("src", data.url);
								$(".user-box .user-img img").attr("src", data.url);
								layer.close(loadLayer);
								layer.alert("上传头像成功");
							} else {
								layer.close(loadLayer);
								layer.alert(data.msg);
							}
						},
						error: function(e) {
							layer.close(loadLayer);
							layer.msg("头像修改失败", {
								time: 1500
							});
						}
					});

				} else {
					layer.alert("获取图片信息错误");
				}
			} else {
				layer.alert("请选择裁剪区域");
			}

		});

	}

	/**
	 * 修改背景图片
	 */
	function alertBg() {
		//修改背景事件
		$("#alert-bgpic").bind("click", function() {
			$("#bgpic-file").trigger("click");
		});

		//绑定change事件
		$("#bgpic-file").bind("change", function() {
			//获取文件路径
			var files = this.files;
			var file;
			if(files && files.length == 1) {
				file = files[0];
				if(/^image\/png$|jpeg$|jpg$/.test(file.type)) {
					$(".alert-pic").html('<img id="bgpic" src="' + URL.createObjectURL(file) + '" />');
					//显示遮罩和修改框
					$(".shadow-box").removeClass("displaynone");
					$(".alert-pic-box").removeClass("displaynone");
					//按钮
					$(".alert-pic-ipt").html(
						'<div class="btn btn-md btn-color-blue2" id="save-bgpic">保存</div>' +
						'<div class="btn btn-md btn-color-red2" id="cancel-bgpic">取消</div>'
					);
				} else {
					$(this).val("");
					Layer.alert("请选择jpg或者png格式的图片");
				}
			} else {
				$(this).val("");
				layer.alert("已取消");
			}
		});

		//点击取消
		$(".alert-pic-ipt").on("click", "#cancel-bgpic", function() {
			$("#bgpic-file").val("");
			$(".shadow-box").addClass("displaynone");
			$(".alert-pic-box").addClass("displaynone");
		});

		//点击保存
		$(".alert-pic-ipt").on("click", "#save-bgpic", function() {
			//表单提交
			$("#bgpic-form").ajaxSubmit({
				beforeSubmit: function() {
					loadLayer = layer.load(1);
				},
				success: function(data) {
					if(data.status == 1) {
						$("#bgpic-file").val("");
						$(".shadow-box").addClass("displaynone");
						$(".alert-pic-box").addClass("displaynone");
						$(".header").css({
							"background": 'url(' + $("#bgpic").attr("src") + ') no-repeat',
							"background-size": "100% auto"
						});
						layer.close(loadLayer);
						layer.alert("上传背景成功");
					} else {
						layer.close(loadLayer);
						layer.alert(data.msg);
					}
				},
				error: function(e) {
					layer.close(loadLayer);
					layer.msg("背景修改失败", {
						time: 1500
					});
				}
			});

		});

	}

});