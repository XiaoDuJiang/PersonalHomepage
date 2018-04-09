<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>注册</title>
		<script src="../../Public/resource/js/jquery-2.1.0.js"></script>
	</head>
	<body>
		注册
		<div id="msg"></div>
		<script type="text/javascript">
			$.ajax({
				type:"post",
				url:"/Home/Login/registerAccount",
				async:true,
				data: {
					'account': '12',
					'password': '123',
					'repwd':'123',
					'username':'guoao',
					'testcode':'testone'
				},
				success: function(data) {
					data = eval('('+data+")");
					$("#msg").html(data.msg);
				}
			});
		</script>
	</body>
</html>