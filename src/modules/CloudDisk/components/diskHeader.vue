<template>
	<section class="cloud-disk-header">
		<windowHeader ref="windowHeader" :config="headerConfig" width="32px" mode="hide"></windowHeader>
		<header class="header fl-row-justy">
			<div style="width: 100%; display: flex">
				<p class="multibtn" @click="handleCollapse" multibtn>
					<i class="el-icon-s-fold"></i>
				</p>
				<div class="logo">
					<img src="https://aliyun-wb-bvqq7ezi1t.oss-cn-beijing.aliyuncs.com//image/2022/6-28/logo.png" alt="" />
				</div>
				<div class="nav full-screen">
					<p class="multibtn" @click="handleChange('fullScreen')" multibtn>
						<i class="iconfont" :class="isFullFlag ? 'icon-quanping1' : 'icon-tuichuquanping'"></i>
					</p>
				</div>
			</div>
			<div class="login">
				<el-dropdown :hide-on-click="false" placement="bottom" @command="handleCommand">
					<div class="userlable">
						<div class="avatar_img_box">
							<span>{{userData.name}}</span>
						</div>
						<span class="menu"></span>
					</div>
					<template v-slot:dropdown>
						<el-dropdown-menu style="width: 140px">
							<!-- <el-dropdown-item command="userInfo">个人中心</el-dropdown-item> -->
							<el-dropdown-item command="logout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</header>
	</section>
</template>

<script>
import screenfull from 'screenfull'; //引入依赖
export default {
	name: 'diskHeader',
	components: {
	},
	data() {
		return {
			headerConfig: {
				background: 'transparent',
				color: 'rgb(150,150,150,1)',
				title: '',
				resize: true,
				mini: true,
				close: (win) => {
					win.hide();
				},
			},
			isFullFlag: false,
			isFullscreen: false,
			navTypes: [],
			userData:{},
			platform: process.platform,
		};
	},
	props: {
		data: {
			type: Object,
		},
		isCollapse: {
			type: Boolean,
			default: function () {
				return false;
			},
		},
		type: {
			type: String,
			default: function () {
				return 'disk';
			},
		},
	},
	mounted() {
		this.userData = JSON.parse(localStorage.getItem('user'));
		// 监听页面全屏
		window.addEventListener('fullscreenchange', (e) => {
			if (screenfull.isFullscreen) {
				this.isFullFlag = true;
			} else {
				this.isFullFlag = false;
			}
		});
	},
	computed: {
		sizeTips() {
			console.log(this.data.size.total.fileSize(), 'this.data.size.total.fileSize()');
			return this.data.size.used.fileSize() + '/' + this.data.size.total.fileSize();
		},
		isDisk() {
			return this.$projectInfo.projectName === 'CloudDisk';
		},
		isWeb() {
			return !this.$isElectron;
		},
	},
	methods: {
		handleCollapse() {
			this.$emit('handleClick', !this.isCollapse);
		},
		handleCommand(command) {
			if (command === 'logout') {
				this.$api.user.logout(() => {
					this.$router.push('/login');
				});
			} else if (command === 'userInfo') {
				console.log('个人中心');
			}
		},
		handleChange(type) {
			if (!screenfull.isEnabled) {
				this.$message('您的浏览器不能全屏');
				return false;
			}
			screenfull.toggle();
		},
		navTypeChange(value) {
			this.$emit('update:type', value);
		},
		showWin() {
			this.$refs.windowHeader.win.show();
		},
		exitDisk() {
			this.$parent.uploadList.forEach((item) => {
				typeof item.pause === 'function' ? item.pause() : '';
			});
		},
		updateCount() {
			return this.$parent.updateCount().count;
		},
	},
};
</script>

<style scoped lang="scss">
.header {
	height: 56px;
	padding: 0 23px;
	background-color: #0e1630;
}
.logo {
	width: 130px;
	height: 45px;
	img {
		width: 100%;
		height: 100%;
	}
}
.avatar_img_box {
	height: 35px;
	width: 35px;
	border-radius: 25px;
	margin-right: 10px;
	background-color: #386893;
	overflow: hidden;
	margin-left: 20px;
	span {
		margin-left: 0;
		line-height: 35px;
		color: #fff;
		display: block;
		text-align: center;
		letter-spacing: 2px;
	}
}
.nav {
	width: 100%;
	display: flex;
	align-items: center;
	margin-left: 10px;
	.nav-list {
		padding: 0 12px;
		font-size: 15px;
		color: white;
		cursor: pointer;
	}
}
.login {
	display: flex;
	align-items: center;
	.btns {
		width: 65px;
		height: 30px;
		font-size: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		border-radius: 5px;
		font-weight: bold;
		cursor: pointer;
	}
	.btns:nth-child(1) {
		background-color: #2f2f2f;
		border: 1px solid white;
		margin-right: 15px;
		font-size: 14px;
	}
	.btns:nth-child(2) {
		background-color: #2f2f2f;
		color: #ff4e60;
		border: 1px solid #ff4e60;
		font-size: 14px;
	}
}
.full-screen {
	justify-content: flex-end;
	font-size: 22px;
}
.multibtn {
	width: 38px;
	max-width: 38px;
	height: 38px;
	max-height: 38px;
	font-size: 18px;
	border-radius: 38px;
	margin: 2px;
	cursor: pointer;
	display: inline-flex;
	vertical-align: middle;
	i {
		color: white;
		display: flex;
		align-items: center;
	}
}
.userlable {
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: white;
	cursor: pointer;
	img {
		width: 25px;
		border-radius: 25px;
		height: 25px;
		margin-right: 10px;
	}
}
</style>
