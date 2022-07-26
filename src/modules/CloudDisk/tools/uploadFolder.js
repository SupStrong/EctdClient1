export default {
	init(files) {
		let foldr = [];
		files.forEach((file) => {
			let list = file.webkitRelativePath.length ? file.webkitRelativePath.split('/') : file.fullPath.split('/');
			list.pop();
			foldr.push(list);
		});
		foldr = this.uniqueFolder(foldr);
		foldr.forEach((item) => {
			if (item.length >= 2) {
				let path = JSON.handle(item);
				path.pop();
				foldr.push(path);
			}
		});
		foldr = this.uniqueFolder(foldr);
		return foldr;
	},
	uniqueFolder(arr) {
		for (let i = 0; i < arr.length; i++) {
			for (let j = i + 1; j < arr.length; ) {
				if (arr[i].toString() === arr[j].toString()) {
					arr.splice(j, 1);
				} else {
					j++;
				}
			}
		}
		return arr;
	},
	mateParent(files, result) {
		let data = [];
		files.forEach((file) => {
			let list = file.webkitRelativePath.length ? file.webkitRelativePath.split('/') : file.fullPath.split('/');
			list.pop();
			data.push({
				file: file,
				path: list.toString(),
				parentId: 0,
			});
		});
		result.forEach((item) => {
			data.forEach((file) => {
				if (file.path === item.path.toString()) {
					file.parentId = item.id;
				}
			});
		});
		return this.groupBy(data);
	},
	groupBy(list) {
		let key = 'parentId';
		let obj = {};
		list.map((item) => {
			if (!obj[item[key]]) {
				//如果不存在这个属性
				obj[item[key]] = [];
			}
			obj[item[key]].push(item.file);
		});
		return obj;
	},
};
