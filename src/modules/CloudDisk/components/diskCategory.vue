<template>
	<div class="category-container" style="height: 100%; background: #0e1630">
		<el-menu
			class="el-menu-vertical-demo"
			style="background: #0e1630"
			text-color="white"
			active-text-color="#ff4e60"
			background-color="#0e1630"
			:unique-opened="true"
			:collapse="isCollapse"
			:collapse-transition="true"
			:style="{ width: isCollapse ? 'auto' : '200px' }"
		>
			<template v-for="(item, index) in categoryMenuData">
				<el-submenu :index="index" :key="index" style="background: #0e1630">
					<template slot="title">
						<i :class="['el-icon', item.icon]"><p v-if="isCollapse == true">{{item.nickName}}</p></i>
						<span>{{ item.name }}</span>
					</template>
					<el-menu-item
						style="background: #0e1630"
						v-for="(subItem, subIndex) in item.child"
						:index="index + '-' + subIndex"
						:key="subIndex"
						@click="change(subItem)"
					>
						<i :class="['el-icon', subItem.icon]" />
						<span slot="title" style="margin-left: 10px">{{ subItem.name }}</span>
					</el-menu-item>
				</el-submenu>
			</template>
		</el-menu>
	</div>
</template>

<script>
export default {
	name: 'diskCategory',
	props: {
		type: {
			type: String,
			default: function () {
				return 'disk';
			},
		},
		isCollapse:{
			type: Boolean,
			default :function () {
				return  false;
			},
		},
		data: {
			type: Object,
		},
	},
	data() {
		return {
			isCollapse: true,
			typeData: [
				{
					name: '我的工具',
					nickName: '工具',
					icon: 'sf-icon-unlink',
					child: [
						{ name: '工作台', icon: 'sf-icon-unlink', data: 'toolTable' },
						{ name: '我的模板', icon: 'sf-icon-link', data: 'template' },
						{ name: '收藏模板', icon: 'sf-icon-unlink', data: 'collect' },
					],
				},
				{
					name: '资源管理',
					nickName: '素材',
					icon: 'sf-icon-unlink',
					child: [
						{ name: '全部文件', icon: 'sf-icon-hdd', data: 'all' },
						{ name: '图片', icon: 'sf-icon-image', data: 'picture' },
						{ name: '视频', icon: 'sf-icon-video', data: 'video' },
						{ name: '文档', icon: 'sf-icon-file-alt', data: 'document' },
						{ name: '音乐', icon: 'sf-icon-music', data: 'music' },
						{ name: '其他', icon: 'sf-icon-puzzle-piece', data: 'other' },
						{ name: '回收站', icon: 'sf-icon-trash', data: 'trash' },
					],
				},
				{
					name: '分享管理',
					nickName: '分享',
					icon: 'sf-icon-unlink',
					child: [
						{ name: '我的分享', icon: 'sf-icon-link', data: 'share' },
						{ name: '失效分享', icon: 'sf-icon-unlink', data: 'disshare' },
					],
				}
			],
			// typeData: [
			// 	{ name: '全部文件', icon: 'sf-icon-hdd', data: 'all' },
			// 	{ name: '图片', icon: 'sf-icon-image', data: 'picture' },
			// 	{ name: '视频', icon: 'sf-icon-video', data: 'video' },
			// 	{ name: '文档', icon: 'sf-icon-file-alt', data: 'document' },
			// 	{ name: '音乐', icon: 'sf-icon-music', data: 'music' },
			// 	// { name: '种子', icon: 'sf-icon-magnet', data: 'torrent' },
			// 	{ name: '其他', icon: 'sf-icon-puzzle-piece', data: 'other' },
			// 	{ name: '回收站', icon: 'sf-icon-trash', data: 'trash' },
			// 	{ name: '我的分享', icon: 'sf-icon-link', data: 'share' },
			// 	{ name: '失效分享', icon: 'sf-icon-unlink', data: 'disshare' },
			// 	{ name: '工具台', icon: 'sf-icon-hdd', data: 'template' },
			// 	// { name: '测评', icon: 'sf-icon-hdd', data: 'lattice' },
			// ], //网盘分类参数
			// shareData: [
			// 	{ name: '我的分享', icon: 'sf-icon-link', data: 'share' },
			// 	{ name: '失效分享', icon: 'sf-icon-unlink', data: 'disshare' },
			// ], //分享分类参数
			// transData: [
			// 	{ name: '正在下载', icon: 'sf-icon-download', count: 0, data: 'download' },
			// 	{ name: '正在上传', icon: 'sf-icon-upload', count: 0, data: 'upload' },
			// 	{ name: '传输完成', icon: 'sf-icon-check-circle', count: 0, data: 'finish' },
			// ], //传输分类参数,
			ectdData: [],
			// imageData: [
			// 	{ name: '实拍', icon: 'sf-icon-hdd', data: 'all' },
			// 	{ name: '测评', icon: 'sf-icon-hdd', data: 'lattice' },
			// ],
			// templateData: [{ name: '所有', icon: 'sf-icon-hdd', data: 'all' }],
			//网盘分类参数
			categoryMenuData: [],
			towerSrc: require('../assets/img/tower/Spring-bottom-0.png'),
			timer: false,
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.categoryMenuData = this.typeData;
			this.timer = setInterval(() => {
				this.background();
			}, 1000);
		});
	},
	beforeDestroy() {
		clearInterval(this.timer);
	},
	watch: {
		type: function () {
			this.$nextTick(() => {
				this.updateData(this.type);
			});
		},
	},
	methods: {
		handleCollapse(){
			this.isCollapse = !this.isCollapse
		},
		background() {
			let season = 'Spring';
			let tag = 0;
			let D = new Date();
			let month = D.getMonth() + 1;
			let hHour = D.getHours();
			if (month > 2 && month < 6) {
				season = 'Spring';
			} else if (month > 5 && month < 9) {
				season = 'Summer';
			} else if (month > 8 && month < 12) {
				season = 'Autumn';
			} else if (month === 12 || month === 1 || month === 2) {
				season = 'Winter';
			}
			if (hHour >= 1 && hHour <= 8) {
				tag = 0;
			} else if (hHour > 8 && hHour <= 16) {
				tag = 1;
			} else if (hHour > 16 && hHour <= 18) {
				tag = 2;
			} else if (hHour > 18 && hHour <= 24) {
				tag = 3;
			}
			this.TowerSrc = require('../assets/img/tower/' + season + '-bottom-' + tag + '.png');
		},
		updateData(type) {
			console.log(type);
			this.categoryMenuData = this.typeData;
			this.change(this.typeData[0].child[0], type);
		},
		updateMenuCount(data) {
			this.categoryMenuData[0].count = data.downloading;
			this.categoryMenuData[1].count = data.uploading;
			this.categoryMenuData[2].count = data.finish;
		},
		change(data, type = this.type) {
			this.$emit('change', data, type);
		},
		/** 获取ectd文档列表 */
		getEctdDocumentList() {
			this.ectdData = [
				{ name: '样品列表', icon: 'sf-icon-upload', data: 'document1', country: 'sample' },
				{ name: '品牌列表', icon: 'sf-icon-upload', data: 'document2', country: 'brand' },
				{ name: '分类列表', icon: 'sf-icon-upload', data: 'document3', country: 'category' },
				{ name: '单位列表', icon: 'sf-icon-upload', data: 'document4', country: 'company' },
				{ name: '文案列表', icon: 'sf-icon-upload', data: 'document5', country: 'imgText' },
			]; //ectd分类,应该是接口动态获取,暂时写死
			this.categoryMenuData = this.ectdData;
		},
	},
};
</script>

<style scoped lang="scss">
.cloud-disk-category {
	width: 100%;
	height: 100%;
	overflow: auto;
	display: flex;
	a,
	span {
		color: white;
	}
	.category-container {
		width: 100%;
		height: 100%;
		// flex: 1;
		// position: relative;
		background: #2f2f2f;
		ul {
			margin-top: 5px;
			background: #2f2f2f;
			li {
				width: 100%;
				height: 40px;
				line-height: 40px;
				cursor: pointer;
				font-size: 14px;
				margin-bottom: 8px;
				display: flex;
				align-items: center;
				padding-left: 20px;
				position: relative;
				color: white;
				i {
					width: 35px;
					height: 35px;
					display: block;
					text-align: center;
					line-height: 35px;
					font-size: 16px;
					margin-right: 12px;
				}
				.count {
					float: right;
					padding: 0 6px;
				}
				&:hover {
					// background: #f8f8f8;
				}
			}
			.active {
				color: #ff4e60;
				background: #3388ff2e !important;
			}
		}
		/*底部*/
		.bottom {
			width: 100%;
			height: 134px;
			position: absolute;
			bottom: 0;
			right: 0;
			font-weight: normal;
			pointer-events: none;
			.tower {
				width: 110px;
				height: 100%;
				background-size: cover !important;
				transition: background 0.4s ease-in-out;
			}
			p {
				/*文件选择提示*/
				width: 100%;
				position: absolute;
				bottom: 3px;
				right: 3px;
				text-align: right;
				font-size: 12px;
				color: #505050;
			}
		}
	}
	// 进度圆大小
	$progress-height: 160px !default;

	// 文字大小
	$progress-font: 36px !default;

	// 进度颜色
	$progress-colors: (
		blue: #33a0ff,
		orange: #ff744a,
		purple: #8350d8,
		cyan: #19c9cb,
	) !default;

	// 进度圆容器
	.wave-progress {
		margin: 0;
		padding: 0;
		font-size: 0;
		position: absolute;
		display: none;
		// 进度圆单元
		> li {
			display: inline-block;
			list-style: none;
			width: $progress-height;
			height: $progress-height;
			position: relative;
			overflow: hidden;
		}
	}

	// 波纹
	.wave {
		position: absolute;
		width: 100%;
		height: 100%;
		// 用伪元素绘制两个波纹容器
		&::before,
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 50%;
			z-index: 10;
			// 设置大小合适的圆形容器(足够覆盖整个进度圆)
			width: 800px;

			height: 800px;
			border-radius: 45%;

			// 一定透明度的白色背景色
			background-color: rgba(255, 255, 255, 0.8);

			// 挪到合适的位置
			transform: translateX(-50%) rotate(0);

			// 添加旋转动画
			animation: rotate 6s linear infinite;
		}

		// 通过重置一个波纹的圆角大小、动画执行时间、延迟间隔
		// 来制造波纹动画的视觉差和时间差
		&::after {
			border-radius: 48%;
			transform: translateX(-50%) rotate(0);
			animation: rotate 10s linear -5s infinite;
			z-index: 20;
		}
	}

	// 进度值
	.text {
		position: absolute;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		z-index: 30;
		text-align: center;
		font-size: $progress-font;
		font-weight: 900;
		line-height: $progress-height;
		color: white;

		// 文字重叠描边，进度值较小场景下白色文字与背景的区分
		&::before {
			// 使用函数取值，DOM 中这个属性必须有值，而且需要与进度值保值一致
			content: attr(data-text);
			position: absolute;
			-webkit-text-stroke: 1px orange;
			z-index: 20;
		}
	}

	// 旋转动画
	@keyframes rotate {
		50% {
			transform: translateX(-50%) rotate(180deg);
		}

		100% {
			transform: translateX(-50%) rotate(360deg);
		}
	}

	// 枚举进度颜色
	@each $key, $value in $progress-colors {
		.wave-#{ $key } {
			background-color: $value;
			// 文字描边颜色与背景一致
			.text::before {
				-webkit-text-stroke: 1px $value;
			}
		}
	}
}
::v-depp .el-menu {
	border: 0;
}
::v-deep .el-menu-item {
	background-color: rgb(14, 22, 48) !important;
	span {
		color: white;
	}
}
::v-deep .el-submenu__title .el-icon {
	vertical-align: middle;
	margin-right: 10px;
	width: 24px;
	text-align: center;
	font-size: 16px;
	// display: grid;
}
::v-deep .el-menu--collapse .el-icon {
	display: grid;
}
::v-deep .el-submenu__title .el-icon p{
	font-size: 10px;
}
::v-deep .el-menu--collapse .el-submenu {
	height: 80px;
	display: flex;
	align-items: center;
}
::v-deep .el-menu-item:hover {
	background: rgb(14, 22, 48) !important;
}
::v-deep .el-menu--popup {
	background-color: rgb(14, 22, 48) !important;
}
::v-deep .el-menu--popup-right-start {
	background-color: rgb(14, 22, 48) !important;
	margin-left: 0 !important;
}
::v-deep .el-submenu__title {
	width: 100%;
	color: white;
}
::v-deep .el-submenu:hover {
	background-color: #0e1630;
}
::v-deep .el-menu {
	background-color: #0e1630;
	border-right: 0;
}
::v-deep .el-submenu__title:hover {
	background-color: #0e1630;
}
::v-deep .el-menu-item.is-active {
	color: #ff4e60;
}
::v-deep .el-menu-item.is-active span {
	color: #ff4e60;
}
.category-container {
	ul {
		li {
			i {
			}
			.count {
			}
			&:hover {
				background: #0e1630;
				span {
					// color: white;
				}
			}
		}
		.active {
			color: #ff4e60;
			background: #0e1630 !important;
		}
	}
}
</style>
