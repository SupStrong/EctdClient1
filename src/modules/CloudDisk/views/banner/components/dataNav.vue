<template>
	<el-drawer title="样品数据" :wrapperClosable="false" :visible.sync="data.isDrawer" direction="rtl">
		<el-table :data="tableData" style="width: 100%">
			<el-table-column type="expand">
				<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item label="名称">
							<span @dblclick="clickFun(props.row.name)">{{ props.row.name }}</span>
						</el-form-item>
						<el-form-item label="品牌">
							<span @dblclick="clickFun(props.row.brandName)">{{ props.row.brandName }}</span>
						</el-form-item>
						<el-form-item label="别称">
							<span @dblclick="clickFun(props.row.nickName)">{{ props.row.nickName }}</span>
						</el-form-item>
						<el-form-item label="含量">
							<span @dblclick="clickFun(props.row.content)">{{ props.row.content }}</span>
						</el-form-item>
						<el-form-item label="分类">
							<span @dblclick="clickFun(props.row.categoryName)">{{ props.row.categoryName }}</span>
						</el-form-item>
						<el-form-item label="国籍">
							<span @dblclick="clickFun(props.row.nationality)">{{ props.row.nationality }}</span>
						</el-form-item>
						<el-form-item label="价格">
							<span @dblclick="clickFun(props.row.price)">{{ props.row.price }}</span>
						</el-form-item>
						<el-form-item label="功效">
							<span @dblclick="clickFun(props.row.effect)">{{ props.row.effect }}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column label="品牌" prop="name"> </el-table-column>
			<el-table-column label="别称" prop="nickName"> </el-table-column>
			<el-table-column label="价格" prop="price"> </el-table-column>
		</el-table>
	</el-drawer>
</template>
<script>
export default {
	data() {
		return {
			tableData: [],
		};
	},
	props: { data: { type: Object, default: () => {} } },
	created() {
		this.$api.sample.list({}, (rs) => {
			this.tableData = rs.data.rows;
		});
	},
	methods: {
		clickFun(val) {
			this.$emit('change', { val: val, type: 'text' });
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
.demo-table-expand {
	font-size: 0;
}
.demo-table-expand label {
	width: 90px;
	color: #99a9bf;
}
.demo-table-expand .el-form-item {
	margin-right: 0;
	margin-bottom: 0;
	width: 50%;
}
::v-deep .el-table__cell {
	padding: 3px 0;
}
::v-deep .demo-table-expand .el-form-item {
	padding-left: 20px;
}
</style>
