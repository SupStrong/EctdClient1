import { request } from '../request';
export default {
	list: function (data, callback, error) {
		return request({
			name: '获取',
			url: '/imgText/list',
			data: data,
			callback: callback,
			error: error,
		});
	},
	create: function (data, callback, error) {
		return request({
			name: '创建',
			url: '/imgText/create',
			data: data,
			callback: callback,
			error: error,
		});
	},
	update: function (data, callback, error) {
		return request({
			name: '编辑样品',
			url: '/imgText/update',
			data: data,
			callback: callback,
			error: error,
		});
	},
	delete: function (data, callback, error) {
		return request({
			name: '删除样品',
			url: '/imgText/delete',
			data: data,
			callback: callback,
			error: error,
		});
	},
};
