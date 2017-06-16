/*
 * Created with Sublime Text 3.
 * demo地址: http://www.lovewebgames.com/jsmodule/index.html
 * github: https://github.com/tianxiangbing/paging
 * User: 田想兵
 * Date: 2015-06-11
 * Time: 16:27:55
 * Contact: 55342775@qq.com
 * Desc: 确保代码最新及时修复bug，请去github上下载最新源码 https://github.com/tianxiangbing/paging
 */
/*
 * Created with Sublime Text 3.
 * demo地址: http://www.lovewebgames.com/jsmodule/index.html
 * github: https://github.com/tianxiangbing/query
 * User: 田想兵
 * Date: 2015-06-11
 * Time: 16:27:55
 * Contact: 55342775@qq.com
 * Desc: 确保代码最新及时修复bug，请去github上下载最新源码 https://github.com/tianxiangbing/query
 */
define('$',function($){
	var Query = {
		getQuery: function(name, type, win) {
			var reg = new RegExp("(^|&|#)" + name + "=([^&]*)(&|$|#)", "i");
			win = win || window;
			var Url = win.location.href;
			var u, g, StrBack = '';
			if (type == "#") {
				u = Url.split("#");
			} else {
				u = Url.split("?");
			}
			if (u.length == 1) {
				g = '';
			} else {
				g = u[1];
			}
			if (g != '') {
				gg = g.split(/&|#/);
				var MaxI = gg.length;
				str = arguments[0] + "=";
				for (i = 0; i < MaxI; i++) {
					if (gg[i].indexOf(str) == 0) {
						StrBack = gg[i].replace(str, "");
						break;
					}
				}
			}
			return decodeURI(StrBack);
		},
		getForm: function(form) {
			var result = {},
				tempObj = {};
			$(form).find('*[name]').each(function(i, v) {
				var nameSpace,
					name = $(v).attr('name'),
					val = $.trim($(v).val()),
					tempArr = [];
				if (name == '' || $(v).hasClass('getvalued')) {
					return;
				}

				if ($(v).data('type') == "money") {
					val = val.replace(/\,/gi, '');
				}

				//处理radio add by yhx  2014-06-18
				if ($(v).attr("type") == "radio") {
					var tempradioVal = null;
					$("input[name='" + name + "']:radio").each(function() {
						if ($(this).is(":checked"))
							tempradioVal = $.trim($(this).val());
					});
					if (tempradioVal) {
						val = tempradioVal;
					} else {
						val = "";
					}
				}


				if ($(v).attr("type") == "checkbox") {
					var tempradioVal = [];
					$("input[name='" + name + "']:checkbox").each(function() {
						if ($(this).is(":checked"))
							tempradioVal.push($.trim($(this).val()));
					});
					if (tempradioVal.length) {
						val = tempradioVal.join(',');
					} else {
						val = "";
					}
				}

				if ($(v).attr('listvalue')) {
					if (!result[$(v).attr('listvalue')]) {
						result[$(v).attr('listvalue')] = [];
						$("input[listvalue='" + $(v).attr('listvalue') + "']").each(function() {
							if ($(this).val() != "") {
								var name = $(this).attr('name');
								var obj = {};
								if ($(this).data('type') == "json") {
									obj[name] = JSON.parse($(this).val());
								} else {
									obj[name] = $.trim($(this).val());
								}
								if ($(this).attr("paramquest")) {
									var o = JSON.parse($(this).attr("paramquest"));
									obj = $.extend(obj, o);
								}
								result[$(v).attr('listvalue')].push(obj);
								$(this).addClass('getvalued');
							}
						});
					}
				}

				if ($(v).attr('arrayvalue')) {
					if (!result[$(v).attr('arrayvalue')]) {
						result[$(v).attr('arrayvalue')] = [];
						$("input[arrayvalue='" + $(v).attr('arrayvalue') + "']").each(function() {
							if ($(this).val() != "") {
								var obj = {};
								if ($(this).data('type') == "json") {
									obj = JSON.parse($(this).val());
								} else {
									obj = $.trim($(this).val());
								}
								if ($(this).attr("paramquest")) {
									var o = JSON.parse($(this).attr("paramquest"));
									obj = $.extend(obj, o);
								}
								result[$(v).attr('arrayvalue')].push(obj);
							}
						});
					}
				}
				if (name == '' || $(v).hasClass('getvalued')) {
					return;
				}
				//构建参数
				if (name.match(/\./)) {
					tempArr = name.split('.');
					nameSpace = tempArr[0];
					if (tempArr.length == 3) {
						tempObj[tempArr[1]] = tempObj[tempArr[1]] || {};
						tempObj[tempArr[1]][tempArr[2]] = val;
					} else {
						if ($(v).data('type') == "json") {
							tempObj[tempArr[1]] = JSON.parse(val);
							if ($(v).attr("paramquest")) {
								var o = JSON.parse($(v).attr("paramquest"));
								tempObj[tempArr[1]] = $.extend(tempObj[tempArr[1]], o);
							}
						} else {
							tempObj[tempArr[1]] = val;
						}
					}
					if (!result[nameSpace]) {
						result[nameSpace] = tempObj;
					} else {
						result[nameSpace] = $.extend({}, result[nameSpace], tempObj);
					}
				} else {
					result[name] = val;
				}

			});
			var obj = {};
			for (var o in result) {
				var v = result[o];
				if (typeof v == "object") {
					obj[o] = JSON.stringify(v);
				} else {
					obj[o] = result[o]
				}
			}
			$('.getvalued').removeClass('getvalued');
			return obj;
		},
		setHash: function(obj) {
			var str = '';
			obj = $.extend(this.getHash(), obj)
			var arr = [];
			for (var v in obj) {
				if(obj[v]!=''){
					arr.push(v + '=' + encodeURIComponent(obj[v]));
				}
			}
			str+=arr.join('&');
			location.hash = str;
			return this;
		},
		getHash: function(name) {
			if (typeof name === "string") {
				return this.getQuery(name, "#");
			} else {
				var obj = {};
				var hash = location.hash;
				if(hash.length>0){
					hash = hash.substr(1);
					var hashArr = hash.split('&');
					for (var i = 0, l = hashArr.length; i < l; i++) {
						var a = hashArr[i].split('=');
						if (a.length > 0) {
							obj[a[0]] = decodeURI(a[1]) || '';
						}
					}
				}
				return obj;
			}
		}
	};
	$.fn.Paging = function (settings) {
		var arr = [];
		$(this).each(function () {
			var options = $.extend({
				target: $(this)
			}, settings);
			var lz = new Paging();
			lz.init(options);
			arr.push(lz);
		});
		return arr;
	};

	function Paging() {
		var rnd = Math.random().toString().replace('.', '');
		this.id = 'Paging_' + rnd;
	}
	Paging.prototype = {
		init: function (settings) {
			this.settings = $.extend({
				callback: null,
				pagesize: 10,
				current: 1,
				prevTpl: "上一页",
				nextTpl: "下一页",
				firstTpl: "首页",
				lastTpl: "末页",
				ellipseTpl: "...",
				toolbar: false,
				hash: false,
				pageSizeList: [5, 10, 15, 20]
			}, settings);
			this.target = $(this.settings.target);
			this.container = $('<div id="' + this.id + '" class="ui-paging-container"/>');
			this.target.append(this.container);
			this.render(this.settings);
			this.format();
			this.bindEvent();
		},
		render: function (ops) {
			typeof ops.count !== 'undefined' ? this.count = ops.count : this.count =this.settings.count;
			typeof ops.pagesize!== 'undefined' ?  this.pagesize = ops.pagesize : this.pagesize = this.settings.pagesize;
			typeof ops.current!== 'undefined' ? this.current = ops.current: this.current = this.settings.current;
			this.pagecount = Math.ceil(this.count / this.pagesize);
			this.format();
		},
		bindEvent: function () {
			var _this = this;
			this.container.on('click', 'li.js-page-action,li.ui-pager', function (e) {
				if ($(this).hasClass('ui-pager-disabled') || $(this).hasClass('focus')) {
					return false;
				}
				if ($(this).hasClass('js-page-action')) {
					if ($(this).hasClass('js-page-first')) {
						_this.current = 1;
					}
					if ($(this).hasClass('js-page-prev')) {
						_this.current = Math.max(1, _this.current - 1);
					}
					if ($(this).hasClass('js-page-next')) {
						_this.current = Math.min(_this.pagecount, _this.current + 1);
					}
					if ($(this).hasClass('js-page-last')) {
						_this.current = _this.pagecount;
					}
				} else if ($(this).data('page')) {
					_this.current = parseInt($(this).data('page'));
				}
				_this.go();
			});
			/*
			$(window).on('hashchange',function(){
				var page=  parseInt(Query.getHash('page'));
				if(_this.current !=page){
					_this.go(page||1);
				}
			})
			 */
		},
		go: function (p) {
			var _this = this;
			this.current = p || this.current;
			this.current = Math.max(1, _this.current);
			this.current = Math.min(this.current, _this.pagecount);
			this.format();
			if (this.settings.hash) {
				Query.setHash({
					page: this.current
				});
			}
			this.settings.callback && this.settings.callback(this.current, this.pagesize, this.pagecount);
		},
		changePagesize: function (ps) {
			this.render({
				pagesize: ps
			});
			this.settings.changePagesize && this.settings.changePagesize.call(this, this.pagesize,this.current, this.pagecount);
		},
		format: function () {
			var html = '<ul>'
			html += '<li class="js-page-first js-page-action ui-pager" >' + this.settings.firstTpl + '</li>';
			html += '<li class="js-page-prev js-page-action ui-pager">' + this.settings.prevTpl + '</li>';
			if (this.pagecount > 6) {
				html += '<li data-page="1" class="ui-pager">1</li>';
				if (this.current <= 2) {
					html += '<li data-page="2" class="ui-pager">2</li>';
					html += '<li data-page="3" class="ui-pager">3</li>';
					html += '<li class="ui-paging-ellipse">' + this.settings.ellipseTpl + '</li>';
				} else
					if (this.current > 2 && this.current <= this.pagecount - 2) {
						if (this.current > 3) {
							html += '<li>' + this.settings.ellipseTpl + '</li>';
						}
						html += '<li data-page="' + (this.current - 1) + '" class="ui-pager">' + (this.current - 1) + '</li>';
						html += '<li data-page="' + this.current + '" class="ui-pager">' + this.current + '</li>';
						html += '<li data-page="' + (this.current + 1) + '" class="ui-pager">' + (this.current + 1) + '</li>';
						if (this.current < this.pagecount - 2) {
							html += '<li class="ui-paging-ellipse" class="ui-pager">' + this.settings.ellipseTpl + '</li>';
						}
					} else {
						html += '<li class="ui-paging-ellipse" >' + this.settings.ellipseTpl + '</li>';
						for (var i = this.pagecount - 2; i < this.pagecount; i++) {
							html += '<li data-page="' + i + '" class="ui-pager">' + i + '</li>'
						}
					}
				html += '<li data-page="' + this.pagecount + '" class="ui-pager">' + this.pagecount + '</li>';
			} else {
				for (var i = 1; i <= this.pagecount; i++) {
					html += '<li data-page="' + i + '" class="ui-pager">' + i + '</li>'
				}
			}
			html += '<li class="js-page-next js-page-action ui-pager">' + this.settings.nextTpl + '</li>';
			html += '<li class="js-page-last js-page-action ui-pager">' + this.settings.lastTpl + '</li>';
			html += '</ul>';
			this.container.html(html);
			if (this.current == 1) {
				$('.js-page-prev', this.container).addClass('ui-pager-disabled');
				$('.js-page-first', this.container).addClass('ui-pager-disabled');
			}
			if (this.current == this.pagecount) {
				$('.js-page-next', this.container).addClass('ui-pager-disabled');
				$('.js-page-last', this.container).addClass('ui-pager-disabled');
			}
			this.container.find('li[data-page="' + this.current + '"]').addClass('focus').siblings().removeClass('focus');
			if (this.settings.toolbar) {
				this.bindToolbar();
			}
		},
		bindToolbar: function () {
			var _this = this;
			var html = $('<li class="ui-paging-toolbar"><select class="ui-select-pagesize"></select><input type="text" class="ui-paging-count"/><a href="javascript:void(0)">跳转</a></li>');
			var sel = $('.ui-select-pagesize', html);
			var str = '';
			for (var i = 0, l = this.settings.pageSizeList.length; i < l; i++) {
				str += '<option value="' + this.settings.pageSizeList[i] + '">' + this.settings.pageSizeList[i] + '条/页</option>';
			}
			sel.html(str);
			sel.val(this.pagesize);
			$('input', html).val(this.current);
			$('input', html).click(function () {
				$(this).select();
			}).keydown(function (e) {
				if (e.keyCode == 13) {
					var current = parseInt($(this).val()) || 1;
					_this.go(current);
				}
			});
			$('a', html).click(function () {
				var current = parseInt($(this).prev().val()) || 1;
				_this.go(current);
			});
			sel.change(function () {
				_this.changePagesize($(this).val());
			});
			this.container.children('ul').append(html);
		}
	}
	return Paging;
});