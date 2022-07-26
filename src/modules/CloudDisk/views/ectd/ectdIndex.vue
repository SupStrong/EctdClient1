<!--  -->
<template>
	<div class="ectd-index">
		<Row :gutter="16" index="0" style="height: 80%">
			<!-- 左侧文件列表 -->
			<Col span="24">
				<div class="ectd-table-container">
					<Table :columns="apiColConfig[diskInfo.country]" style="height: 580px" :data="tableData"></Table>
					<Page :total="totalAll" style="margin-top: 15px" @on-change="changeTotalAll" />
				</div>
			</Col>
		</Row>
	</div>
</template>
<script>
export default {
	name: 'ectdIndex',
	components: {},
	props: {
		diskInfo: { type: Object, default: () => {} },
	},
	data() {
		return {
			tableData: [],
			delPopup: false,
			isShow: false,
			editId: '',
			totalAll: 0,
			apiColConfig: {
				sample: [
					{ title: '品牌', key: 'brandName', element: '<application-type>' },
					{ title: '名称', key: 'name', element: '<sequence-number>' },
					{ title: '别称', key: 'nickName', element: '<sequence-number>' },
					{ title: '含量', key: 'content', element: '<regulatory-activity-type>' },
					{ title: '分类', key: 'categoryName', element: '<sequence-type>' },
					{ title: '国籍', key: 'nationality', element: '<sequence-description>' },
					{ title: '价格', key: 'price' },
					{ title: '功效', key: 'effect' },
					{ title: '详情', key: 'detail' },
					{ title: '图片', key: 'image' },
					{
						title: '操作',
						key: 'action',
						render: (h, params) => {
							return h('div', [
								h(
									'span',
									{
										style: {
											fontSize: '14px',
											cursor: 'pointer',
											color: '#fc1',
										},
										on: {
											click: () => {
												this.isShow = true;
												this.editId = params.row.id;
											},
										},
										class: 'btn',
									},
									'编辑'
								),
								h(
									'span',
									{
										style: {
											fontSize: '14px',
											padding: '5px 10px',
											cursor: 'pointer',
											color: 'green',
										},
										on: {
											click: () => {
												this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {}).then(() => {
													this.deleteData('sample', params.row.id);
												});
											},
										},
										class: 'btn',
									},
									'删除'
								),
							]);
						},
					},
				],
				brand: [
					{ title: '品牌名称', key: 'name', element: '<application-id>', fixed: 'left' },
					{ title: '别称', key: 'nickName', element: '<application-id>', fixed: 'left' },
					{ title: '国籍', key: 'nationality', element: '<application-id>', fixed: 'left' },
					{
						title: '操作',
						key: 'action',
						render: (h, params) => {
							return h('div', [
								h(
									'span',
									{
										style: {
											fontSize: '14px',
											cursor: 'pointer',
											color: '#fc1',
										},
										on: {
											click: () => {
												this.isShow = true;
												this.editId = params.row.id;
											},
										},
										class: 'btn',
									},
									'编辑'
								),
								h(
									'span',
									{
										style: {
											fontSize: '14px',
											padding: '5px 10px',
											cursor: 'pointer',
											color: 'green',
										},
										on: {
											click: () => {
												this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {}).then(() => {
													this.deleteData('brand', params.row.id);
												});
											},
										},
										class: 'btn',
									},
									'删除'
								),
							]);
						},
					},
				],
				category: [
					{ title: '分类名称', key: 'name', element: '<application-id>', fixed: 'left' },
					{
						title: '操作',
						key: 'action',
						render: (h, params) => {
							return h('div', [
								h(
									'span',
									{
										style: {
											fontSize: '14px',
											cursor: 'pointer',
											color: '#fc1',
										},
										on: {
											click: () => {
												this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {}).then(() => {
													this.deleteData('category', params.row.id);
												});
											},
										},
										class: 'btn',
									},
									'编辑'
								),
								h(
									'span',
									{
										style: {
											fontSize: '14px',
											padding: '5px 10px',
											cursor: 'pointer',
											color: 'green',
										},
										on: {
											click: () => {
												this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {}).then(() => {
													this.deleteData('category', params.row.id);
												});
											},
										},
										class: 'btn',
									},
									'删除'
								),
							]);
						},
					},
				],
				company: [
					{ title: '单位名称', key: 'name', element: '<application-id>', fixed: 'left' },
					{
						title: '操作',
						key: 'action',
						render: (h, params) => {
							return h('div', [
								h(
									'span',
									{
										style: {
											fontSize: '14px',
											cursor: 'pointer',
											color: '#fc1',
										},
										on: {
											click: () => {
												this.isShow = true;
												this.editId = params.row.id;
											},
										},
										class: 'btn',
									},
									'编辑'
								),
								h(
									'span',
									{
										style: {
											fontSize: '14px',
											padding: '5px 10px',
											cursor: 'pointer',
											color: 'green',
										},
										on: {
											click: () => {
												this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {}).then(() => {
													this.deleteData('company', params.row.id);
												});
											},
										},
										class: 'btn',
									},
									'删除'
								),
							]);
						},
					},
				],
				imgText: [
					{ title: '名称', key: 'name', element: '<application-id>', fixed: 'left' },
					{ title: '分类', key: 'categoryName', element: '<application-id>', fixed: 'left' },
					{
						title: '操作',
						key: 'action',
						render: (h, params) => {
							return h('div', [
								h(
									'span',
									{
										style: {
											fontSize: '14px',
											cursor: 'pointer',
											color: '#fc1',
										},
										on: {
											click: () => {
												this.isShow = true;
												this.editId = params.row.id;
											},
										},
										class: 'btn',
									},
									'编辑'
								),
								h(
									'span',
									{
										style: {
											fontSize: '14px',
											padding: '5px 10px',
											cursor: 'pointer',
											color: 'green',
										},
										on: {
											click: () => {
												this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {}).then(() => {
													this.deleteData('imgText', params.row.id);
												});
											},
										},
										class: 'btn',
									},
									'删除'
								),
							]);
						},
					},
				],
			},
		};
	},
	methods: {
		/** 刷新数据 */
		refreshData(page = 1) {
			switch (this.diskInfo.country) {
				case 'sample':
					this.$api.sample.list({ page }, (rs) => {
						this.tableData = rs.data.rows;
						this.totalAll = rs.data.count;
					});
					break;
				case 'brand':
					this.$api.brand.list({ page }, (rs) => {
						this.tableData = rs.data.rows;
						this.totalAll = rs.data.count;
					});
					break;
				case 'category':
					this.$api.categorymenu.list({ page }, (rs) => {
						this.tableData = rs.data.rows;
						this.totalAll = rs.data.count;
					});
					break;
				case 'company':
					this.$api.companyTable.list({ page }, (rs) => {
						this.tableData = rs.data.rows;
						this.totalAll = rs.data.count;
					});
					break;
				case 'imgText':
					this.$api.imgText.list({ page }, (rs) => {
						this.tableData = rs.data.rows;
						this.totalAll = rs.data.count;
					});
					break;
			}
		},
		changeTotalAll(page) {
			this.refreshData(page);
		},
		// 删除数据
		deleteData(type, id) {
			switch (type) {
				case 'sample':
					this.$api.sample.delete({ id: id }, (rs) => {
						if (rs.code === 0) {
							this.$Message.success('删除成功');
						}
					});
					break;
				case 'brand':
					this.$api.brand.delete({ id: id }, (rs) => {
						if (rs.code === 0) {
							this.$Message.success('删除成功');
						}
					});
					break;
				case 'category':
					this.$api.categorymenu.delete({ id: id }, (rs) => {
						if (rs.code === 0) {
							this.$Message.success('删除成功');
						}
					});
					break;
				case 'company':
					this.$api.companyTable.delete({ id: id }, (rs) => {
						if (rs.code === 0) {
							this.$Message.success('删除成功');
						}
					});
					break;
				case 'imgText':
					this.$api.imgText.delete({ id: id }, (rs) => {
						if (rs.code === 0) {
							this.$Message.success('删除成功');
						}
					});
					break;
			}
			this.refreshData();
		},
	},
	watch: {
		diskInfo: {
			handler() {
				this.refreshData();
				this.totalAll = 0;
			},
			deep: true,
		},
	},
};
</script>
<style scoped>
.ectd-index {
	background: #f5f6fa;
	padding: 16px;
	height: 90%;
}
.ectd-table-container {
	padding: 16px;
	background: #ffffff;
	height: 100%;
}
</style>
