export default {
	init(e, callback) {
		let files = {
			file: [],
			folder: [],
		};
		for (let i = 0; i < e.dataTransfer.files.length; i++) {
			let item = e.dataTransfer.files[i];
			let name = item.name.split('/');
			let fileName = name[name.length - 1];
			if (fileName.Before('.') !== fileName) {
				files.file.push(item);
			}
		}
		callback && callback(files);
		let items = e.dataTransfer.items;
		if (items && items.length && items[0].webkitGetAsEntry != null) {
			items.forEach(async (item) => {
				let entry;
				if (item.webkitGetAsEntry && (entry = item.webkitGetAsEntry())) {
					if (entry.isDirectory) {
						files.folder = await addFilesFormDirectory(entry, entry.name, []);
						callback && callback(files);
					}
				}
			});
		}
		async function addFilesItems(items) {
			for (let i = 0; i < items.length; i++) {
				let item = items[i];
				let entry;
				if (item.webkitGetAsEntry && (entry = item.webkitGetAsEntry())) {
					if (entry.isDirectory) {
						files.folder.push(await addFilesFormDirectory(entry, entry.name, []));
					}
				}
			}
		}
		async function getFile(entry, path) {
			return new Promise((resolve) => {
				entry.file(function (file) {
					file.fullPath = path + '/' + file.name;
					// 那么暴露出去的就是 '文件夹/q.jpg' 这种形式
					resolve(file);
				});
			});
		}
		// 读取文件夹下的文件
		async function addFilesFormDirectory(directory, path, data = []) {
			return new Promise((resolve) => {
				const dirReader = directory.createReader();
				dirReader.readEntries(async function (entries) {
					for (let i = 0; i < entries.length; i++) {
						let entry = entries[i];
						if (entry.isFile) {
							// 如果是文件
							data.push(await getFile(entry, path));
						} else if (entry.isDirectory) {
							// 递归处理
							let data1 = await addFilesFormDirectory(entry, path + '/' + entry.name);
							data = [...data, ...data1];
						}
					}
					resolve(data);
				});
			});
		}
	},
};
