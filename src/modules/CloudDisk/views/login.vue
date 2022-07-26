<template>
	<div class="cloud-main">
		<windowHeader style="position: absolute" v-if="isDiskClient" :config="header"></windowHeader>
		<pageHeader @change="changeType" v-else></pageHeader>
		<section class="index-section">
			<div class="login-window" :class="{ client: $isElectron }">
				<div class="left">
					<loginModule ref="loginModule" :mode="$isElectron ? 'normal' : 'dialog'" :head="$isElectron" @login="loginSuccess">
						<div class="web-title">欢迎使用</div>
						<template slot-scope="{ data }">
							<div class="web-title">{{ data[2] }}账号</div>
						</template>
					</loginModule>
				</div>
				<div class="right">
					<img draggable="false" class="logo" :src="$projectInfo.logo" alt="" />
					<span class="name">C-DISK</span>
					<span class="site">https://disk.zjinh.cn</span>
					<img draggable="false" src="../assets/img/login/right-bg.png" alt="" />
					<span class="sf-icon-cloud-download download"></span>
					<span class="sf-icon-bolt fast"></span>
					<span class="sf-icon-image image"></span>
					<span class="sf-icon-video video"></span>
					<span class="sf-icon-music music"></span>
					<span class="sf-icon-shield-check shield"></span>
					<span class="sf-icon-share-alt share"></span>
				</div>
			</div>
		</section>
		<footer class="index-footer animated slideInUp" v-if="!isDiskClient">
			<div class="banner-info">
				<Carousel v-model="value1" radius-dot :autoplay-speed="5000" :autoplay="true" :loop="true" arrow="never">
					<CarouselItem>
						<div class="banner-content">
							<p>在线预览</p>
							<p>多种文件可即开即看</p>
						</div>
					</CarouselItem>
					<CarouselItem>
						<div class="banner-content">
							<p>多端同步</p>
							<p>一地上传，多地使用</p>
						</div>
					</CarouselItem>
					<CarouselItem>
						<div class="banner-content">
							<p>在线解压</p>
							<p>一键解压，速取所需</p>
						</div>
					</CarouselItem>
				</Carousel>
			</div>
			<clientDownload></clientDownload>
			<p class="copyright">
				{{ $copyRight }}
			</p>
		</footer>
	</div>
</template>

<script>
import pageHeader from '../components/pageHeader';
export default {
	name: 'login',
	components: {
		pageHeader,
	},
	data() {
		return {
			header: {
				color: '#fff',
				background: 'rgba(0,0,0,0)',
				title: '',
				resize: false,
				mini: true,
			},
			value1: 1,
		};
	},
	computed: {
		isDiskClient: function () {
			return this.$isElectron && this.$projectInfo.projectName === 'CloudDisk';
		},
	},
	methods: {
		loginSuccess() {
			if (this.$isElectron) {
				this.$ipc.send('system', 'login', {});
			} else {
				this.$router.push('/index');
			}
		},
		changeType(type) {
			this.$refs.loginModule.nowType = type;
		},
		openGitHub() {
			window.open(this.$gitHub);
		},
	},
};
</script>

<style scoped lang="scss">
.index-section {
	width: 100%;
	height: calc(100% - 60px);
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	background: url('../assets/img/login/bg.jpg');
	background-size: 100% 100%;
	.login-window {
		width: 350px;
		background: #fff;
		margin-right: 5%;
		display: flex;
		border-radius: 10px;
		margin-top: -120px;
		padding-bottom: 20px;
		.left {
			width: 100%;
			padding: 10px 20px;
			position: relative;
			z-index: 1;
			.web-title {
				font-size: 20px;
				padding: 20px 0 10px;
			}
		}
		.right {
			flex: 1;
			width: 100%;
			height: 100%;
			display: none;
		}
	}
	.client {
		width: 100%;
		height: 100%;
		margin: 0;
		border-radius: 0;
		.left {
			padding-top: 40px;
		}
		.right {
			display: block;
			position: relative;
			.logo {
				position: absolute;
				top: 60px;
				left: 0;
				right: 0;
				bottom: 0;
				margin: auto;
				border-radius: 100%;
				object-fit: none;
				width: 100px;
				height: 100px;
				animation: break 2s ease-in-out 350ms infinite alternate;
				box-shadow: 0 0 35px 3px rgba(255, 255, 255, 0.5);
			}
			@keyframes break {
				from {
					box-shadow: 0 0 15px 3px rgba(255, 255, 255, 0.1);
					color: #ffffff50;
				}
				to {
					box-shadow: 0 0 35px 3px rgba(255, 255, 255, 0.5);
					color: #ffffff;
				}
			}
			@keyframes heart {
				from {
					transform: translate(0, 0);
				}
				to {
					transform: translate(0, 6px);
				}
			}
			span {
				position: absolute;
				color: #ffffff50;
				text-align: center;
				border-radius: 100%;
				width: 50px;
				height: 50px;
				line-height: 50px;
				animation: break 2s ease-in-out 350ms infinite alternate;
				box-shadow: none !important;
				&.name {
					width: unset;
					font-family: zk-font;
					padding: 0 10px;
					line-height: 30px;
					color: #fff !important;
				}
				&.site {
					width: unset;
					bottom: -100px;
					right: 38px;
					opacity: 0.5;
					padding: 0 10px;
					line-height: 30px;
					color: #fff !important;
				}
				&.download {
					top: 200px;
					left: 143px;
					font-size: 20px;
				}
				&.fast {
					top: 120px;
					left: 285px;
					font-size: 20px;
				}
				&.image {
					top: 131px;
					left: 183px;
					font-size: 20px;
				}
				&.music {
					top: 286px;
					left: 183px;
					font-size: 18px;
				}
				&.video {
					top: 177px;
					left: 356px;
					font-size: 18px;
				}
				&.shield {
					top: 310px;
					left: 260px;
					font-size: 18px;
				}
				&.share {
					top: 266px;
					left: 333px;
					font-size: 18px;
				}
			}
		}
	}
}
.index-footer {
	width: 100%;
	height: 150px;
	display: flex;
	align-items: center;
	justify-content: space-around;
	position: absolute;
	bottom: 0;
	background: #fff;
	flex-direction: column;
	.banner-info {
		width: 1000px;
		height: 200px;
		position: absolute;
		margin-top: -500px;
		.banner-content {
			width: 600px;
			height: 200px;
			p {
				font-size: 44px;
				color: #fff;
				position: relative;
				padding: 10px 100px;
			}
			p:before {
				content: '“';
				position: absolute;
				font-family: fantasy;
				left: 56px;
				top: -36px;
				font-size: 100px;
				color: #fff;
				opacity: 0.5;
			}
			p:after {
				content: '”';
				position: absolute;
				font-family: fantasy;
				right: 56px;
				bottom: -36px;
				font-size: 100px;
				color: #fff;
				opacity: 0.5;
			}
			p:first-child:after,
			p:last-child:before {
				display: none;
			}
		}
	}
	.copyright {
		font-size: 12px;
		color: #6d6d6d;
	}
}
</style>
