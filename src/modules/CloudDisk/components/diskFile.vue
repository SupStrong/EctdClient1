<template>
	<div class="file" :class="{ active: item.active }" @mousedown.stop="mousedown" @dblclick.stop="open(item)">
		<!-- <div class="select" @mousedown.stop.prevent="prevent">
			<Checkbox v-model="item.active"></Checkbox>
		</div> -->
		<span class="icon">
			<!-- {{ item.$icon }} -->
			<img :src="item.$icon == 'ImageType.png' ? 'https://aliyun-wb-bvqq7ezi1t.oss-cn-beijing.aliyuncs.com/' + item.content : itemIcon(item)" alt="" />
		</span>
		<p>{{ item.name }}</p>
		<!--<div class="time">{{ item.updatedAt }}</div>
		<div class="size">{{ item.$size }}</div> -->
	</div>
</template>

<script>
export default {
	name: 'DiskFile',
	props: {
		item: {
			type: Object,
		},
	},
	methods: {
		itemIcon(item) {
			if (item.thumb) {
				return this.$api.public.server('url') + item.thumb;
			}
			return require('../assets/img/disk/' + item.$icon);
		},
		mousedown(e) {
			this.$emit('mousedown', e);
		},
		open(item) {
			console.log('000');
			this.$emit('open', 'open', item);
		},
		prevent() {},
	},
};
</script>

<style scoped lang="scss">
/*文件图标视图*/
.block-file {
	.file {
		width: 85px;
		height: 80px;
		float: left;
		margin: 10px 10px 0 0;
		text-align: center;
		border-radius: 3px;
		cursor: pointer;
		overflow: hidden;
		.icon {
			font-size: 30px;
			width: 100%;
			height: 40px;
			line-height: 40px;
			margin-top: 5px;
			display: block;
			img {
				height: 40px;
			}
		}
		.select {
			display: none;
		}
		p {
			color: #333333;
			text-overflow: ellipsis;
			word-break: break-all;
			font-size: 11px;
			width: 100%;
		}
		.time {
			display: none;
		}
		.size {
			display: none;
		}
	}
}
/*文件列表视图*/
.list-file {
	.file {
		padding-left: 5px;
		cursor: pointer;
		margin: 3px 0;
		display: flex;
		align-items: center;
		line-height: 35px;
		font-size: 12px;
		text-align: left;
		float: left;
		img {
			width: 100px;
			height: 100px;
		}
		.icon {
			padding-top: 9px;
		}
		.time {
			width: calc(23% - 10px);
			text-indent: 10px;
		}
		.size {
			width: 25%;
			text-indent: 20px;
		}
		p {
			width: 53%;
			height: 35px;
			margin-left: 5px;
			overflow: hidden;
			word-break: break-all;
			text-overflow: ellipsis;
		}
	}
}
.file:hover {
	background: #f4f5f7;
}
/*选中样式*/
.active {
	background: #ececec !important;
}
</style>
