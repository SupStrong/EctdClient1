<template>
	<div class="cloudSeries-feedback-main">
		<windowHeader style="position: absolute" :config="header" ref="windowHeader" />
		<div class="head">问题反馈</div>
		<div class="main">
			<p>
				当前应用：<span class="name">{{ this.$projectInfo.logoText }}</span> ver:{{ version }}
			</p>

			<p>我们需要以下信息进行问题反馈</p>
			<input v-model="feedBackObject.title" placeholder="简单的描述" />
			<textarea v-model="feedBackObject.content" placeholder="遇到的问题，报错信息等" />
		</div>
		<div class="bottom">
			<p class="release">{{ this.$copyRight }}</p>
			<button :disabled="loading" @click="FeedBack">提交{{ loading ? '中' : '' }}</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'feedBackWindow',
	data() {
		return {
			loading: false,
			FeedBackTitle: '',
			FeedBackContent: '',
			feedBackObject: {
				title: '',
				content: '',
			},
			header: {
				color: '#fff',
				title: '',
				resize: false,
				mini: false,
			},
		};
	},
	computed: {
		version() {
			return this.$packageInfo.version;
		},
	},
	methods: {
		FeedBack() {
			if (!this.feedBackObject.title.length) {
				this.$Message.warning('请先简单的描述下问题');
				return;
			}
			if (!this.feedBackObject.content.length) {
				this.$Message.warning('请详细描述问题');
				return;
			}
			this.loading = true;
			this.$api.user.feedBack(
				{
					...this.feedBackObject,
					app: this.$projectInfo.logoText,
					version: this.version,
				},
				() => {
					this.loading = false;
					this.$Message.info({
						content: '感谢您的反馈，问题已被记录',
						onClose: () => {
							if (this.$isElectron) {
								this.$refs.windowHeader.close();
							} else {
								this.$parent.close();
							}
						},
					});
					this.feedBackObject = {
						title: '',
						content: '',
					};
				},
				(rs) => {
					this.$Message.error(rs.msg);
					this.loading = false;
				}
			);
		},
	},
};
</script>

<style scoped lang="scss">
.cloudSeries-feedback-main {
	width: 100%;
	height: 100%;
	background: #fff;
	position: relative;
	display: flex;
	flex-direction: column;
	.head {
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-image: url('../assets/common/svg/header.svg');
		background-size: 100% 100%;
		background-position: bottom center;
		padding: 0 50px 0 10px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		font-size: 16px;
		color: #fff;
		.logo {
			height: 45px;
			vertical-align: bottom;
			font-size: 30px;
			color: #4c4c4c;
			font-weight: bold;
			background-size: contain;
			background-repeat: no-repeat;
			font-family: 'zk-font';
		}
		span {
			vertical-align: bottom;
			font-size: 14px;
			margin: 0 10px;
			color: #4c4c4c;
		}
	}
	.main {
		height: calc(100% - 90px);
		background: #fff;
		padding: 15px;
		p {
			font-size: 14px;
			color: #4f4f4f;
			margin-bottom: 5px;
			line-height: 25px;
			.name {
				font-family: 'zk-font';
				font-size: 18px;
			}
		}
		input,
		textarea {
			width: 100%;
			-webkit-app-region: no-drag;
			height: 32px;
			border-radius: 3px;
			border: 1px solid #eee;
			padding: 0 5px;
			margin-bottom: 15px;
		}
		textarea {
			padding: 5px;
			height: 110px;
			resize: none;
		}
		input:focus,
		textarea:focus {
			border-color: $mainColor;
			outline: 0;
			box-shadow: 0 0 0 2px rgba(91, 91, 234, 0.2);
		}
	}
	.bottom {
		width: 100%;
		height: 60px;
		padding: 10px 15px 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-image: url('../assets/common/svg/about-footer.svg');
		background-size: 100% 100%;
		background-position: bottom center;
		position: absolute;
		bottom: 0;
		right: 0;
		p {
			font-size: 12px;
			color: #fff;
		}
		button {
			padding: 5px 13px;
			background: none;
			font-size: 12px;
			color: #fff;
			overflow: hidden !important;
			-webkit-app-region: no-drag;
			border-radius: 5px;
			&:hover {
				background: rgba(255, 255, 255, 0.1);
			}
		}
	}
}
</style>
