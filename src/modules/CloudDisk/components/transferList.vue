<template>
	<ul class="cloud-disk-transfer-list">
		<li v-for="item in data" :key="item.key" v-show="category === item._state || (category === item._type && item._state !== 'finish')">
			<div class="name">
				<span>{{ item.name }}</span>
			</div>
			<div class="task-actions">
				<i
					:class="buttonType(item)"
					v-show="item._state !== 'waiting' && item._state !== 'finish' && item._state !== 'cancelled' && ($isElectron || item._type !== 'download')"
					@click="pause(item)"
					style="font-size: 14px"
				/>
				<i class="sf-icon-times" v-show="item._state !== 'finish' && item._state !== 'cancelled'" @click="cancel(item)" />
				<i class="sf-icon-trash-alt" v-show="item._state === 'finish' || item._state === 'cancelled'" @click="removeMission(item)" />
				<i class="sf-icon-folder" v-show="item._type === 'download' && $isElectron" @click="openFolder(item)" />
			</div>
			<div class="task-progress">
				<Progress :percent="item._progress" :stroke-width="6" />
			</div>
			<div class="task-speed">
				{{ item._stateText }}
				{{ item._progressText }}
				<span v-show="item._state === 'progress'">{{ mathSpeed(item) }}</span>
			</div>
		</li>
	</ul>
</template>

<script>
export default {
	name: 'transferList',
	props: {
		data: Array,
		category: String,
		type: String,
	},
	watch: {
		data: {
			handler: function () {
				if (this.$isElectron) {
					this.$api.localFile.write(this.type, this.data);
				}
				this.updateData();
			},
			deep: true,
		},
	},
	methods: {
		buttonType(item) {
			if (item._state === 'paused') {
				return 'ivu-icon ivu-icon-ios-play';
			} else {
				return 'ivu-icon ivu-icon-ios-pause';
			}
		},
		formatSeconds(value) {
			let secondTime = parseInt(value); // 秒
			let minuteTime = 0; // 分
			let hourTime = 0; // 小时
			if (secondTime > 60) {
				//如果秒数大于60，将秒数转换成整数
				//获取分钟，除以60取整数，得到整数分钟
				minuteTime = parseInt(secondTime / 60);
				//获取秒数，秒数取佘，得到整数秒数
				secondTime = parseInt(secondTime % 60);
				//如果分钟大于60，将分钟转换成小时
				if (minuteTime > 60) {
					//获取小时，获取分钟除以60，得到整数小时
					hourTime = parseInt(minuteTime / 60);
					//获取小时后取佘的分，获取分钟除以60取佘的分
					minuteTime = parseInt(minuteTime % 60);
				}
			}
			let result = '';
			if (secondTime > 0) {
				result = '' + parseInt(secondTime) + '秒';
			} else {
				result = '正在计算';
			}
			if (minuteTime > 0) {
				result = '' + parseInt(minuteTime) + '分' + result;
			}
			if (hourTime > 0) {
				result = '' + parseInt(hourTime) + '小时' + result;
			}
			return result;
		},
		mathSpeed(item) {
			let NowTime = new Date().getTime() / 1000;
			let time = NowTime - item._time;
			let speed = item._chunk / time;
			let remaining_chunk = item.size - item._chunk;
			let remaining_time = remaining_chunk / speed;
			return speed.fileSize() + '/s  剩余时间:' + this.formatSeconds(remaining_time);
		},
		removeMission(item) {
			this.$emit('remove', item);
		},
		openFolder(item) {
			this.$electron.shell.showItemInFolder(item.url);
		},
		updateData() {
			this.$emit('update');
		},
		cancel(item) {
			typeof item.cancel === 'function' ? item.cancel() : '';
		},
		pause(item) {
			typeof item.pause === 'function' ? item.pause() : '';
		},
	},
};
</script>

<style scoped lang="scss">
.cloud-disk-transfer-list {
	width: 100%;
	li {
		width: 100%;
		position: relative;
		padding: 16px 12px;
		border: 1px solid #ccc;
		border-radius: 6px;
		margin: 16px 0;
		transition: border-color 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
		.name {
			color: #505753;
			margin-bottom: 20px;
			margin-right: 240px;
			word-break: break-all;
			span {
				font-size: 14px;
				line-height: 26px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
		.task-actions {
			position: absolute;
			top: 16px;
			right: 12px;
			height: 24px;
			padding: 0 10px;
			overflow: hidden;
			user-select: none;
			cursor: default;
			text-align: right;
			direction: rtl;
			border: 1px solid #f5f5f5;
			color: #9b9b9b;
			background-color: #fff;
			border-radius: 14px;
			transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
			i {
				float: left;
				display: inline-block;
				padding: 5px;
				margin: 0 4px;
				font-size: 12px;
				cursor: pointer;
				line-height: 15px;
			}
		}
		.task-actions:hover {
			border-color: #5b5bea;
			color: #fff;
			background-color: #5b5bea;
			width: auto;
		}
		.task-speed {
			font-size: 12px;
			line-height: 14px;
			min-height: 14px;
			color: #9b9b9b;
			margin-top: 8px;
			span {
				float: right;
			}
		}
	}
	li:hover {
		border-color: $diskMainColor;
	}
}
</style>
