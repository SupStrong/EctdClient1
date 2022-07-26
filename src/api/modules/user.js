import { request } from '../request';
export default {
	login: function (data, callback, error) {
		return request({
			name: '登录',
			url: '/user/login',
			data: data,
			callback: callback,
			error: error,
		});
	},
	logout: function (callback, error) {
		return request({
			name: '登出',
			url: '/user/logout',
			data: {},
			callback: callback,
			error: error,
		});
	},
	register: function (data, callback, error) {
		return request({
			name: '注册',
			url: '/user/register',
			data: data,
			callback: callback,
			error: error,
		});
	},
	forget: function (data, callback, error) {
		return request({
			name: '找回密码',
			url: '/user/forget',
			data: data,
			callback: callback,
			error: error,
		});
	},
	verify: function (data, callback, error) {
		return request({
			name: '用户激活',
			url: '/user/verify',
			data: data,
			callback: callback,
			error: error,
		});
	},
	resend: function (data, callback, error) {
		return request({
			name: '重新发送邮件',
			url: '/user/resend',
			data: data,
			callback: callback,
			error: error,
		});
	},
	errorEmail: function (data, callback, error) {
		return request({
			url: '/user/error/email',
			data: data,
			callback: callback,
			error: error,
		});
	},
	info: function (data, callback, error) {
		let url = '/user/info';
		data ? (url = url + '/' + data) : '';
		return request({
			name: '获取用户信息',
			url: url,
			method: 'get',
			callback: callback,
			error: error,
		});
	},
	update: function (data, callback, error) {
		return request({
			name: '更新用户信息',
			url: '/user/update',
			data: data,
			passed: true,
			callback: callback,
			error: error,
		});
	},
	updatePassword: function (data, callback, error) {
		return request({
			name: '修改用户密码',
			url: '/user/update/password',
			data: data,
			callback: callback,
			error: error,
		});
	},
	updateEmail: function (data, callback, error) {
		return request({
			name: '修改用户邮箱',
			url: '/user/update/email',
			data: data,
			callback: callback,
			error: error,
		});
	},
	feedBack: function (data, callback, error) {
		return request({
			name: '反馈问题',
			url: '/user/feedback',
			data: data,
			passed: true,
			callback: callback,
			error: error,
		});
	},
	verifyToken: function (callback, error) {
		return request({
			name: 'token验证',
			url: '/user/token',
			data: {
				token: localStorage.token,
			},
			callback: callback,
			error: error,
		});
	},
};
