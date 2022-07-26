<template>
	<div class="window-header" :style="styleObject" :class="[testMac ? 'darwin' : platform, { hide: mode === 'hide' }]">
		<template v-if="win || testMac">
			<div class="drag-top"></div>
			<div class="left">
				<span v-if="$isElectron && !config.hideTitle">{{ config.title }}</span>
				<slot name="left"></slot>
			</div>
			<ul class="window-actions" :style="{ color: styleObject.color }">
				<template v-if="testMac || platform === 'darwin'">
					<li class="mac-close mac-button" @click="close"></li>
					<li class="mac-resize mac-button" v-if="hasMini" @click="mini"></li>
					<li class="mac-mini mac-button" v-if="hasRestore" @click="restore"></li>
					<slot></slot>
				</template>
				<template v-else>
					<slot></slot>
					<li class="sf-icon-minus" :style="{ width: width }" v-if="hasMini" @click="mini" />
					<li :class="buttonState" :style="{ width: width }" v-if="hasRestore" @click="restore" />
					<li class="sf-icon-times" :style="{ width: width }" @click="close" />
				</template>
			</ul>
		</template>
		<template v-else>
			<div class="left">
				<span v-if="$isElectron && !config.hideTitle">{{ config.title }}</span>
				<slot name="left"></slot>
			</div>
			<div></div>
		</template>
	</div>
</template>

<script>
export default {
	name: 'windowHeader',
	props: {
		config: {
			type: Object,
			default: function () {
				return {};
			},
		},
		mode: {
			type: String,
			default: function () {
				return 'normal';
			},
		},
		width: {
			type: String,
			default: function () {
				return '45px';
			},
		},
	},
	watch: {
		config: {
			handler() {
				this.win && this.win.setTitle(this.config.title);
				let cloudWindow = this.$parent.$parent;
				if (cloudWindow) {
					if (cloudWindow.windowClass) {
						cloudWindow.config.title = this.config.title;
						cloudWindow.config.color = this.config.color;
						cloudWindow.config.background = this.config.background;
					} else {
						this.styleObject = {
							color: this.config.color ? this.config.color : '#333',
							background: this.config.background ? this.config.background : '',
							zIndex: this.config.index || 1,
						};
					}
				} else {
					this.styleObject = {
						color: this.config.color ? this.config.color : '#333',
						background: this.config.background ? this.config.background : '',
						zIndex: this.config.index || 1,
					};
				}
			},
			deep: true,
		},
	},
	data() {
		return {
			buttonState: 'sf-icon-window-maximize',
			styleObject: {},
			win: false,
			platform: process.platform,
			testMac: false,
		};
	},
	created() {
		if (this.$isElectron) {
			this.win = this.$electron.remote.getCurrentWindow();
			this.win.on('maximize', () => {
				this.buttonState = 'sf-icon-window-restore';
			});
			this.win.on('unmaximize', () => {
				this.buttonState = 'sf-icon-window-maximize';
			});
		}
		this.styleObject = {
			color: this.config.color ? this.config.color : '#333',
			background: this.config.background ? this.config.background : '',
			zIndex: this.config.index || 1,
		};
		//(this.$projectEnv === 'browser' && !this.testMac)
		if (!this.$isElectron && this.$projectEnv === 'browser') {
			this.styleObject.height = '0px';
		}
		this.config.resize = this.config.resize === undefined ? true : this.config.resize;
	},
	computed: {
		hasMini: function () {
			return this.config.mini === undefined ? true : this.config.mini;
		},
		hasRestore: function () {
			return this.config.resize === undefined ? true : this.config.resize;
		},
	},
	methods: {
		mini() {
			this.win.minimize();
		},
		close() {
			this.config.close ? this.config.close(this.win) : this.win.close();
		},
		restore() {
			if (this.platform === 'darwin') {
				this.win.setFullScreen(!this.win.isFullScreen());
			} else {
				if (this.win.isMaximized()) {
					this.win.restore();
				} else {
					this.win.maximize();
				}
			}
		},
	},
};
</script>

<style scoped lang="scss">
.darwin {
	flex-direction: row-reverse;
	.window-actions {
		margin-top: 13px !important;
	}
}
.hide {
	position: absolute !important;
	height: 2px !important;
	.window-actions {
		margin-top: 30px;
	}
}
.window-header {
	width: 100%;
	height: 30px;
	position: relative;
	z-index: 1;
	-webkit-app-region: drag;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.drag-top {
		width: 100%;
		height: 2px;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		-webkit-app-region: no-drag;
	}
	.left {
		font-size: 13px;
		line-height: 30px;
		padding: 0 5px;
		max-width: calc(100% - 120px);
		text-overflow: ellipsis;
		word-break: break-all;
		overflow: hidden;
		white-space: nowrap;
	}
	.window-actions {
		text-align: center;
		display: flex;
		align-items: center;
		-webkit-app-region: no-drag;
		li {
			width: 45px;
			height: 30px;
			line-height: 28px;
			font-size: 12px;
			-webkit-app-region: no-drag;
			cursor: pointer;
		}
		li:hover {
			background: rgba(0, 0, 0, 0.1);
		}
		.sf-icon-times {
			font-size: 16px;
		}
		.mac-button {
			width: 12px;
			height: 12px;
			border-radius: 100%;
			margin: 3px;
		}
		.mac-mini {
			background: #02c94c;
		}
		.mac-resize {
			background: #ffbd41;
		}
		.mac-close {
			background: #ff5e5f;
		}
	}
}
</style>
