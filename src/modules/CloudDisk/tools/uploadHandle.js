import BMF from 'browser-md5-file';
let bmf = new BMF();
import disk from '../../../api/modules/disk';
import axios from 'axios';
import { client } from '../../../../utils/oss';
import randomKey from './randomKey';
let defineKey = {
	_md5: 0, //初始化md5
	_eachSize: 0, //初始化每个分片大小为0
	_state: 'waiting', //状态
	_stateText: '等待中',
	_chunk: 0, //已经上传大小
	_progress: 0, //进度
	_type: 'upload',
	_progressText: '0B/0B',
	_time: new Date().getTime() / 1000,
};
export default {
	paused: false, //由历史记录恢复回来的为true
	uploadList: {}, //上传列表
	callbackFun: function () {},
	maxFileSize: 0,
	uploading: 0, //正在上传的数量
	maxLimit: 3,
	stateText: {
		initMd5: '生成md5',
		md5err: 'md5生成错误',
		verify: '文件验证中',
		progress: '正在上传',
		waiting: '等待中',
		finish: '上传完成',
		error: '上传失败',
		paused: '已暂停',
		cancelled: '已取消',
		cancelling: '正在取消',
	},
	chunkSize: 4194304, //4MB ,单位B
	init(files, data, callback, paused) {
		console.log(files, data, callback, paused, 'files, data, callback, paused');
		this.paused = paused;
		this.callbackFun = callback;
		files.forEach((item) => {
			let key = randomKey(10);
			if (this.uploadList[key]) {
				key = randomKey(10);
			}
			this.uploadList[key] = {
				file: item,
				name: item.name,
				size: item.size,
				data: data, //上传的参数
				path: item.path,
				key: key,
				...defineKey,
				pause: () => {
					this.pauseUpload(key);
				},
				cancel: () => {
					this.cancelUpload(key);
				},
			};
		});
		if (!paused) {
			this.canStart();
		}
	},
	canStart() {
		this.uploading = 0;
		let uploadState = ['progress', 'initMd5', 'verify'];
		for (let i in this.uploadList) {
			let item = this.uploadList[i];
			if (uploadState.includes(item._state)) {
				this.uploading++;
			}
		}
		let leftLimit = this.maxLimit - this.uploading;
		if (leftLimit > 0) {
			let leftCount = 0;
			for (let i in this.uploadList) {
				let item = this.uploadList[i];
				if (item._state === 'waiting') {
					leftCount++;
				}
			}
			leftLimit = leftCount > leftLimit ? leftLimit : leftCount; //如果剩余任务数量小于阈值，则使用阈值
			let index = 0;
			if (leftLimit > 0) {
				for (let key in this.uploadList) {
					let item = this.uploadList[key];
					if (item._state === 'waiting') {
						index++;
						this.createMd5(item, key);
						if (index === leftLimit) {
							break;
						}
					}
				}
			}
		}
	},
	setData(index, key, value, fileData) {
		if (key === '_progress') {
			value = parseInt(value);
		}
		this.uploadList[index][key] = value;
		if (key === '_state') {
			if (value === 'finish') {
				let fileSize = this.uploadList[index].size.fileSize();
				this.uploadList[index]['_progress'] = 100;
				this.uploadList[index]['_progressText'] = fileSize + '/' + fileSize;
				this.canStart();
			} else if (value === 'cancelled' || value === 'paused' || value === 'error' || value === 'md5err') {
				this.canStart();
				if (value === 'cancelled') {
					this.uploadList[index]['_progress'] = 0;
				}
			}
			this.uploadList[index]['_stateText'] = this.stateText[value];
		}
		console.log(fileData, 'sb');
		this.callbackFun(Object.values(this.uploadList), fileData ? fileData : false);
	},
	getChunk(file, index, chunk = 0) {
		let eachSize = this.chunkSize; //分片大小,如果文件大于切片大小，则将文件分成10分作为切片大小
		let chunks = Math.ceil(file.size / eachSize) || 1; //切片总数;
		let isLastChunk = chunk === chunks - 1 ? 1 : 0; // 判断是否为末分片
		let blobFrom = chunk * eachSize; // 分段开始
		let blobTo = (chunk + 1) * eachSize; // 分段结尾
		blobTo >= file.size ? file.size : blobTo;
		this.setData(index, '_eachSize', eachSize);
		this.setData(index, '_progressText', (eachSize * chunk).fileSize() + '/' + file.size.fileSize()); //计算进度条文字
		return {
			file: file.slice(blobFrom, blobTo), //切片文件
			chunk: chunk, //切片
			chunks: chunks, //切片总数
			last: isLastChunk, //是否最后一个
			md5: this.uploadList[index]._md5,
		};
	},
	createMd5(item, index) {
		this.setData(index, '_state', 'initMd5');
		let file = item.file;
		bmf.md5(file, (err, md5) => {
			if (err) {
				this.setData(index, '_state', 'md5err');
			} else {
				this.setData(index, '_state', 'verify');
				this.setData(index, '_md5', md5);
				this.verifyMd5(item, index);
			}
		});
	},
	verifyMd5(item, index) {
		disk.uploadVerify(
			{
				md5: this.uploadList[index]._md5,
				name: item.name,
				size: item.size,
				...item.data,
			},
			(rs) => {
				this.updateFinish(index, rs.data);
				console.log('111111');
			},
			(rs) => {
				console.log('222222');
				//曾经上传过，返回已经上传的分片数量 从该处开始
				// this.uploading++;
				this.setData(index, '_state', 'progress');
				this.startUpload(item, index, rs.data.chunk || 0);
			}
		);
	},
	startUpload(item, index, chunk) {
		let fd = new FormData();
		let fileData = this.getChunk(item.file, index, chunk);
		for (let key in fileData) {
			fd.append(key, fileData[key]);
		}
		chunk = parseInt(chunk);
		fileData.last = parseInt(fileData.last);
		console.log('fd', fd);
		let cancelToken = axios.CancelToken.source();
		this.setData(index, 'cancelToken', cancelToken);
		if (!fileData.last) {
			//如果不是最后一个
			chunk++;
			this.startUpload(item, index, chunk);
		} else {
			this.mergeFile(item.file, index);
		}
	},
	mergeFile(file, index) {
		const date = new Date();
		let that = this;
		client()
			.multipartUpload(`/image/${date.getFullYear()}/${date.getMonth()}-${date.getDate()}/${file.name}`, file, {})
			.then(function (res) {
				disk.uploadMerge(
					{
						...that.uploadList[index].data,
						md5: that.uploadList[index]._md5,
						name: file.name,
						size: file.size,
						extname: res.name,
						chunkSize: that.uploadList[index]._eachSize,
					},
					(rs) => {
						that.updateFinish(index, rs.data);
					},
					() => {
						that.setData(index, '_state', 'error');
					}
				);
			});
		// disk.uploadMerge(
		// 	{
		// 		...this.uploadList[index].data,
		// 		md5: this.uploadList[index]._md5,
		// 		name: file.name,
		// 		size: file.size,
		// 		chunkSize: this.uploadList[index]._eachSize,
		// 	},
		// 	(rs) => {
		// 		this.updateFinish(index, rs.data);
		// 	},
		// 	() => {
		// 		this.setData(index, '_state', 'error');
		// 	}
		// );
	},
	pauseUpload(index) {
		if (this.uploadList[index]._state === 'paused') {
			//已经暂停的话
			this.setData(index, '_time', new Date().getTime() / 1000);
			this.setData(index, '_state', 'progress');
			if (this.uploadList[index]._md5) {
				//有md5验证，查找已经上传的进度
				this.verifyMd5(this.uploadList[index], index);
			} else {
				//没有的创建
				this.createMd5(this.uploadList[index], index);
			}
		} else {
			this.setData(index, '_state', 'paused');
			this.uploadList[index].cancelToken && this.uploadList[index].cancelToken.cancel('cancel');
		}
	},
	updateFinish(index, data) {
		this.setData(index, '_state', 'finish', data);
	},
	cancelUpload(index) {
		let item = this.uploadList[index];
		item.cancelToken && item.cancelToken.cancel('cancel');
		if (item._chunk > 0) {
			this.setData(index, '_state', 'cancelling');
			disk.uploadCancel(
				{
					md5: item._md5,
				},
				(rs) => {
					this.setData(index, '_state', 'cancelled');
				},
				() => {
					this.setData(index, '_state', 'paused');
				}
			);
		} else {
			this.setData(index, '_state', 'cancelled');
		}
	},
	removeList(index) {
		delete this.uploadList[index];
		this.callbackFun(Object.values(this.uploadList));
	},
};
