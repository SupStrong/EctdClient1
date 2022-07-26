<template>
	<header class="index-header">
		<div class="logo">
			<img src="../../../assets/common/img/app/CloudDisk.png" alt="" draggable="false" />
			<div class="info">
				<!-- <p class="name">LC-XHS</p>
				<p class="site">愿长夜漫漫 总有人为你留一盏灯</p> -->
				<div class="name anniu btnInput" style="margin-bottom:10px;border:1px solid red" id="btnInput" @click="btnInput">按钮阿</div>
				<input type="text" ref="anniuInput" id="anniuInput" style="border:1px solid red" placeholder="hhhhhh">
			</div>
		</div>
		<div class="action">
			<template v-if="login">
				<diskUser></diskUser>
			</template>
			<template v-else>
				<button @click="changeType('login')">登录</button>
				<button @click="changeType('register')">注册</button>
			</template>
			<!-- <button @click="openGitHub">
				<Icon type="logo-github" />
				GitHub	
			</button> -->
		</div>
	</header>
</template>

<script>
import diskUser from './diskUser';
export default {
	name: 'pageHeader',
	components: {
		diskUser,
	},
	data() {
		return {
			login: false,
		};
	},
	mounted() {
		this.getUser();
	},
	methods: {
		btnInput(){
			var apple = document.getElementById( 'anniuInput' );
			let a = document.getElementById('btnInput');
			apple.focus();
		},
		getUser() {
			this.$api.user.verifyToken(
				() => {
					if (this.$route.name.includes('Login')) {
						this.$router.push('/index');
					} else {
						this.$api.user.info(false, (rs) => {
							this.$store.commit('updateUserInfo', rs.data);
							this.login = true;
							this.$emit('login');
						});
					}
					this.$emit('complete');
				},
				() => {
					this.login = false;
					this.$emit('complete');
				}
			);
		},
		goHome() {
			location.href = this.$api.public.server('diskWebUrl');
		},
		openGitHub() {
			window.open(this.$gitHub);
		},
		changeType(type) {
			this.$emit('change', type);
		},
	},
};
</script>

<style scoped lang="scss">
.index-header {
	width: 100%;
	height: 60px;
	box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.05);
	padding: 0 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #fff;
	.logo {
		display: flex;
		align-items: center;
		cursor: pointer;
		img {
			width: 45px;
			margin-right: 10px;
			border-radius: 100%;
			background: #edf1f8;
		}
		.info {
			zoom: 90%;
			.name {
				color: #636363;
				font-size: 22px;
				font-family: 'zk-font';
				line-height: 20px;
			}
			.site {
				font-size: 12px;
				color: #6d6d6d;
			}
		}
	}
	.action {
		display: flex;
		align-items: center;
		button {
			padding: 0 10px;
			background: #fff;
			color: #2f2f2f;
			font-size: 14px;
			&:hover {
				color: $diskMainColor;
			}
		}
	}
}
</style>
