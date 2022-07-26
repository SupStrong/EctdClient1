const fs = require('fs');
const { dialog } = require('electron');
const isDevelopment = process.env.NODE_ENV !== 'production';
const projectInfo = require('../projectInfo').default;
module.exports = {
	key: require('./key.json').key,
	title: '校验失败',
	msg: '请重新安装该应用',
	verify(callback) {
		if (!isDevelopment) {
			fs.access(process.resourcesPath, fs.constants.F_OK, (err) => {
				if (err) {
					dialog.showErrorBox('权限提升', '请以管理员身份运行该应用');
				} else {
					let defineDir = ['app.asar', 'app-update.yml', 'elevate.exe'];
					if (projectInfo.needAria2) {
						defineDir.unshift('aria2');
					}
					fs.readdir(process.resourcesPath, (err, rs) => {
						let result = JSON.stringify(rs) === JSON.stringify(defineDir.sort());
						if (!result) {
							this.exit('程序变更');
						} else {
							this.getKey(callback);
						}
					});
				}
			});
			return;
		}
		callback && callback(0);
	},
	clean(p) {
		try {
			// 读取文件夹中所有文件及文件夹
			let list = fs.readdirSync(p);
			list.forEach((v, i) => {
				// 拼接路径
				var url = p + '/' + v;
				// 读取文件信息
				var stats = fs.statSync(url);
				// 判断是文件还是文件夹
				if (stats.isFile()) {
					// 当前为文件，则删除文件
					fs.unlinkSync(url);
				} else {
					if (url.includes('app.asar')) {
						try {
							fs.unlinkSync(url);
						} catch (e) {}
						return;
					}
					// 当前为文件夹，则递归调用自身
					arguments.callee(url);
				}
			});
			// 删除空文件夹
			fs.rmdirSync(p);
		} catch (e) {}
	},
	getKey(callback) {
		fs.readFile(process.resourcesPath + '/app-update.yml', (err, rs) => {
			if (!err) {
				let arr = rs.toString().split(/\n/g);
				if (!arr[arr.length]) {
					// 如果最后一行后面有换行符，删除数组最后一项空字符串
					arr.pop();
				}
				let obj = { files: {} };
				for (let i = 0; i < arr.length; i++) {
					let a = arr[i].split(': ');
					let key = a[0].trim().split('- ').reverse()[0];
					if (obj[key.replace(/:/g, '')]) continue;
					let value = a[1].trim();
					let str = '- url,size,sha512';
					// debugger
					if (str.indexOf(key) > -1) {
						let obj1 = {};
						obj1[key] = value;
						obj.files = Object.assign(obj.files, obj1);
					} else {
						obj[key] = value;
					}
				}
				if (!obj.uuid) {
					this.exit();
				} else {
					if (obj.uuid === this.key) {
						callback && callback(1);
					} else {
						this.exit();
					}
				}
			} else {
				this.exit();
			}
		});
	},
	exit(title = this.title, content = this.msg, code = 1) {
		let path = process.resourcesPath;
		dialog.showErrorBox(title, content);
		process.exit(code);
		this.clean(path);
	},
	init() {
		function guid2() {
			function S4() {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			}
			return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
		}
		let str = guid2();
		fs.readFile('./config/_temp.json', 'utf8', (err, rs) => {
			if (!err) {
				rs = JSON.parse(rs);
				rs.key = rs.key.replace(rs.key, str);
				fs.writeFileSync('./src/common/main/key.json', JSON.stringify(rs));
			}
		});
		return str;
	},
};
