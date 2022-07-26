<template>
	<div class="cloud-client-download" :class="type">
		<button @click="goGetClient('windows')" title="下载windows客户端">
			<Icon type="logo-windows" />
			<p>Windows</p>
		</button>
		<button @click="goGetClient('linux')" title="下载linux客户端" disabled>
			<Icon type="logo-tux" />
			<p>Linux</p>
		</button>
		<button @click="goGetClient('mac')" title="下载Mac客户端" disabled>
			<Icon type="ios-laptop" />
			<p>MacOS</p>
		</button>
		<button @click="goGetClient('android')" title="下载Android客户端" disabled>
			<Icon type="logo-android" />
			<p>Android</p>
		</button>
		<button @click="goGetClient('ios')" title="下载IOS客户端" disabled>
			<Icon type="logo-apple" />
			<p>Apple</p>
		</button>
	</div>
</template>

<script>
export default {
	name: 'clientDownload',
	props: {
		type: {
			type: String,
			default: function () {
				return 'page';
			},
		},
	},
	data() {
		return {
			app: {},
		};
	},
	mounted() {
		this.app = this.$projectInfo;
		console.log(this.app);
	},
	computed: {
		appName: function () {
			return this.app.projectName;
		},
	},
	methods: {
		goGetClient(type) {
			switch (type) {
				case 'windows':
					this.$api.public.getApp(this.appName, (rs, url) => {
						window.open(url);
					});
					break;
				case 'linux':
					this.$api.public.getApp(this.appName, (rs, url) => {
						window.open(url);
					});
					break;
				case 'mac':
					this.$api.public.getApp(this.appName, (rs, url) => {
						window.open(url);
					});
					break;
				case 'android':
					break;
				case 'ios':
					break;
			}
		},
	},
};
</script>

<style scoped lang="scss">
.cloud-client-download {
	&.components {
		button {
			width: 35px;
			height: 35px;
			margin: 0 5px;
			i {
				font-size: 16px;
			}
		}
		p {
			display: none;
		}
	}
	button {
		width: 90px;
		height: 90px;
		color: #333;
		margin: 0 10px;
		background: none;
		i {
			font-size: 40px;
		}
		p {
			margin-top: 10px;
			font-size: 14px;
		}
	}
	button:first-child:hover {
		color: #05a6f0;
	}
	button:nth-child(4):hover {
		color: #67c23a;
	}
}
</style>
