require(['dropdownmenu', 'layer', 'zeroclipboard', 'jquery', 'tool', 'ueditor', 'viewer'], function(dorpDownMenu, Layer, zcl, $, tool) {
	//绑定附属信息点击事件
	tool.bindUserInfoCilck();

	//ueditor初始化
	window.ZeroClipboard = zcl;
	var ue1 = UE.getEditor('noteEditor');
	var ue2 = UE.getEditor('studyEditor');

	//绑定tab切换
	writeTabBind();

	//照片相关操作初始化
	addImgBind();

	//照片相关操作初始化
	function addImgBind() {
		//记录照片数量
		var idx = 0;

		//绑定预览事件
		$("#shuoshuo-addimg-form").on("change", "input[type='file']", function() {
			var files = this.files;
			var file;
			var fileidx = $(this).attr("data-idx");
			if(files && files.length) {
				file = files[0];
				if(/^image\/png$|jpeg$|jpg$/.test(file.type)) {
					$(".shuoshuo-img-list li[data-idx='" + fileidx + "']").find("img").attr("src", URL.createObjectURL(file));
				} else {
					Layer.msg("请选择jpg或者png格式的图片", {
						time: 1500
					})
				}
			}
		});

		//点击修改图片
		$(".shuoshuo-img-list").on("click", ".alter-img", function() {
			$("#addimg-" + $(this).parent().attr("data-idx")).trigger("click");
		});

		//添加
		$(".shuhsuo-addimg").bind("click", function() {
			//先判断上个框是否有图片
			if(idx < 4) {
				//生成一个预览框
				$(".shuoshuo-img-list").append(
					'<li class="shuoshuo-img" data-idx="' + idx + '">' +
					'<span class="del-img"></span>' +
					'<span class="alter-img"></span>' +
					'<img src="" />' +
					'</li>'
				);
				//生成一个文件input
				$("#shuoshuo-addimg-form").append(
					'<input type="file" name="" id="addimg-' + idx + '" data-idx="' + idx + '" value="" accept="image/jpeg,image/jpg,image/png"/>'
				);
				//图片展示初始化
				$('.shuoshuo-img[data-idx="' + idx + '"]').viewer({
					url: 'data-original' //用于放大图
				});
				$("#addimg-" + idx).trigger('click');
				idx++;
				if(idx == 4) {
					$(".shuhsuo-addimg").hide();
				}
			}
		});

		//删除
		$(".shuoshuo-img-list").on("click", "li .del-img", function(event) {
			var delIdx = $(this).parent().attr("data-idx");
			$(this).parent().remove();
			$("#addimg-" + delIdx).remove();
			//重新排序
			$(".shuoshuo-img-list li").each(function(index, element) {
				$(this).attr("data-idx", index);
			});
			$("#shuoshuo-addimg-form input[type='file']").each(function(index, element) {
				$(this).attr("id", "addimg-" + index);
				$(this).attr("data-idx", index);
			});
			if(idx == 4) {
				$(".shuhsuo-addimg").show();
			}
			idx--;
			event.stopPropagation();
		});

	}

	//tab切换
	function writeTabBind() {
		$('.write-tab li').bind("click", function() {
			if(!$(this).attr('class') || $(this).attr('class').indexOf('active') == -1) {
				$('.write-tab li').removeClass('active');
				$(this).addClass('active');
				var clickCs = $(this).attr("data-toggle");
				$('.write-tab li').each(function() {
					if($(this).attr("data-toggle") != clickCs) {
						$("." + $(this).attr("data-toggle")).addClass("displaynone");
					} else {
						$("." + clickCs).removeClass("displaynone");
						$("." + clickCs).css("opacity", 0);
						$("." + clickCs).animate({
							opacity: 1
						});
					}
				});
			}
		});
	}

	//初始化父菜单列表

	//初始化一级菜单列表
	dorpDownMenu.init({
		parentElt: document.getElementById("select-first-title"),
		title: {
			key: "",
			value: "请选择笔记所属(新建则在上面填写)",
			//默认是false 不替换标题
			replace: false
		},
		selectors: [{
			value: "1",
			txt: "测试中的一级标题1"
		}, {
			value: "2",
			txt: "测试中的一级标题2"
		}, {
			value: "3",
			txt: "测试中的一级标题3"
		}]

	});
	
	//初始化二级菜单列表
	dorpDownMenu.init({
		parentElt: document.getElementById("select-second-title"),
		title: {
			key: "",
			value: "请选择二级标题(没有则选此项)",
			//默认是false 不替换标题
			replace: false
		},
		selectors: [{
			value: "1",
			txt: "测试中的二级标题1"
		}, {
			value: "2",
			txt: "测试中的二级标题2"
		}, {
			value: "3",
			txt: "测试中的二级标题3"
		}]

	});
});