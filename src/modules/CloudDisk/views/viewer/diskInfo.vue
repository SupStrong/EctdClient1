<template>
	<div class="cloud-disk-info-main" @keyup.stop.esc="close" tabindex="-1">
		<windowHeader :config="header" />
		<div class="header" v-if="fileData.$icon">
			<img draggable="false" :src="itemIcon(fileData)" alt="" />
			<span>{{ fileData.name }}</span>
		</div>
		<div class="content">
			<div class="info-item">
				<span>文件类型:</span>
				<div>{{ fileData.type === 'folder' ? '文件夹' : fileData.extName + '文件' }}</div>
			</div>
			<div class="info-item">
				<span>文件位置:</span>
				<div class="address">
					<span>网盘</span>
					<span v-for="(item, index) in fileData.address" :key="index"> /{{ item.name }} </span>
				</div>
			</div>
			<div class="info-line"></div>
			<div class="info-item">
				<span>文件大小:</span>
				<div>{{ fileData.$size }} ({{ fileData.size }}字节)</div>
			</div>
			<div class="info-item">
				<span>创建时间:</span>
				<div>{{ fileData.createdAt }}</div>
			</div>
			<div class="info-item">
				<span>修改时间:</span>
				<div>{{ fileData.updatedAt }}</div>
			</div>
			<div class="info-line"></div>
			<div class="info-item">
				<span>唯一标识:</span>
				<div>{{ fileData.id }}</div>
			</div>
			<div class="info-item">
				<span>文件分享:</span>
				<template v-if="fileData.share">
					<input :value="shareUrl" @focus="copy" type="text" />
					<button @click="copy">复制</button>
				</template>
				<div v-if="!fileData.share">未分享</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'diskInfo',
	data() {
		return {
			fileData: {},
			header: {
				title: '',
				resize: false,
				mini: false,
			},
		};
	},
	computed: {
		shareUrl: function () {
			return this.$api.public.server('diskWebUrl') + 's/' + this.fileData.share;
		},
	},
	created() {
		if (this.$isElectron) {
			this.$ipc.on('win-data', (event, data) => {
				//接收打开文件的数据
				this.init(data);
			});
		}
	},
	methods: {
		init(data) {
			if (!data.address) {
				this.$api.disk.fileInfo(
					{
						id: data.id,
					},
					(rs) => {
						this.fileData = Object.assign(data, rs.data);
					}
				);
			} else {
				this.fileData = data;
			}
			this.header.title = data.name + ' 属性';
		},
		itemIcon(item) {
			return require('../../assets/img/disk/' + item.$icon);
		},
		copy() {
			this.$copyText(this.shareUrl);
		},
		close() {
			this.window.close();
		},
	},
};
</script>

<style scoped lang="scss">
/*文件属性窗口*/
.cloud-disk-info-main {
	width: 100%;
	height: 100%;
	background: #fff;
	color: #000;
	-webkit-app-region: drag;
	border: 1px solid #efefef;
	display: flex;
	flex-direction: column;
	.header {
		width: 100%;
		display: flex;
		height: 50px;
		padding: 0 6px;
		align-items: center;
		img {
			width: 40px;
		}
		span {
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 14px;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-left: 10px;
		}
	}
	.content {
		width: 100%;
		height: calc(100% - 50px);
		overflow: auto;
		padding: 0 10px;
		.info-item {
			display: flex;
			align-items: baseline;
			font-size: 14px;
			line-height: 32px;
			span {
				font-weight: 600;
			}
			div {
				width: calc(100% - 105px);
				flex: 1;
				text-overflow: ellipsis;
				white-space: normal;
				padding-top: 6px;
				padding-left: 10px;
				color: #2d2d2d;
			}
		}
		.info-line {
			width: 100%;
			height: 1px;
			background: #eaecf0;
			margin: 5px auto;
		}
		.address {
			span {
				font-weight: normal;
			}
		}
	}
}
.info-item input {
	width: calc(100% - 120px);
	height: 29px;
	border-radius: 0;
	margin-left: 10px;
	-webkit-app-region: no-drag;
}
.info-item input::selection {
	color: #5b5bea !important;
	background-color: #eaecf0;
}
.info-item button {
	float: right;
	background: none;
	height: 30px;
	line-height: 30px;
	padding: 0 10px;
	-webkit-app-region: no-drag;
	color: #5b5bea;
}
</style>
