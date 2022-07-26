<template>
	<el-drawer title="表情" :wrapperClosable="false" :visible.sync="data.isDrawer" direction="rtl">
		<div>
			<svg class="icon" v-for="(item, index) of iconArr" style="width: 40px; height: 40px" :key="index" @dblclick="clickFun(item)">
				<use draggable="false" ondragstart="return false;" :xlink:href="'#' + item"></use>
			</svg>
		</div>
	</el-drawer>
</template>
<script>
export default {
	data() {
		return {
			iconArr: ['icon-xiangsu_xiaoya', 'icon-xiangsu_biaoqing', 'icon-xiangsu_meiguihua', 'icon-xiangsu_tangguo'],
		};
	},
	props: { data: { type: Boolean, default: true } },
	methods: {
		clickFun(val) {
			console.log(val, 'vava');
			this.$emit('change', { val: val, type: 'icon' });
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
.icon {
	cursor: pointer;
}
</style>
