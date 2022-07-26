import Aria2Client from './aria2client';
import { ipcRenderer } from 'electron';
import { getStorage, setStorage } from './utils';
import { getDownloadSaveDir, isRemoteServer, setDownloadSaveDir } from './aria2utils';

const defaultServer = {
	id: 1,
	title: '本地默认',
	host: '127.0.0.1',
	port: 6800,
	secure: false,
	secret: window.location.hash.split('#')[1],
};
setStorage('ARIA2_LOCAL_SERVER', defaultServer);
let conf = getStorage('ARIA2_SERVER');
if (conf) {
	if (conf.id === 1) {
		conf = defaultServer;
		setStorage('ARIA2_SERVER', defaultServer);
	}
} else {
	conf = defaultServer;
}
export default {
	state: {
		actives: [],
		waitings: [],
		stopped: [],
		menu: 'active',
		online: false,
		isRemoteServer: isRemoteServer(),
	},
	aria2: null,
	callback: null,
	init(callback) {
		this.callback = callback;
		let enableAria2 = getStorage('enableAria2');
		if (enableAria2 || enableAria2 === null) {
			let data = ipcRenderer.sendSync('start-aria2-cli');
			conf.secret = data.secret;
			if (!getDownloadSaveDir()) {
				setDownloadSaveDir(data.aria2DownloadDir);
			}
		}
		this.checkAria2Status();
		this.aria2 = new Aria2Client({
			...conf,
			onRefresh: (data) => {
				this.setState({
					...data,
				});
			},
		});

		this.aria2.onConnect = async () => {
			this.aria2
				.getGlobalOption()
				.then((config) => {
					if (!getDownloadSaveDir()) {
						setDownloadSaveDir(config.dir);
					}
					// eventBus.emit('aria2_connect', config);
					this.setState({ online: true });
				})
				.catch((e) => {
					// message.error(`连接服务器失败: ${e.message}`);
					this.setState({ online: false });
				});
		};
		this.aria2.onClose = () => {
			this.setState({ online: false });
		};
		return this.aria2;
	},
	setState(state) {
		this.state = Object.assign(this.state, state);
		if (this.callback) {
			this.callback(this.state);
		}
	},
	checkAria2Status() {
		const status = ipcRenderer.sendSync('get-aria2-status');
		if (status && status.error) {
			const r = /failed to bind TCP port\s+([\d]+)/;
			const m = status.message.match(r);
			if (m && m[1]) {
				console.error('Aria2启动失败' + m[0]);
			}
		} else if (status) {
			const r = /listening on TCP port\s+(\d+)/;
			const m = status.message.match(r);
			if (m && m[1]) {
				console.log('Aria2启动成功' + m[0]);
			}
		}
	},
	componentWillMount() {
		setTimeout(() => {
			try {
				this.aria2.connect().catch(() => {
					const cfg = this.aria2.config;
					message.error(`无法连接到${cfg.host}:${cfg.port}`);
				});
			} catch (e) {
				console.log(e);
			}
		}, 1000);
		eventBus.on('server_change', (item) => {
			let cfg = getStorage('ARIA2_SERVER');
			console.log(cfg, item);
			if (cfg && cfg.id && cfg.id === item.id) {
				setStorage('ARIA2_SERVER', item);
				this.connectToServer(item);
			}
		});
	},

	async connectToServer(server) {
		const hide = message.loading(`正在连接到${server.host}:${server.port}...`, 0);
		this.setState({
			actives: [],
			waitings: [],
			stopped: [],
			isRemoteServer: isRemoteServer(),
		});
		try {
			await this.aria2.close();
			this.aria2.setOptions(server);
			await this.aria2.connect();
			hide();
		} catch (e) {
			console.log(e);
			hide();
			if (e && e.type === 'error') {
				message.error(`无法连接到${server.host}:${server.port}`);
			}
		}
	},
};
