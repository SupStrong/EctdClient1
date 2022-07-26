<template>
	<div class="cloud-disk-music-player" tabindex="-1" @mousedown="playerState.volumeState = false">
		<windowHeader :config="header" />
		<!--控制-->
		<div class="container">
			<div class="title">{{ nowPlay.name }}</div>
			<ul class="control">
				<li class="btn-hide" />
				<li class="btn-small sf-icon-step-backward" @click="playerCommend('prev')" />
				<li :class="'btn-big ' + playerState.button" @click="playerCommend('play')" />
				<li class="btn-small sf-icon-step-forward" @click="playerCommend('next')" />
				<li
					class="btn-hide sf-icon-volume-up"
					@mousedown.stop="playerState.volumeState ? (playerState.volumeState = false) : (playerState.volumeState = true)"
				/>
			</ul>
			<div class="volume-bar" v-show="playerState.volumeState" @mousedown.stop="playerState.volumeState = true">
				<div class="volume-container" ref="volume" @mousedown="changeVolume">
					<div class="slider">
						<span class="dots" />
					</div>
				</div>
			</div>
			<div class="time">
				<div id="cloud-music-lrc-list"></div>
				<span>{{ playerState.timeText }}</span>
			</div>
			<div class="progress" @mousedown="timeChange" ref="slider">
				<div class="slider" :style="{ width: playerState.processWidth }">
					<span class="dots" />
				</div>
			</div>
			<canvas width="350" height="240" id="canvas" />
		</div>
		<audio
			preload="auto"
			ref="audio"
			@ended="playerCommend('next')"
			@timeupdate="musicProcess"
			@error="playerCommend('next')"
			@durationchange="playerState.button = 'sf-icon-pause'"
			@seeking="playerState.button = 'sf-icon-circle-notch sf-spin'"
			@canplay="playerCommend('play')"
			:src="nowPlay.playUrl"
			id="audio"
			crossOrigin="anonymous"
		/>
		<!--播放列表-->
		<ul class="list">
			<li v-for="(item, index) in playList" :key="index" :class="{ active: nowPlay.count === index }" @click="playCallBack(item, index)">
				{{ 9 > index ? '0' : '' }}{{ index + 1 }} {{ item.name }}
			</li>
		</ul>
	</div>
</template>

<script>
import mediaControl from '../../../../common/media/mediaControl';
export default {
	name: 'musicPlayer',
	data() {
		return {
			header: {
				color: '#4f4f4',
				hideTitle: true,
				title: '',
				head: false,
				resize: false,
				mini: true,
			},
			audio: null,
			mediaControl: false,
			playList: [],
			nowPlay: {
				name: '准备播放',
				count: 0,
			},
			playerState: {
				timeText: '00:00/00:00',
				processWidth: 0,
				button: 'sf-icon-play',
				visualState: true,
				volumeState: false,
			},
			handle: null,
			/* 定时执行句柄 */
			list: [],
			/* lrc歌词及时间轴数组 */
			regex: /^[^\[]*((?:\s*\[\d+\:\d+(?:\.\d+)?\])+)([\s\S]*)$/,
			/* 提取歌词内容行 */
			regex_time: /\[(\d+)\:((?:\d+)(?:\.\d+)?)\]/g,
			/* 提取歌词时间轴 */
			regex_trim: /^\s+|\s+$/,
			/* 过滤两边空格 */
			callback: null,
			/* 定时获取歌曲执行时间回调函数 */
			interval: 0.3,
			/* 定时刷新时间，单位：秒 */
			format: '<li>{html}</li>',
			/* 模板 */
			prefixid: 'cloud-music-lrc-list',
			/* 容器ID */
			hoverClass: 'this_lrc',
			/* 选中节点的className */
			hoverTop: 100,
			/* 当前歌词距离父节点的高度 */
			duration: 0,
			/* 歌曲回调函数设置的进度时间 */
			duration_: -1,
		};
	},
	created() {
		if (this.$isElectron) {
			this.$ipc.on('win-data', (event, data) => {
				//接收音乐文件列表的数据
				this.init(data);
			});
			this.$ipc.on('Next', () => {
				this.playerCommend('next');
			});
			this.$ipc.on('Prev', () => {
				this.playerCommend('prev');
			});
			this.$ipc.on('Play', () => {
				this.playerCommend('play');
			});
		}
	},
	beforeDestroy() {
		clearInterval(this.handle);
		this.initKeyDown('stop');
	},
	methods: {
		init(data) {
			this.$nextTick(() => {
				data.forEach((item, index) => {
					if (item.active) {
						this.playCallBack(item, index);
						this.playerCommend('play');
					}
				});
				this.playList = data;
				this.audio = this.$refs.audio;
				this.mediaControl = mediaControl.init(this.audio);
				this.initKeyDown();
			});
		},
		initKeyDown(flag) {
			if (flag === 'stop') {
				this.$el.removeEventListener('keydown', () => {}, true);
				return;
			}
			this.$el.addEventListener('keydown', (e) => {
				if (e.key === ' ') {
					this.playerCommend('play');
				} else if (e.key === 'ArrowLeft') {
					this.changeTime('-');
				} else if (e.key === 'ArrowRight') {
					this.changeTime('+');
				}
			});
		},
		playCallBack(item, index) {
			this.nowPlay = item;
			this.nowPlay.count = index;
			this.nowPlay.playUrl = this.$api.public.uploadUrl('disk', item.content);
			this.getLyr();
		},
		changeTime(state) {
			this.mediaControl.timeControl(state);
		},
		playerCommend(commend) {
			if (!this.playList.length) {
				return;
			}
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
						this.playerCommend('play');
					}
					break;
				case 'play':
					if (this.audio.paused) {
						this.audio.play();
						this.playerState.button = 'sf-icon-pause';
						if (this.$isElectron) {
							this.$ipc.send('player-control', 'audio', 'pause');
						}
					} else {
						this.audio.pause();
						this.playerState.button = 'sf-icon-play';
						if (this.$isElectron) {
							this.$ipc.send('player-control', 'audio', 'play');
						}
					}
					this.header.title = this.nowPlay.name;
					if (this.playerState.visualState) {
						this.mediaControl.musicVisual('canvas', () => {
							this.playerState.visualState = false;
						});
					}
					break;
			}
		},
		changeVolume(e) {
			let volume = this.$refs.volume;
			this.mediaControl.volumeControl(volume, e);
		},
		timeChange(e) {
			let slider = this.$refs.slider;
			this.mediaControl.timeControl(slider, e);
		},
		musicProcess() {
			this.playerState.timeText = this.mediaControl.time();
			this.playerState.processWidth = this.mediaControl.progress();
		},
		getLyr() {
			this.$api.disk.lrc(
				{
					name: this.nowPlay.name,
				},
				(rs) => {
					if (rs.data.lrc && rs.data.lrc.lyric) {
						let data = rs.data.lrc.lyric;
						this.start(data, () => {
							return this.audio.currentTime;
						});
					}
				}
			);
		},
		start(txt, callback) {
			if (typeof txt !== 'string' || txt.length < 1 || typeof callback !== 'function') return; /* 停止前面执行的歌曲 */
			this.stop();
			this.callback = callback;
			let item = null,
				item_time = null,
				html = ''; /* 分析歌词的时间轴和内容 */
			txt = txt.split('\n');
			for (let i = 0; i < txt.length; i++) {
				item = txt[i].replace(this.regex_trim, '');
				if (item.length < 1 || !(item = this.regex.exec(item))) continue;
				while ((item_time = this.regex_time.exec(item[1]))) {
					this.list.push([parseFloat(item_time[1]) * 60 + parseFloat(item_time[2]), item[2]]);
				}
				this.regex_time.lastIndex = 0;
			} /* 有效歌词 */
			if (this.list.length > 0) {
				/* 对时间轴排序 */
				this.list.sort(function (a, b) {
					return a[0] - b[0];
				});
				if (this.list[0][0] >= 0.1) this.list.unshift([this.list[0][0] - 0.1, '']);
				this.list.push([this.list[this.list.length - 1][0] + 1, '']);
				for (let i = 0; i < this.list.length; i++) html += this.format.replace(/\{html\}/gi, this.list[i][1]); /* 赋值到指定容器 */
				document.getElementById(this.prefixid).innerHTML = html;
				/* 定时调用回调函数，监听歌曲进度 */
				if (typeof callback() === 'number') {
					this.handle = setInterval(() => {
						this.jump(callback());
					}, this.interval * 1000);
				}
			} else {
				/* 没有歌词 */
			}
		},
		/* 跳到指定时间的歌词 */
		jump(duration) {
			if (typeof this.handle !== 'number' || typeof duration !== 'number' || this.list.length < 1) return false;
			if (duration < 0) duration = 0;
			if (this.duration_ === duration) return;
			duration += 0.2;
			this.duration_ = duration;
			duration += this.interval;

			let left = 0,
				right = this.list.length - 1,
				last = right,
				pivot = Math.floor(right / 2),
				tmpobj = null,
				tmp = 0,
				thisobj = this;
			/* 二分查找 */
			while (left <= pivot && pivot <= right) {
				if (this.list[pivot][0] <= duration && (pivot === right || duration < this.list[pivot + 1][0])) {
					//if(pivot === right) this.stop();
					break;
				} else if (this.list[pivot][0] > duration) {
					/* left */
					right = pivot;
				} else {
					/* right */
					left = pivot;
				}
				tmp = left + Math.floor((right - left) / 2);
				if (tmp === pivot) break;
				pivot = tmp;
			}
			if (pivot === this.pivot) return;
			this.pivot = pivot;
			tmpobj = document.getElementById(this.prefixid).childNodes;
			for (let i = 0; i < tmpobj.length; i++) {
				tmpobj[i].className = this.prefixid;
			}
			if (tmpobj[pivot]) {
				tmpobj[pivot].className += ' ' + thisobj.hoverClass;
				/*tmp = tmpobj[pivot + 1].offsetTop - tmpobj[pivot].parentNode.offsetTop - this.hoverTop;
                    tmp = tmp > 0 ? tmp * 1 : 0;//如果不设置滚动条使用margin设置为-1
                    tmpobj[pivot].parentNode.scrollTop = tmp;//这里可以用margintop*/
			}
		},
		/* 停止执行歌曲 */
		stop() {
			if (typeof this.handle === 'number') clearInterval(this.handle);
			this.handle = this.callback = null;
			this.duration_ = -1;
			this.regex_time.lastIndex = 0;
			this.list = [];
		},
	},
};
</script>

<style scoped lang="scss">
.cloud-disk-music-player {
	background-color: #fff;
	width: 100%;
	height: 100%;
	.container {
		width: 100%;
		height: 150px;
		border-bottom: 2px solid $diskMainColor;
		-webkit-app-region: drag;
		canvas {
			position: absolute;
			top: 0;
			z-index: 0;
			opacity: 0.75;
		}
		.control {
			width: 252px;
			height: 60px;
			margin: 0 auto;
			position: relative;
			z-index: 1;
			li {
				float: left;
				-webkit-app-region: no-drag;
			}
			.btn-big,
			.btn-small {
				border: 2px solid $diskMainColor;
				display: block;
				border-radius: 25px;
				text-align: center;
				color: $diskMainColor;
				font-size: 18px;
				cursor: pointer;
			}
			.btn-big:hover,
			.btn-small:hover {
				opacity: 0.8;
			}
			.btn-big {
				width: 50px;
				height: 50px;
				line-height: 46px;
				background: $diskMainColor;
				color: #fff;
			}
			.btn-small {
				width: 35px;
				height: 35px;
				line-height: 31px;
				font-size: 14px;
				margin: 8px;
			}
			.btn-hide {
				width: 30px;
				color: $diskMainColor;
				height: 30px;
				line-height: 30px;
				margin: 10px;
				font-size: 14px;
			}
		}
		.title {
			width: 100%;
			height: 35px;
			text-align: center;
			color: #585858;
			font-weight: 700;
			font-size: 14px;
			position: relative;
			z-index: 2;
		}
		.time {
			width: 91%;
			height: 25px;
			line-height: 20px;
			font-size: 12px;
			text-align: right;
			color: #585858;
			font-weight: bold;
			position: relative;
			z-index: 2;
		}
		.progress {
			width: 85%;
			margin: 0 auto;
			overflow: initial;
			height: 5px;
			background: #eee;
			border-radius: 5px;
			position: relative;
			z-index: 2;
			-webkit-app-region: no-drag;
			.slider {
				position: relative;
				z-index: 2;
				overflow: initial;
				width: 0;
				height: 5px;
				background: $diskMainColor;
				border-radius: 3px;
				display: flex;
				justify-content: flex-end;
			}
		}
	}
	.list {
		width: 100%;
		height: calc(100% - 180px);
		overflow-y: auto;
		background: #fff;
		position: relative;
		z-index: 1;
		li {
			width: 100%;
			height: 35px;
			line-height: 35px;
			color: #4a4a4a;
			border-top: 1px solid #dcdbdb;
			text-indent: 10px;
			font-size: 12px;
		}
		li:hover {
			color: $diskMainColor;
			cursor: pointer;
		}
		.active {
			color: $diskMainColor !important;
			background-color: #eaecf0;
		}
	}
	.volume-bar {
		width: 30px;
		height: 129px;
		background: #fff;
		position: absolute;
		right: 66px;
		top: 105px;
		padding: 12px;
		border: 1px solid #eee;
		z-index: 3;
		-webkit-app-region: no-drag;
		.volume-container {
			overflow: initial;
			width: 6px;
			height: 100px;
			background: #bbbbbb;
			border-radius: 3px;
			position: relative;
			bottom: 0;
			.slider {
				position: relative;
				top: 0;
				width: 100%;
				height: 100%;
				background: $diskMainColor;
				overflow: unset !important;
				.dots {
					right: 2px;
				}
			}
		}
	}
	.dots {
		position: relative;
		top: -2px;
		right: -2px;
		z-index: 1;
		display: block;
		width: 10px;
		height: 10px;
		border-radius: 10px;
		background: $diskMainColor;
	}
}
</style>
<style lang="scss">
#cloud-music-lrc-list {
	float: left;
	padding-left: 28px;
	width: 245px;
	height: 25px;
	font-size: 12px;
	color: #585858;
	transition: all 350ms;
	* {
		display: none;
	}
	.this_lrc {
		text-align: left;
		display: block !important;
		transition: all 350ms;
		animation-duration: 0.35s;
		animation-fill-mode: both;
		-webkit-animation-name: slideInUp;
		animation-name: slideInUp;
	}
}
</style>
