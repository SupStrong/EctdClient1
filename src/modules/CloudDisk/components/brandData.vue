<!--  -->
<template>
	<Modal :value="value" title="新建" @on-cancel="$emit('input', false)" @on-ok="onSubmit">
		<Form :model="form" :label-width="80" label-colon>
			<FormItem label="品牌名称">
				<Input v-model="form.name" placeholder="请输入品牌名称"></Input>
			</FormItem>
			<FormItem label="品牌别称">
				<Input v-model="form.nickName" placeholder="请输入品牌别称"></Input>
			</FormItem>
			<FormItem label="国籍">
				<Select v-model="form.nationality">
					<Option label="中国" value="中国"></Option>
					<Option label="英国" value="英国"></Option>
					<Option label="美国" value="美国"></Option>
					<Option label="日本" value="日本"></Option>
					<Option label="荷兰" value="荷兰"></Option>
					<Option label="法国" value="法国"></Option>
					<Option label="泰国" value="泰国"></Option>
				</Select>
			</FormItem>
		</Form>
	</Modal>
</template>

<script>
export default {
	name: 'brandData',
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
				nickName: '',
				nationality: '',
			},
		};
	},
	methods: {
		onSubmit() {
			this.$api.brand.create(this.form, (rs) => {
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
