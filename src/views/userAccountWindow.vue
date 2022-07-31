<template>
	<div class="cloudSeries-account-win">
		<windowHeader style="position: absolute" :config="header" />
		<div class="head">{{ userInfo.name }}</div>
		<div class="cloud-main">
			<div class="left">
				<ul>
					<li v-for="(item, index) in menuType" :key="index" :class="{ active: nowActive === index }" @click="nowActive = index">{{ item }}</li>
				</ul>
			</div>
			<div class="right" :class="animation">
				<div class="info-card" v-if="nowActive === 0">
					<div class="user">
						<label :class="{ editMode: editMode }" for="avatar" @mouseenter="showUpload = true" @mouseleave="showUpload = false" title="更换头像">
							<img class="avatar" :src="userInfo.avatar" draggable="false" alt="" />
							<input type="file" id="avatar" @change="selectFile" />
							<div :style="{ opacity: showUpload ? 1 : 0 }">修改头像</div>
						</label>
						<template v-if="editMode">
							<Form :label-width="75" style="margin-top: 10px">
								<formInput label="用户名" v-model="userInfoConfig.name" maxlength="15" :required="false"></formInput>
								<FormItem label="生日:">
									<DatePicker type="date" v-model="userInfoConfig.birthDay" placeholder="选择一个日期" style="width: 100%"></DatePicker>
								</FormItem>
								<FormItem label="性别:">
									<Select v-model="userInfoConfig.sex">
										<Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
									</Select>
								</FormItem>
								<formInput label="个性签名" type="textarea" v-model="userInfoConfig.sign" :rows="4" maxlength="50" :required="false"></formInput>
							</Form>
							<div class="button-area">
								<Button @click="editMode = false">取消</Button>
								<Button type="primary" @click="updateUser">更新</Button>
							</div>
						</template>
						<template v-else>
							<p class="name">{{ userInfo.name }}</p>
							<p class="info">{{ otherInfo }}</p>
							<p class="info">CLOUDID：{{ userInfo.account }}</p>
							<p class="info">邮箱：{{ userInfo.email }}</p>
							<p class="info">手机号：{{ userInfo.phone }}</p>
							<p class="info">个性签名：{{ userInfo.sign }}</p>
							<p class="info edit" @click="editMode = true">编辑信息</p>
						</template>
					</div>
				</div>
				<div class="user-safe" v-else-if="nowActive === 1">
					<p class="setting-title">
						<span class="icon sf-icon-shield-check"></span>
						安全相关
					</p>
					<div class="setting-content">
						<div class="title">账号密码</div>
						<Form :label-width="100">
							<formInput label="当前账号密码" v-model="editPassWord.password" type="password" :required="false"></formInput>
							<formInput label="新的账号密码" v-model="editPassWord.newPassword" type="password" :required="false"></formInput>
							<formInput label="再次输入密码" v-model="editPassWord.confirmPassWord" type="password" :required="false"></formInput>
						</Form>
						<div class="button-area">
							<button :disabled="passwordDisabled" @click="updatePassWord">立即修改</button>
						</div>
					</div>
					<div class="setting-content">
						<div class="title">
							<div class="text">邮箱绑定</div>
							<div class="tips">修改后需要重新登录</div>
						</div>
						<Form :label-width="100">
							<formInput
								label="当前邮箱"
								v-model="editEmail.oldEmail"
								:disabled="editEmail.step === 2"
								:placeholder="userInfo.email"
								:required="false"
							></formInput>
							<formInput label="新的邮箱" v-model="editEmail.email" :disabled="editEmail.step === 2" :required="false"></formInput>
							<formInput v-if="editEmail.step === 2" label="验证码" v-model="editEmail.code" :required="false"></formInput>
						</Form>
						<div class="button-area">
							<button v-if="editEmail.step === 1" :disabled="emailDisabled" @click="updateEmail">立即验证</button>
							<button v-else :disabled="emailDisabled" @click="updateEmail">验证并修改</button>
						</div>
					</div>
					<div class="setting-content">
						<div class="title">手机号绑定</div>
						暂不支持
					</div>
				</div>
				<div class="user-link" v-else-if="nowActive === 2">
					<p class="setting-title">
						<span class="icon sf-icon-link"></span>
						账号关联
					</p>
					<div class="setting-content">
						<div class="title">网易云音乐账号</div>
					</div>
				</div>
				<div class="user-logout" v-else-if="nowActive === 3">
					<p class="setting-title">
						<span class="icon sf-icon-times-hexagon"></span>
						账号注销
					</p>
					<div class="setting-content">
						<p class="logout-tips">感谢您{{ userInfo.createdAt ? '在' + userInfo.createdAt : '' }}注册了此账号，以下是注销说明</p>
						<p class="logout-tips">本次操作将<span>彻底删除</span>所有与您有关的数据</p>
						<div class="logout-tips">
							<ul>
								<li></li>
							</ul>
						</div>
					</div>
					<div class="setting-content">
						<p class="logout-tips">具体数据如下</p>
						<div class="logout-tips">
							<ul class="delete-list">
								<li v-for="(item, index) in deleteDataInfo" :key="index">
									{{ item }}
								</li>
							</ul>
						</div>
						<p class="logout-tips">
							该操作<span>不可逆</span>，是否继续。
							<button @click="deleteUser">继续</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'userAccountWindow',
	data() {
		return {
			header: {
				title: '',
				resize: false,
				mini: false,
				color: '#fff',
				index: 2,
			},
			userInfo: {
				sex: 0,
				birthDay: '',
			},
			userInfoConfig: {
				name: '',
				sign: '',
				sex: '2',
			},
			editPassWord: {
				password: '',
				newPassword: '',
				confirmPassWord: '',
			},
			passwordPending: false,
			editEmail: {
				email: '',
				oldEmail: '',
				step: 1,
				code: '',
			},
			emailPending: false,
			deleteDataInfo: ['您的个人用户信息', 'CloudWeb下所有应用的数据', 'C-DISK的所有数据', 'C-SAFE的所有数据', 'C-NOTE的所有数据', '关联的账号信息'],
			sexList: [
				{
					label: '女',
					value: '0',
				},
				{
					label: '男',
					value: '1',
				},
				{
					label: '不指定',
					value: '2',
				},
			],
			showUpload: false, //显示修改头像
			avatarFile: false, //头像文件
			avatarFileType: false, //文件格式
			changePassForm: {},
			nowActive: 0,
			menuType: ['个人信息', '安全相关', '账号关联', '账号注销'],
			editMode: false,
			animation: '',
		};
	},
	mounted() {
		this.getUserInfo();
	},
	watch: {
		nowActive: function (now, old) {
			if (now > old) {
				this.animation = 'animated slideInUp';
			} else {
				this.animation = 'animated slideInDown';
			}
			let a = setTimeout(() => {
				this.animation = '';
				clearTimeout(a);
			}, 350);
		},
	},
	computed: {
		otherInfo: function () {
			let sex = this.userInfo.sex.toString() === '2' ? '性别:' + this.sexList[this.userInfo.sex].label : this.sexList[this.userInfo.sex].label;
			let age = this.userInfo.birthDay && this.userInfo.birthDay.length ? ',' + new Date().age(this.userInfo.birthDay) + '岁' : '';
			return sex + age;
		},
		passwordDisabled: function () {
			return (
				this.editPassWord.password.length === 0 ||
				this.editPassWord.newPassword.length === 0 ||
				this.editPassWord.newPassword !== this.editPassWord.confirmPassWord ||
				this.editPassWord.password === this.editPassWord.newPassword ||
				this.passwordPending
			);
		},
		emailDisabled: function () {
			return (
				this.editEmail.email.length === 0 ||
				this.editEmail.oldEmail.length === 0 ||
				this.editEmail.email === this.editEmail.oldEmail ||
				(this.editEmail.step === 2 && this.editEmail.code.length === 0) ||
				this.emailPending
			);
		},
	},
	methods: {
		getUserInfo() {
			this.$api.user.info(false, (rs) => {
				this.$nextTick(() => {
					if (this.$store) {
						// this.$store.commit('updateUserInfo', rs.data);
					}
					this.userInfo = rs.data;
					this.userInfoConfig = JSON.handle(rs.data);
				});
			});
		},
		selectFile(e) {
			let target = e.target;
			let file = target.files[0];
			let type = this.$path.extname(file.name).toLowerCase().replace('.', '');
			if (type.Exist('png,jpeg,jpg,gif')) {
				if (type.size > 512000) {
					this.$Message.error('请选择小于500KB的图像文件');
					target.value = '';
					return false;
				}
				this.avatarFile = file;
				this.avatarFileType = type;
			} else {
				this.$Message.error('请选择png、jpeg、jpg、gif格式的文件');
				target.value = '';
			}
		},
		updateUser() {
			if (!this.userInfoConfig.name || this.userInfoConfig.name.length === 0) {
				this.$Message.error('用户名不能为空');
				return;
			}
			if (this.userInfoConfig.name.length > 15) {
				this.$Message.error('用户名长度过长');
				return;
			}
			if (this.userInfoConfig.sign && this.userInfoConfig.sign.length > 50) {
				this.$Message.error('个性签名长度过长');
				return;
			}
			let fd = new FormData();
			delete this.userInfoConfig.id;
			delete this.userInfoConfig.avatar;
			delete this.userInfoConfig.phone;
			delete this.userInfoConfig.email;
			for (let key in this.userInfoConfig) {
				fd.append(key, this.userInfoConfig[key]);
			}
			if (this.avatarFile) {
				let old_avatar = this.userInfo.avatar.Before('/');
				if (old_avatar !== 'normal.jpg' && this.avatarFileType !== old_avatar.Before('.').toLowerCase()) {
					//如果不是默认头像，新旧文件后缀不一样
					fd.append('old_avatar', old_avatar);
				}
				fd.append('avatar', this.avatarFile);
			}
			this.$api.user.update(fd, (rs) => {
				this.$Message.success(rs.msg);
				this.editMode = false;
				this.getUserInfo();
			});
		},
		updatePassWord() {
			this.passwordPending = true;
			this.$api.user.updatePassword(
				this.editPassWord,
				(rs) => {
					this.passwordPending = false;
					this.$Message.success(rs.msg);
					this.editPassWord = {
						password: '',
						newPassword: '',
						confirmPassWod: '',
					};
				},
				(rs) => {
					this.passwordPending = false;
					this.$Message.error(rs.msg);
				}
			);
		},
		updateEmail() {
			this.emailPending = true;
			this.$api.user.updateEmail(
				this.editEmail,
				(rs) => {
					this.emailPending = false;
					if (this.editEmail.step === 1) {
						this.$set(this.editEmail, 'step', 2);
					} else {
						if (this.$isElectron) {
							this.$ipc.send('system', 'logoff');
						} else {
							this.$api.user.logout(() => {
								this.$router.push('/');
							});
						}
					}
					this.$Message.success(rs.msg);
				},
				(rs) => {
					this.emailPending = false;
					this.$Message.error(rs.msg);
				}
			);
		},
		deleteUser() {
			this.$Message.info('正在开发');
		},
		close() {
			this.$refs.header.close();
		},
	},
};
</script>

<style scoped lang="scss">
$settingPanel: #f9f9f9;
.cloudSeries-account-win {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	.head {
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-image: url('../assets/common/svg/header.svg');
		background-size: 100% 100%;
		background-position: bottom center;
		//background-image: linear-gradient(to right, $mainColor 0%, #00f2fe 100%);
		padding: 0 50px 0 10px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		font-size: 16px;
		color: #fff;
		position: relative;
		z-index: 1;
	}
}
.cloud-main {
	display: flex;
	height: calc(100% - 50px);
	padding: 15px;
}
.left {
	width: 130px;
	height: 100%;
	background: $settingPanel;
	border-radius: 5px;
	ul {
		li {
			width: 100%;
			height: 35px;
			line-height: 35px;
			border-left: 4px solid rgba(0, 0, 0, 0);
			padding-left: 10px;
			cursor: pointer;
			margin-bottom: 10px;
			color: #4c4c4c;
			&:hover {
				border-left: 4px solid #eee;
			}
			&.active {
				border-left: 4px solid $diskMainColor;
				background: linear-gradient(274deg, rgba(251, 251, 251, 0) 0%, #edf4fc 75%, #d2e1ff 100%);
			}
		}
	}
}
.right {
	width: 100%;
	height: 100%;
	overflow: auto;
	padding: 0 10px;
	flex: 1;
	.setting-title {
		width: 100%;
		line-height: 50px;
		border-radius: 5px;
		background: $settingPanel;
		padding: 0 10px;
		margin-bottom: 10px;
		color: #4c4c4c;
		font-size: 18px;
		display: flex;
		align-items: center;
		.icon {
			margin-right: 10px;
			font-size: 20px;
			color: $mainColor;
			&.sf-icon-link {
				color: #00c261;
			}
			&.sf-icon-times-hexagon {
				color: red;
			}
		}
	}
	.setting-content {
		width: 100%;
		border-radius: 5px;
		background: $settingPanel;
		padding: 10px 15px;
		margin-bottom: 15px;
		.title {
			width: 100%;
			margin-bottom: 10px;
			font-size: 16px;
			color: #313131;
			display: flex;
			align-items: flex-end;
			border-bottom: 1px solid #eee;
			.tips {
				font-size: 12px;
				color: #fb5c5c;
				margin-left: 10px;
				font-weight: normal;
			}
		}
		.logout-tips {
			width: 100%;
			font-size: 14px;
			line-height: 24px;
			color: #4c4c4c;
			position: relative;
			button {
				color: red;
				position: absolute;
				right: 0;
				top: 0;
				padding: 0 10px;
				font-size: 14px;
				background: none;
			}
			.delete-list {
				padding-left: 23px;
				color: #717171;
				margin: 5px 0;
				li {
					width: 100%;
					font-size: 12px;
					list-style: circle;
				}
			}
			span {
				color: red;
				font-weight: bold;
			}
		}
		.button-area {
			width: 100%;
			display: flex;
			align-items: center;
			margin-top: 15px;
			justify-content: flex-end;
			button {
				background: $diskMainColor;
				color: #fff;
				padding: 0 10px;
				height: 32px;
				border-radius: 5px;
				font-size: 14px;
			}
		}
		::v-deep {
			.ivu-form-item {
				margin-bottom: 10px;
				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}
	.info-card {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		border-radius: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		img {
			width: 100px;
			height: 100px;
			border-radius: 100%;
			box-shadow: 1px 1px 17px -10px rgb(0 0 0 / 50%);
		}
		.user {
			width: 360px;
			height: 100%;
			background: #f9f9f9;
			padding: 10px;
			display: flex;
			align-items: center;
			flex-direction: column;
			position: relative;
			border-radius: 5px;
			box-shadow: 1px 1px 17px -10px rgb(0 0 0 / 50%);
			overflow: hidden;
			::v-deep.ivu-form-item {
				margin-bottom: 10px;
			}
			input {
				display: none;
			}
			label {
				width: 130px;
				height: 130px;
				position: relative;
				z-index: 2;
				transition: all 0.35s;
				cursor: pointer;
				&.editMode {
					width: 80px;
					height: 80px;
				}
				.avatar {
					width: 100%;
					height: 100%;
					border-radius: 100%;
					border: 1px solid #eee;
					background: rgba(255, 255, 255, 0.5);
				}
				div {
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.5);
					position: absolute;
					border-radius: 100%;
					top: 0;
					z-index: 3;
					overflow: hidden;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #fff;
					font-size: 16px;
					transition: all 0.35s;
				}
			}
			p {
				max-width: 80%;
				z-index: 2;
			}
			.name {
				width: 100%;
				text-align: center;
				font-weight: bold;
				margin-top: 10px;
				font-size: 18px;
				color: #5f5f5f;
			}
			.info {
				font-size: 14px;
				margin-top: 10px;
				color: #6d6d6d;
			}
			.edit {
				color: $diskMainColor;
				cursor: pointer;
			}
			.button-area {
				button {
					margin: 0 3px;
				}
			}
		}
	}
}
</style>
