require(['jquery', 'layer', 'viewer', 'highlight'], function($, layer) {
	//加载
	var loadLayer;

	//代码样式初始化
	hljs.initHighlightingOnLoad();

	noteInit();
	//笔记列表初始化
	function noteInit() {
		//获取id
		var nodetitle_id = location.href.split("/")[location.href.split("/").length - 1];
		if(nodetitle_id && !isNaN(nodetitle_id) && nodetitle_id != 0) {
			getNoteInfo(nodetitle_id);
		}

		//获取笔记信息
		function getNoteInfo(nodetitle_id) {
			$.ajax({
				type: "post",
				url: "/Home/Index/getNoteInfoById",
				async: true,
				data: {
					nodetitle_id: nodetitle_id
				},
				beforeSend: function() {
					loadLayer = layer.load(1);
				},
				success: function(data) {

					if(data.status == 1) {
						//列表信息组织
						$(".note-tree-title").text(data.list.title[0].name);
						for(var i in data.list.nodelist) {
							if(data.list.nodelist[i].fatherid == 0) {
								$(".note-tree-list").append(
									'<p data-id="' + data.list.nodelist[i].id + '">' + data.list.nodelist[i].title + '</p>'
								);
							} else {
								$(".note-tree-list").append(
									'<li data-id="' + data.list.nodelist[i].id + '">' + data.list.nodelist[i].title + '</li>'
								);
							}
						}

						//列表点击
						$("body").on("click", ".note-tree-title", function() {
							if($(this).attr("class").indexOf("up-icon-red") != -1) {
								//隐藏
								$(".note-tree-list").hide(200);
								$(this).removeClass("up-icon-red");
								$(this).addClass("down-icon-red");
							} else {
								//显示
								$(".note-tree-list").show(200);
								$(this).removeClass("down-icon-red");
								$(this).addClass("up-icon-red");
							}
						});

						//笔记点击
						$(".note-tree-list li").bind("click", function() {
							notetitleClick(this);
						});
						$(".note-tree-list p").bind("click", function() {
							notetitleClick(this);
						});

						layer.close(loadLayer);
					} else {
						layer.close(loadLayer);
						layer.alert(data.msg);
					}

				},
				error: function() {
					layer.close(loadLayer);
					layer.alert("获取笔记列表失败");
				}
			});
		}

		//笔记点击
		function notetitleClick(e) {
			var node_id = $(e).attr("data-id");
			$.ajax({
				type: "post",
				url: "/Home/Index/getNoteContentById",
				async: true,
				data: {
					node_id: node_id
				},
				beforeSend: function() {
					loadLayer = layer.load(1);
				},
				success: function(data) {
					if(data.status == 1) {
						$(".note-title").text($(e).text());
						if($.trim(data.list[0]['content'])) {
							$(".note-article").html(data.list[0]['content']);
						} else {
							$(".note-article").html('<p>暂无内容</p>');
						}
						noteContentInit();
						$(".note-tree-list li").removeClass("active");
						$(".note-tree-list p").removeClass("active");
						$(e).addClass("active");
						$(".note-tree-title").trigger("click");
						layer.close(loadLayer);
					} else {
						layer.close(loadLayer);
						layer.alert(data.msg);
					}
				},
				error: function() {
					layer.close(loadLayer);
					layer.alert("获取笔记内容失败");
				}
			});
		}

		//content初始化
		function noteContentInit() {
			$(".note-article pre").each(function() {
				var codeHtml = $(this).html();
				$(this).after(
					'<pre><code>' + codeHtml + '</code></pre>'
				);
				$(this).remove();
			});

			$(".note-article img").each(function() {
				$(this).css({
					"max-width": "100%",
					"cursor": "pointer"
				});
				//图片展示初始化
				$(this).viewer({
					url: 'data-original'
				});
			});
		}
	}

});