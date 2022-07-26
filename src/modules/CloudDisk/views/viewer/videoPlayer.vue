<script src="../../../../../../../ClientProject/aplayer_1.0.0/resources/app/main.js"></script>
<template>
	<div class="cloud-disk-video-player">
		<windowHeader :config="header" />
		<div class="video-main" ref="VideoPlayer" :class="{ haveBar: platform !== 'browser', full: fullScreenFlag }">
			<video
				ref="video"
				crossorigin="*"
				@error="videoError"
				@ended="videoEnded"
				@dblclick="FullScreen"
				@click="videoPlayerCommend('play')"
				@progress="videoCache"
				@timeupdate="videoProcess"
				@durationchange="playerState.button = 'sf-icon-pause'"
				@seeking="playerState.button = 'sf-icon-circle-notch sf-spin'"
				@canplay="videoPlayerCommend('play')"
				:src="nowPlay.playUrl"
			></video>
			<div class="control-bar" @mouseenter="mouseInBar = true" @mouseleave="mouseInBar = false" :style="{ bottom: hideBar && !mouseInBar ? '-65px' : 0 }">
				<div class="slider-container">
					<div class="progress">
						<div class="container" @mousedown="timeChange" ref="slider">
							<div class="slider" :style="{ width: playerState.processWidth }"></div>
						</div>
					</div>
					<div class="volume">
						<div class="icon sf-icon-volume-up"></div>
						<div class="container" ref="volume" @mousedown="changeVolume">
							<div class="slider"></div>
						</div>
					</div>
				</div>
				<div class="button-container">
					<div class="left">
						<button :class="playerState.button" @click="videoPlayerCommend('play')"></button>
						<button class="sf-icon-stop"></button>
						<button class="sf-icon-step-backward" @click="videoPlayerCommend('prev')"></button>
						<button class="sf-icon-step-forward" @click="videoPlayerCommend('next')"></button>
						<div class="time">
							{{ playerState.timeText }}
						</div>
					</div>
					<div class="right">
						<button class="sf-icon-bars" @click="activeMenu = !activeMenu"></button>
					</div>
				</div>
			</div>
			<div class="control-bar" v-if="hideBar" style="opacity: 0" @mouseenter="hideBar = false"></div>
			<div class="right-menu" :style="{ right: activeMenu && !hideBar ? '0' : '-250px' }">
				<ul>
					<li v-for="(item, index) in playList" :title="item.name" :key="index" :class="{ active: nowPlay.count === index }" @click="playCallBack(item, index)">
						{{ index + 1 }}.{{ item.name }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
let hideTimer = null;
import mediaControl from '../../../../common/media/mediaControl';
export default {
	name: 'videoPlayer',
	data() {
		return {
			header: {
				title: '',
				color: '#fff',
				background: '#1e1e1e',
			},
			mediaControl: false,
			activeMenu: false,
			playList: [],
			nowPlay: {
				name: '准备播放',
				count: 0,
			},
			playerState: {
				timeText: '00:00/00:00',
				processWidth: 0,
				cacheWidth: 0,
				button: 'sf-icon-play',
				volumeState: false,
			},
			platform: this.$projectEnv.platform,
			fullScreenFlag: false,
			hideBar: false,
			mouseInBar: false,
		};
	},
	watch: {
		mouseInBar: function (now) {
			if (now && this.fullScreenFlag) {
				hideTimer && clearTimeout(hideTimer);
				hideTimer = setTimeout(() => {
					this.hideBar = true;
					clearTimeout(hideTimer);
				}, 3000);
			}
		},
		fullScreenFlag: function (now, old) {
			hideTimer && clearTimeout(hideTimer);
			if (now === true) {
				hideTimer = setTimeout(() => {
					this.hideBar = true;
					clearTimeout(hideTimer);
				}, 3000);
			} else {
				this.hideBar = false;
			}
		},
	},
	created() {
		if (this.$isElectron) {
			this.$ipc.on('win-data', (event, data) => {
				//接收打开视频文件的数据
				this.init(data);
			});
			this.$ipc.on('video-prev', () => {
				this.videoPlayerCommend('prev');
			});
			this.$ipc.on('video-play', () => {
				this.videoPlayerCommend('play');
			});
			this.$ipc.on('video-next', () => {
				this.videoPlayerCommend('next');
			});
		}
	},
	beforeDestroy() {
		document.removeEventListener('fullscreenchange', () => {}, true);
	},
	methods: {
		init(data) {
			this.$nextTick(() => {
				data.forEach((item, index) => {
					if (item.active) {
						this.playCallBack(item, index);
						this.videoPlayerCommend('play');
					}
				});
				this.playList = data;
				let video = this.$refs.video;
				this.mediaControl = mediaControl.init(video);
				document.addEventListener('fullscreenchange', (event) => {
					// document.fullscreenElement存在即为全屏
					// is in fullscreen mode if there is one. If there isn't one,
					// the value of the property is null.
					this.fullScreenFlag = !!document.fullscreenElement;
				});
			});
		},
		playCallBack(item, index) {
			this.nowPlay = item;
			this.nowPlay.count = index;
			this.nowPlay.playUrl = this.$api.public.uploadUrl('disk', item.content);
		},
		changeTime(state) {
			this.mediaControl.timeControl(state);
		},
		videoPlayerCommend(commend) {
			if (!this.playList.length) {
				return;
			}
			this.activeMenu = false;
			let nowCount = this.nowPlay.count;
			let allCount = this.playList.length;
			switch (commend) {
				case 'prev':
					if (nowCount !== 0) {
						this.playCallBack(this.playList[nowCount - 1], nowCount - 1);
					}
					break;
				case 'next':
					if (nowCount !== allCount - 1) {
						this.playCallBack(this.playList[nowCount + 1], nowCount + 1);
					} else {
						this.videoPlayerCommend('play');
					}
					break;
				case 'play':
					let media = this.$refs.video;
					if (media.paused) {
						media.play();
						this.playerState.button = 'sf-icon-pause';
						this.animation = 'animated zoomOut';
						if (this.$isElectron) {
							this.$ipc.send('player-control', 'video', 'pause');
						}
					} else {
						media.pause();
						this.playerState.button = 'sf-icon-play';
						this.animation = 'animated zoomIn';
						if (this.$isElectron) {
							this.$ipc.send('player-control', 'video', 'play');
						}
					}
					this.header.title = this.nowPlay.name;
					break;
			}
		},
		changeVolume(e) {
			let volume = this.$refs.volume;
			this.mediaControl.volumeControl(volume, e, 'x');
		},
		videoEnded() {
			let media = this.$refs.video;
			media.currentTime = 0;
			this.videoPlayerCommend('play');
		},
		timeChange(e) {
			let slider = this.$refs.slider;
			this.mediaControl.timeControl(slider, e);
		},
		videoProcess() {
			this.playerState.timeText = this.mediaControl.time();
			this.playerState.processWidth = this.mediaControl.progress();
		},
		videoCache() {
			this.playerState.cacheWidth = this.mediaControl.cacheProgress();
		},
		ShowControl() {
			if (this.FullFlag) {
				this.BarAnimation = 'animated slideInUp';
				this.VideoHeight = 'calc(100% - 70px)';
			}
		},
		HideControl() {
			if (this.FullFlag) {
				clearTimeout(this.TimeOutID);
				this.TimeOutID = setTimeout(() => {
					this.BarAnimation = 'animated fadeOut';
					this.VideoHeight = '100%';
					clearTimeout(this.TimeOutID);
				}, 5000);
			}
		},
		FullScreen() {
			let element = this.$refs.VideoPlayer;
			if (this.fullScreenFlag) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			} else {
				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.webkitRequestFullScreen) {
					element.webkitRequestFullScreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.msRequestFullscreen) {
					// IE11
					element.msRequestFullscreen();
				}
			}
		},
		videoError(e) {
			this.$Message.error(e);
		},
	},
};
</script>

<style scoped lang="scss">
.cloud-disk-video-player {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
	border: 1px solid #000;
	position: relative;
	.video-main {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		flex-direction: column;
		flex: 1;
		video {
			width: 100%;
			height: calc(100% - 65px);
			background: #000;
		}
		.control-bar {
			width: 100%;
			height: 65px;
			background: #1e1e1e;
			display: flex;
			align-items: center;
			flex-direction: column;
			transition: all 350ms;
			z-index: 1;
			.slider-container {
				width: 100%;
				height: 20px;
				border-bottom: 1px solid #000;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 10px;
				.progress {
					width: 100%;
					flex: 1;
				}
				.volume {
					width: 120px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #777777;
					padding-left: 10px;
					.icon {
						font-size: 10px;
						margin-right: 5px;
					}
				}
				.container {
					width: 100%;
					height: 3px;
					background: #444444;
					.slider {
						width: 100%;
						height: 100%;
						background: #fae100;
						position: relative;
					}
				}
				.slider:after {
					content: '';
					width: 8px;
					height: 8px;
					position: absolute;
					background: #f0f0f0;
					border-radius: 100%;
					right: -3px;
					top: -2px;
				}
			}
			.button-container {
				width: 100%;
				height: 45px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left,
				.right {
					width: 50%;
					display: flex;
					align-items: center;
				}
				.right {
					justify-content: flex-end;
				}
				* {
					height: 45px;
					line-height: 45px;
					color: #f0f0f0;
				}
				button {
					width: 45px;
					background: #1e1e1e;
					font-size: 12px;
					border-left: 1px solid #000;
				}
				.time {
					padding: 0 10px;
					font-size: 10px;
					border-left: 1px solid #000;
				}
			}
		}
		.right-menu {
			width: 250px;
			height: 100%;
			padding-bottom: 70px;
			transition: all 350ms;
			position: absolute;
			right: 0;
			background: #444;
			z-index: 0;
			ul {
				width: 100%;
				height: 100%;
				overflow: auto;
				li {
					width: 100%;
					height: 35px;
					line-height: 35px;
					font-size: 12px;
					color: #b5b5b5;
					padding: 0 5px;
					white-space: nowrap;
					text-overflow: ellipsis;
					word-break: break-all;
					overflow: hidden;
					margin: 1px auto;
					cursor: pointer;
					&:hover {
						background: #353535;
						color: #fff;
					}
					&.active {
						background: #353535;
						color: #38f;
					}
				}
			}
		}
		&.full {
			video {
				height: 100%;
			}
			.control-bar {
				position: absolute;
				bottom: 0;
			}
		}
	}
	.haveBar {
		height: calc(100% - 30px);
	}
}
</style>
