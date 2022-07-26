import cloudWindow from '../../../common/cloudWindow';
let treeWin = null;
export default function (title, callback, filter) {
	if (treeWin) {
		treeWin.active();
		return;
	}
	treeWin = cloudWindow({
		component: require('../views/viewer/treeViewer'),
		only: true,
		width: 400,
		height: 400,
		background: '#eee',
		color: '#606060',
		title: title || '选择一个目录',
		minimizable: false,
		maximizable: false,
		resizable: false,
		frame: true,
		close: (data) => {
			treeWin = false;
			callback && callback(data);
		},
		callback: (com) => {
			com.setFilter(filter);
		},
	});
}
