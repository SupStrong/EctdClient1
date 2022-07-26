<template>
	<div :class="{ 'cd-tree-container': first }">
		<div class="cd-tree-list" :class="{ open: item.show }" v-for="(item, index) in !first ? data : normalData" :key="index">
			<ul class="list-container" :class="{ child: item.id !== 1 }">
				<li class="cd-tree" @dblclick.stop="openTree(item, index)" @mousedown="selectTree(item)">
					<Icon v-if="!item.show && item.load !== 'loading'" type="ios-folder" />
					<Icon v-if="item.load === 'loading'" type="ios-loading sf-spin" />
					<Icon v-if="item.show && item.load !== 'loading'" type="ios-folder-open" />
					<div :title="item.name">{{ item.name }}</div>
				</li>
				<DiskTree :data="item.child" :first="false" :filter="filter" v-if="item.show" @select="selectTree" />
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DiskTree',
	props: {
		data: {
			type: Array,
			default: function () {
				return [];
			},
		},
		filter: {
			type: Array,
			default: function () {
				return [];
			},
		},
		first: {
			type: Boolean,
			default: function () {
				return true;
			},
		},
	},
	data() {
		return {
			normalData: [{ name: '我的网盘', id: 1, show: false, load: false, child: [] }],
		};
	},
	methods: {
		checkIn(item, rs) {
			if (rs[0] && rs[0].parentId === item.id) {
				rs.forEach((items) => {
					if (this.filter.length === 0 || !this.filter.includes(items.id)) {
						items.load = false;
						items.show = false;
						items.child = [];
						item.child.push(items);
					}
				});
			}
		},
		loadTree(list) {
			this.$api.disk.folderList(
				{
					parentId: list.id,
				},
				(rs) => {
					this.checkIn(list, rs.data); //检查并插入数据
					list.load = 'success';
					list.show = true;
				}
			);
		},
		openTree(item, index) {
			if (item.load === 'success') {
				item.show = !item.show;
			} else {
				item.load = 'loading';
				this.loadTree(item);
			}
		},
		selectTree(item) {
			let tree = document.getElementsByClassName('cd-tree');
			for (let i = 0; i < tree.length; i++) {
				tree[i].className = 'cd-tree';
			}
			let path = event.path;
			for (let j = 0; j < path.length; j++) {
				if (path[j].nodeName === 'LI') {
					path[j].className = 'cd-tree active';
				}
			}
			this.$emit('select', item);
		},
	},
};
</script>

<style scoped lang="scss">
.cd-tree-container {
	width: 100%;
	height: 100%;
	padding: 15px;
	overflow: hidden;
	overflow-y: auto;
	.cd-tree-list {
		position: relative;
	}
}

.list-container {
	width: 100%;
	height: auto;
	&.child {
		padding-left: 22px;
	}
	&:after {
		content: '';
		width: 9px;
		height: 32px;
		//border-left: 1px dashed red;
		border-bottom: 1px dashed #c8c8cc;
		position: absolute;
		left: 14px;
		top: -14px;
		z-index: -1;
	}
	&:before {
		content: '';
		width: 1px;
		border-left: 1px dashed #c8c8cc;
		height: 100%;
		position: absolute;
		left: 14px;
		top: -13px;
		z-index: -1;
	}
	li {
		width: 100%;
		height: 30px;
		line-height: 30px;
		cursor: pointer;
		margin-bottom: 2px;
		border-radius: 3px;
		display: flex;
		align-items: center;
		span,
		i {
			display: block;
			line-height: 30px;
			margin: 0 5px;
			color: #f5c257;
			font-size: 20px;
		}
		div {
			width: 100%;
			overflow: hidden;
			padding-right: 5px;
			text-overflow: ellipsis;
		}
		&:hover,
		&.active {
			background: #ececec;
			color: $diskMainColor !important;
		}
	}
}
</style>
