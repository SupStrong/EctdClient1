<template>
	<div :class="{ 'zip-tree-container': first }">
		<div class="zip-tree-list" :class="{ open: item.show }" v-for="(item, index) in data" :key="index">
			<ul class="list-container" :class="{ child: !first }">
				<li class="zip-tree" :class="{ active: first }" @dblclick.stop="openTree(item, index)" v-if="item.type === 'folder'" @mousedown="selectTree(item)">
					<Icon v-if="!item.show" type="ios-folder" />
					<Icon v-if="item.show" type="ios-folder-open" />
					<div :title="item.name">{{ item.name }}</div>
				</li>
				<zipTree :data="item.child" :first="false" v-if="item.show" @select="selectTree" />
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	name: 'zipTree',
	props: {
		data: {
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
	methods: {
		openTree(item, index) {
			item.show = !item.show;
		},
		selectTree(item) {
			let tree = document.getElementsByClassName('zip-tree');
			for (let i = 0; i < tree.length; i++) {
				tree[i].className = 'zip-tree';
			}
			let path = event.path;
			for (let j = 0; j < path.length; j++) {
				if (path[j].nodeName === 'LI') {
					path[j].className = 'zip-tree active';
				}
			}
			this.$emit('select', item);
		},
	},
};
</script>

<style scoped lang="scss">
.zip-tree-container {
	width: 100%;
	height: 100%;
	padding: 15px;
	overflow: hidden;
	overflow-y: auto;
	.zip-tree-list {
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
