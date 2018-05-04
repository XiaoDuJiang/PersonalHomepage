require(['dropdownmenu', 'layer', 'zeroclipboard', 'jquery', 'tool', 'ueditor', 'viewer', 'jquery.form', 'highlight'], function(dorpDownMenu, Layer, zcl, $, tool) {
	//初始化代码信息
	hljs.initHighlightingOnLoad();
	//绑定附属信息点击事件
	tool.bindUserInfoCilck();
	//ueditor需要
	window.ZeroClipboard = zcl;

	//loading对象
	var loadLayer;
	//绑定tab切换
	writeTabBind();
	//说说初始化
	initShuoShuo();
	//日志初始化
	initDaily();
	//笔记初始化
	initNote();

	//初始化日志
	function initDaily() {
		//ueditor初始化
		var dailyUE = UE.getEditor('noteEditor');
		//添加代码
		$("#code-inster-daily").bind('click', function() {
			dailyUE.execCommand('insertHtml', "<pre>请在这个填写代码(删除本段文字)</pre>");
		});
		//绑定发布事件
		$("#note-submit").bind("click", dailySubmit);
		//点击发布
		function dailySubmit() {
			//验证是否有数据
			if(UE.getEditor('noteEditor').getContentTxt()) {
				//保存到数据库
				//获取带格式的内容
				var dailyContent = UE.getEditor('noteEditor').getContent();
				$.ajax({
					type: "post",
					url: "/Home/Index/uploadDaily",
					async: true,
					data: {
						content: dailyContent
					},
					beforeSend: function() {
						loadLayer = Layer.load(1);
					},
					success: function(data) {
						if(data.status == 1) {
							Layer.close(loadLayer);
							Layer.msg(data.msg, {
								time: 1500
							});
						} else {
							Layer.close(loadLayer);
							Layer.alert(data.msg);
						}
					},
					error: function() {
						Layer.close(loadLayer);
						Layer.alert("发布日志失败");
					}
				});
			}
		}

	}

	//笔记初始化
	function initNote() {
		//ueditor初始化
		var studyUE = UE.getEditor('studyEditor');

		//获取该用户的一级标题
		$.ajax({
			type: "post",
			url: "/Home/Index/getUserNoteTitle",
			async: true,
			beforeSend: function() {
				loadLayer = Layer.load(1);
			},
			success: function(data) {
				Layer.close(loadLayer);
				if(data.status == 1) {
					//初始化一级标题选择框
					var selectors = [];
					for(var i in data.list) {
						selectors.push({
							value: data.list[i].id,
							txt: data.list[i].name
						});
					}

					//初始化一级菜单列表
					dorpDownMenu.init({
						parentElt: document.getElementById("select-first-title"),
						title: {
							key: "0",
							value: "请选择笔记所属(新建则在上面填写)",
							//默认是false 不替换标题
							replace: false
						},
						selectors: selectors
					});

					//绑定一级菜单点击 显示二级菜单事件
					$("#select-first-title ul").find("li").bind("click", function() {
						selectTitleId = $(this).parent().prev().attr("data-selector");
						if(selectTitleId != 0) {
							$.ajax({
								type: "post",
								url: "/Home/Index/getUserSecondNote",
								async: true,
								data: {
									titleid: selectTitleId
								},
								beforeSend: function() {
									loadLayer = Layer.load(1);
								},
								success: function(data) {
									Layer.close(loadLayer);

									if(data.status == 1) {
										var selectors = [];
										$("#select-second-title").html("");
										if(data.list.length > 0) {
											for(var i in data.list) {
												selectors.push({
													value: data.list[i].id,
													txt: data.list[i].title
												});
											}

											//初始化二级菜单列表
											dorpDownMenu.init({
												parentElt: document.getElementById("select-second-title"),
												title: {
													key: "0",
													value: "请选择二级标题(如新建，则不选)",
													//默认是false 不替换标题
													replace: false
												},
												selectors: selectors
											});
										} else {
											Layer.msg("暂无二级标题", {
												time: 1500
											});
										}

									} else {
										Layer.alert(data.msg);
									}
								},
								error: function() {
									Layer.close(loadLayer);
									Layer.alert("初始化笔记二级标题失败");
								}
							});
						} else {
							$("#select-second-title").html("");
						}
					});
				} else {
					Layer.alert(data.msg);
				}

			},
			error: function() {
				Layer.close(loadLayer);
				Layer.alert("初始化笔记一级标题失败");
			}
		});

		//添加代码
		$("#code-inster-study").bind('click', function() {
			studyUE.execCommand('insertHtml', "<pre>请在这个填写代码(删除本段文字)</pre>");
		});

		//点击发布笔记
		$("#study-submit").bind("click", studySubmit);
		//笔记提交
		function studySubmit() {
			var notetitle = $("#note-newtitle").val();
			var firsttitleid = $("#select-first-title .select-div>div").attr("data-selector");
			var secondtitleid = $("#select-second-title .select-div>div").attr("data-selector");
			var notename = $("#note-name").val();
			var content = UE.getEditor('studyEditor').getContent();
			var content_txt = UE.getEditor('studyEditor').getContentTxt();
			if(!notetitle && firsttitleid == 0) {
				Layer.alert("请输入或选择一级标题");
				return false;
			}
			if(!notename) {
				Layer.alert("请输入笔记标题");
				return false;
			}
			if(!content_txt) {
				Layer.alert("请输入笔记内容");
				return false;
			}

			$.ajax({
				type: "post",
				url: "/Home/Index/addStudyNote",
				async: true,
				data: {
					notetitle: notetitle,
					firsttitleid: firsttitleid,
					secondtitleid: secondtitleid,
					notename: notename,
					content: content
				},
				beforeSend: function() {
					loadLayer = Layer.load(1);
				},
				success: function(data) {
					Layer.close(loadLayer);
					console.log(data);
					
					
				},
				error: function() {
					Layer.close(loadLayer);
					Layer.alert("笔记上传失败");
				}
			});

		}

	}

	//初始化说说
	function initShuoShuo() {
		//照片相关操作初始化
		addImgBind();
		//绑定说说提交事件
		$("#shuoshuo-submit").bind('click', shuoshuoUpload);

		//初始化说说form
		function initShuoShuoForm() {
			$("#shuoshuo-content").val("");
			$(".shuoshuo-img-list").html("");
			$("#shuoshuo-addimg-form").html("");
			$(".shuoshuo-addimg").show();
		}

		//说说提交
		function shuoshuoUpload() {
			//验证数据
			if($("#shuoshuo-content").val()) {
				$("#shuoShuoForm").ajaxSubmit({
					beforeSubmit: function() {
						loadLayer = Layer.load(1);
					},
					success: function(data) {
						Layer.close(loadLayer);
						if(data.status == 1) {
							Layer.msg(data.msg, {
								time: 1500
							});
							//初始化
							initShuoShuoForm();
						} else {
							Layer.alert(data.msg);
						}
					},
					error: function(e) {
						Layer.close(loadLayer);
						Layer.msg("说说上传失败", {
							time: 1500
						});
					}
				});
			} else {
				Layer.msg("请输入说说内容", {
					time: 1500
				});
			}
		}

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
					var filenames = [];
					$("#shuoshuo-addimg-form input[type='file']").each(function() {
						filenames.push($(this).val().split('\\')[$(this).val().split('\\').length - 1]);
					});
					filenum = 0;
					for(var i in filenames) {
						if(filenames[i] == file.name) {
							filenum++;
						}
					}

					if(filenum <= 1) {
						if(/^image\/png$|jpeg$|jpg$/.test(file.type)) {
							$(".shuoshuo-img-list li[data-idx='" + fileidx + "']").find("img").attr("src", URL.createObjectURL(file));
						} else {
							Layer.msg("请选择jpg或者png格式的图片", {
								time: 1500
							})
						}
					} else {
						Layer.msg("文件或文件名重复", {
							time: 1500
						})
						$(this).val("");
					}
				}
			});

			//点击修改图片
			$(".shuoshuo-img-list").on("click", ".alter-img", function() {
				$("#addimg-" + $(this).parent().attr("data-idx")).trigger("click");
			});

			//添加
			$(".shuoshuo-addimg").bind("click", function() {
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
						'<input type="file" name="addimg-' + idx + '" id="addimg-' + idx + '" data-idx="' + idx + '" value="" accept="image/jpeg,image/jpg,image/png"/>'
					);
					//图片展示初始化
					$('.shuoshuo-img[data-idx="' + idx + '"]').viewer({
						url: 'data-original' //用于放大图
					});
					$("#addimg-" + idx).trigger('click');
					idx++;
					if(idx == 4) {
						$(".shuoshuo-addimg").hide();
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
					$(this).attr("name", "addimg-" + index);
				});
				if(idx == 4) {
					$(".shuoshuo-addimg").show();
				}
				idx--;
				event.stopPropagation();
			});

		}
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

});