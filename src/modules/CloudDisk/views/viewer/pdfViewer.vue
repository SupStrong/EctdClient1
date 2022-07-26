<template>
	<div class="cloud-disk-pdf-viewer">
		<windowHeader :config="header" />
		<div class="container">
			<iframe ref="webview" :src="src" frameborder="0"></iframe>
		</div>
	</div>
</template>

<script>
export default {
	name: 'pdfViewer',
	data() {
		return {
			src: null,
			header: {
				title: '',
				background: '#323639',
				color: '#fff',
			},
		};
	},
	created() {
		if (this.$isElectron) {
			this.$ipc.on('win-data', (event, data) => {
				//接收打开pdf文件的数据
				this.init(data);
			});
		}
	},
	methods: {
		init(data) {
			this.$nextTick(() => {
				this.src = this.$api.public.uploadUrl('disk', data.content);
				this.header.title = data.name + '-PDF阅读器';
			});
		},
	},
};
</script>

<style scoped lang="scss">
/*pdf窗口*/
.cloud-disk-pdf-viewer {
	width: 100%;
	height: 100%;
	background: #4e5255;
	display: flex;
	flex-direction: column;
	.container {
		width: 100%;
		height: 100%;
		flex: 1;
		iframe {
			width: 100%;
			height: 100%;
			margin: 0;
		}
	}
}
</style>
