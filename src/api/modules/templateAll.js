import { request } from '../request';
export default {
	list: function (data, callback, error) {
		return request({
			name: '样式',
			url: '/templateAll/list',
			data: data,
			callback: callback,
			error: error,
		});
	},
	get: function (data, callback, error) {
		return request({
			name: '样式',
			url: '/templateAll/get',
			data: data,
			callback: callback,
			error: error,
		});
	},
	create: function (data, callback, error) {
		return request({
			name: '样式',
			url: '/templateAll/create',
			data: data,
			callback: callback,
			error: error,
		});
	},
	update: function (data, callback, error) {
		return request({
			name: '样式',
			url: '/templateAll/update',
			data: data,
			callback: callback,
			error: error,
		});
	},
	delete: function (data, callback, error) {
		return request({
			name: '样式',
			url: '/templateAll/delete',
			data: data,
			callback: callback,
			error: error,
		});
	},
};
