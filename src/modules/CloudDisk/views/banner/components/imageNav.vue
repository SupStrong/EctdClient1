<template>
	<el-drawer title="插画" :wrapperClosable="false" :visible.sync="data.isDrawer" direction="rtl">
		<img
			v-for="(item, index) in imgData"
			class="image"
			:src="'http://118.31.70.36:3000/uploads/disk/' + item.content"
			:key="index"
			alt=""
			@dblclick="clickFun(item)"
		/>
	</el-drawer>
</template>
<script>
export default {
	data() {
		return {
			imgData: [],
		};
	},
	props: {
		data: {
			type: Object,
			default: function () {
				return {};
			},
		},
	},
	created() {
		this.getData();
	},
	methods: {
		getData() {
			let obj = {
				parentId: 1256052754,
				category: 'all',
			};
			this.$api.disk.list(obj, (rs) => {
				this.imgData = rs.data.rows;
			});
		},
		clickFun(val) {
			this.$emit('change', { val: 'http://118.31.70.36:3000/uploads/disk/' + val.content, type: 'image' });
		},
	},
};
</script>
<style scoped lang="scss">
.tool-data {
	.table-list {
		width: 600px !important;
		max-height: 600px !important;
		overflow: scroll;
	}
	::v-deep .el-form-item {
		display: block;
		margin-bottom: 3px;
	}
}
span {
	cursor: pointer;
}
.image {
	max-width: 70px;
	max-height: 70px;
	cursor: pointer;
	display: inline;
}
</style>
