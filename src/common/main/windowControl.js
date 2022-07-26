import { BrowserWindow, Menu } from 'electron';
const { projectName } = require('../projectInfo').default;
const isDevelopment = process.env.NODE_ENV !== 'production';
export default {
	create(options) {
		Menu.setApplicationMenu(null);
		let defaultOptions = {
			width: 800,
			height: 600,
			title: projectName,
			frame: process.platform === 'darwin',
			useContentSize: false,
			transparent: false,
			minimizable: true,
			maximizable: true,
			resizable: true,
			alwaysOnTop: false,
			show: false,
			titleBarStyle: 'hidden',
			webPreferences: {
				devTools: isDevelopment,
				nodeIntegration: true,
				webSecurity: false,
				scrollBounce: true,
				contextIsolation: false,
				enableRemoteModule: true,
				plugins: true,
				webviewTag: true,
			},
		};
		options = Object.assign(defaultOptions, options);
		let win = new BrowserWindow(options);
		options.backgroundColor && (win.backgroundColor = options.backgroundColor);
		win.name = options.url;
		win.loadURL(this.checkRouter(options.url));
		win.callback = (data) => {
			win.webContents.send('win-data', data);
			typeof options.callback === 'function' ? options.callback() : '';
		};
		win.on('closed', (event) => {
			win = null;
			typeof options.onclose === 'function' ? options.onclose(event) : '';
		});
		win.on('ready-to-show', (event) => {
			win.show();
			win.focus();
			typeof options.ready === 'function' ? options.ready(event) : '';
		});
		win.webContents.on('did-finish-load', () => {
			win.setTitle(options.title);
			win.callback(options.data || null);
			isDevelopment && win.webContents.openDevTools();
		});
		return win;
	},
	checkRouter(router) {
		if (router.includes('file://') || router.includes('http')) {
			return router;
		}
		if (isDevelopment) {
			let port = 8080;
			return `http://localhost:${port}/#/` + router;
		}
		return 'app://./index.html#/' + router;
	},
	active(win, data) {
		if (win) {
			win.show();
			win.focus();
			data && win.callback(data);
		}
		return win;
	},
	cloudWindow(options, callback, onClose) {
		let windowName = options.name; //窗口变量名
		if (options.only && global.windowObject[windowName]) {
			return this.active(global.windowObject[windowName], options.data || '');
		}
		global.windowObject[windowName] = this.create({
			...options,
			onclose: () => {
				global.windowObject[windowName] = null;
				delete global.windowObject[windowName];
				onClose && onClose();
			},
			callback: () => {
				callback && callback();
			},
		});
		return global.windowObject[windowName];
	},
};
