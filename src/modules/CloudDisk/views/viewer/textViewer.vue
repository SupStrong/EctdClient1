<template>
	<div class="cloud-disk-text-viewer">
		<windowHeader :config="header" />
		<div class="container">
			<SshPre v-if="fileContent" :language="extName">
				{{ fileContent }}
			</SshPre>
		</div>
	</div>
</template>

<script>
import SshPre from 'simple-syntax-highlighter';
import 'simple-syntax-highlighter/dist/sshpre.css';
export default {
	name: 'textViewer',
	components: {
		SshPre,
	},
	data() {
		return {
			fileContent: false,
			extName: 'js',
			header: {
				title: '',
				background: '#fff',
				color: '#6d6d6d',
			},
		};
	},
	mounted() {
		if (this.$isElectron) {
			this.$ipc.on('win-data', (event, data) => {
				//接收打开文本文件的数据
				this.init(data);
			});
		}
	},
	methods: {
		init(data) {
			this.$nextTick(() => {
				this.fileContent = null;
				this.src = this.$api.public.uploadUrl('disk', data.content);
				this.header.title = data.name + '-文本查看器';
				let extName = data.extName;
				this.extName = extName.substr(1);
				this.$api.disk.getContent(data.id, (rs) => {
					this.$nextTick(() => {
						this.fileContent = rs.data;
					});
				});
			});
		},
	},
};
</script>

<style scoped lang="scss">
/*text窗口*/
.cloud-disk-text-viewer {
	width: 100%;
	height: 100%;
	background: #fff;
	display: flex;
	flex-direction: column;
	.container {
		width: 100%;
		height: 100%;
		flex: 1;
		user-select: text;
		::v-deep {
			.ssh-pre {
				margin: 0;
				height: 100%;
				overflow: auto;
			}
		}
	}
}
</style>
