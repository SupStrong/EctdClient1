<template>
	<div class="content">
		<div class="left-child"></div>
		<div class="center-child">
			<div class="template-main" v-for="(item, index) of 6" :key="index">
				<div class="fl-row-justy">
					<div class="G-t-r G-bold G-color-333 G-Fsize-16">第1页</div>
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
export default {
	name: 'disabledHandle',
	props: {
		item: {
			type: Object,
		},
	},
	data() {
		return {};
	},
	methods: {
		handleChange(type) {
			console.log(type);
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
	background-color: #252627;
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
