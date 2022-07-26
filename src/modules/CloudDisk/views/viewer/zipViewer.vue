<template>
	<div class="cloud-disk-zipper-viewer">
		<windowHeader :config="header" />
		<div class="zipper-main">
			<div class="header">
				<button @click="extract('all')">
					<Icon type="md-archive" />
					<p>全部解压</p>
				</button>
				<button :disabled="zipViewer.selectFiles.length === 0" @click="extract">
					<Icon type="md-archive" />
					<p>解压选中</p>
				</button>
			</div>
			<div class="main">
				<div class="left">
					<zipTree :data="folderList" @select="treeSelect"></zipTree>
				</div>
				<div class="right">
					<div class="nav">
						<div class="item" v-for="(nav, index) in navData" :key="index" @click="treeSelect(nav)">
							{{ nav.name }}
						</div>
					</div>
					<div class="file-list">
						<div
							class="zip-item"
							v-for="(item, index) in fileList"
							:class="{ active: item.active }"
							@mousedown.stop="selectFiles($event, item, index)"
							@dblclick="treeSelect(item)"
							:key="index"
						>
							<img :src="itemIcon(item)" class="icon" alt="" draggable="false" />
							<div class="name">{{ item.name }}</div>
							<div class="size">{{ item.$size }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import zipTree from '../../components/zipTree';
import treeViewer from '../../tools/treeViewer';
export default {
	name: 'zipViewer',
	components: {
		zipTree,
	},
	data() {
		return {
			header: {
				title: '',
				color: '#fff',
				background: 'linear-gradient(to right, #38f 0%, #00f2fe 100%)',
			},
			originList: [],
			originFileList: [],
			folderList: [],
			fileList: [],
			navData: [],
			zipViewer: {
				keyFlag: null, //按住的按键
				select: {}, //当前选择的（单个）
				selectFiles: [], //多选
			},
			zipId: 0,
			unpacking: false,
		};
	},
	watch: {
		fileList: {
			handler: function () {
				this.zipViewer.selectFiles = this.fileList.filter((item) => {
					return item.active;
				});
			},
			deep: true,
		},
		unpacking: function () {
			if (this.unpacking) {
				localStorage.lockUnpack = true;
			} else {
				localStorage.removeItem('lockUnpack');
			}
		},
	},
	mounted() {
		if (this.$isElectron) {
			this.$ipc.on('win-data', (event, data) => {
				//接收打开压缩文件的数据
				this.init(data);
			});
		}
	},
	beforeDestroy() {
		document.documentElement.removeEventListener('keydown', () => {}, true);
		document.documentElement.removeEventListener('keyup', () => {}, true);
	},
	methods: {
		init(data) {
			this.unpacking = localStorage.lockUnpack;
			document.addEventListener('keydown', (e) => {
				if (e.key === 'Control') {
					this.zipViewer.keyFlag = 'Control';
				}
				if (e.key === 'Shift') {
					this.zipViewer.keyFlag = 'Shift';
				}
			});
			document.addEventListener('keyup', (e) => {
				this.zipViewer.keyFlag = null;
			});
			this.zipId = data.id;
			this.$api.disk.zipInfo(
				{
					id: data.id,
				},
				(rs) => {
					let fileList = rs.data.list;
					let folder = fileList.filter((item) => {
						return item.type === 'folder';
					});
					fileList.forEach((item) => {
						this.$api.disk.diskData(item);
					});
					this.originFileList = JSON.handle(fileList);
					this.originList = JSON.handle(folder);
					folder.forEach((item) => {
						item.child = fileList.filter((file) => {
							return file.path === item.entryName && file.type === 'file';
						});
					});
					this.folderList = this.createTree(folder);
					if (this.folderList.length) {
						this.treeSelect(this.folderList[0]);
					}
				}
			);
		},
		createTree(data) {
			for (let i = data.length - 1; i > -1; i--) {
				let item = data[i];
				item.show = true;
				item.child = item.child || [];
				for (let j = data.length - 1; j > -1; j--) {
					let obj = data[j];
					if (obj.path === item.entryName) {
						item.child.unshift(obj);
						data.splice(j, 1);
					}
				}
			}
			return data;
		},
		itemIcon(item) {
			return require('../../assets/img/disk/' + item.$icon);
		},
		treeSelect(item) {
			if (item.type === 'folder') {
				this.fileList = item.child;
				let entry = item.entryName.split('/');
				let navData = this.originList.filter((item) => {
					return entry.includes(item.name);
				});
				let folder = JSON.handle(navData);
				folder.forEach((item) => {
					item.child = this.originFileList.filter((file) => {
						return file.path === item.entryName;
					});
				});
				this.navData = folder;
			}
		},
		selectFiles(event, item, index) {
			if (event.button === 0 || event.button === 2) {
				event.stopPropagation();
				if (!this.zipViewer.keyFlag) {
					if (this.zipViewer.selectFiles.length === 0) {
						item.active = true;
						this.zipViewer.select = item;
					} else {
						let hasFlag = this.zipViewer.selectFiles.filter((select) => {
							return select.entryName === item.entryName;
						});
						if (!hasFlag.length) {
							this.clearSelect();
							item.active = true;
							this.zipViewer.select = item;
						}
					}
				}
				document.onmouseup = () => {
					document.onmousemove = null;
					if (this.zipViewer.keyFlag === 'Control') {
						//Ctrl多选
						item.active = !item.active; //反选
					} else if (this.zipViewer.keyFlag === 'Shift') {
						//Shift多选
						let Start = index,
							End;
						item.active = true;
						if (this.zipViewer.select.entryName) {
							for (let i = 0; i < this.fileList.length; i++) {
								if (this.fileList[i].entryName === this.zipViewer.select.entryName) {
									Start = i;
								}
								if (this.fileList[i].entryName === item.entryName) {
									End = i;
								}
							}
						}
						this.clearSelect(true);
						for (let j = Math.min(End, Start); j < Math.max(End, Start) + 1; j++) {
							this.fileList[j].active = true;
						}
					} else if (!this.zipViewer.keyFlag) {
						if (event.button === 2) {
							//如果是右键，判断当前是否在已选中的里面
							let hasIndex = this.zipViewer.selectFiles.filter((file) => {
								return file.id === item.id;
							});
							if (!hasIndex.length) {
								//单选
								this.clearSelect();
								item.active = true;
								this.zipViewer.select = item;
							}
						} else {
							//左键直接取消原有的选中
							this.clearSelect();
							item.active = true;
							this.zipViewer.select = item;
						}
					}
				};
			}
		},
		clearSelect() {
			this.fileList.forEach((item) => {
				item.active = false;
			});
		},
		extract(type) {
			if (this.unpacking) {
				this.$Message.warning('正在解压，请等待解压完成');
				return false;
			}
			let data = 'all';
			if (type !== 'all') {
				let select = this.zipViewer.selectFiles;
				data = this.getAllChild(select, []);
				if (data.length > 80) {
					this.$Message.warning('文件/文件夹数量过多，请选择全部解压');
					return false;
				}
				data = data.reduce((a, b) => {
					a.push(b.entryName);
					return a;
				}, []);
				console.log(data);
			}
			treeViewer(
				'请选择要解压到的目录',
				(select) => {
					if (select) {
						let msg = this.$Message.loading({
							content: '正在解压...',
							duration: 0,
						});
						this.unpacking = true;
						this.$api.disk.zipUnpack(
							{
								targetId: select.id,
								id: this.zipId,
								files: data,
							},
							(rs) => {
								this.unpacking = false;
								msg();
								this.$Message.success('解压成功');
							},
							(rs) => {
								this.unpacking = false;
								msg();
								this.$Message.error(rs.msg);
							}
						);
					}
				},
				[]
			);
		},
		getAllChild(data, result) {
			data.forEach((item) => {
				result.push(item);
				if (item.child && item.child.length) {
					this.getAllChild(item.child, result);
				}
			});
			return result;
		},
	},
};
</script>

<style scoped lang="scss">
.cloud-disk-zipper-viewer {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
	position: relative;
	.zipper-main {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		flex-direction: column;
		flex: 1;
		.header {
			width: 100%;
			height: 70px;
			background-image: linear-gradient(to right, #38f 0%, #00f2fe 100%);
			//background: $diskMainColor;
			display: flex;
			align-items: flex-start;
			box-shadow: 0 0 11px -2px rgb(0 0 0 / 50%);
			position: relative;
			flex: none;
			z-index: 1;
			button {
				width: 60px;
				height: 60px;
				margin: 0 10px;
				background: none;
				border-radius: 5px;
				color: #fff;
				i {
					font-size: 26px;
				}
				p {
					font-size: 12px;
					margin-top: 5px;
				}
			}
		}
		.main {
			width: 100%;
			height: 100%;
			flex: 1;
			display: flex;
			.left {
				width: 200px;
				height: 100%;
				background: #fff;
				border-right: 1px solid #eee;
			}
			.right {
				width: 100%;
				height: 100%;
				flex: 1;
				display: flex;
				flex-direction: column;
				.nav {
					width: 100%;
					height: 35px;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #eee;
					padding: 0 5px;
					.item {
						font-size: 12px;
						&:after {
							content: '/';
						}
						&:hover {
							color: $diskMainColor;
							cursor: pointer;
						}
					}
				}
				.file-list {
					width: 100%;
					height: calc(100% - 70px);
					overflow: auto;
					padding: 5px;
					flex: 1 1 0;
					.zip-item {
						width: 100%;
						display: flex;
						align-items: center;
						height: 35px;
						padding: 0 5px;
						font-size: 12px;
						color: #4c4c4c;
						border-radius: 3px;
						margin-bottom: 2px;
						.icon {
							width: 20px;
						}
						.name {
							margin-left: 5px;
						}
						.size {
							width: 150px;
							text-align: left;
							margin-left: auto;
						}
						&:hover,
						&.active {
							background: #eee;
							cursor: pointer;
						}
					}
				}
			}
		}
	}
}
</style>
