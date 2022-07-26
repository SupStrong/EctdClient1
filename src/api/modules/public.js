import { request, config, axios } from '../request';
export default {
	getApp(app, callback, error) {
		let url = 'https://update.zjinh.cn/' + app + '/';
		let fileName = 'latest' + (navigator.userAgent.indexOf('Mac OS X') > 0 ? '-mac' : '') + '.yml';
		axios
			.get(url + fileName)
			.then((rs) => {
				rs = rs.data;
				let arr = rs.split(/\n/g);
				if (!arr[arr.length]) {
					// 如果最后一行后面有换行符，删除数组最后一项空字符串
					arr.pop();
				}
				let obj = {
					files: {},
				};
				for (let i = 0; i < arr.length; i++) {
					let a = arr[i].split(': ');
					let key = a[0].trim().split('- ').reverse()[0];
					if (obj[key.replace(/:/g, '')]) continue;
					let value = a[1] && a[1].trim();
					let str = '- url,size,sha512';
					if (str.indexOf(key) > -1) {
						let obj1 = {};
						obj1[key] = value;
						obj.files = Object.assign(obj.files, obj1);
					} else {
						obj[key] = value;
					}
				}
				callback && callback(obj, url + obj.files.url);
			})
			.catch((e) => {
				error && error(e);
			});
	},
	download(url, progress, callback, error, range = 0) {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		//监听进度事件
		xhr.abort();
		xhr.addEventListener(
			'progress',
			function (e) {
				if (e.lengthComputable) {
					progress && progress(e.total, e.loaded);
				}
			},
			false
		);
		xhr.responseType = 'blob';
		xhr.onload = () => {
			if (xhr.status === 200) {
				callback(xhr.response);
			}
		};
		xhr.onerror = (e) => {
			error && error(e);
		};
		xhr.send();
		return xhr;
	},
	verifyCode() {
		return config.oss + '/user/code' + '?' + Math.random();
	},
	server(key) {
		return config[key] + '/';
	},
	uploadUrl(folder, file) {
		return config.oss + file;
	},
};
