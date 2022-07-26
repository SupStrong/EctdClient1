/*这个文件是所有模块通用的*/

import Vue from 'vue';
const path = require('path');
import api from '../api/index';
const packageInfo = require('../../package.json');
const projectInfo = require('./projectInfo').default;
const projectName = projectInfo.projectName;
packageInfo.name = projectName;
require('./tool'); //引入工具函数
import cloudWindow from './cloudWindow'; //引入窗口组件
Vue.api = Vue.prototype.$api = api; //全局注册api;
// 引入插件
import '../plugins/iview.js';
import '../plugins/element.js';
import lazyLoad from 'vue-lazyload';
Vue.use(lazyLoad);
/*开始自动化引入公用组件*/
const requireComponent = require.context('../components/public', true, /\.vue$/);
requireComponent.keys().forEach((fileName) => {
	// 获取组件配置
	const componentConfig = requireComponent(fileName);
	// 剥去文件名开头的 `./` 和`.vue`结尾的扩展名
	const componentName = path.basename(fileName).replace(/\.vue$/, '');
	// 全局注册组件
	Vue.component(componentName.replace(/\//, '-'), componentConfig.default || componentConfig);
});
Vue.path = Vue.prototype.$path = path; //注册path
Vue.packageInfo = Vue.prototype.$packageInfo = packageInfo; //注册packageInfo
let debounceTimeout = null; //定义一个定时器
Vue.debounce = Vue.prototype.$debounce = function (fn, wait) {
	if (debounceTimeout) {
		clearTimeout(debounceTimeout);
	}
	debounceTimeout = setTimeout(() => {
		fn();
		clearTimeout(debounceTimeout);
	}, wait);
}; //防抖
Vue.notify = Vue.prototype.$notify = function (msg, name) {
	const notification = {
		title: name || projectName,
		body: msg,
		icon: projectInfo.logo,
	};
	return new window.Notification(notification.title, notification);
}; //通知接口
Vue.$Cookie = Vue.prototype.$Cookie = {
	get: function (name) {
		let arr,
			reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
		if ((arr = document.cookie.match(reg))) return decodeURIComponent(arr[2]);
		else return null;
	},
	set: function (name, value, time) {
		let exp = new Date();
		exp.setTime(exp.getTime() + time);
		document.cookie = name + '=' + encodeURI(value) + ';expires=' + exp.toGMTString() + ';path=/';
	},
	remove: function (name) {
		let exp = new Date();
		exp.setTime(exp.getTime() - 1);
		if (this.get(name) != null) document.cookie = name + '=' + this.get(name) + ';expires=' + exp.toGMTString();
	},
};
Vue.isElectron = Vue.prototype.$isElectron = !!process.versions; //是否是electron
if (Vue.isElectron) {
	const electron = require('electron');
	const ipcRenderer = electron.ipcRenderer;
	//引入electron接口
	Vue.electron = Vue.prototype.$electron = electron; //electron
	Vue.ipc = Vue.prototype.$ipc = ipcRenderer; //ipc接口
	Vue.ipc.on('about', function () {
		Vue.about();
	});
	Vue.ipc.on('feedBack', function () {
		Vue.feedBack();
	});
} else {
	let token = Vue.$Cookie.get('token');
	if (token) {
		localStorage.setItem('token', token);
	}
}
Vue.cloudWindow = Vue.prototype.$cloudWindow = cloudWindow;
let about = null; //关于窗口
let feedBack = null; //问题反馈窗口
let userAccount = null; //用户信息窗口
Vue.about = Vue.prototype.$about = function () {
	if (about) {
		return about.active();
	}
	about = Vue.cloudWindow({
		width: 600,
		height: 330,
		only: true,
		name: 'about',
		url: 'about',
		hideTitle: true,
		title: '关于' + projectName,
		frame: false, //
		maximizable: false,
		minimizable: false,
		resizable: false,
		component: require('../views/aboutWindow'),
		close: function () {
			about = false;
		},
	});
};
Vue.feedBack = Vue.prototype.$feedBack = function () {
	if (feedBack) {
		return feedBack.active();
	}
	feedBack = Vue.cloudWindow({
		width: 500,
		height: 350,
		only: true,
		name: 'feedBack',
		url: 'feedBack',
		hideTitle: true,
		title: '问题反馈-' + projectName,
		frame: false, //
		maximizable: false,
		minimizable: false,
		resizable: false,
		color: '#fff',
		background: 'rgba(0,0,0,0)',
		component: require('../views/feedBackWindow'),
		close: function () {
			feedBack = false;
		},
	});
};
Vue.userAccount = Vue.prototype.$userAccount = function () {
	if (userAccount) {
		return feedBack.active();
	}
	userAccount = Vue.cloudWindow({
		width: 680,
		height: 480,
		only: true,
		name: 'userAccount',
		url: 'userAccount',
		frame: false, //
		maximizable: false,
		minimizable: false,
		resizable: false,
		hideTitle: true,
		title: '账号设置',
		color: '#fff',
		background: 'rgba(0,0,0,0)',
		component: require('../views/userAccountWindow'),
		close: function () {
			userAccount = false;
		},
	});
	return userAccount;
};
Vue.disableDrag = Vue.prototype.$disableDrag = function () {
	window.addEventListener(
		'dragenter',
		function (e) {
			e.preventDefault();
		},
		false
	);
	window.addEventListener(
		'dragover',
		function (e) {
			e.preventDefault();
		},
		false
	);
	window.addEventListener(
		'dragleave',
		function (e) {
			e.preventDefault();
		},
		false
	);
	window.addEventListener(
		'drop',
		function (e) {
			e.preventDefault();
		},
		false
	);
};
Vue.copyRight = Vue.prototype.$copyRight = `©2014-2021 CloudSeries ${projectInfo.logoText} All rights reserved ZJINH`; //版权信息
Vue.gitHub = Vue.prototype.$gitHub = 'https://github.com/zjinh/';
Vue.projectInfo = Vue.prototype.$projectInfo = projectInfo;
Vue.projectEnv = Vue.prototype.$projectEnv = projectInfo.env || process.platform;
Vue.getLocation = Vue.prototype.$getLocation = function (callback) {
	if (!projectInfo.needMap) {
		throw '该应用无法使用此功能，请配置needMap为true';
	}
	let map, geolocation;
	let AMap = window.AMap;
	//加载地图，调用浏览器定位服务
	map = new AMap.Map('amap-area', {
		resizeEnable: true,
	});
	map.plugin('AMap.Geolocation', function () {
		geolocation = new AMap.Geolocation({
			enableHighAccuracy: true, //是否使用高精度定位，默认:true
			timeout: 10000, //超过10秒后停止定位，默认：无穷大
			buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
			zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			buttonPosition: 'RB',
		});
		map.addControl(geolocation);
		geolocation.getCurrentPosition();
		AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
		AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
	});
	//解析定位结果
	function onComplete(data) {
		let info = data.addressComponent;
		callback({
			data: {
				lat: data.position.getLat(),
				lng: data.position.getLng(),
				info: info,
				address: data.formattedAddress,
			},
		});
	}
	//解析定位错误信息
	function onError(data, tryGagin) {
		if (!tryGagin) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						callback({
							data: {
								lat: position.coords.latitude,
								lng: position.coords.longitude,
							},
						});
					},
					(error) => {
						switch (error.code) {
							case 1:
								onError('位置服务被拒绝', true);
								break;
							case 2:
								onError('暂时获取不到位置信息', true);
								break;
							case 3:
								onError('获取位置信息超时', true);
								break;
							default:
								onError('未知错误', true);
								break;
						}
					},
					{ timeout: 5000, enableHighAccuracy: true }
				);
			} else {
				onError('不支持获取地理位置信息', true);
			}
		} else {
			callback({
				error: data,
				data: null,
			});
		}
	}
};
Vue.getUserInfo = Vue.prototype.$getUserInfo = function (callback) {
	api.user.info(null, (rs) => {
		this.$store.commit('updateUserInfo', rs.data);
		callback && callback(rs.data);
	});
};
Vue.scrollEnd = Vue.prototype.$scrollEnd = (e, callback, offset = 100) => {
	let element = e.target;
	if (element.scrollHeight - element.scrollTop - offset === element.clientHeight) {
		callback();
	}
};
Vue.copyText = Vue.prototype.$copyText = function (value = '复制的内容') {
	let a = document.createElement('input');
	a.setAttribute('value', value);
	document.body.appendChild(a);
	a.select();
	a.focus();
	document.execCommand('copy');
	document.body.removeChild(a);
};
