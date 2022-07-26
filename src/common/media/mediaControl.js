function timeDeal(time) {
	let m = parseInt(time / 60) < 10 ? '0' + parseInt(time / 60) : parseInt(time / 60);
	let s = parseInt(time % 60) < 10 ? '0' + parseInt(time % 60) : parseInt(time % 60);
	return (isNaN(m) ? '00' : m) + ':' + (isNaN(s) ? '00' : s);
}
export default {
	media: false,
	init(media) {
		this.media = media;
		return this;
	},
	playList() {},
	timeControl(action, e) {
		if (typeof action === 'string') {
			if (action === '-') {
				this.media.currentTime = this.media.currentTime - 5;
			} else {
				this.media.currentTime = this.media.currentTime + 5;
			}
		} else {
			let slider = action;
			document.onmousedown = document.onmousemove = (e) => {
				this.media.currentTime = (this.media.duration * (e.pageX - slider.getBoundingClientRect().left)) / slider.offsetWidth;
			};
			document.onmouseup = function () {
				document.onmousedown = document.onmousemove = null;
			};
			this.media.currentTime = (this.media.duration * (e.pageX - slider.getBoundingClientRect().left)) / slider.offsetWidth;
		}
	},
	volumeControl(dom, e, direction = 'y') {
		function calculateSlider(e) {
			direction === 'y'
				? volume(Math.abs((e.pageY - dom.getBoundingClientRect().top) / dom.offsetHeight - 1))
				: volume((e.pageX - dom.getBoundingClientRect().left) / dom.offsetWidth);
		}

		let volume = (arm) => {
			arm > 1 ? (arm = 1) : '';
			arm < 0 ? (arm = 0) : '';
			this.media.volume = arm;
			if (parseFloat(arm) * 100 < 101) {
				if (direction === 'x') {
					dom.childNodes[0].style.width = parseFloat(arm) * 100 + '%';
				} else {
					dom.childNodes[0].style.height = parseFloat(arm) * 100 + '%';
					dom.childNodes[0].style.top = parseFloat(1 - arm) * 100 + '%';
				}
			}
		};

		document.onmousedown = document.onmousemove = function (e) {
			calculateSlider(e);
		};
		document.onmouseup = function () {
			document.onmousedown = document.onmousemove = null;
		};
		calculateSlider(e);
	},
	progress() {
		return (Math.round(this.media.currentTime) / Math.round(this.media.duration)) * 100 + '%';
	},
	cacheProgress() {
		let progress = 0;
		try {
			progress = (this.media.buffered.end(this.media.buffered.length - 1) / this.media.duration).toFixed(2) * 100 + '%';
		} catch (e) {
			progress = 0;
		}
		return progress;
	},
	time(type, prefix = '/') {
		if (type === 'split') {
			return {
				current: timeDeal(this.media.currentTime),
				duration: timeDeal(this.media.duration),
			};
		} else {
			return timeDeal(this.media.currentTime) + prefix + timeDeal(this.media.duration);
		}
	},
	musicVisual(canvasId, callback) {
		if (!canvasId) {
			throw '缺少canvasId';
			return false;
		}
		window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
		let ctx = new AudioContext();
		let analyser = ctx.createAnalyser();
		let audioSrc = ctx.createMediaElementSource(this.media);
		audioSrc.connect(analyser);
		analyser.connect(ctx.destination);
		let canvas = document.getElementById(canvasId),
			cwidth = canvas.width,
			cheight = canvas.height,
			meterWidth = 10, //width of the meters in the spectrum
			capHeight = 2,
			capStyle = '#eee',
			meterNum = 800 / (10 + 2), //count of the meters
			capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
		ctx = canvas.getContext('2d');
		let gradient = ctx.createLinearGradient(0, 0, 0, 300);
		gradient.addColorStop(1, '#38f');
		gradient.addColorStop(0.5, '#38f');
		gradient.addColorStop(0, '#fff');
		function renderFrame() {
			let array = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(array);
			let step = Math.round(array.length / meterNum);
			ctx.clearRect(0, 0, cwidth, cheight);
			for (let i = 0; i < meterNum; i++) {
				let value = array[i * step];
				if (capYPositionArray.length < Math.round(meterNum)) {
					capYPositionArray.push(value);
				}
				ctx.fillStyle = capStyle;
				if (value < capYPositionArray[i]) {
					ctx.fillRect(i * 12, cheight - --capYPositionArray[i], meterWidth, capHeight);
				} else {
					ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
					capYPositionArray[i] = value;
				}
				ctx.fillStyle = gradient;
				ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight);
			}
			requestAnimationFrame(renderFrame);
		}
		renderFrame();
		callback && callback();
		return true;
	},
	videoFullScreen(el) {},
};
