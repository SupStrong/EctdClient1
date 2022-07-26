<template>
	<Poptip trigger="hover" placement="bottom-start" width="200" padding="0" @on-popper-show="hoverUser = true" @on-popper-hide="hoverUser = false">
		<div class="user-container">
			<div class="user">
				<img v-if="userInfo.avatar" :src="userInfo.avatar" alt="" draggable="false" />
				<span class="name">{{ userInfo.name || '未登录' }}</span>
			</div>
			<!-- <Icon :class="['arrow', { rotate: hoverUser }]" type="ios-arrow-up" /> -->
		</div>
		<div class="action-head" slot="title">
			<div class="user">
				<img v-if="userInfo.avatar" :src="userInfo.avatar" alt="" draggable="false" />
				<span class="name">{{ userInfo.name || '未登录' }}</span>
			</div>
		</div>
		<div class="action-list" slot="content">
			<ul>
				<li v-for="(item, index) in actionMenu" :key="index" @click="dropDownClick(item.action)">
					{{ item.name }}
				</li>
			</ul>
		</div>
	</Poptip>
</template>

<script>
export default {
	name: 'diskUser',
	data() {
		return {
			hoverUser: false,
			quitFlag: false,
			actionMenu: [
				{
					name: '退出',
					action: 'exit',
				},
			],
		};
	},
	computed: {
		userInfo() {
			return this.$store.state.userInfo;
		},
	},
	mounted() {
		if (this.$isElectron) {
			window.onbeforeunload = () => {
				if (!this.quitFlag && process.env.NODE_ENV !== 'development') {
					this.$emit('show');
					this.dropDownClick('exit');
					return false;
				}
			};
			this.$ipc.on('exit', () => {
				this.dropDownClick('exit');
			});
			this.$ipc.on('forces-exit', () => {
				this.quitFlag = true;
			});
		} else {
			this.actionMenu.splice(1, 1);
		}
	},
	methods: {
		dropDownClick(command) {
			switch (command) {
				case 'account':
					this.$userAccount();
					break;
				case 'setting':
					this.$cloudWindow({
						url: 'disk-setting',
						component: require('../views/setting'),
						only: true,
						name: 'diskOfficeViewer',
						title: 'C-DISK设置',
						width: 600,
						height: 400,
						minHeight: 350,
						minWidth: 500,
						minimizable: false,
						maximizable: false,
						resizable: false,
						background: '#fff',
						color: '#4f4f4',
						frame: false,
						close: () => {
							//delete this.fileViewer[type];
						},
						callback: (com) => {
							//com.init(data);
						},
					});
					break;
				case 'about':
					this.$about();
					break;
				case 'feedBack':
					this.$feedBack();
					break;
				case 'switch':
				case 'exit':
					let tips = '',
						type = '';
					type = command === 'switch' ? '切换账号' : '退出';
					let count = this.$parent.updateCount ? this.$parent.updateCount().count : 0;
					if (count > 0) {
						tips = `${count}个传输任务未完成，${type}将${this.$isElectron ? '暂停' : '取消'}传输<br>`;
					}
					this.$confirm(type, command === 'switch' ? '确认退出当前账号吗' : '确认退出C-Disk吗', {}).then(() => {
						this.quitFlag = true;
						if (this.$isElectron) {
							this.$emit('exit');
							this.$ipc.send('system', command === 'switch' ? 'logoff' : 'exit');
						} else {
							this.$api.user.logout(() => {
								this.$router.push('/login');
							});
						}
					});
					break;
			}
		},
	},
};
</script>

<style scoped lang="scss">
.user {
	display: flex;
	align-items: center;
	-webkit-app-region: no-drag;
	img {
		border-radius: 100%;
		width: 35px;
		height: 35px;
		box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
	}
	span {
		font-size: 14px;
		margin: 0 10px;
	}
}
.user-container {
	display: flex;
	align-items: center;
	.arrow {
		transition: all 350ms;
		font-size: 18px;
		color: #8c8c8c;
	}
	.rotate {
		transform: rotate(180deg) !important;
	}
	::v-deep {
		.name {
			color: #8c8c8c;
		}
	}
	&:hover {
		.name {
			color: $diskMainColor;
		}
		.arrow {
			color: $diskMainColor;
		}
	}
}
::v-deep {
	.ivu-poptip-title {
		&:after {
			display: none;
		}
	}
}
.action-head {
	height: 80px;
	display: flex;
	align-items: center;
	padding: 10px;
	border-radius: 4px 4px 0 0;
	background: linear-gradient(to right, #4481eb 0%, #04befe 100%);
	::v-deep {
		img {
			width: 45px;
			height: 45px;
		}
		.name {
			color: #fff !important;
		}
	}
}
.action-list {
	width: 100%;
	ul {
		padding: 10px 0;
		li {
			width: 100%;
			height: 35px;
			line-height: 35px;
			padding: 0 10px;
			font-size: 14px;
			color: #424e67;
			&:hover {
				background: #f0f8fd;
			}
		}
	}
}
</style>
