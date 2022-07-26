<template>
	<div class="cloud-disk-image-viewer" tabindex="-1" @keydown.left="prevImage" @keydown.right="nextImage">
		<windowHeader :config="header" />
		<div class="container" ref="imageViewer">
			<img
				class="imageShower"
				:class="{ imageAnim: !disableAnim }"
				:src="'https://aliyun-wb-bvqq7ezi1t.oss-cn-beijing.aliyuncs.com' + nowImage.content"
				:style="{
					webkitTransform: 'rotate(' + angle + 'deg)',
					...imageOffset,
				}"
				ref="imageShow"
				@mousewheel="mouseZoom"
				@load="onload"
				@mousedown="imageDrag"
				alt=""
			/>
			<Spin v-show="loading">
				<Icon type="ios-loading" size="26" class="loading" />
			</Spin>
			<div class="zoom-tips imageAnim" :style="{ opacity: showZoomTips }">{{ zoom }}%</div>
			<p class="control-tips imageAnim" :style="{ opacity: showNumberTips }">{{ nowImage.count + 1 }}/{{ imageList.length }}</p>
			<ul
				class="control-area imageAnim"
				:style="{ bottom: canShowControlBar ? '0' : '-50px' }"
				@mouseenter="mouseInControl = true"
				@mouseleave="mouseInControl = false"
			>
				<li @click="imageOriginal(100)" v-if="zoom === firstZoom">1:1</li>
				<li class="sf-icon-expand" @click="imageOriginal(firstZoom)" v-else></li>
				<li class="sf-icon-search-plus" @click="zoomImage(1)" />
				<li class="sf-icon-search-minus" @click="zoomImage(-1)" />
				<li class="sf-icon-angle-left" style="padding-right: 2px" @click="prevImage" />
				<li class="sf-icon-angle-right" style="padding-left: 2px" @click="nextImage" />
				<li class="sf-icon-undo" @click="rotateImage(-90)" />
				<li class="sf-icon-redo" @click="rotateImage(90)" />
			</ul>
			<ul class="control-area" style="opacity: 0" v-if="!canShowControlBar" @mouseenter="mouseInControl = true" @mouseleave="mouseInControl = false"></ul>
		</div>
	</div>
</template>

<script>
let zoomTimer = null;
let showNumberTimer = null;
let showControlTimer = null;
export default {
	name: 'imageViewer',
	data() {
		return {
			header: {
				title: '',
				background: '#f8fdff',
				color: '#6d6d6d',
				index: 2,
			},
			nowImage: {
				disk_name: '',
				count: 0,
				URL: '',
			},
			natureSize: {
				width: 0,
				height: 0,
			},
			imageStyle: {
				left: 0,
				top: 0,
			},
			zoom: 100,
			loading: false,
			disableAnim: false,
			angle: 0,
			firstZoom: 0,
			imageList: [],
			showZoomTips: 0,
			showNumberTips: 0,
			showControlBar: 1,
			mouseInControl: false,
		};
	},
	created() {
		if (this.$isElectron) {
			this.$ipc.on('win-data', (event, data) => {
				//接收打开图片文件的数据
				this.init(data);
			});
		}
	},
	watch: {
		mouseInControl: function (now) {
			if (now === false) {
				this.showControlBar = true;
				this.hideControlBar();
			}
		},
	},
	computed: {
		canShowControlBar: function () {
			return this.showControlBar || this.mouseInControl;
		},
		imageOffset: function () {
			return {
				top: this.imageStyle.top + 'px',
				left: this.imageStyle.left + 'px',
				width: this.imageStyle.width + 'px',
				height: this.imageStyle.height + 'px',
			};
		},
	},
	methods: {
		init(data) {
			this.$nextTick(() => {
				data.forEach((item, index) => {
					if (item.active) {
						this.showImage(item, index);
					}
				});
				this.imageList = data;
			});
		},
		onload(e) {
			this.loading = true;
			this.angle = 0;
			let nature = {
				width: e.path[0].naturalWidth,
				height: e.path[0].naturalHeight,
			};
			this.natureSize = nature;
			let container = {
				width: this.$refs.imageViewer.offsetWidth,
				height: this.$refs.imageViewer.offsetHeight,
			};
			let imageSize = {
				width: container.width * 0.8,
				height: container.height * 0.8,
			};
			this.header.title = `${this.nowImage.name}  (${nature.width}x${nature.height}像素，${this.nowImage.$size})-图片查看器`;
			this.zoom = parseInt((imageSize.height / nature.height) * 100);
			this.firstZoom = this.zoom;
			this.calcImgStyle();
			this.centerImg();
		},
		calcImgStyle() {
			this.imageStyle.width = parseInt(this.natureSize.width * (this.zoom / 100));
			this.imageStyle.height = parseInt(this.natureSize.height * (this.zoom / 100));
		},
		centerImg() {
			let container = {
				width: this.$refs.imageViewer.offsetWidth,
				height: this.$refs.imageViewer.offsetHeight,
			};
			this.loading = false;
			let imagSize = this.imageStyle;
			this.imageStyle.left = (container.width - imagSize.width) / 2;
			this.imageStyle.top = (container.height - imagSize.height) / 2;
		},
		showImage(item, index) {
			console.log(item, index, 'Xxs');
			this.nowImage = item;
			this.nowImage.count = index;
			this.nowImage.URL = this.$api.public.uploadUrl('disk', item.content);
			this.showNumberTips = 1;
			this.showControlBar = 1;
			showNumberTimer && clearTimeout(showNumberTimer);
			showNumberTimer = setTimeout(() => {
				this.showNumberTips = 0;
				clearTimeout(showNumberTimer);
			}, 4000);
			this.hideControlBar();
		},
		hideControlBar() {
			showControlTimer && clearTimeout(showControlTimer);
			showControlTimer = setTimeout(() => {
				this.showControlBar = 0;
				clearTimeout(showControlTimer);
			}, 3000);
		},
		imageOriginal(zoom) {
			this.zoom = zoom;
			this.calcImgStyle();
			this.centerImg();
		},
		zoomImage(a) {
			this.disableAnim = true;
			let oImg = this.$refs.imageShow;
			let area = this.$refs.imageViewer;
			if (a < 0 && this.zoom > 3) {
				this.zoom = this.zoom - 5;
			} else if (a > 0 && this.zoom < 300) {
				this.zoom = this.zoom + 5;
			}
			this.calcImgStyle();
			let x = event.clientX - area.getBoundingClientRect().left;
			let y = event.clientY - area.getBoundingClientRect().top;
			let ratioL = (x - oImg.offsetLeft) / oImg.offsetWidth,
				ratioT = (y - oImg.offsetTop) / oImg.offsetHeight,
				l = Math.round(x - this.imageStyle.width * ratioL),
				t = Math.round(y - this.imageStyle.height * ratioT);
			this.imageStyle.left = l;
			this.imageStyle.top = t;
			this.showZoomTips = 1;
			zoomTimer && clearTimeout(zoomTimer);
			zoomTimer = setTimeout(() => {
				this.showZoomTips = 0;
				this.disableAnim = false;
				clearTimeout(zoomTimer);
			}, 1500);
		},
		imageDrag() {
			let img_show = this.$refs.imageShow;
			event.preventDefault();
			this.disableAnim = true;
			let oDragObj = img_show;
			let nTY = parseInt(oDragObj.style.top + 0);
			let y = event.clientY;
			let nTX = parseInt(oDragObj.style.left + 0);
			let x = event.clientX;
			document.onmousemove = (event) => {
				let top = nTY + event.clientY - y;
				let left = nTX + event.clientX - x;
				if (
					left < -img_show.offsetWidth * 2 + 10 ||
					left > window.innerWidth - 10 ||
					top < -img_show.offsetHeight * 2 + 10 ||
					top > window.innerHeight * 2 - 20
				) {
					document.onmousemove = null;
					//_this.centerImg();
					return;
				}
				oDragObj.style.top = top + 'px';
				oDragObj.style.left = left + 'px';
			};
			document.onmouseup = () => {
				this.disableAnim = false;
				document.onmousemove = null;
			};
			return false;
		},
		mouseZoom() {
			this.zoomImage(event.wheelDelta);
		},
		rotateImage(a) {
			this.disableAnim = false;
			this.angle = this.angle + a;
		},
		nextImage() {
			if (!this.imageList.length) {
				return;
			}
			let nowImageIndex = this.nowImage.count;
			let allCount = this.imageList.length;
			if (nowImageIndex !== allCount - 1) {
				this.showImage(this.imageList[nowImageIndex + 1], nowImageIndex + 1);
			} else {
				this.showImage(this.imageList[0], 0);
			}
		},
		prevImage() {
			if (!this.imageList.length) {
				return;
			}
			let nowImageIndex = this.nowImage.count;
			if (this.nowImage.count !== 0) {
				this.showImage(this.imageList[nowImageIndex - 1], nowImageIndex - 1);
			} else {
				this.showImage(this.imageList[this.imageList.length - 1], this.imageList.length - 1);
			}
		},
	},
};
</script>

<style scoped lang="scss">
/*图片查看窗口*/
.cloud-disk-image-viewer {
	width: 100%;
	height: 100%;
	background: #f8fdff;
	display: flex;
	flex-direction: column;
	.container {
		width: 100%;
		height: 100%;
		flex: 1;
		.loading {
			animation: loading 1s linear infinite;
		}
		@keyframes loading {
			from {
				transform: rotate(0deg);
			}
			50% {
				transform: rotate(180deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
		.demo-spin-col {
			height: 100px;
			position: relative;
			border: 1px solid #eee;
		}
		.cd-image-container .ivu-spin-main {
			float: right;
			padding: 30px 10px;
		}
		.imageShower {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			cursor: grab;
			box-shadow: 0 0 89px 0 rgb(74 69 69 / 37%);
		}
		.imageAnim {
			transition: all 0.3s ease-out !important;
		}
		.zoom-tips {
			width: 100px;
			height: 30px;
			color: #fff;
			text-align: center;
			font-size: 14px;
			line-height: 30px;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 30px;
			opacity: 1;
			pointer-events: none;
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			z-index: 2;
		}
		.control-tips {
			width: 100%;
			text-align: center;
			line-height: 30px;
			bottom: 42px;
			left: 0;
			font-size: 14px;
			color: #fff;
			position: absolute;
			z-index: 2;
			pointer-events: none;
			text-shadow: 0 0 5px rgb(0, 0, 0);
		}
		.control-area {
			position: absolute;
			margin: 0 auto;
			bottom: 0;
			width: 100%;
			height: 42px;
			background: #fff;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 2;
			li {
				width: 30px;
				height: 30px;
				font-size: 18px;
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: pointer;
				color: #333;
				border: 1px solid rgba(0, 0, 0, 0);
				margin: 0 5px;
				&:first-child {
					margin-left: -32px;
				}
				&.sf-icon-angle-left,
				&.sf-icon-angle-right {
					width: 32px;
					height: 32px;
					font-size: 26px;
					border: 1px solid #333;
					border-radius: 100%;
					margin: 0 10px;
					&:hover {
						color: #fff;
						background: $diskMainColor;
					}
				}
				&:hover {
					border: 1px solid $diskMainColor;
					color: $diskMainColor;
				}
			}
		}
	}
}
</style>
