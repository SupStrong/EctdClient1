<template>
	<div class="cloud-disk-tree-viewer">
		<diskTree ref="tree" :filter="filter" @select="selectTree"></diskTree>
		<div class="button-area">
			<button :disabled="disabled" @click="submit">确定</button>
			<button @click="close">取消</button>
		</div>
	</div>
</template>

<script>
import diskTree from '../../components/diskTree';
export default {
	name: 'treeViewer',
	components: {
		diskTree,
	},
	data() {
		return {
			selectData: false,
			filter: [],
			filterData: [],
		};
	},
	computed: {
		disabled: function () {
			if (this.filterData.length && this.selectData) {
				let flag = this.filterData.filter((item) => {
					return item.id === this.selectData.id || item.parentId === this.selectData.id;
				});
				return !!flag.length;
			}
			return !this.selectData;
		},
	},
	methods: {
		selectTree(data) {
			this.selectData = data;
		},
		setFilter(data) {
			this.filterData = data;
			this.filter = data.reduce((a, b) => {
				a.push(b.id);
				return a;
			}, []);
		},
		submit() {
			this.$parent.close(this.selectData);
		},
		close() {
			this.$parent.close(false);
		},
	},
};
</script>

<style scoped lang="scss">
.cloud-disk-tree-viewer {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
	.button-area {
		width: 100%;
		height: 55px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		box-shadow: 0 0 5px 1px rgb(0 0 0 / 10%);
		button {
			width: 40%;
			height: 32px;
			border-radius: 3px;
			font-size: 14px;
			background: #eee;
			color: #7b7b7b;
			&:first-child {
				background: $diskMainColor;
				color: #fff;
			}
		}
	}
}
</style>
