import { app, session, ipcMain } from 'electron';
import fs from 'fs';
const extractExt = (filename) => filename.slice(filename.lastIndexOf('.'), filename.length).toLowerCase(); // 提取后缀名
let defineKey = {
	_state: 'init', //状态
	_chunk: 0, //已经下载大小
	_progress: 0, //进度
	_progressText: '0B/0B',
	_time: '',
};
export default {
	transDownFolder: app.getPath('downloads'),
	downloadList: {},
	webContents: false,
	fileSize(a) {
		let bytes = parseFloat(a);
		if (bytes === 0) return '0B';
		let k = 1024,
			sizes = ['B', 'KB', 'MB', 'GB', 'TB'],
			i = Math.floor(Math.log(bytes) / Math.log(k));
		return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
	},
	fileObject(item, state) {
		let obj = defineKey;
		obj._state = state || item.getState();
		obj._chunk = item.getReceivedBytes();
		obj._progressText = this.fileSize(item.getReceivedBytes()) + '/' + this.fileSize(item.getTotalBytes());
		obj._progress = parseInt((item.getReceivedBytes() / item.getTotalBytes()) * 100);
		obj._time = item.getStartTime();
		let result = {
			url: item.url,
			...obj,
		};
		try {
			this.webContents && this.webContents.send('downloadList', result, item.key);
		} catch (e) {
			item.cancel();
		}
		result.file = item;
		return result;
	},
	changeFolder(data) {
		if (typeof data === 'undefined') {
			return;
		}
		this.transDownFolder = data;
	},
	getQueryVariable(variable, url) {
		let query = url.split('?')[1];
		if (!query) {
			return false;
		}
		let vars = query.split('&');
		for (let i = 0; i < vars.length; i++) {
			let pair = vars[i].split('=');
			if (pair[0] === variable) {
				return pair[1];
			}
		}
		return false;
	},
	init() {
		ipcMain.on('download', (event, type, data) => {
			let downloadItem = this.downloadList[data];
			if (downloadItem === undefined) {
				return;
			}
			switch (type) {
				case 'pause':
					downloadItem.file.pause();
					break;
				case 'cancel':
					downloadItem.file.cancel();
					break;
				case 'resume':
					downloadItem.file.resume();
					break;
				case 'remove':
					delete this.downloadList[data];
					break;
			}
		});
		this.remove();
		session.defaultSession.on('will-download', (event, item, webContents) => {
			this.webContents = webContents;
			let url = item.getURLChain().toString();
			let name = decodeURI(this.getQueryVariable('name', url)) || item.getFilename();
			let key = this.getQueryVariable('key', url);
			item.key = key;
			let extname = extractExt(name);
			let fileName = name.substring(0, name.indexOf(extname));
			let file = fs.readdirSync(this.transDownFolder);
			if (file.length) {
				let files = file.filter((item) => {
					return item.includes(fileName);
				});
				if (files.length) {
					name = fileName + '(' + (files.length + 1) + ')' + extname;
				}
			}
			item.url = this.transDownFolder;
			item.setSavePath(this.transDownFolder + '/' + name); // 设置保存路径,使Electron不提示保存对话框。
			item.on('updated', (event, state) => {
				this.downloadList[key] = this.fileObject(item, item.isPaused() ? 'paused' : 'progress');
			});
			item.once('done', (event, state) => {
				state = state === 'completed' ? 'finish' : state === 'interrupted' ? 'paused' : state;
				this.downloadList[key] = this.fileObject(item, state);
			});
		});
	},
	remove() {
		for (let item in this.downloadList) {
			this.downloadList[item].file.pause();
		}
		session.defaultSession.removeListener('will-download', (event, item, webContents) => {
			item.removeListener('updated', (event, state) => {});
			item.removeListener('done', (event, state) => {});
		});
	},
};
