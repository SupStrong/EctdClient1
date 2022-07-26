<!--  -->
<template>
	<Modal :value="value" title="新建" @on-cancel="$emit('input', false)" @on-ok="onSubmit">
		<Form :model="form" :label-width="80" label-colon>
			<FormItem label="文案">
				<Input v-model="form.name" placeholder="文案名称"></Input>
			</FormItem>
			<FormItem label="分类">
				<Select filterable v-model="form.categoryId">
					<Option :value="item.id" v-for="(item, index) of categoryList" :key="index">{{ item.name }}</Option>
				</Select>
			</FormItem>
		</Form>
	</Modal>
</template>

<script>
export default {
	name: 'classifyData',
	props: {
		value: { type: Boolean, default: true },
		status: {
			type: String,
			default: function () {
				return 'news';
			},
		},
	},
	data() {
		return {
			form: {
				name: '',
				categoryId: '',
			},
			categoryList: [],
		};
	},
	created() {
		this.getClassify();
	},
	methods: {
		getClassify() {
			this.$api.categorymenu.list({}, (rs) => {
				console.log(rs.data.rows, 'rs.data.rows');
				this.categoryList = rs.data.rows;
			});
		},
		onSubmit() {
			this.$api.imgText.create(this.form, (rs) => {
				if (rs.code === 0) {
					this.$Message.success('新增成功');
					this.form = {};
					this.$emit('input', true);
				} else {
					this.form = {};
					this.$emit('input', false);
				}
			});
		},
	},
};
</script>
<style scoped>
.form-lable {
	align-self: center;
}
</style>
