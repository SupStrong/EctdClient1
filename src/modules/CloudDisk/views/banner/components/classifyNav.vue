<template>
	<el-drawer title="分类数据" :wrapperClosable="false" :visible.sync="data.isDrawer" direction="rtl">
		<el-collapse v-model="activeNames" @change="handleChange">
			<el-collapse-item title="雅思兰黛" name="1">
				<span class="G-Mr-5">眉笔</span>
				<span class="G-Mr-5">沿线</span>
			</el-collapse-item>
			<el-collapse-item title="反馈 Feedback" name="2">
				<div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
				<div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
			</el-collapse-item>
			<el-collapse-item title="效率 Efficiency" name="3">
				<div>简化流程：设计简洁直观的操作流程；</div>
				<div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
				<div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
			</el-collapse-item>
			<el-collapse-item title="可控 Controllability" name="4">
				<div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
				<div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
			</el-collapse-item>
		</el-collapse>
	</el-drawer>
</template>
<script>
export default {
	data() {
		return {
			tableData: [
				{
					id: '12987122',
					name: '好滋好味鸡蛋仔',
					category: '江浙小吃、小吃零食',
					desc: '荷兰优质淡奶，奶香浓而不腻',
					address: '上海市普陀区真北路',
					shop: '王小虎夫妻店',
					shopId: '10333',
				},
				{
					id: '12987123',
					name: '好滋好味鸡蛋仔',
					category: '江浙小吃、小吃零食',
					desc: '荷兰优质淡奶，奶香浓而不腻',
					address: '上海市普陀区真北路',
					shop: '王小虎夫妻店',
					shopId: '10333',
				},
				{
					id: '12987125',
					name: '好滋好味鸡蛋仔',
					category: '江浙小吃、小吃零食',
					desc: '荷兰优质淡奶，奶香浓而不腻',
					address: '上海市普陀区真北路',
					shop: '王小虎夫妻店',
					shopId: '10333',
				},
				{
					id: '12987126',
					name: '好滋好味鸡蛋仔',
					category: '江浙小吃、小吃零食',
					desc: '荷兰优质淡奶，奶香浓而不腻',
					address: '上海市普陀区真北路',
					shop: '王小虎夫妻店',
					shopId: '10333',
				},
			],
			activeNames: ['1'],
		};
	},
	props: { data: { type: Object, default: () => {} } },
	methods: {
		clickFun(val) {
			this.$emit('change', { val: val, type: 'text' });
		},
		handleChange(val) {
			console.log(val);
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
