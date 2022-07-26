<template>
	<el-drawer title="模板" :wrapperClosable="false" :visible.sync="data.isDrawer" direction="rtl">
		<p v-for="(item, index) of listData" @dblclick="funTemplate(item)" :key="index">模板{{ index }}</p>
	</el-drawer>
</template>
<script>
export default {
	data() {
		return {
			listData: [],
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
			this.$api.templateAll.list({}, (rs) => {
				this.listData = rs.data.rows;
			});
		},
		funTemplate(item) {
			this.$emit('handleTemplate', item.id);
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
.text {
	font-size: 18px;
	cursor: pointer;
	padding-left: 10px;
}
::v-deep .el-divider--horizontal {
	margin: 5px 0;
}
</style>
