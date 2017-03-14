
/*
	version: v1.4.1
	author: yzz
	create time: 2016-11-04
	update time: 2017-03-14
	description: yHelper utility class
	log:
		2017-03-14: 整理：整理优化
		2017-01-20: 增加方法：复制到粘贴板
		2017-01-13: 增加方法：对象的深拷贝
		2017-01-13: 修改bug：js规范化，去掉不需要的','符号，价格正则增加一个括号
		2017-01-07: 修改方法调用的bug
		2016-12-24: 增加 传入时间数组，返回默认时间格式 的方法
		2016-12-19: 增加 图片帮助类，线上图片加载后，获取宽高，并执行回调函数 的方法
		2016-12-13: 增加 common类（内部用）数字，不足两位补充0，并转化为字符串 的方法
		2016-12-13: 增加 "/Date(1481536867133)/" 格式的时间转换 的方法
		2016-12-05: 增加 '阻止事件冒泡' 的方法
		2016-11-29: 增加 '阻止默认行为' 的方法
		2016-11-04：首次建立
*/
$(function () {
	(function () {
		'use strict';

		//y帮助类
		var yHelper = {

			//****************************************************对象方法 开始****************************************************

			//request请求对象方法
			request: {
				//从location.search中获取参数（?号后的部分）（参数部分改为小写）
				getParams: function () {
					var theParams = new Object();
					var url = location.search;
					if (url.indexOf("?") != -1) {
						var strs = url.substr(1).split("&");
						for (var i = 0, i1 = strs.length; i < i1; i++) {
							//拼接以"="分割的字符串
							if (strs[i]) {
								var strParamArr = strs[i].split("=");
								var key = strParamArr.shift();
								var value = strParamArr.join("=");			//有可能参数的值也带有'='号，所以才这样做
								theParams[key.toLowerCase()] = value;
							}
						}
					}
					return theParams;
				}
			},

			//response响应对象方法
			response: {
				//重定向跳转
				redirect: function (url, consoleInfo) {
					if (!!consoleInfo) {
						console.log("-- redirect log:  " + consoleInfo + " --");
					}
					window.location.href = url;
					if (window.event) {
						window.event.returnValue = false;
					}
				}
			},
			//number对象方法
			number: {
				//数字，不足两位补充0，并转化为字符串
				prefixZero: function (number) {
					var str = '' + number;
					if (str.length == 1) {
						str = new Array().concat(0, str).join('');
					}
					return str;
				}
			},

			//regex对象方法
			regex: {
				//传入需要匹配的字符串与正则表达式（注意：正则表达式要加上匹配组才有效），返回匹配的数组		
				getRegexArr: function (str, pattern, index) {
					var regArr = [];
					var result = [], regexp = new RegExp(pattern);
					while ((result = regexp.exec(str)) != null) {
						if (!!index) {
							regArr.push(result[index]);
						} else {
							regArr.push(result[1]);
						}
					}
					return regArr;
				},
				//判断指定字符串知否匹配特定的格式	
				isMatch: function (str, pattern) {
					return !!str.match(pattern);
				},
				//判断str中是否包含value字符串 返回true or false	
				isContains: function (str, value) {
					return str.indexOf(value) > -1;
				}
			},

			//时间对象方法
			date: {
				//获取时间数组（年月日时分秒，按顺序存储）		
				//yHelper.date.getDateTimeArr
				getDateTimeArr: function (theTimeStr) {
					var theTime = new Date(theTimeStr);
					var year = theTime.getFullYear();
					var month = theTime.getMonth() + 1;
					var day = theTime.getDate();
					var hour = theTime.getHours();
					var minute = theTime.getMinutes();
					var second = theTime.getSeconds();
					return new Array().concat(year + '', yHelper.number.prefixZero(month), yHelper.number.prefixZero(day),
						yHelper.number.prefixZero(hour), yHelper.number.prefixZero(minute), yHelper.number.prefixZero(second));
				},
				//str传入的时间格式："/Date(1481536867133)/"
				getTimeArrFromBG: function (str) {
					var date = new Date(parseInt(str.slice(6)));
					return yHelper.date.getDateTimeArr(date);
				},
				//传入时间数组，返回默认时间格式（如：2016-12-24 16:00:00）
				formatDefault: function (timeArr) {
					return timeArr[0] + '-' + timeArr[1] + '-' + timeArr[2] + ' ' + timeArr[3] + ':' + timeArr[4] + ':' + timeArr[5];
				},
				//是否在缓存时间范围内 true or false	（constDuration:缓存持续时间常量；theCacheTime:缓存设置的时间）	
				//yHelper.date.isInCacheTime			constDuration 参数格式为 1h （说明：'1h'表示缓存'1小时'  ，单位分别有：y,M,d,h,m,s ）
				isInCacheTime: function (constDuration, theCacheTime) {
					//正则匹配，取出数词和量词
					var num = yHelper.regex.getRegexArr(constDuration, /(\d+)/g)[0];
					var measure = yHelper.regex.getRegexArr(constDuration, /(y|M|d|h|m|s)/g)[0];
					var status = false;
					//获取当前系统时间的各种时间值
					var currentTimeArr = yHelper.date.getDateTimeArr(new Date());
					//获取缓存时间的各种时间值
					var cacheTimeArr = yHelper.date.getDateTimeArr(theCacheTime);
					switch (measure) {
						case "y": { status = (Math.abs(currentTimeArr[0] - cacheTimeArr[0]) < num); } break;
						case "M": { status = (Math.abs(currentTimeArr[1] - cacheTimeArr[1]) < num); } break;
						case "d": { status = (Math.abs(currentTimeArr[2] - cacheTimeArr[2]) < num); } break;
						case "h": { status = (Math.abs(currentTimeArr[3] - cacheTimeArr[3]) < num); } break;
						case "m": { status = (Math.abs(currentTimeArr[4] - cacheTimeArr[4]) < num); } break;
						case "s": { status = (Math.abs(currentTimeArr[5] - cacheTimeArr[5]) < num); } break;
						default: { status = false; } break;
					}
					return status;
				}
			},
			//图片帮助类
			image: {
				//线上图片加载后，获取宽高，并执行回调函数
				load: function (imgurl, callback, noCatch) {
					var img_url;
					if (!noCatch) {
						img_url = imgurl;
					} else {
						img_url = imgurl + '?' + Date.parse(new Date());
					}
					var img = new Image();
					img.src = img_url;
					img.onload = function () {
						callback(img.width, img.height);
					};
				}
			},

			object: {
				clone: function (obj) {
					//或者JSON.parse(JSON.stringify(obj));
					return $.extend({}, obj);
				}
			},

			//html对象方法
			html: {
				//html编码
				encode: function (str) {
					if (!str || str.length == 0) return "";
					var s = str
						.replace(/</g, "&lt;")
						.replace(/>/g, "&gt;")
						.replace(/ /g, "&nbsp;")
						.replace(/\'/g, "&#39;")
						.replace(/\"/g, "&quot;")
						.replace(/\n/g, "<br>");
					return s;
				},
				//html解码
				decode: function (str) {
					if (!str || str.length == 0) return "";
					var s = str
						.replace(/&lt;/g, "<")
						.replace(/&gt;/g, ">")
						.replace(/&nbsp;/g, " ")
						.replace(/&#39;/g, "\'")
						.replace(/&quot;/g, "\"")
						.replace(/<br>/g, "\n");
					return s;
				},
				//从html获取纯文本（剔除掉html标签以及多余字符）	  （剔除 title、head、style、script 标签以及内部的内容，只获取body内部的纯文本（空格也去掉））	
				getBodyText: function (html) {
					var $html = $(html
						.replace(/<title>[\s|\S]*?<\/title>/ig, "")
						.replace(/<head>[\s|\S]*?<\/head>/ig, "")
						.replace(/<style>[\s|\S]*?<\/style>/ig, "")
						.replace(/<script>[\s|\S]*?<\/script>/ig, "")
						);
					var str = $html.text().replace(/\s+/g, "");
					return str;
				}
			},

			//scrollBar滚动条对象方法
			scrollBar: {
				//禁用滚动条	
				forbidden: function () {
					var bodyWidth = $(document.body).width();
					$(document.body).css({
						"overflow": "hidden",
						"width": bodyWidth
					});
				},
				//启用滚动条
				startUsing: function () {
					var bodyWidth = $(document.body).width();
					$(document.body).css({
						"overflow": "auto",
						"width": bodyWidth
					});
				}
			},

			//encryption加解密对象方法
			encryption: {
				//8进制解密 （只能对只含有数字的字符串，两位一取，不足两位的 前面会自动补0）
				decryptEight: function (str) {
					var newChs = [];
					var sCh = [];
					var s = "";
					for (var index in str) {
						if (index % 2 == 0) {
							sCh.push(str[index]);
							sCh.push(str[parseInt(index) + 1]);
							s = parseInt(sCh.join(''), 8);
							newChs.push(s);
							sCh = [];
						}
					}
					return newChs.join('');
				}
			},

			//阻止事件冒泡
			stopPropagation: function (e) {
				e = e || window.event;
				if (e.stopPropagation) { //W3C阻止冒泡方法  
					e.stopPropagation();
				} else {
					e.cancelBubble = true; //IE阻止冒泡方法  
				}
			},

			//阻止默认行为
			stopDefault: function (e) {
				//阻止默认浏览器动作(W3C) 
				if (e && e.preventDefault)
					e.preventDefault();
					//IE中阻止函数器默认动作的方式 
				else
					window.event.returnValue = false;
				return false;
			},

			//localStorage对象方法
			localStorage: {
				getUsageAmount: function () {
					//获取localStorage使用量	
					if (!window.localStorage) {
						console.log('浏览器不支持localStorage');
						return 5;
					}
					var size = 0;
					for (item in window.localStorage) {
						if (window.localStorage.hasOwnProperty(item)) {
							size += window.localStorage.getItem(item).length;
						}
					}
					//console.info("-- LS : " + (size / 1024 / 1024).toFixed(2) + "");
					return (size / 1024 / 1024).toFixed(2);		//单位：MB
				}
			},
			//复制到粘贴板
			copyToClipboard: function (txt) {
				var aux = document.createElement("input");
				aux.setAttribute("value", txt);
				document.body.appendChild(aux);
				aux.select();
				document.execCommand("copy");
				document.body.removeChild(aux);
			}

			//****************************************************对象方法 结束****************************************************
		};

		window.yHelper = yHelper;

	})();
})