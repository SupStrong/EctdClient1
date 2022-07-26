import { request } from '../request';
export default {
	list: function (data, callback, error) {
		return request({
			name: '获取分类列表',
			url: '/categorymenu/list',
			data: data,
			callback: callback,
			error: error,
		});
	},
	create: function (data, callback, error) {
		return request({
			name: '创建分类',
			url: '/categorymenu/create',
			data: data,
			callback: callback,
			error: error,
		});
	},
	update: function (data, callback, error) {
		return request({
			name: '编辑分类',
			url: '/categorymenu/update',
			data: data,
			callback: callback,
			error: error,
		});
	},
	delete: function (data, callback, error) {
		return request({
			name: '删除分类',
			url: '/categorymenu/delete',
			data: data,
			callback: callback,
			error: error,
		});
	},
};
