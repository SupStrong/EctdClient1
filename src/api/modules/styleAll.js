import { request } from '../request';
export default {
	list: function (data, callback, error) {
		return request({
			name: '样式',
			url: '/styleAll/list',
			data: data,
			callback: callback,
			error: error,
		});
	},
	create: function (data, callback, error) {
		return request({
			name: '样式',
			url: '/styleAll/create',
			data: data,
			callback: callback,
			error: error,
		});
	},
	update: function (data, callback, error) {
		return request({
			name: '样式',
			url: '/styleAll/update',
			data: data,
			callback: callback,
			error: error,
		});
	},
	delete: function (data, callback, error) {
		return request({
			name: '样式',
			url: '/styleAll/delete',
			data: data,
			callback: callback,
			error: error,
		});
	},
};
