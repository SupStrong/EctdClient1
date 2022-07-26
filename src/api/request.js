import axios from 'axios';
import vue from 'vue';
import { Message } from 'view-design';
import configFile from '../../config/request.json';
const config = configFile[process.env.NODE_ENV];
let notLoginUrl = location.href.includes('/#/') ? '#/login' : '/login';
let projectInfo = {};
let isElectron = !!process.versions;
if (isElectron) {
	projectInfo = require('../common/projectInfo').default;
}
// http request 拦截器
axios.interceptors.request.use(
	(config) => {
		if (localStorage.token) {
			// 判断是否存在token，如果存在的话，则每个http header都加上token
			config.headers.Authorization = `${localStorage.token}`;
		}
		if (isElectron) {
			// 这里应该使用连接符
			config.headers.AppId = `${projectInfo.appId}`;
		}
		return config;
	},
	(err) => {
		return Promise.reject(err);
	}
);
// http response 拦截器
axios.interceptors.response.use(
	(response) => {
		if (response.headers.authorization) {
			localStorage.token = response.headers.authorization;
			vue.$Cookie.set('token', response.headers.authorization);
		}
		return response;
	},
	(error) => {
		let message = '';
		if (error.response) {
			switch (error.response.status) {
				case 400:
					message = '请求错误(400)';
					break;
				case 401:
					message = '未授权，请重新登录(401)';
					localStorage && localStorage.removeItem('token');
					if (isElectron) {
						vue.ipc.send('system', 'logoff');
					} else {
						if (!location.href.includes('/login')) {
							location.href = notLoginUrl;
						}
					}
					break;
				case 403:
					message = '拒绝访问(403)';
					break;
				case 404:
					message = '请求出错(404)';
					break;
				case 408:
					message = '请求超时(408)';
					break;
				case 500:
					message = '服务器错误(500)';
					break;
				case 501:
					message = '服务未实现(501)';
					break;
				case 502:
					message = '网络错误(502)';
					break;
				case 503:
					message = '服务不可用(503)';
					break;
				case 504:
					message = '网络超时(504)';
					break;
				case 505:
					message = 'HTTP版本不受支持(505)';
					break;
				default:
					message = `连接出错(${error.response.status})!`;
			}
		} else {
			if (error.message !== 'cancel') {
				message = '无法连接服务器';
			}
		}
		message && Message.error(message);
		return Promise.reject(error.response ? error.response.data : error); // 返回接口返回的错误信息
	}
);
function request(options) {
	let url = config.url;
	if (options.url.indexOf('http') === 0) {
		url = options.url;
	} else {
		url = url + options.url;
	}
	let params = new URLSearchParams();
	let method = options.method ? options.method.toUpperCase() : 'POST';
	let data = options.data || {};
	let cancelToken = options.cancelToken;
	let tips = options.tips !== undefined ? options.tips : true;
	if (method === 'POST' || method === 'DELETE') {
		if (options.passed) {
			//过滤 不处理数据
			params = data;
		} else {
			for (let name in data) {
				if (data.hasOwnProperty(name)) {
					params.append(name, data[name]);
				}
			}
		}
	} else if (method === 'GET') {
		data = Object.keys(data)
			.map(function (key) {
				return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
			})
			.join('&');
		params = {};
		if (data) {
			url = url + '?' + data;
		}
	}
	return new Promise((resolve, reject) => {
		axios({
			url: url,
			method: method,
			data: params,
			emulateJSON: true,
			cancelToken: cancelToken ? cancelToken.token : '',
			responseType: options.download ? 'blob' : '',
			onUploadProgress: function (e) {
				//原生获取上传进度的事件
				if (e.lengthComputable) {
					//属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
					//如果lengthComputable为false，就获取不到
					options.progress && options.progress(e.total, e.loaded);
				}
			},
			onDownloadProgress: function (e) {
				options.progress && options.progress(e.total, e.loaded);
			},
		}).then(
			(response) => {
				response = response.data;
				if (response.code !== 0 && response.code !== 200) {
					options.error && typeof options.error === 'function' ? options.error(response) : '';
					if (tips && !options.error) {
						options.callback && typeof options.callback === 'function' ? options.callback(response) : '';
						resolve(response);
						Message.error(options.name + '失败:' + response.msg);
					}
				} else {
					options.callback && typeof options.callback === 'function' ? options.callback(response) : '';
					resolve(response);
				}
			},
			(error) => {
				requestError(options, error);
				reject(error);
			}
		);
	}).catch((e) => {
		options.error && typeof options.error === 'function' ? options.error(e) : '';
	});
}
function requestError(options, error) {}
export { request, config, axios };
