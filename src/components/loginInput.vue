<template>
	<div :class="[inputClass, styleMode]">
		<span :class="'sf-icon-' + config.icon"></span>
		<input
			:id="id"
			:type="config.type === 'verify' ? 'text' : config.type || 'text'"
			v-model="inputData"
			autocomplete="off"
			spellcheck="false"
			@focus="focusState = 'input-container focus'"
			@blur="blur"
			@input="update"
			@keyup.enter="goEnter"
			:disabled="disabled ? disabled : false"
		/>
		<label :for="id">{{ config.desp }}</label>
		<Tooltip v-if="config.type === 'verify'" content="点击刷新" placement="bottom-end" :transfer="true">
			<img draggable="false" :src="url" @click="reload" alt="" />
		</Tooltip>
	</div>
</template>

<script>
export default {
	name: 'l-input',
	data() {
		return {
			id: 'input-' + Math.random(),
			focusState: 'input-container',
			url: this.$api.public.verifyCode(),
			inputData: '',
			timeFlag: false,
			styleMode: 'normal',
		};
	},
	model: {
		prop: 'propValue',
		event: 'input',
	},
	props: {
		config: {
			type: Object,
		},
		propValue: {
			type: [String, Number, undefined],
			default: function () {
				return '';
			},
		},
		disabled: {
			type: [Boolean, String],
			default: function () {
				return false;
			},
		},
	},
	mounted() {
		this.inputData = this.propValue;
		this.styleMode = this.$parent.mode;
	},
	computed: {
		inputClass: function () {
			return this.config.disabled || this.inputData ? 'input-container focus' : this.focusState;
		},
	},
	watch: {
		propValue: function () {
			this.inputData = this.propValue;
		},
	},
	methods: {
		update() {
			this.$emit('input', this.inputData);
		},
		goEnter() {
			this.$emit('enter');
		},
		blur() {
			if (this.config.value) {
				this.focusState = 'input-container focus';
			} else {
				this.focusState = 'input-container';
			}
		},
		reload() {
			if (this.timeFlag) {
				this.$Message.info(this.timeFlag + 's后可重新获取');
				return;
			}
			this.url = this.$api.public.verifyCode();
			this.$Message.info('验证码已刷新,2分钟内有效');
			this.timeFlag = 10;
			let a = setInterval(() => {
				this.timeFlag--;
				if (this.timeFlag === 0) {
					clearInterval(a);
				}
			}, 1000);
		},
	},
};
</script>

<style scoped lang="scss">
.input-container {
	width: 100%;
	position: relative;
	display: flex;
	align-items: center;
	overflow: unset !important;
	&.normal {
		height: 40px;
		border-bottom: 1px solid #eee;
		margin-top: 20px;
	}
	&.dialog {
		height: 50px;
		border: 1px solid #dadce0;
		border-radius: 4px;
		margin-top: 15px;
		span {
			font-size: 16px;
		}
		label {
			font-size: 16px;
			top: 11px;
		}
		input {
			font-size: 16px;
		}
	}
	span {
		width: 40px;
		height: 40px;
		position: absolute;
		text-align: center;
		line-height: 40px;
		font-size: 14px;
		color: #b8b7b7;
	}
	label {
		position: absolute;
		left: 35px;
		font-size: 14px;
		top: 10px;
		cursor: text;
		transition: all 0.35s;
		color: #80868b;
		background: #fff;
		padding: 0 8px;
	}
	input {
		width: 100%;
		height: 32px;
		padding-left: 42px;
		background: none;
		font-size: 14px;
		color: #202124;
	}
	input[disabled='disabled'] {
		cursor: not-allowed;
	}
	.ivu-tooltip {
		width: 100px;
		height: 40px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-right: 10px;
	}
	img {
		width: 100%;
		height: 100%;
		cursor: pointer;
	}
}
.focus {
	&.dialog {
		border: 2px solid $mainColor !important;
	}
	label {
		top: -10px !important;
		font-size: 12px !important;
		color: $mainColor !important;
	}
}
</style>
