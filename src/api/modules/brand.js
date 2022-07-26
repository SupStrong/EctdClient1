import { request } from '../request';
export default {
	list: function (data, callback, error) {
		return request({
			name: '获取品牌列表',
			url: '/brand/list',
			data: data,
			callback: callback,
			error: error,
		});
	},
	create: function (data, callback, error) {
		return request({
			name: '创建品牌',
			url: '/brand/create',
			data: data,
			callback: callback,
			error: error,
		});
	},
	update: function (data, callback, error) {
		return request({
			name: '编辑品牌',
			url: '/brand/update',
			data: data,
			callback: callback,
			error: error,
		});
	},
	delete: function (data, callback, error) {
		return request({
			name: '删除品牌',
			url: '/brand/delete',
			data: data,
			callback: callback,
			error: error,
		});
	},
};
