<template>
	<div class="content">
		<div class="left-child">
			<!-- 颜色 -->
			<!-- <div class="tool-color">
				<h3>文字颜色(一键刷新)</h3>
				<div class="color-list" v-for="(item, index) in colorData" :key="index">
					<div class="list G-Mt-10" :key="index" :style="{ 'background-color': 'rgb(' + item.RGB + ')' }"></div>
					<span>{{ item.name }}</span>
				</div>
			</div> -->
			<!-- 滤镜 -->
			<!-- <div class="tool-filter">
				<h3>可选滤镜</h3>
				<div class="filter-list" v-for="(item,index) in filterData" :key="index">
					<div class="list">
<img src="https://aliyun-wb-bvqq7ezi1t.oss-cn-beijing.aliyuncs.com/yoyo/bg3.jpg" :style="{'background':`linear-gradient(90deg,rgba(${item.colR}, ${item.colG}, ${item.colB}, ${item.colA}) ${item.colStart},rgba(${item.corR}, ${item.corG}, ${item.corB}, ${item.corA}) ${item.corStart})`}" alt=""></img>
						<span>{{item.name || '变暗'}}</span>
					</div>
				</div>
			</div> -->
			<!-- 边框 -->
			<div class="tool-border">
				<h3>图片边框<button @click="handleClick('export')">保存生成</button></h3>
				
				<div class="border-list" v-for="(item, index) in borderData" :key="index">
					<div class="list">
						<img
							src="https://aliyun-wb-bvqq7ezi1t.oss-cn-beijing.aliyuncs.com/yoyo/bg3.jpg"
							:style="{
								'border-width': `${item.width || '2px'}`,
								'border-style': `${item.type}`,
								'border-radius': `${item.radius}`,
								'border-color': 'white',
								'border-image': `${item.color}` || 'white',
							}"
							alt=""
						/>
					</div>
				</div>
				<h3>边框颜色<button data-v-0513acdc="" class="btn default" @click="handleClick('refresh')">(一键刷新)</button></h3>
				<div class="list">
					<div class="color-list" v-for="(item, index) in borderColorData" :key="index">
						<div class="list G-Mt-10" :key="index" :style="{ 'background-color': 'rgb(' + item.RGB + ')','background-image':`${item.RGB}` }"></div>
						<span>{{ item.name }}</span>
					</div>
				</div>
			</div>
		<!-- 字体 -->
		<!-- <div class="typeface-color">
				<h3>可选字体</h3>
				<div class="typeface-list" v-for="(item, index) in fontData" :key="index">
					<p :style="{'font-family':item.fontName}">{{item.name}}</p>
				</div>
			</div> -->
	</div>
		<div class="center-child">
			<div class="template-main" v-for="(item, index) of template" :key="index">
				<div class="fl-row-justy">
					<div class="G-t-r G-bold G-color-333 G-Fsize-16">第{{index + 1}}页</div>
					<div class="icon G-t-r">
						<el-tooltip class="item" effect="dark" content="删除模板" placement="top-start">
							<i class="iconfont icon-shanchu G-Fsize-22 G-Mr-10" @click="handleChange('delete', index)"></i>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="背景色" placement="top-start">
							<i class="iconfont icon-beijingse G-Fsize-20 G-Mr-10" @click="handleChange('bgColor', index)"></i>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="背景图" placement="top-start">
							<i class="iconfont icon-beijingtupian G-Fsize-20 G-Mr-10" @click="handleChange('bgImage', index)"></i>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="添加一个新模板" placement="top-start">
							<i class="iconfont icon-tianjia G-Fsize-20 G-Mr-10" @click="handleChange('add', index)"></i>
						</el-tooltip>

						<el-tooltip class="item" effect="dark" content="复制一个新模板" placement="top-start">
							<i class="iconfont icon-fuzhi G-Fsize-20 G-Mr-10" @click="handleChange('clone', index)"></i>
						</el-tooltip>
					</div>
				</div>
				<div class="box"></div>
			</div>
		</div>
		<div class="right-child"></div>
	</div>
</template>

<script>
import colorJson from '../../../assets/json/color';
import filterJson from '../../../assets/json/filter';
import gradientJson from '../../../assets/json/gradient';
import publicData from '../../../assets/json/public';

// 公共 mixins
import importPPT from '../mixins/importPPT';
import exportImgMixins from '../mixins/exportImg';
export default {
	
  mixins: [importPPT, exportImgMixins],
	name: 'disabledHandle',
	props: {
		item: {
			type: Object,
		},
	},
	data() {
		return {
			colorData: colorJson,
			filterData: filterJson,
			borderColorData:[...gradientJson,...colorJson.sort(() => Math.random() - 0.5)],
			borderData: publicData.borderData,
			fontData:publicData.fontData,
			template:[
				{}
			]
		};
	},
	mounted(){
	},
	methods: {
		handleClick(commend){
			switch (commend) {
				case 'refresh': //刷
				this.borderColorData = [...gradientJson,...colorJson.sort(() => Math.random() - 0.5)];
				break;
				case 'export': // 导出
				this.exportImg()
				break;
			}
		},
		handleChange(commend = 'normal', index) {
			switch (commend) {
				case 'delete': //删除
					this.template.splice(index, 1);
					break;
				case 'add':
					this.template.push([{ text: 'text' }]);
					break;
				case 'clone':
					this.template.push(this.template[index]);
					break;
				case 'down':
					//
					break;
				case 'official':
					//
					break;
				case 'my':
					//
					break;
				case 'bgColor':
					// 背景色
					this.templateIdx = index;
					this.handleOpenDrawer = 'bgColor';
					break;
				case 'bgImage':
					// 背景图
					this.templateIdx = index;
					this.handleOpenDrawer = 'imageSource';
					break;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.content {
	display: flex;
	justify-content: space-between;
}
.left-child {
	width: 25%;
	height: calc(100vh - 56px);
	overflow-y: scroll;
	background-color: #252627;
	h3 {
		font-weight: 600;
		margin: 10px 0 10px 15px;
		.btn{
			margin-left: 10px;
			border: 0;
			color: white;
			background: transparent;
			font-size: 12px;
			color: #ff4e60;
		}
	}
	.tool-color {
		.color-list {
			display: inline-block;
			width: 70px;
			text-align: center;
			margin-top: 8px;
		}
		.list {
			width: 38px;
			height: 38px;
			color: white;
			background: white;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 15px;
			font-size: 10px;
			cursor: pointer;
			margin: 0 auto;
			border: 1px solid #fff;
		}
	}
	.tool-filter {
		.filter-list {
			width: calc(100% / 3);
			display: inline-block;
			.list {
				text-align: center;
				cursor: pointer;
				img {
					width: 90%;
				}
				span {
					color: white;
					margin-top: 10px;
					display: inline-block;
				}
			}
		}
	}
	.tool-border {
		.border-list {
			width: calc(100% / 4);
			display: inline-block;
			.list {
				cursor: pointer;
				margin-top: 10px;
			}
			div {
				width: 90px;
				height: 90px;
				margin: 0 auto;
			}
			img {
				width: 100%;
				height: 100%;
			}
		}
		.color-list {
			display: inline-block;
			width: 70px;
			text-align: center;
			margin-top: 8px;
			.list {
				width: 38px;
				height: 38px;
				color: white;
				background: white;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 15px;
				font-size: 10px;
				cursor: pointer;
				margin: 0 auto;
				border: 1px solid #fff;
			}
		}
	}
	.typeface-color{
		.typeface-list{
			height: 45px;
			color: white;
			padding-left: 15px;
			font-size: 20px;
			display: flex;
			align-items: center;
			cursor: pointer;
		}
		.typeface-list:hover{
			background: rgb(50,50,50);
		}
	}
}
.left-child::-webkit-scrollbar {
	/*滚动条整体样式*/
	width: 3px; /*高宽分别对应横竖滚动条的尺寸*/
	height: 3px;
}
.left-child::-webkit-scrollbar-thumb {
	/*滚动条里面小方块*/
	border-radius: 6px;
	-webkit-box-shadow: inset 0 0 5px #535353;
	background: #535353;
}
.left-child::-webkit-scrollbar-track {
	/*滚动条里面轨道*/
	-webkit-box-shadow: inset 0 0 5px white;
	border-radius: 6px;
	background: white;
}
.center-child::-webkit-scrollbar {
	/*滚动条整体样式*/
	width: 0; /*高宽分别对应横竖滚动条的尺寸*/
	height: 0;
}
.center-child::-webkit-scrollbar-thumb {
	/*滚动条里面小方块*/
	border-radius: 6px;
	-webkit-box-shadow: inset 0 0 5px rgb(14, 22, 48);
	background: #535353;
}
.center-child::-webkit-scrollbar-track {
	/*滚动条里面轨道*/
	-webkit-box-shadow: inset 0 0 5px white;
	border-radius: 6px;
	background: #ededed;
}
.center-child {
	overflow: scroll;
	height: calc(100vh - 56px);
	padding-top: 50px;
	padding-bottom: 50px;
	.template-main {
		width: 514.188px;
		margin-top: 25px;
	}
	.box {
		background-color: #fff;
		width: 100%;
		height: 727.38px;
		position: relative;
		cursor: pointer;
		box-sizing: border-box;
		border: 2px solid white;
		&.active {
			border: 2px dashed #88ffe3 !important;
		}
	}
	.cloud-main {
		display: flex;

		flex-direction: column;

		background: #f8f8f8;
	}
}
.right-child {
	width: 25%;
	height: calc(100vh - 56px);
	background-color: #252627;
}
</style>
<style lang="scss">
::v-deep .right {
	margin: 0 !important;
}
</style>
