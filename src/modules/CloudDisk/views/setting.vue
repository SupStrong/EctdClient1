<template>
	<div class="cloud-disk-setting">
		<windowHeader :config="header" />
		<div class="main">
			<ul class="menu">
				<li v-for="(item, index) in settingMenuData" :key="index" :class="{ active: item.active }" @click="change(item, index)">
					<span :class="item.icon" />
					<p>{{ item.name }}</p>
				</li>
			</ul>
			<div class="content">
				<template v-if="settingMenuData.System.active">
					<p class="title">系统设置</p>
					<p class="sec-title">开机自启动</p>
					<div class="setting-item">
						<Checkbox v-model="settingData.autoStartFlag">&nbsp;系统启动后自动运行C-Disk</Checkbox>
					</div>
				</template>
				<template v-else-if="settingMenuData.Trans.active">
					<p class="title">传输设置</p>
					<p class="sec-title">下载目录设置</p>
					<div class="setting-item">
						当前目录：{{ settingData.transDownFolder }}
						<button @click="changeTransAddress">[修改]</button>
					</div>
					<p class="tips">*磁盘根目录可能无权限操作</p>
					<p class="sec-title">同时上传数</p>
					<div class="setting-item">
						<InputNumber :max="5" :min="1" v-model="settingData.maxUpTrans" />
					</div>
					<p class="sec-title">同时下载数</p>
					<div class="setting-item" style="margin-bottom: 0">
						<InputNumber :max="5" :min="1" v-model="settingData.maxDownTrans" />
					</div>
					<p class="tips">*请不要在正在下载文件的情况下修改下载目录</p>
					<p class="tips">*修改目录在下次登录生效</p>
				</template>
				<template v-else-if="settingMenuData.Notice.active">
					<p class="title">提醒设置</p>
					<p class="sec-title">弹窗提醒</p>
					<div class="setting-item">
						<Checkbox v-model="settingData.noticeBubble">&nbsp;传输完成后气泡提示</Checkbox>
					</div>
					<p class="sec-title">声音提醒</p>
					<div class="setting-item" style="width: 100%">
						<Checkbox v-model="settingData.noticeFlag">&nbsp;传输完成后声音提醒</Checkbox>
					</div>
					<div class="setting-item" style="width: 100%">
						<RadioGroup v-model="settingData.noticeVoice" @on-change="voiceChange">
							<Radio label="音效一" :disabled="!settingData.noticeFlag" />
							<Radio label="音效二" :disabled="!settingData.noticeFlag" />
							<Radio label="音效三" :disabled="!settingData.noticeFlag" />
							<Radio label="音效四" :disabled="!settingData.noticeFlag" />
						</RadioGroup>
						<audio :src="voiceSrc" ref="audio" />
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DiskSetting',
	watch: {
		settingData: {
			handler() {
				this.$ipc.send('system', 'auto-launch', this.settingData.autoStartFlag);
				this.$api.localFile.write('setting', this.settingData);
			},
			deep: true,
		},
	},
	data() {
		return {
			header: {
				color: '#4f4f4',
				title: 'C-DISK设置',
				head: false,
				resize: false,
				mini: false,
			},
			settingMenuData: {
				System: {
					active: true,
					name: '系统',
					icon: 'sf-icon-hashtag',
				},
				Trans: {
					active: '',
					name: '传输',
					icon: 'sf-icon-exchange',
				},
				Notice: {
					active: '',
					name: '提醒',
					icon: 'sf-icon-bell',
				},
			},
			voiceSrc: '', //提醒测试音效.
			settingData: {
				autoStartFlag: false,
				transDownFolder: '',
				maxUpTrans: 3,
				maxDownTrans: 3,
				noticeBubble: true, //气泡提示
				noticeFlag: true, //提醒声音
				noticeVoice: '音效一', //哪个提醒声音
			},
			defaultFolder: null,
			loading: '',
		};
	},
	created() {
		this.defaultFolder = (this.$electron.remote ? this.$electron.remote : this.$electron).app.getPath('downloads');
		this.GetLocalSetting();
	},
	methods: {
		change(item, index) {
			for (let i in this.settingMenuData) {
				this.settingMenuData[i].active = false;
			}
			this.settingMenuData[index].active = true;
		},
		GetLocalSetting() {
			this.$api.localFile.read('setting', (data) => {
				if (data.transDownFolder !== undefined) {
					this.$nextTick(() => {
						this.settingData = data;
					});
				} else {
					this.settingData.transDownFolder = this.defaultFolder;
					this.$api.localFile.write('setting', this.settingData);
				}
				switch (this.settingData.noticeVoice.substr(-5)) {
					case '1.wav':
						this.settingData.noticeVoice = '音效一';
						break;
					case '2.wav':
						this.settingData.noticeVoice = '音效二';
						break;
					case '3.wav':
						this.settingData.noticeVoice = '音效三';
						break;
					case '4.wav':
						this.settingData.noticeVoice = '音效四';
						break;
				}
			});
		},
		voiceChange(a) {
			switch (a) {
				case '音效一':
					this.voiceSrc = this.$path.join(__static, '/CloudDisk/voice/1.wav');
					break;
				case '音效二':
					this.voiceSrc = this.$path.join(__static, '/CloudDisk/voice/2.wav');
					break;
				case '音效三':
					this.voiceSrc = this.$path.join(__static, '/CloudDisk/voice/3.wav');
					break;
				case '音效四':
					this.voiceSrc = this.$path.join(__static, '/CloudDisk/voice/4.wav');
					break;
			}
			this.playVoice();
			localStorage.noticeVoice = this.voiceSrc;
		},
		playVoice() {
			this.$refs.audio.currentTime = 0;
			this.$refs.audio.pause();
			this.$refs.audio.load();
			let a = setTimeout(() => {
				this.$refs.audio.play();
				clearTimeout(a);
			}, 200);
		},
		changeTransAddress() {
			this.$electron.remote.dialog
				.showOpenDialog({
					title: '选择文件下载目录',
					//默认路径
					defaultPath: '../Desktop',
					//选择操作，此处是打开文件夹
					properties: ['openDirectory'],
					filters: [{ name: 'All', extensions: ['*'] }],
				})
				.then((res) => {
					res = res.filePaths;
					res = (res[0] && res[0]) || this.defaultFolder;
					//回调函数内容，此处是将路径内容显示在input框内
					this.settingData.transDownFolder = res;
				});
		},
	},
};
</script>

<style scoped lang="scss">
/*设置窗口*/
.cloud-disk-setting {
	width: 100%;
	height: 100%;
	background: #fff;
	display: flex;
	flex-direction: column;
	.menu {
		width: 100px;
		height: 100%;
		overflow: unset !important;
		li {
			width: 100%;
			height: 35px;
			background: #fff;
			color: #6e6e6e;
			border-radius: 5px 0 0 5px;
			border: 1px solid #fff;
			display: flex;
			align-items: center;
			line-height: 35px;
			&.active {
				width: calc(100% + 1px);
				border: 1px solid #eee;
				border-right: none;
				color: #6e6e6e !important;
				cursor: default !important;
				position: relative;
			}
			&:hover {
				color: $diskMainColor;
				cursor: pointer;
			}
			span {
				width: 35px;
				height: 35px;
				text-align: center;
			}
			p {
				width: calc(100% - 60px);
			}
		}
	}
	.main {
		width: 100%;
		height: 100%;
		padding: 10px;
		display: flex;
		.content {
			width: 100%;
			height: 100%;
			flex: 1;
			border: 1px solid #eee;
			padding-left: 20px;
			border-radius: 0 5px 5px 5px;
			.title {
				width: 100%;
				font-size: 16px;
				line-height: 35px;
				margin-bottom: 10px;
				color: $diskMainColor;
			}
			.sec-title {
				width: 100%;
				font-size: 14px;
				border-left: 2px solid $diskMainColor;
				text-indent: 5px;
				margin-top: 10px;
			}
			.tips {
				color: #e83c3c;
				width: 100%;
				font-size: 12px;
				margin-top: 5px;
			}
			.setting-item {
				margin: 10px 0;
				display: flex;
				align-items: center;
				padding-left: 10px;
				.ivu-input-wrapper,
				.setting-item .ivu-input-number {
					margin: 5px 0;
				}
				button {
					background: none;
					color: $diskMainColor;
					font-size: 14px;
					margin-left: 10px;
				}
			}
		}
	}
}
.ivu-input-number,
.ivu-input-number-input,
.ivu-input-number-input-wrap {
	overflow: hidden !important;
}
</style>
