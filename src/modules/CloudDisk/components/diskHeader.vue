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
				<div class="nav">
					<!-- <div class="nav-list">
						<div>热门模板</div>
						<div></div>
					</div> -->
				</div>
			</div>
			<div class="login">
				<div class="btns">登录</div>
				<div class="btns">注册</div>
			</div>
		</header>
	</section>
</template>

<script>
import diskUser from './diskUser';
export default {
	name: 'diskHeader',
	components: {
		diskUser,
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
			navTypes: [
			],
			platform: process.platform,
		};
	},
	props: {
		data: {
			type: Object,
		},
		isCollapse:{
			type: Boolean,
			default :function () {
				return  false;
			},
		},
		type: {
			type: String,
			default: function () {
				return 'disk';
			},
		},
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
		handleCollapse(){
			this.$emit('handleClick', !this.isCollapse);
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
		width: 75px;
		height: 35px;
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
.multibtn{
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
		i{
			color:white;
			display: flex;
			align-items: center;
		}
}
</style>
