import { request } from '../request';
let FileType = {
	android: {
		ext: ['apk'],
		icon: 'ApkType.png',
	},
	pdf: {
		ext: ['pdf'],
		icon: 'PdfType.png',
	},
	torrent: {
		ext: ['torrent'],
		icon: 'BtType.png',
	},
	vcf: {
		ext: ['vcf'],
		icon: 'VcfType.png',
	},
	txt: {
		ext: ['txt'],
		icon: 'TxtType.png',
	},
	html: {
		ext: ['htm', 'html'],
		icon: 'html.png',
	},
	exe: {
		ext: ['exe', 'msi', 'dmg'],
		icon: 'exe.png',
	},
	word: {
		ext: ['doc', 'docx'],
		icon: 'DocType.png',
	},
	PowerPoint: {
		ext: ['ppt', 'pptx'],
		icon: 'PptType.png',
	},
	excel: {
		ext: ['xls', 'xlsx'],
		icon: 'ExcelType.png',
	},
	video: {
		ext: ['mp4', 'rmvb', 'mkv'],
		icon: 'VideoType.png',
	},
	image: {
		ext: ['apng', 'png', 'jpg', 'jpeg', 'bmp', 'gif', 'ico', 'webp'],
		icon: 'ImageType.png',
	},
	music: {
		ext: ['m4a', 'mp3', 'ogg', 'flac', 'f4a', 'wav', 'ape'],
		icon: 'MusicType.png',
	},
	compress: {
		ext: ['7z', 'zip', 'rar', 'tar.gz'],
		icon: 'RarType.png',
	},
};
export default {
	info: function (callback, error) {
		return request({
			name: '获取网盘信息',
			url: '/disk/info',
			method: 'get',
			data: {},
			callback: callback,
			error: error,
		});
	},
	list: function (data, callback, error) {
		return request({
			name: '获取网盘文件',
			url: '/disk/list',
			method: 'get',
			data: data,
			callback: (rs) => {
				if (rs.data && rs.data.rows) {
					rs.data.rows.forEach((item) => {
						this.diskData(item);
					});
				}
				callback(rs);
			},
			error: error,
		});
	},
	isFolderList: function (data, callback, error) {
		return request({
			name: '判断是否有样品文件夹',
			url: '/disk/isfolder/list',
			method: 'get',
			data: data,
			callback: callback,
			error: error,
		});
	},
	folderList: function (data, callback, error) {
		return request({
			name: '获取文件夹',
			url: '/disk/folderlist',
			method: 'get',
			data: data,
			callback: callback,
			error: error,
		});
	},
	newFolder: function (data, callback, error) {
		return request({
			name: '新建文件夹',
			url: '/disk/new/folder',
			data: data,
			callback: callback,
			error: error,
		});
	},
	rename: function (data, callback, error) {
		return request({
			name: '重命名',
			url: '/disk/rename',
			data: data,
			callback: callback,
			error: error,
		});
	},
	copy: function (data, callback, error) {
		return request({
			name: '复制文件',
			url: '/disk/copy',
			passed: true,
			data: data,
			callback: callback,
			error: error,
		});
	},
	move: function (data, callback, error) {
		return request({
			name: '移动文件',
			url: '/disk/move',
			passed: true,
			data: data,
			callback: callback,
			error: error,
		});
	},
	trash: function (data, callback, error) {
		return request({
			name: '移动至回收站',
			url: '/disk/trash',
			passed: true,
			data: data,
			callback: callback,
			error: error,
		});
	},
	recover: function (data, callback, error) {
		return request({
			name: '移出回收站',
			url: '/disk/recover',
			passed: true,
			data: data,
			callback: callback,
			error: error,
		});
	},
	delete: function (data, callback, error) {
		return request({
			name: '删除文件',
			url: '/disk/delete',
			passed: true,
			method: 'delete',
			data: data,
			callback: callback,
			error: error,
		});
	},
	uploadVerify: function (data, callback, error) {
		return request({
			name: '校验上传的文件',
			url: '/disk/upload/verify',
			tips: false,
			data: data,
			callback: callback,
			error: error,
		});
	},
	uploadChunk: function (data, cancelToken, callback, error) {
		return request({
			name: '上传文件切片',
			url: '/disk/upload/chunk',
			tips: false,
			data: data,
			cancelToken: cancelToken,
			passed: true,
			callback: callback,
			error: error,
		});
	},
	search: function (data, callback, error) {
		return request({
			name: '搜索',
			url: '/disk/search',
			data: data,
			callback: callback,
			error: error,
		});
	},
	uploadMerge: function (data, callback, error) {
		return request({
			name: '合并文件切片',
			url: '/disk/upload/merge',
			data: data,
			callback: callback,
			error: error,
		});
	},
	uploadCancel: function (data, callback, error) {
		return request({
			name: '取消文件上传',
			url: '/disk/upload/cancel',
			data: data,
			callback: callback,
			error: error,
		});
	},
	fileInfo: function (data, callback, error) {
		return request({
			name: '获取文件信息',
			url: '/disk/file/info',
			method: 'get',
			data: data,
			callback: callback,
			error: error,
		});
	},
	lrc: function (data, callback, error) {
		return request({
			name: '获取歌词',
			url: '/disk/lrc',
			method: 'get',
			data: data,
			callback: callback,
			error: error,
		});
	},
	fileSize(bytes) {
		bytes = parseFloat(bytes);
		if (bytes === 0) return '0B';
		let k = 1024,
			sizes = ['B', 'KB', 'MB', 'GB', 'TB'],
			i = Math.floor(Math.log(bytes) / Math.log(k));
		return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
	},
	matchIcon(item, extName, fullPath = false) {
		for (let i in FileType) {
			if (FileType[i].ext.includes(extName)) {
				item.$icon = fullPath ? '' : FileType[i].icon;
				break;
			}
		}
		if (!item.$icon) {
			item.$icon = fullPath ? '' : 'OtherType.png';
		}
	},
	diskData(item) {
		item.active = false; //设置未选择
		item.$size = this.fileSize(item.size); //计算文件大小
		item.$icon = 'OtherType.png'; //初始化为其他图标
		item.openType = null; //初始化为无法打开的文件
		item.active = false;
		item.hover = false;
		if (item.type === 'file') {
			let extName = item.extName.substr(1);
			this.matchIcon(item, extName);
			if (item.extName === '.zip') {
				item.openType = 'zip';
			} else if (item.extName === '.pdf') {
				item.openType = 'pdf';
			} else if (FileType.image.ext.includes(extName)) {
				item.openType = 'image';
			} else if (FileType.video.ext.includes(extName)) {
				item.openType = 'video';
			} else if (FileType.music.ext.includes(extName)) {
				item.openType = 'audio';
			} else if (FileType.word.ext.includes(extName) || FileType.excel.ext.includes(extName) || FileType.PowerPoint.ext.includes(extName)) {
				item.openType = 'office';
			} else if (
				[
					'ini',
					'txt',
					'xml',
					'aspx',
					'php',
					'phtml',
					'js',
					'json',
					'c',
					'htm',
					'html',
					'log',
					'cpp',
					'java',
					'less',
					'css',
					'scss',
					'sass',
					'md',
					'sql',
				].includes(extName)
			) {
				item.openType = 'text';
			}
		} else {
			item.$icon = 'FolderType.png';
		}
		return item;
	},
	uploadFolder: function (data, callback, error) {
		return request({
			name: '上传文件夹',
			url: '/disk/upload/folder',
			passed: true,
			data: data,
			callback: callback,
			error: error,
		});
	},
	zipUnpack: function (data, callback, error) {
		return request({
			name: '解压文件',
			url: '/disk/zip/unpack',
			data: data,
			callback: callback,
			error: error,
		});
	},
	zipInfo: function (data, callback, error) {
		return request({
			name: '压缩包信息',
			url: '/disk/zip/info',
			method: 'get',
			data: data,
			callback: callback,
			error: error,
		});
	},
	zipPack: function (data, callback, error) {
		return request({
			name: '压缩文件',
			url: '/disk/zip/pack',
			data: data,
			callback: callback,
			error: error,
		});
	},
	getContent: function (data, callback, error) {
		return request({
			name: '获取文件',
			method: 'get',
			url: '/disk/get-content',
			data: {
				id: data,
			},
			callback: callback,
			error: error,
		});
	},
	shareInfo: function (data, callback, error) {
		let code = data.code;
		delete data.code;
		return request({
			name: '获取分享信息',
			method: 'get',
			url: '/disk/share/info/' + code,
			data: data,
			callback: (rs) => {
				rs.data = this.diskData(rs.data);
				callback(rs);
			},
			error: error,
		});
	},
	createShare: function (data, callback, error) {
		return request({
			name: '分享文件',
			url: '/disk/share/create',
			data: data,
			callback: callback,
			error: error,
		});
	},
	cancelShare: function (data, callback, error) {
		return request({
			name: '取消分享',
			url: '/disk/share/cancel',
			data: data,
			callback: callback,
			error: error,
		});
	},
	saveShare: function (data, callback, error) {
		return request({
			name: '保存分享到网盘',
			url: '/disk/share/save',
			passed: true,
			data: data,
			callback: callback,
			error: error,
		});
	},
	shareList: function (data, callback, error) {
		return request({
			name: '加载分享列表',
			url: '/disk/share/list',
			method: 'get',
			data: data,
			callback: (rs) => {
				if (rs.data && rs.data) {
					rs.data.forEach((item) => {
						this.diskData(item);
					});
				}
				callback(rs);
			},
			error: error,
		});
	},
};
