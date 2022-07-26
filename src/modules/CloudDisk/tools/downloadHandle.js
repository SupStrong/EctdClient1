import fa from 'element-ui/src/locale/lang/fa';

let defineKey = {
	_state: 'waiting', //状态
	_stateText: '初始化',
	_chunk: 0, //已经下载大小
	_progress: 0, //进度
	_type: 'download',
	_progressText: '0B/0B',
	_time: new Date().getTime() / 1000,
};
let electron = null;
import publicMode from '../../../api/modules/public';
import randomKey from './randomKey';
export default {
	isElectron: false,
	paused: false,
	downloadTarget: '',
	downloadList: {}, //下载列表
	maxLimit: 3,
	downloading: 0,
	callbackFun: function () {},
	stateText: {
		init: '初始化',
		progress: '正在下载',
		finish: '下载完成',
		error: '下载失败',
		paused: '已暂停',
		cancelled: '已取消',
	},
	init(list, isElectron, callback, paused = false) {
		this.callbackFun = callback;
		this.isElectron = isElectron;
		this.paused = paused;
		if (isElectron) {
			if (!electron) {
				electron = require('electron');
				electron.ipcRenderer.on('downloadList', (e, data, key) => {
					if (this.paused) {
						electron.ipcRenderer.send('download', 'pause', key);
					}
					this.downloadList[key] = Object.assign(
						this.downloadList[key] || {
							pause: () => {
								this.pauseDownload(key);
							},
							cancel: () => {
								this.cancelDownload(key);
							},
						},
						data
					);
					this.setData(key, '_state', data['_state']);
				});
			}
		}
		list.forEach((item) => {
			if (item.key) {
				this.downloadList[item.key] = {
					key: item.key,
					name: item.name,
					size: item.size,
					path: item.path,
					...defineKey,
					pause: () => {
						this.pauseDownload(item.key);
					},
					cancel: () => {
						this.cancelDownload(item.key);
					},
				};
				this.setData(item.key, '_progressText', '0B/' + item.size.fileSize()); //计算进度条文字
			} else {
				let key = randomKey(10);
				if (this.downloadList[key]) {
					key = randomKey(10);
				}
				item.size = parseFloat(item.size);

				this.downloadList[key] = {
					key: key,
					name: item.name,
					size: item.size,
					path: item.path ? item.path : publicMode.uploadUrl('disk', item.content) + '?name=' + item.name + '&key=' + key,
					...defineKey,
					pause: () => {
						this.pauseDownload(key);
					},
					cancel: () => {
						this.cancelDownload(key);
					},
				};
				this.setData(key, '_progressText', '0B/' + item.size.fileSize()); //计算进度条文字
			}
		});
		this.callbackFun(Object.values(this.downloadList));
		if (!paused) {
			this.canStart();
		}
	},
	canStart() {
		this.downloading = 0;
		let uploadState = ['progress'];
		for (let i in this.downloadList) {
			let item = this.downloadList[i];
			if (uploadState.includes(item._state)) {
				this.downloading++;
			}
		}
		let leftLimit = this.maxLimit - this.downloading;
		if (leftLimit > 0) {
			let leftCount = 0;
			for (let i in this.downloadList) {
				let item = this.downloadList[i];
				if (item._state === 'waiting') {
					leftCount++;
				}
			}
			leftLimit = leftCount > leftLimit ? leftLimit : leftCount; //如果剩余任务数量小于阈值，则使用阈值
			let index = 0;
			if (leftLimit > 0) {
				for (let key in this.downloadList) {
					let item = this.downloadList[key];
					if (item._state === 'waiting') {
						index++;
						this.startDownload(item, key);
						if (index === leftLimit) {
							break;
						}
					}
				}
			}
		}
	},
	setData(index, key, value) {
		if (key === '_progress') {
			value = parseInt(value);
		}
		this.downloadList[index][key] = value;
		if (key === '_state') {
			if (value === 'finish') {
				let fileSize = this.downloadList[index].size.fileSize();
				this.downloadList[index]['_progress'] = 100;
				this.downloadList[index]['_progressText'] = fileSize + '/' + fileSize;
				this.canStart();
			} else if (value === 'cancelled' || value === 'paused' || value === 'error') {
				this.canStart();
				if (value === 'cancelled') {
					this.downloadList[index]['_progress'] = 0;
				}
			}
			this.downloadList[index]['_stateText'] = this.stateText[value];
		}
		this.callbackFun(Object.values(this.downloadList), value === 'finish' ? this.downloadList[index] : false);
	},
	startDownload(item, index) {
		if (this.isElectron) {
			electron.remote.getCurrentWindow().webContents.downloadURL(item.path);
		} else {
			this.setData(index, '_state', 'progress');
			this.webDownload(item, index);
		}
	},
	webDownload(item, index) {
		let xhr = publicMode.download(
			item.path,
			(total, load) => {
				this.setData(index, '_chunk', load); //计算进度条
				this.setData(index, '_progress', (load / total) * 100); //计算进度条
				this.setData(index, '_progressText', load.fileSize() + '/' + total.fileSize()); //计算进度条文字
			},
			(blob) => {
				this.setData(index, '_state', 'finish');
				const link = document.createElement('a');
				const body = document.querySelector('body');
				link.href = window.URL.createObjectURL(blob);
				link.download = item.name;
				link.style.display = 'none';
				body.appendChild(link);
				link.click();
				body.removeChild(link);
				window.URL.revokeObjectURL(link.href);
			},
			() => {
				this.setData(index, '_state', 'error');
			}
		);
		this.setData(index, 'cancelToken', xhr);
	},
	pauseDownload(index) {
		if (this.isElectron) {
			if (this.downloadList[index]._state === 'paused') {
				this.paused = false;
				electron.ipcRenderer.send('download', 'resume', index);
			} else {
				electron.ipcRenderer.send('download', 'pause', index);
			}
		} else {
			if (this.downloadList[index]._state === 'paused') {
				//已经暂停的话
				this.setData(index, '_time', new Date().getTime() / 1000);
				this.setData(index, '_state', 'progress');
				this.startDownload(this.downloadList[index], index);
			} else {
				this.setData(index, '_state', 'paused');
				this.downloadList[index].cancelToken.abort();
			}
		}
	},
	cancelDownload(index) {
		if (this.isElectron) {
			electron.ipcRenderer.send('download', 'cancel', index);
		} else {
			this.downloadList[index].cancelToken.abort();
		}
		this.setData(index, '_state', 'cancelled');
	},
	removeList(index) {
		if (this.isElectron) {
			electron.ipcRenderer.send('download', 'remove', index);
		}
		delete this.downloadList[index];
		this.callbackFun(Object.values(this.downloadList));
	},
};
