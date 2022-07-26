<template>
	<div class="cloud-series-not-found">
		<div class="left">
			<img src="../assets/common/svg/404.svg" draggable="false" alt="" />
		</div>
		<div class="right">
			<h1>404</h1>
			<h2>找不到该页面</h2>
		</div>
	</div>
</template>

<script>
export default {
	name: 'notFound',
};
</script>

<style scoped lang="scss">
.cloud-series-not-found {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	.left {
		width: 30%;
		img {
			width: 100%;
		}
	}
	.right {
		width: 500px;
		padding-left: 100px;
		h1 {
			font-size: 100px;
			color: #38f;
			line-height: 150px;
		}
	}
}
</style>
