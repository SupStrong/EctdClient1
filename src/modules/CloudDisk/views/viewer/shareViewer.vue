<template>
	<div class="cd-share-main">
		<Tabs type="card">
			<TabPane label="创建链接分享">
				<div class="share-card" v-if="!shareSuccess">
					<div class="line">
						<div class="label">提取码:</div>
						<ISwitch v-model="needPass">
							<span slot="open">开</span>
							<span slot="close">关</span>
						</ISwitch>
					</div>
					<div class="line" v-if="needPass">
						<div class="label"></div>
						<div class="pass-container">
							<RadioGroup v-model="passType">
								<Radio label="auto">
									<span>系统自动生成</span>
								</Radio>
								<Radio label="customer">
									<span>自定义</span>
								</Radio>
							</RadioGroup>
							<div class="content">
								<p v-if="passType === 'auto'">由系统随机生成提取码</p>
								<p v-else>请手动填写，尽量不要使用同一密码</p>
								<input v-model="passCode" type="text" maxlength="4" v-if="passType === 'customer'" />
							</div>
						</div>
					</div>
				</div>
				<div class="share-success" v-if="shareSuccess">
					<p>
						<i class="sf-icon-check-circle"></i>
						<span>分享成功，快复制发给好友吧</span>
					</p>
					<div class="line">
						<div class="label">链接：</div>
						<div class="value">
							<Input type="text" v-model="shareUrl" readonly />
						</div>
					</div>
					<div class="line" v-if="needPass" style="margin: 0">
						<div class="label">提取码：</div>
						<div class="value">
							<Input type="text" v-model="passCode" style="width: 100px" readonly />
						</div>
					</div>
					<div class="line" style="justify-content: flex-end">
						<Button type="primary" @click="copyAddress">复制链接{{ needPass ? '及提取码' : '' }}</Button>
					</div>
				</div>
			</TabPane>
			<!--<TabPane label="发送给好友">敬请期待</TabPane>-->
		</Tabs>
		<div class="button-area" v-if="!shareSuccess">
			<Button type="primary" :loading="loading" @click="createShare">创建</Button>
			<Button @click="close">取消</Button>
		</div>
		<div class="button-area" v-else>
			<Button @click="close">关闭</Button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DiskShare',
	data() {
		return {
			needPass: false,
			passType: 'auto',
			passCode: '',
			shareSuccess: false,
			shareCode: '',
			shareFile: {},
			loading: false,
		};
	},
	computed: {
		shareUrl: function () {
			return this.$api.public.server('diskWebUrl') + 's/' + this.shareCode;
		},
		copyValue: function () {
			return '链接:' + this.shareUrl + (this.needPass ? '提取码:' + this.passCode : '');
		},
	},
	methods: {
		init(file) {
			this.shareFile = file;
			this.shareSuccess = false;
			this.needPass = false;
			this.passType = 'auto';
			this.shareCode = '';
			this.passCode = '';
			this.loading = false;
		},
		createShare() {
			let obj = {};
			if (this.loading) {
				return;
			}
			if (this.needPass) {
				if (this.passType === 'auto') {
					this.passCode = this.randomStr(4);
				} else {
					if (this.passCode.length !== 4) {
						this.$Message.warning('请填写4位的提取码');
						return;
					}
				}
				obj.pass = this.passCode;
			}
			this.loading = true;
			this.$api.disk.createShare(
				{
					id: this.shareFile.id,
					...obj,
				},
				(rs) => {
					this.loading = false;
					this.shareSuccess = true;
					this.shareCode = rs.data;
				},
				(rs) => {
					this.loading = false;
					this.shareSuccess = false;
				}
			);
		},
		randomStr: function (len) {
			len = len || 32;
			let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
			let maxPos = $chars.length;
			let pwd = '';
			for (let i = 0; i < len; i++) {
				pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return pwd;
		},
		copyAddress() {
			this.$copyText(this.copyValue);
		},
		close() {
			if (this.loading) {
				return;
			}
			this.$parent.close(this.shareSuccess ? this.shareCode : false);
		},
	},
};
</script>

<style scoped lang="scss">
/*分享窗口*/
.cd-share-main {
	width: 100%;
	height: 100%;
	padding: 20px;
	position: relative;
	.share-card {
		width: 100%;
		height: 100%;
		padding: 0 10px;
		.line {
			width: 100%;
			display: flex;
			align-items: flex-start;
			margin-bottom: 10px;
			.label {
				width: 100px;
			}
			.pass-container {
				width: 400px;
				height: 100px;
				.content {
					padding: 5px 20px;
					p {
						font-size: 12px;
						color: #989898;
					}
					input {
						margin-top: 10px;
						width: 60px;
						height: 32px;
						padding: 0 3px;
						border-radius: 3px;
						border: 1px solid rgb(220 220 220);
						&:focus {
							border: 1px solid $diskMainColor;
						}
					}
				}
			}
		}
	}
	.share-success {
		width: 100%;
		height: 100%;
		padding: 0 0 30px 30px;
		p {
			display: flex;
			align-items: center;
			margin-bottom: 10px;
			i {
				font-size: 40px;
				color: #00cc88;
			}
			span {
				margin-left: 10px;
			}
		}
		.line {
			width: 100%;
			display: flex;
			align-items: center;
			margin-bottom: 20px;
			.label {
				width: 68px;
			}
			.value {
				flex: 1;
			}
		}
	}
	.button-area {
		position: absolute;
		right: 20px;
		bottom: 20px;
		button {
			margin-left: 10px;
		}
	}
}
</style>
