<template>
	<div class="content">
		<div class="template">
			<!-- <div class="title">我的模板</div> -->
			<div class="main" v-for="(item, index) in 26" :key="index">
				<div class="header">
					<img src="https://aliyun-wb-bvqq7ezi1t.oss-cn-beijing.aliyuncs.com/image/2022/6-22/12121.jpg" alt="" />
				</div>
				<div class="info">
					<p class="name">实拍1.ppt</p>
					<p class="size">720 x 960 像素</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'dataHandle',
	props: {
		item: {
			type: Object,
		},
	},
	data() {
		return {}
	},
};
</script>

<style lang="scss" scoped>
.template {
	// max-height: 100vh;
	padding: 15px 20px;
	// overflow: scroll;
	box-sizing: border-box;
	// background: skyblue;
	.title {
		font-size: 34px;
		font-weight: bold;
	}
	.main {
		width: 245px;
		height: 236px;
		float: left;
		margin-right: 25px;
		margin-bottom: 15px;
		.header {
			height: 185px;
			background: rgba(64, 87, 109, 0.07);
			border-radius: 8px;
			padding-top: 16px;
			box-sizing: border-box;
			img {
				width: 160px;
				margin: 0 auto;
				border-radius: 8px 8px 0 0;
			}
		}
		.info {
			.name{
				font-weight: bold;
				margin-top: 5px;
			}
			.size{}
		}
	}
}
</style>
