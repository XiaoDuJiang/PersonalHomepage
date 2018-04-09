<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="en">

	<head>
		<meta charset="UTF-8">
		<title>登录</title>
		<script src="../../Public/resource/js/jquery-2.1.0.js"></script>
	</head>

	<body>
		登录
		<div id="msg"></div>
		<script type="text/javascript">
			$.ajax({
				type: "post",
				url: "/Home/Login/loginIn",
				async: true,
				data: {
					'account': '1',
					'password': '123'
				},
				success: function(data) {
					data = eval('(' + data + ")");
					$("#msg").html(data.msg);
					$.ajax({
						type: "post",
						url: "userCancel",
						async: true,
						success: function(data) {
							data = eval('(' + data + ")");
							$("#msg").html(data.msg);
							//测试通过session获取用户信息
							$.ajax({
								type: "post",
								url: "/Home/Login/getUserInfoBySession",
								async: true,
								success: function(data) {
									data = eval('(' + data + ")");
									$("#msg").html(data.msg);
								}
							});
						}
					});
					/*//测试通过session获取用户信息
					$.ajax({
						type: "post",
						url: "/Home/Login/getUserInfoBySession",
						async: true,
						success: function(data) {
							data = eval('(' + data + ")");
							$("#msg").html(data.msg);
						}
					});*/

				}
			});
		</script>
	</body>

</html>