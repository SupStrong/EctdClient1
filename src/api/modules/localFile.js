import encrypt from '@/common/encrypt';
import electron from 'electron';
import projectInfo from '../../common/projectInfo';
const fs = require('fs');
const productName = projectInfo.default.projectName;
const path = require('path');
const app = (electron.remote ? electron.remote : electron).app;
export default {
	address: path.join(app.getPath('appData')) + '/CloudSeries/',
	user: '',
	debug: process.env.NODE_ENV === 'development',
	folders: {},
	files: {}, //用户本地文件对象
	char26() {
		let ch_small = 'a';
		let str = '';
		let ch_big = 'A';
		for (let i = 0; i < 26; i++) {
			str += String.fromCharCode(ch_small.charCodeAt(0) + i) + String.fromCharCode(ch_big.charCodeAt(0) + i);
		}
		return str;
	},
	log(message) {
		this.debug && console.info(message);
	},
	init(user, callback) {
		this.user = user;
		this.folders = {
			basic: this.address + productName,
			user: this.address + productName + '/' + user,
		};
		this.files = {
			login: this.folders.basic,
			upload: this.folders.user,
			download: this.folders.user,
			setting: this.folders.user,
			key: this.folders.basic,
			__map__: this.folders.basic,
		};
		this.mkdirSync(this.folders.user);
		for (let file in this.files) {
			this.files[file] = this.files[file] + '/' + file + '.json';
			if (file === '__map__') {
				fs.writeFile(this.files[file], JSON.stringify(this.files), () => {
					this.log('创建' + this.files[file]);
				});
			} else {
				fs.appendFileSync(this.files[file], '');
			}
		}
		callback && callback();
	},
	mkdirSync(dirPath, mode) {
		try {
			if (!fs.existsSync(dirPath)) {
				let pathTmp;
				dirPath.split(/[/\\]/).forEach(function (dirname) {
					//这里指用/ 或\ 都可以分隔目录  如  linux的/usr/local/services   和windows的 d:\temp\aaaa
					if (pathTmp) {
						pathTmp = path.join(pathTmp, dirname);
					} else {
						pathTmp = dirname;
					}
					if (!fs.existsSync(pathTmp)) {
						if (!fs.mkdirSync(pathTmp, mode)) {
							return false;
						}
					}
				});
			}
			return true;
		} catch (e) {
			this.log('create director fail! path=' + dirPath + ' errorMsg:' + e);
			return false;
		}
	},
	getMap(type) {
		if (this.files[type]) {
			return this.files;
		}
		try {
			return JSON.parse(fs.readFileSync(this.address + productName + '/__map__.json'));
		} catch (e) {
			return false;
		}
	},
	read(type, callback, encryption) {
		this.files = this.getMap(type);
		this.log('读取' + this.files[type]);
		if (!this.files) {
			return callback(null, callback, 1);
		}
		fs.readFile(this.files[type], { flag: 'r+', encoding: 'utf8' }, (err, data) => {
			data = encryption ? this.encryption(data, false) : data;
			try {
				data = JSON.parse(data);
			} catch (e) {
				data = {};
			}
			callback && callback(data, err);
		});
	},
	write(type, data, encryption, callback) {
		this.log('写入' + this.files[type]);
		data = JSON.stringify(data);
		if (encryption) {
			data = this.encryption(data, true);
		}
		if (type === 'key') {
			let char26 = this.char26();
			data = encrypt.encode(data, data + char26, data + char26);
		}
		fs.writeFileSync(this.files[type], data);
		/*		fs.writeFile(this.files[type], data, (err) => {
			console.log(err);
			callback && callback(data, err);
		});*/
	},
	encryption(data, command) {
		let key = this.read('key');
		let pKey = key + this.char26();
		if (command === 'lock' || command === true) {
			data = encrypt.encode(data, pKey, key);
		} else {
			data = encrypt.decode(data, pKey, key);
		}
		return data;
	},
};
