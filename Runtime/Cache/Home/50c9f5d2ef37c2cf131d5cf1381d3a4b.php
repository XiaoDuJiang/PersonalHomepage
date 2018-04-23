<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="en">

	<head>
		<meta charset="UTF-8">
		<title>登录</title>
		<link rel="stylesheet" type="text/css" href="../../../../Public/resource/css/style.css" />
		<link rel="stylesheet" type="text/css" href="../../../../Public/resource/js/layer/theme/default/layer.css" />
		
		<script src="../../../../Public/resource/js/require.js" data-main="../../../../Public/resource/js/require.js"></script>
		<script src="../../../../Public/resource/js/requireconf.js"></script>
	</head>

	<body class="overflow-hidden">
		<div class="container">
			<div class="nav-top">
				<div class="menu">
					<ul class="menu-list">
						<li>
							<a href="javascript:void(0);" class="logo">PersonalHomepage</a>
						</li>
					</ul>
				</div>
			</div>
			<div class="input-box">
				<div class="login-box">
					<input type="text" class="icon-account" id="login-account" placeholder="账号" value="" />
					<input type="password" class="icon-pwd" id='login-password' placeholder="密码" value="" />

					<div id="login-in" class="btn btn-opacity">登录</div>
					<div class="input-to" data-to="register-box">注册&gt;&gt;</div>
				</div>

				<div class="register-box displaynone">
					<input type="text" class="icon-account" id="account" placeholder="账号" value="" />
					<input type="password" class="icon-pwd" id="password" placeholder="密码" value="" />
					<input type="text" class="icon-name" id="username" placeholder="昵称" value="" />
					<input type="text" class="icon-testcode" id="testcode" placeholder="测试码" value="" />

					<div class="btn btn-opacity" id="register">注册</div>
					<div class="input-to" data-to="login-box">登录&gt;&gt;</div>
				</div>
			</div>

		</div>
		
		<script src="../../../../Public/resource/js/view/login.js"></script>
	</body>

</html>