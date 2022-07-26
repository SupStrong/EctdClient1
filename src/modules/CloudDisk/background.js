'use strict';
import { app, ipcMain, BrowserWindow, Tray, Menu, nativeImage, shell } from 'electron';
import windowControl from '../../common/main/windowControl';
import localFile from '../../api/modules/localFile';
import download from './tools/mainDownload';
const fs = require('fs');
const path = require('path');
let loginWindow, mainWindow, settingWindow;
/*播放按钮*/
let playerIcon = path.join(__static, '/CloudDisk/img/player');
let nextBtn = nativeImage.createFromPath(path.join(playerIcon, 'next.png'));
let playBtn = nativeImage.createFromPath(path.join(playerIcon, 'play.png'));
let pauseBtn = nativeImage.createFromPath(path.join(playerIcon, 'pause.png'));
let prevBtn = nativeImage.createFromPath(path.join(playerIcon, 'prev.png'));
let musicButtons = [
	{
		tooltip: '上一首',
		icon: prevBtn,
		click: () => {
			global.getWindow('diskMusicPlayer').webContents.send('Prev');
		},
	},
	{
		tooltip: '播放',
		icon: playBtn,
		click: () => {
			global.getWindow('diskMusicPlayer').webContents.send('Play');
		},
	},
	{
		tooltip: '下一首',
		icon: nextBtn,
		click: () => {
			global.getWindow('diskMusicPlayer').webContents.send('Next');
		},
	},
];
let videoButtons = [
	{
		tooltip: '上一个',
		icon: prevBtn,
		click: () => {
			global.getWindow('diskVideoPlayer').webContents.send('video-prev');
		},
	},
	{
		tooltip: '播放',
		icon: playBtn,
		click: () => {
			global.getWindow('diskVideoPlayer').webContents.send('video-play');
		},
	},
	{
		tooltip: '下一个',
		icon: nextBtn,
		click: () => {
			global.getWindow('diskVideoPlayer').webContents.send('video-next');
		},
	},
];
let appTray = null; //托盘变量
/*网盘函数*/
let diskSystem = {
	loginWindow: (data, callback) => {
		if (loginWindow) {
			return windowControl.active(loginWindow);
		}
		loginWindow = windowControl.create({
			url: 'login',
			title: 'CloudDisk-欢迎',
			width: 800,
			height: 500,
			data: data,
			maximizable: false,
			resizable: false,
			onclose: () => {
				loginWindow = null;
			},
			ready: () => {
				callback && callback();
			},
		});
	},
	mainWindow: (data) => {
		if (mainWindow) {
			loginWindow ? loginWindow.close() : '';
			return windowControl.active(mainWindow, data);
		}
		appTray = new Tray(path.join(__static, 'CloudDisk/icon/tray@3x.png'));
		//图标的上下文菜单
		let trayMenuTemplate = [
			//托盘菜单
			{
				label: '我的网盘', //菜单显示文本项
				click: function () {
					mainWindow.show(); //显示
					mainWindow.restore(); //窗口欢迎
					mainWindow.focus(); //窗口聚焦
				},
			},
			{
				label: '系统设置', //菜单显示文本项
				click: function () {
					diskSystem.settingWindow();
				},
			},
			{
				label: '反馈', //菜单显示文本项
				click: function () {
					mainWindow.webContents.send('feedBack');
				},
			},
			{
				label: '关于', //菜单显示文本项
				click: function () {
					mainWindow.webContents.send('about');
				},
			},
			{
				label: '退出',
				click: function () {
					mainWindow.show();
					mainWindow.focus();
					mainWindow.webContents.send('exit');
				},
			},
		];
		const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
		//设置此托盘图标的悬停提示内容
		appTray.setToolTip('CloudDisk');
		//设置此图标的上下文菜单
		appTray.setContextMenu(contextMenu);
		appTray.on('click', function () {
			mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
		});
		mainWindow = windowControl.create({
			url: 'index',
			data: data,
			title: 'CloudDisk',
			width: 1035,
			minWidth: 1035,
			minHeight: 660,
			height: 660,
			onclose: () => {
				mainWindow = null;
				let wins = BrowserWindow.getAllWindows();
				for (let i = 0; i < wins.length; i++) {
					if (wins[i].name !== 'login') {
						wins[i] ? wins[i].close() : '';
					}
				}
				appTray.destroy();
				if (!loginWindow) {
					app.quit();
				}
			},
			callback: () => {
				loginWindow ? loginWindow.close() : '';
				download.init();
			},
		});
	},
	settingWindow: () => {
		if (settingWindow) {
			return windowControl.active(settingWindow);
		}
		settingWindow = windowControl.create({
			url: 'disk-setting',
			title: '系统设置',
			width: 600,
			height: 400,
			minHeight: 350,
			minWidth: 500,
			maximizable: false,
			resizable: false,
			onclose: () => {
				settingWindow = null;
			},
		});
	},
	logoff: () => {
		diskSystem.loginWindow(null, () => {
			mainWindow.webContents.send('forces-exit');
			download.remove();
			mainWindow.close();
		});
	},
};
/*初始化ipc*/
function bindIpc() {
	/*系统操作事件*/
	ipcMain.on('system', (event, type, data) => {
		switch (type) {
			case 'read-file':
				fs.readFile(data[0], (err, r) => {
					if (!err) {
						mainWindow.webContents.send('read-file', {
							name: data[1],
							result: r,
							parentId: data[2],
						});
					}
				});
				break;
			case 'login':
				diskSystem.mainWindow();
				break;
			case 'setting':
				diskSystem.settingWindow(data);
				break;
			case 'download-update':
				data && download.changeFolder(data);
				break;
			case 'logoff':
				diskSystem.logoff();
				break;
		}
	});
	/*播放器操作事件*/
	ipcMain.on('player-control', (event, type, data) => {
		switch (type) {
			case 'audio':
				if (data === 'pause') {
					musicButtons[1].icon = pauseBtn;
					musicButtons[1].tooltip = '暂停';
				} else {
					musicButtons[1].icon = playBtn;
					musicButtons[1].tooltip = '播放';
				}
				global.getWindow('diskMusicPlayer').setThumbarButtons(musicButtons);
				break;
			case 'video':
				if (data === 'pause') {
					videoButtons[1].icon = pauseBtn;
					videoButtons[1].tooltip = '暂停';
				} else {
					videoButtons[1].icon = playBtn;
					videoButtons[1].tooltip = '播放';
				}
				global.getWindow('diskVideoPlayer').setThumbarButtons(videoButtons);
				break;
		}
	});
}
function listenOpen() {
	global.getWindow('diskOfficeViewer').webContents.on('new-window', (e, url, frameName, disposition, options, additionalFeatures) => {
		// 阻止创建默认窗口
		e.preventDefault();
		shell.openExternal(url);
	});
}

export default {
	activate() {
		if (loginWindow === null) {
			diskSystem.loginWindow();
		}
	},
	ready() {
		bindIpc();
		localFile.read(
			'login',
			(data, err) => {
				if (err) {
					diskSystem.loginWindow(null);
				} else {
					if (data.username) {
						diskSystem.mainWindow(data);
					} else {
						diskSystem.loginWindow();
					}
				}
			},
			true
		);
	},
	second() {
		if (loginWindow) {
			loginWindow.show();
			loginWindow.restore();
			loginWindow.focus();
			return;
		}
		if (mainWindow) {
			mainWindow.show();
			mainWindow.restore();
			mainWindow.focus();
		}
	},
	cloudWindow: function (options) {
		windowControl.cloudWindow(
			options,
			() => {
				options.eleCallback && eval(options.eleCallback);
			},
			() => {
				options.eleClose && eval(options.eleClose);
			}
		);
	},
};
