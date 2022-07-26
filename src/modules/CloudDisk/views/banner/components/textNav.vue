<template>
	<el-drawer title="文案" :wrapperClosable="false" :visible.sync="data.isDrawer" direction="rtl">
		<el-form label-position="right" label-width="80px" :model="form">
			<el-form-item label="新增文案">
				<el-input v-model="form.name" style="width: 290px; margin-right: 10px"></el-input>
				<el-button type="danger" @click="onSubmit">新增文案</el-button>
			</el-form-item>
		</el-form>
		<p class="text" v-for="(item, index) in oftenArr" style="float: left" @dblclick="clickFun(item)">{{ item }}</p>
		<hr />
		<p class="text" v-for="item in textArr" :key="item.id" @dblclick="clickFun(item.name)">{{ item.name }}</p>
	</el-drawer>
</template>
<script>
export default {
	data() {
		return {
			oftenArr: [
				'平衡水油',
				'深层清洁',
				'舒缓保湿',
				'温和清洁',
				'保湿滋润',
				'清洁肌肤',
				'美白保湿',
				'温和保湿',
				'控油清洁',
				'控油清洁',
				'抑制闭口',
				'清理污垢',
				'唤醒肤底',
				'清爽控油',
				'清洁面部',
				'水润肌肤',
				'保湿保湿',
				'控油祛痘',
				'便宜大碗',
				'敏感肌冲',
				'平价洁面',
				'温和洗脸',
				'控油修复',
				'调养肌肤',
				'亮白肌肤',
				'质地清滑',
				'混油皮',
				'干皮',
				'油痘肌',
				'全肤质',
				'控油、收缩毛孔',
				'调节水油平衡',
				'修护、细腻毛孔',
				'修护受损',
				'强韧屏障',
				'提亮肤色',
				'油痘肌用',
				'油皮用',
				'洗出鸡蛋肌',
				'霸屏油痘圈',
				'超温和洁面',
				'告别油腻、痘痘肌肤',
				'深度清洁',
				'抗痘痘',
				'补水',
				'去红',
				'急救',
				'清爽',
				'柔顺',
				'不紧绷',
				'洗卸二合一',
				'两种植物提取物',
				'白花春黄菊提取物',
				'金盏菊提取物',
				'母菊提取物',
				'矢车菊提取物',
				'白花春黄菊提取物',
				'清爽',
				'光解酶具备',
				'DNA修复和保护',
				'让皮肤恢复活力',
				'淡化黑斑',
				'提升光泽度',
				'提高紧致度',
				'减少皱纹和细纹',
			],
			textArr: [],
			form: {
				name: '',
				categroyId: '',
			},
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
		clickFun(val) {
			this.$emit('change', { val: val, type: 'text' });
		},
		getData() {
			this.$api.imgText.list({}, (rs) => {
				this.textArr = rs.data.rows;
			});
		},
		onSubmit() {
			if (this.form.name === '') {
				this.$Message.error('不能为空');
				return;
			}
			this.$api.imgText.create(this.form, (rs) => {
				if (rs.code === 0) {
					this.$Message.success('新增成功');
					this.form = {};
					this.getData();
				}
			});
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
