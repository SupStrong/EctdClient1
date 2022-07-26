<template>
	<section class="virtual-container" ref="listWrap" @scroll="scrollListener" @mousedown="mouseSelect">
		<div class="scroll-bar" :style="{ height: scrollHeight }"></div>
		<template v-if="ready">
			<main class="virtual-list" :style="listStyle" v-if="itemWidth">
				<div class="virtual-group-item" :style="{ height: itemHeight + 'px' }" v-for="(item, index) in showList" :key="index">
					<div class="virtual-item" :style="{ width: itemWidth + 'px' }" :data-index="data.$_virtual_id" v-for="(data, i) in item.data" :key="i">
						<slot :item="data" :index="data.$_virtual_id" />
					</div>
				</div>
			</main>
			<main class="virtual-list" :style="listStyle" v-else>
				<div class="virtual-item" :data-index="start + index" v-for="(val, index) in showList" :key="index">
					<slot :item="val" :index="start + index"></slot>
				</div>
			</main>
		</template>
		<div v-if="showMouseSelect" class="mouse-area" :style="mouseSelectData" />
	</section>
</template>

<script>
export default {
	name: 'virtualList',
	data() {
		return {
			showNum: 10, //显示几条数据
			start: 0, //滚动过程显示的开始索引
			end: 0, //滚动过程显示的结束索引
			calcArray: [], //用于计算的数组
			maxItems: 1, //每一行多少个
			mouseSelectData: {
				left: '0',
				top: '0',
				width: '0',
				height: '0',
			},
			showMouseSelect: false,
			container: null,
			lockLoad: false, //是否锁定滚动加载
			ready: false,
		};
	},
	props: {
		list: Array,
		itemWidth: {
			type: Number,
			default: function () {
				return 0;
			},
		},
		itemHeight: {
			type: Number,
			default: function () {
				return 30;
			},
		},
		canDrag: {
			type: Boolean,
			default: function () {
				return false;
			},
		},
		draging: {
			type: Boolean,
			default: function () {
				return false;
			},
		},
	},
	watch: {
		itemHeight: function () {
			this.setData();
		},
		list: function () {
			this.setData(false);
		},
	},
	computed: {
		//显示的数组，用计算属性计算
		showList() {
			if (!this.calcArray.length) {
				return [];
			}
			return this.calcArray.slice(this.start, this.end);
		},
		scrollHeight() {
			return this.itemHeight * this.calcArray.length + 'px';
		},
		listStyle: function () {
			return {
				transform: `translateY(${this.start * this.itemHeight}px)`,
			};
		},
		listTop: function () {
			return this.start * this.itemHeight;
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.container = this.$el;
			this.setData();
		});
	},
	created() {
		window.removeEventListener('resize', () => {});
		window.addEventListener('resize', () => {
			let a = setTimeout(() => {
				this.setData();
				clearTimeout(a);
			}, 100);
		});
	},
	methods: {
		setData(calcSize = true) {
			this.lockLoad = true;
			this.ready = false;
			if (this.container.offsetWidth === 0 || this.list.length === 0) {
				return;
			}
			this.start = 0;
			if (this.itemWidth) {
				let data = this.handleData();
				this.groupData(data);
			} else {
				this.calcArray = this.list;
			}
			this.ready = true;
			if (calcSize) {
				this.getMaxSize();
			}
			let a = setTimeout(() => {
				this.lockLoad = false; //等待数据更新500ms后解锁
				clearTimeout(a);
			}, 500);
		},
		handleData() {
			let data = this.list;
			for (let i = 0, len = data.length; i < len; i++) {
				data[i].$_virtual_id = i;
			}
			return data;
		},
		groupData(data) {
			let maxWidth = this.container.offsetWidth;
			let maxItems = Math.floor(maxWidth / this.itemWidth);
			this.maxItems = maxItems;
			let result = [];
			for (let i = 0, len = data.length; i < len; i += maxItems) {
				result.push({
					id: i, //this.uuid(),
					data: data.slice(i, i + maxItems),
				});
			}
			this.calcArray = result;
		},
		getIndex(group_index, index) {
			let data = this.showList.slice(0, group_index);
			return (
				data.reduce((a, b) => {
					a = a += b.data ? b.data.length : 0;
					return a;
				}, 0) + index
			);
		},
		getMaxSize() {
			this.$nextTick(() => {
				let mawHeight = this.container.getBoundingClientRect().height;
				this.showNum = Math.floor(mawHeight / this.itemHeight) + 2;
				this.end = this.showNum;
				this.scrollListener();
			});
		},
		scrollListener() {
			let element = this.container;
			let scrollTop = element.scrollTop;
			this.start = Math.floor(scrollTop / this.itemHeight);
			this.end = this.start + this.showNum;
			if (parseInt((element.scrollHeight - scrollTop).toString()) <= element.clientHeight && !this.lockLoad) {
				this.$emit('load');
				this.lockLoad = true;
			}
		},
		uuid() {
			let s = [];
			let hexDigits = '0123456789abcdef';
			for (let i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = '4';
			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
			s[8] = s[13] = s[18] = s[23] = '-';
			return s.join('');
		},
		updatePosition(start, end) {
			this.$emit('scroll', {}, start, end);
		},
		mouseSelect(event) {
			if (!this.canDrag) {
				return;
			}
			let area = this.container;
			let start = {
				x: event.clientX - area.getBoundingClientRect().left + area.scrollLeft,
				y: event.clientY - area.getBoundingClientRect().top + area.scrollTop,
			};
			this.mouseSelectData.left = start.x;
			this.mouseSelectData.top = start.y;
			document.onmouseup = (event) => {
				event && event.stopPropagation();
				this.mouseSelectData = {
					left: '0',
					top: '0',
					width: '0',
					height: '0',
				};
				document.onmousemove = null;
				this.showMouseSelect = false;
				let a = setTimeout(() => {
					this.$emit('update:draging', false);
					clearTimeout(a);
				}, 200);
			};
			document.onmousemove = (ev) => {
				if (!this.draging) {
					this.$emit('update:draging', true);
				}
				this.showMouseSelect = true;
				let end = {
					x: ev.clientX - area.getBoundingClientRect().left + area.scrollLeft,
					y: ev.clientY - area.getBoundingClientRect().top + area.scrollTop,
				};
				this.mouseSelectData = {
					left: Math.min(start.x, end.x) + 'px',
					top: Math.min(start.y, end.y) + 'px',
					width: Math.abs(end.x - start.x) + 'px',
					height: Math.abs(end.y - start.y) + 'px',
				};
				let area_data = {
					left: Math.min(start.x, end.x),
					top: Math.min(start.y, end.y) - this.listTop,
					width: Math.abs(end.x - start.x),
					height: Math.abs(end.y - start.y),
				};
				let selList = document.querySelectorAll('.virtual-item');
				for (let i = 0; i < selList.length; i++) {
					let elm = selList[i];
					let index = elm.dataset.index;
					let rect = elm.getBoundingClientRect();
					let sl = rect.width + elm.offsetLeft,
						st = rect.height + elm.offsetTop;
					let area_l = area_data.left + area_data.width;
					let area_t = area_data.top + area_data.height;
					let item = this.list[index];
					if (!item) {
						break;
					}
					if (sl > area_data.left && st > area_data.top && elm.offsetLeft < area_l && elm.offsetTop < area_t) {
						if (item.isSelected !== true) {
							item.isSelected = true;
						}
					} else {
						if (item.isSelected) {
							item.isSelected = false;
						}
					}
				}
			};
		},
	},
};
</script>

<style scoped lang="less">
.mouse-area {
	position: absolute;
	background-color: #6cc29110;
	border: 1px solid #6cc29180;
}
.virtual-container {
	position: relative;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	overflow: auto;
}
.virtual-list {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	.virtual-item {
		width: 100%;
	}
}
.virtual-group-item {
	width: 100%;
	display: flex;
	align-items: center;
	.virtual-item {
		width: unset;
	}
}
</style>
