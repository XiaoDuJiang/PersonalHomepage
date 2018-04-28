define(['jquery'], function($) {
	var dorpDownMenu = function() {
		var ddm = {
			init: function(options) {
				//传入参数
				//parentElt 父节点
				//title     选择的名字
				//{key:(名字),value:(值),replace:true(是否替换)}
				//selectors 选项数组
				//[{value:1,txt:电脑}]

				//默认值
				options = options ? options : {};
				options.parentElt = options.parentElt ? options.parentElt : document.getElementsByTagName("body")[0];
				options.title = options.title ? options.title : {
					key: "dropDownMenu",
					value: "dropDownMenu",
					replace: true
				};
				options.title.key = options.title.key ? options.title.key : "dropDownMenu";
				options.title.value = options.title.value ? options.title.value : "dropDownMenu";
				options.title.replace = options.title.replace ? options.title.replace : false;
				options.selectors = options.selectors ? options.selectors : [{
					value: "dropDownMenu1",
					txt: "dropDownMenu1"
				}, {

					value: "dropDownMenu2",
					txt: "dropDownMenu2"

				}];

				//生成节点
				var selectorsHtml = "";
				for(var i in options.selectors) {
					selectorsHtml += '<li data-value="' + options.selectors[i].value + '">' + options.selectors[i].txt + '</li>'
				}

				var selectDiv = document.createElement("div");
				$(selectDiv).attr("class", "select-div");

				var dataDefault;
				if(options.title.replace) {
					dataDefault = 1;
				} else {
					dataDefault = 0;
				}

				selectDiv.innerHTML = '<div data-default="' + dataDefault + '" data-selector="' + options.title.key + '">' + options.title.value + '<span></span></div>' +
					'<ul data-toggle="hidden">' +
					selectorsHtml +
					'</ul>'

				options.parentElt.appendChild(selectDiv);

				//绑定点击事件
				bindSelectEvent(selectDiv);
			}
		}

		//绑定事件
		function bindSelectEvent(selectDiv) {
			$(selectDiv).find("div").bind("click", function() {
				var selectors = $(this).next();
				if(selectors.attr("data-toggle") === "hidden") {
					//显示
					showSelect(selectors);
				} else if(selectors.attr("data-toggle") === "show") {
					hideSelect(selectors);
				}
			});

			$(selectDiv).find("ul li").bind("click", function() {
				var selectValue = $(this).attr("data-value");
				var prevValue = $(this).parent().prev().attr("data-selector");
				var selectTxt = $(this).text();
				var prevTxt = $(this).parent().prev().text();
				//判断是否是默认值
				var isDefult = $(selectDiv).find("div").attr("data-default") == "1" ? true : false;
				//避免删除后不消失的bug
				var thisParent = $(this).parent();

				$(this).parent().prev().attr("data-selector", selectValue).html(selectTxt + "<span></span>");
				if(isDefult) {
					$(selectDiv).find("div").attr("data-default", "0");
					$(this).remove();
				} else {
					$(this).attr("data-value", prevValue).text(prevTxt);
				}
				thisParent.css("display", "none");
				thisParent.attr("data-toggle", "hidden");

			});

			//点击空白处消失
			$("body").bind("click", function() {
				hideSelect($(selectDiv).find("ul"));
			});
		}

		//显示选择框
		function showSelect(e) {
			e.attr("data-toggle", "animate");
			e.css("display", "block");
			e.css("opacity", "0");
			e.animate({
				opacity: 1
			}, 200);
			setTimeout(function() {
				e.attr("data-toggle", "show");
			}, 200);
			event.stopPropagation();
		}

		//隐藏选择框
		function hideSelect(e) {
			e.attr("data-toggle", "animate");
			e.animate({
				opacity: 0
			}, 200);
			setTimeout(function() {
				e.css("display", "none");
				e.attr("data-toggle", "hidden");
			}, 200);
			event.stopPropagation();
		}

		return ddm;
	}();
	
	return dorpDownMenu;
});