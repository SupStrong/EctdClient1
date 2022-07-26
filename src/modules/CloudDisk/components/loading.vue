<template>
	<div class="cloud-disk-load" v-if="loading || !length">
		<div class="loading" v-if="loading">
			<div class="sf-icon-hdd">
				<div class="beat">
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
			正在加载
		</div>
		<div class="empty" v-else v-show="!length > 0">
			<span class="sf-icon-hdd" />
			<p>这里什么都没有</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'loading',
	props: {
		loading: {
			type: Boolean,
		},
		length: {
			type: Number,
		},
	},
};
</script>

<style scoped lang="scss">
.cloud-disk-load {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: -1;
	/*加载动画*/
	.loading {
		text-align: center;
		color: #5b5bea;
		font-size: 16px;
		position: relative !important;
		.sf-icon-hdd {
			width: 100%;
			font-size: 45px;
			position: relative;
		}
		p {
			color: #828282;
			font-size: 16px;
		}
		.beat {
			position: absolute;
			top: 36px;
			text-align: center;
			left: calc(50% - 8px);
			background: #fff;
			height: 10px;
			width: 26px;
			div {
				float: right;
				background-color: #5b5bea;
				width: 4px;
				height: 4px;
				margin-top: 3px;
				margin-right: 2px;
				border-radius: 100%;
				animation-fill-mode: both;
				display: inline-block;
				animation: cd-loading 0.7s 0s infinite linear;
			}
			div:nth-child(2n-1) {
				animation-delay: 0.35s !important;
			}
		}
	}
	/*无数据提示*/
	.empty {
		width: 100%;
		color: #828282;
		text-align: center;
		font-size: 16px;
		position: relative !important;
		span {
			width: 100%;
			font-size: 45px;
		}
	}
}

@-webkit-keyframes cd-loading {
	50% {
		opacity: 0.2;
		-webkit-transform: scale(0.75);
		transform: scale(0.75);
	}

	100% {
		opacity: 1;
		-webkit-transform: scale(1);
		transform: scale(1);
	}
}
@keyframes cd-loading {
	50% {
		opacity: 0.5;
		-webkit-transform: scale(0.75);
		transform: scale(0.75);
	}
	100% {
		opacity: 1;
		-webkit-transform: scale(1);
		transform: scale(1);
	}
}
</style>
