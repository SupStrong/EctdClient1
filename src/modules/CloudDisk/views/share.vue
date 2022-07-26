<template>
	<div class="cloud-disk-share">
		<pageHeader ref="header" @change="typeChange" @complete="getShareInfo" @login="isLogin = true"></pageHeader>
		<div class="share-contain main" v-if="showShare">
			<div class="left">
				<div class="one-file animated zoomIn" v-if="shareInfo.type === 'file'">
					<img :src="fileIcon(shareInfo)" :alt="shareInfo.name" />
					<p class="name">{{ shareInfo.name }}</p>
					<div class="download">
						<span>{{ downloading ? progressText : shareInfo.$size }}</span>
						<div class="progress" :style="{ width: progress }"></div>
						<button class="sf-icon-download" v-if="!downloading" @click="download"></button>
					</div>
					<!-- <button v-if="isSameUser" class="save" @click="cancelShare">取消分享</button> -->
					<!-- <button v-else class="save" @click="save">保存到网盘</button> -->
				</div>
				<div class="file-list list-file" v-else>
					<!-- <div class="header">
						<Checkbox v-model="select" @on-change="selectAll">&nbsp;&nbsp;全选</Checkbox>
						<div class="container">
							<button @click="cancelShare" v-if="isSameUser">取消分享</button>
							<button v-else @click="save">
								<span class="sf-icon-save"></span>
								保存到网盘
							</button>
						</div>
					</div> -->
					<div class="nav">
						<span class="block" @click="rootDir">根目录/</span>
						<span class="block" v-for="(item, index) in navData" :key="index" @click="openFolder(item, index)">{{ item.name }}/</span>
					</div>
					<div class="list">
						<diskFile v-for="item in fileList" :key="item.id" :item="item" @open="openFolder(item)"></diskFile>
					</div>
				</div>
			</div>
			<!-- <div class="right animated slideInRight">
				<div class="background" :style="{ background: 'url(' + shareInfo.user.avatar + ')' }"></div>
				<div class="content">
					<img :src="shareInfo.user.avatar" draggable="false" alt="" />
					<p>{{ shareInfo.user.name }}</p>
					<div class="sign">{{ shareInfo.user.sign || '暂无签名' }}</div>
				</div>
			</div> -->
		</div>
		<div class="share-contain disabled" v-else>
			<template v-if="showPassCode">
				<span class="sf-icon-cloud"></span>
				<div class="pass-area">
					<input type="text" v-model="passCode" maxlength="4" placeholder="请输入提取码" />
					<button class="sf-icon-arrow-right" :disabled="passCode.length !== 4" @click="getShareInfo"></button>
				</div>
				<div class="tips animated shakeX" v-if="errorTips">{{ errorTips }}</div>
				<div class="tips" v-else></div>
			</template>
			<template v-else>
				<span class="sf-icon-unlink"></span>
				<p>分享已失效或不存在</p>
			</template>
		</div>
		<div class="copyright">{{ $copyRight }}</div>
		<cloudDialog :show.sync="showLogin" :width="448" radius="10px" title="" height="auto" padding="0 25px 25px">
			<loginModule ref="loginModule" mode="dialog" :head="false" @login="loginSuccess">
				<template slot-scope="{ data }">
					<h2>{{ data[2] }}</h2>
				</template>
			</loginModule>
		</cloudDialog>
	</div>
</template>

<script>
import pageHeader from '../components/pageHeader';
import diskFile from '../components/diskFile';
import treeViewer from '../tools/treeViewer';
export default {
	name: 'share',
	components: {
		pageHeader,
		diskFile,
	},
	data() {
		return {
			select: false,
			showLogin: false,
			showShare: false,
			showPassCode: false,
			passCode: '',
			errorTips: '',
			shareInfo: {
				user: {},
			},
			isLogin: false,
			progress: 0,
			progressText: 0,
			downloading: false,
			fileList: [],
			saveData: [],
			navData: [],
			first: true,
		};
	},
	computed: {
		downloadUrl: function () {
			return this.$api.public.uploadUrl('disk', this.shareInfo.content);
		},
		isSameUser: function () {
			return this.$store.state.userInfo.id === this.shareInfo.user.id;
		},
	},
	watch: {
		fileList: {
			handler: function () {
				this.saveData = this.fileList.filter((item) => {
					return item.active;
				});
				this.select = this.saveData.length === this.fileList.length;
			},
			deep: true,
		},
	},
	methods: {
		getShareInfo() {
			let code = this.$route.params.share;
			if (!code) {
				return;
			}
			let pass = this.$Cookie.get('share_' + code);
			let data = {
				code: code,
			};
			if (pass) {
				data.pass = pass;
			} else {
				data.pass = this.passCode;
			}
			this.$api.disk.shareInfo(
				data,
				(rs) => {
					if (this.showPassCode) {
						this.$Cookie.set('share_' + code, data.pass, 1000 * 60 * 24);
					}
					this.showPassCode = false;
					this.showShare = true;
					this.shareInfo = rs.data;
					this.saveData = [rs.data];
					document.title = this.shareInfo.name + ' C-Disk-分享';
					if (this.shareInfo.type === 'folder') {
						if (this.$route.query.id && this.first) {
							if (this.isLogin) {
								this.updateNav(true);
								this.first = false;
							} else {
								this.fileList = [this.shareInfo];
							}
						} else {
							this.fileList = [this.shareInfo];
							if (this.fileList.length === 1) {
								this.openFolder(this.fileList[0]);
							}
						}
					}
				},
				(rs) => {
					if (rs.code === 1000) {
						//需要提取码
						this.showPassCode = true;
						this.showShare = false;
					} else {
						this.showShare = false;
						this.$Cookie.remove('share_' + code);
					}
					this.errorTips = rs.msg;
					let a = setTimeout(() => {
						this.errorTips = '';
						clearTimeout(a);
					}, 2000);
					if (rs.data) {
						document.title = rs.data.name + ' C-Disk-分享';
					}
				}
			);
		},
		typeChange(type) {
			this.showLogin = true;
			this.$nextTick(() => {
				this.$refs.loginModule.nowType = type;
			});
		},
		fileIcon(item) {
			return require('../assets/img/disk/' + item.$icon);
		},
		selectAll() {
			this.fileList.forEach((item) => {
				item.active = this.select;
			});
		},
		loginSuccess() {
			this.isLogin = true;
			this.showLogin = false;
			this.$refs.header.getUser();
		},
		rootDir() {
			this.$router.replace({
				query: {},
			});
			this.navData = [];
			this.getShareInfo();
		},
		updateNav(flag) {
			let routeData = this.$route.query;
			if (parseInt(routeData.first) === this.shareInfo.id) {
				this.$api.disk.fileInfo(
					{
						id: routeData.id,
						userId: this.shareInfo.user.id,
					},
					(rs) => {
						let index = rs.data.address.findIndex((item) => {
							return item.id === parseInt(routeData.first);
						});
						if (index) {
							rs.data.address.splice(0, index);
						}
						this.navData = rs.data.address;
						if (flag) {
							this.openFolder(this.navData[this.navData.length - 1], this.navData.length - 1);
						}
					}
				);
			}
		},
		openFolder(item, index) {
			console.log('1222');
			// if (!this.isLogin) {
			// 	this.typeChange('login');
			// 	return;
			// }
			if (item.type && item.type !== 'folder') {
				return;
			}
			this.$router.replace({
				query: {
					first: this.shareInfo.id,
					name: item.name,
					id: item.id,
				},
			});
			if (index !== undefined) {
				for (let i = this.navData.length - 1; i > 0; i--) {
					if (item.id === this.navData[i].id) {
						break;
					}
					this.navData.splice(i, 1);
				}
			} else {
				this.navData.push(item);
			}
			this.$api.disk.shareList(
				{
					id: item.id,
					userId: this.shareInfo.user.id,
				},
				(rs) => {
					this.fileList = rs.data;
				}
			);
		},
		cancelShare() {
			this.$confirm({
				title: '取消分享',
				tips: '取消后该链接将失效',
				callback: () => {
					this.$api.disk.cancelShare(
						{
							id: this.shareInfo.id,
						},
						() => {
							location.reload();
						}
					);
				},
			});
		},
		save() {
			if (!this.isLogin) {
				this.typeChange('login');
			} else {
				if (this.saveData.length === 0) {
					this.$Message.warning('请先勾选要保存的文件');
					return false;
				}
				treeViewer(
					'请选择要保存到的目录',
					(select) => {
						if (select) {
							let msg = this.$Message.loading({
								content: '正在保存...',
								duration: 0,
							});
							this.$api.disk.saveShare(
								{
									target: select.id,
									id: this.saveData.reduce((a, b) => {
										a.push(b.id);
										return a;
									}, []),
								},
								(rs) => {
									msg();
									this.$Message.success('保存成功');
								},
								(rs) => {
									msg();
									this.$Message.error(rs.msg);
								}
							);
						}
					},
					[]
				);
			}
		},
		download() {
			this.downloading = true;
			this.$api.public.download(
				this.$api.public.uploadUrl('disk', this.shareInfo.content),
				(total, load) => {
					this.progress = (load / total) * 100 + '%';
					this.progressText = load.fileSize() + '/' + total.fileSize();
				},
				(blob) => {
					this.downloading = false;
					this.progress = 0;
					const link = document.createElement('a');
					const body = document.querySelector('body');
					link.href = window.URL.createObjectURL(blob);
					link.download = this.shareInfo.name;
					link.style.display = 'none';
					body.appendChild(link);
					link.click();
					body.removeChild(link);
					window.URL.revokeObjectURL(link.href);
				}
			);
		},
	},
};
</script>

<style scoped lang="scss">
.cloud-disk-share {
	width: 100%;
	height: 100%;
	background: #edf1f5;
	display: flex;
	flex-direction: column;
	.share-contain {
		margin: 20px auto;
		width: 70%;
		height: 100%;
		flex: 1;
		overflow: hidden;
		&.main {
			background: #fff;
			border: 1px solid #eee;
			border-radius: 5px;
			display: flex;
			.left {
				width: 100%;
				height: 100%;
				flex: 1;
			}
			.right {
				width: 230px;
				height: 100%;
				border-left: 1px solid #f2f6fd;
				position: relative;
				.background {
					width: 100%;
					height: 100%;
					position: absolute;
					right: 0;
					background-size: cover !important;
					background-position: center !important;
				}
				.content {
					padding-top: 50px;
					width: 100%;
					height: 100%;
					backdrop-filter: saturate(110%) blur(100px);
					display: flex;
					flex-direction: column;
					align-items: center;
					position: relative;
					z-index: 1;
					img {
						width: 55px;
						height: 55px;
						border-radius: 100%;
						border: 1px solid #f2f6fd;
					}
					p {
						font-size: 14px;
						font-weight: bold;
						margin-top: 20px;
					}
					.sign {
						width: 80%;
						text-align: center;
						margin-top: 10px;
					}
				}
			}
			.one-file {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				.name {
					font-size: 26px;
					text-align: center;
					padding: 26px 0px 5px 0px;
				}
				.download {
					font-size: 12px;
					width: 200px;
					border-radius: 50px;
					height: 40px;
					margin-top: 10px;
					padding: 0 6px 0 20px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					background: #e1e7ea;
					color: #2d2d2d;
					position: relative;
					overflow: hidden;
					button {
						width: 32px;
						height: 32px;
						border-radius: 100%;
						text-align: center;
						line-height: 30px;
						font-size: 14px;
						background: $diskMainColor;
						color: #fff;
					}
					.progress {
						height: 40px;
						border-radius: 50px;
						background: #3388ff2e !important;
						position: absolute;
						left: 0;
						transition: all 0.35s;
					}
				}
				.save {
					background: $diskMainColor;
					color: #fff;
					margin-top: 15px;
					width: 200px;
					border-radius: 50px;
					height: 40px;
				}
			}
			.file-list {
				width: 100%;
				height: 100%;
				padding: 0 10px;
				display: flex;
				flex-direction: column;
				.header {
					width: 100%;
					height: 50px;
					border-bottom: 1px solid #eee;
					display: flex;
					align-items: center;
					padding: 0 5px;
					justify-content: space-between;
					button {
						height: 32px;
						border-radius: 3px;
						padding: 0 10px;
						font-size: 12px;
						margin-left: 10px;
						backdrop-filter: saturate(180%) blur(30px);
						background: $diskMainColor;
						color: #fff;
						line-height: 30px;
					}
				}
				.nav {
					width: 100%;
					display: flex;
					font-size: 10px;
					height: 30px;
					align-items: center;
					padding: 0 5px;
					.block {
						margin-right: 5px;
						&:hover {
							color: $diskMainColor;
							cursor: pointer;
						}
					}
				}
				.list {
					width: 100%;
					height: 100%;
					overflow: auto;
				}
			}
		}
		&.disabled {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			span {
				font-size: 100px;
				color: #b5b5b5;
			}
			p {
				font-size: 16px;
				color: #b9b8b8;
				margin-top: 10px;
			}
			.tips {
				text-align: center;
				height: 18px;
				color: #da4343;
				font-size: 12px;
				margin: 10px 0;
			}
			.pass-area {
				width: 250px;
				height: 45px;
				border-radius: 40px;
				background: #fff;
				display: flex;
				align-items: center;
				padding: 0 4px;
				justify-content: flex-end;
				position: relative;
				input {
					background: #e6e6e6;
					height: 30px;
					border-radius: 30px;
					width: calc(100% - 15px);
					left: 7px;
					position: absolute;
					padding-left: 15px;
					padding-right: 45px;
					font-size: 14px;
					font-weight: bold;
				}
				button {
					width: 35px;
					height: 35px;
					background: #38f;
					color: #fff;
					border-radius: 100%;
					border: 5px solid #fff;
					box-sizing: content-box;
				}
			}
		}
	}

	.copyright {
		width: 100%;
		text-align: center;
		color: #6d6d6d;
		font-size: 12px;
		line-height: 45px;
	}
}
</style>
