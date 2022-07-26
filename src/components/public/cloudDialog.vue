<template>
	<div class="cloud-dialog-mask animated" :class="anim" v-if="show" @click.stop="close">
		<div class="cloud-dialog-main" :style="containerStyle" @click.stop="other">
			<div class="header">
				<div class="title">{{ title }}</div>
				<div class="close sf-icon-times" @click.stop="close"></div>
			</div>
			<div class="container" :style="{ padding: padding }">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'cloudDialog',
	props: {
		show: {
			type: Boolean,
			default: function () {
				return true;
			},
		},
		width: {
			type: [Number, String],
			default: function () {
				return 800;
			},
		},
		height: {
			type: [Number, String],
			default: function () {
				return 600;
			},
		},
		padding: {
			type: String,
			default: function () {
				return '0';
			},
		},
		radius: {
			type: String,
			default: function () {
				return '0';
			},
		},
		title: {
			type: String,
			default: function () {
				return '标题';
			},
		},
	},
	computed: {
		containerStyle: function () {
			return {
				width: typeof this.width === 'string' ? this.width : this.width + 'px',
				height: typeof this.height === 'string' ? this.height : this.height + 'px',
				borderRadius: this.radius,
			};
		},
	},
	data() {
		return {
			anim: 'fadeIn',
		};
	},
	methods: {
		other() {},
		close() {
			this.anim = 'fadeOut';
			let a = setTimeout(() => {
				this.$emit('update:show', false);
				this.$emit('close');
				this.anim = 'fadeIn';
				clearTimeout(a);
			}, 350);
		},
	},
};
</script>

<style scoped lang="scss">
.cloud-dialog-mask {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	backdrop-filter: saturate(100%) blur(30px);
	.cloud-dialog-main {
		display: flex;
		flex-direction: column;
		background: #fff;
		position: relative;
		.header {
			width: 100%;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 0 20px;
			position: relative;
			.title {
				width: 100%;
				text-align: center;
				position: absolute;
				font-size: 14px;
				color: #6d6d6d;
				left: 0;
				top: 0;
				line-height: 40px;
				padding: 0 20px;
			}
			.close {
				position: relative;
				z-index: 1;
				font-size: 16px;
				color: #2d2d2d;
				cursor: pointer;
				&:hover {
					color: #f56c6c;
				}
			}
		}
		.container {
			width: 100%;
			height: 100%;
			flex: 1;
		}
	}
}
</style>
