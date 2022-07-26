<!--  -->
<template>
	<Modal :value="value" title="常用含量" @on-cancel="$emit('input', false)" @on-ok="onSubmit">
		<Form :model="form" :label-width="80" label-colon>
			<FormItem label="常用含量">
				<Input v-model="form.name" placeholder="请输入含量"></Input>
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
			},
		};
	},
	methods: {
		onSubmit() {
			this.$api.companyTable.create(this.form, (rs) => {
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
