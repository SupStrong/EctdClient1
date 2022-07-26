import { request } from '../request';
export default {
	list: function (data, callback, error) {
		return request({
			name: '获取样品列表',
			url: '/sample/list',
			data: data,
			callback: callback,
			error: error,
		});
	},
	create: function (data, callback, error) {
		return request({
			name: '创建样品',
			url: '/sample/create',
			data: data,
			callback: callback,
			error: error,
		});
	},
	update: function (data, callback, error) {
		return request({
			name: '编辑样品',
			url: '/sample/update',
			data: data,
			callback: callback,
			error: error,
		});
	},
	delete: function (data, callback, error) {
		return request({
			name: '删除样品',
			url: '/sample/delete',
			data: data,
			callback: callback,
			error: error,
		});
	},
};
