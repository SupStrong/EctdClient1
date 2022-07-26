const fs = require('fs');
const path = require('path');
let secret = '';
import { ipcMain, app, dialog } from 'electron';
const child_process = require('child_process');
const platform = process.platform;
const arch = process.arch;
import projectInfo from '../projectInfo';
export default {
	init() {
		const aria2dir = path.resolve(__static, 'aria2/aria2cli');
		// let sessionFile = path.join(aria2dir, 'aria2.session');
		const aria2home = path.join(app.getPath('appData')) + '/CloudSeries/' + projectInfo.default.projectName;
		let aria2Cli = null;
		let preFix = process.env.NODE_ENV !== 'production' ? '' : '../';
		if (platform === 'win32') {
			aria2Cli = path.resolve(__static, `${preFix}aria2/aria2-1.33.1-win-${arch}/aria2c.exe`);
		} else if (platform === 'darwin') {
			aria2Cli = path.resolve(__static, `${preFix}aria2/aria2-1.33.1-mac-x64/aria2c`);
		} else {
			aria2Cli = path.resolve(__static, `${preFix}aria2/aria2-1.33.1-linux-x64/aria2c`);
		}
		const aria2DownloadDir = app.getPath('downloads');

		if (!fs.existsSync(aria2home)) {
			fs.mkdirSync(aria2home);
		}
		let sessionFile = path.join(aria2home, 'aria2.session');
		let aria2ConfFile = path.join(aria2home, 'aria2.conf');
		if (!fs.existsSync(sessionFile)) {
			fs.copyFileSync(path.join(aria2dir, 'aria2.session'), sessionFile);
		}
		if (!fs.existsSync(aria2ConfFile)) {
			fs.copyFileSync(path.join(aria2dir, 'aria2.conf'), aria2ConfFile);
		}
		secret = Math.random().toString(32).substr(2);
		if (fs.existsSync(aria2ConfFile)) {
			let confContent = fs.readFileSync(aria2ConfFile).toString();
			let c = confContent.replace(/\\n/g, '\n').replace(/#.+/g, '');
			let m = c.match(/rpc-secret=(.+)/i);
			if (m && m.length > 1) {
				secret = m[1];
			} else {
				confContent = confContent.replace(/rpc-secret=(.+)/i, 'rpc-secret=' + secret);
				fs.writeFileSync(aria2ConfFile, confContent);
			}
		}

		const aria2Conf = [
			'--dir',
			aria2DownloadDir,
			'--conf-path',
			aria2ConfFile,
			'--input-file',
			sessionFile,
			'--save-session',
			sessionFile,
			// '--max-concurrent-downloads', 10,
			// '--max-connection-per-server', 16,
			// '--min-split-size', '1024K',
			// '--split', 16,
			// '--max-overall-download-limit', '0K',
			// '--max-overall-upload-limit', '0K',
			// '--max-download-limit', '0K',
			// '--max-upload-limit', '0K',
			// '--continue', 'true',
			// '--auto-file-renaming', 'true',
			// '--allow-overwrite', 'true',
			// '--disk-cache', '0M',
			// '--max-tries', 0,
			// '--retry-wait', 5,
			'--rpc-secret',
			secret,
		];

		let aria2Status = null;
		let aria2Running = false;
		const startAria2 = function () {
			if (fs.existsSync(aria2Cli) || (platform === 'win32' && fs.existsSync(aria2Cli))) {
				console.log('rpc-secret: ', secret);
				const worker = child_process.spawn(aria2Cli, aria2Conf);

				worker.stdout.on('data', function (data) {
					console.log(data.toString());
					if (data.toString().indexOf('Address already in use') >= 0) {
						aria2Status = {
							error: true,
							message: data.toString(),
						};
					} else if (data.toString().indexOf('IPv4 RPC: listening on TCP port') >= 0) {
						aria2Status = {
							error: false,
							message: data.toString(),
						};
					}
				});

				process.on('exit', function () {
					worker.killed || worker.kill();
				});
				return process;
			}
			return null;
		};

		ipcMain.on('get-aria2-status', function (e) {
			e.returnValue = aria2Status;
			aria2Status = null;
		});
		ipcMain.on('start-aria2-cli', function (e) {
			if (!aria2Running) {
				startAria2();
				aria2Running = true;
			}
			e.returnValue = {
				aria2Running,
				secret,
				aria2DownloadDir,
			};
		});
		ipcMain.on('change-aria2-dir', function (e, data) {
			dialog
				.showOpenDialog({
					title: '选择下载目录',
					defaultPath: data || aria2DownloadDir,
					properties: ['openDirectory', 'createDirectory '],
				})
				.then((result) => {
					e.returnValue = result;
				})
				.catch((err) => {});
		});
	},
};
