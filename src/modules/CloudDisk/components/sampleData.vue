<!--  -->
<template>
	<Modal :value="value" title="新建样品" @on-cancel="$emit('input', false)" @on-ok="onSubmit">
		<Form :model="form" :label-width="80" label-colon>
			<FormItem label="名称">
				<Input v-model="form.name" placeholder="请输入名称"></Input>
			</FormItem>
			<FormItem label="别称">
				<Input v-model="form.nickName" placeholder="请输入别称"></Input>
			</FormItem>
			<FormItem label="品牌" @on-change="selectBrand">
				<Select v-model="form.brandId">
					<Option :value="item.id" v-for="(item, index) of brandList" :key="index">{{ item.name }}</Option>
				</Select>
			</FormItem>
			<FormItem label="分类">
				<Select v-model="form.categoryId">
					<Option :value="item.id" v-for="(item, index) of categoryList" :key="index">{{ item.name }}</Option>
				</Select>
			</FormItem>
			<FormItem label="含量">
				<Select v-model="form.content">
					<Option :value="item.name" v-for="(item, index) of companyList" :key="index">{{ item.name }}</Option>
				</Select>
			</FormItem>
			<FormItem label="价格">
				<Input v-model="form.price" placeholder="请输入价格"></Input>
			</FormItem>
			<FormItem label="功效">
				<Input v-model="form.effect" placeholder="请输入功效"></Input>
			</FormItem>
			<FormItem label="详情">
				<Input v-model="form.detail" placeholder="请输入详情"></Input>
			</FormItem>
			<FormItem label="上传图片"> </FormItem>
		</Form>
	</Modal>
</template>

<script>
export default {
	name: 'sampleData',
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
				brandId: '',
				categoryId: '',
				nickName: '',
				name: '',
				content: '',
				price: '',
				effect: '',
				detail: '',
				image: '',
			},
			brandList: [],
			categoryList: [],
			companyList: [],
		};
	},
	created() {
		this.getBrand();
		this.getClassify();
		this.getCompany();
	},
	methods: {
		getBrand() {
			this.$api.brand.list({}, (rs) => {
				this.brandList = rs.data.rows;
			});
		},
		getClassify() {
			this.$api.categorymenu.list({}, (rs) => {
				this.categoryList = rs.data.rows;
			});
		},
		getCompany() {
			this.$api.companyTable.list({}, (rs) => {
				this.companyList = rs.data.rows;
			});
		},
		selectBrand(val) {
			console.log(val, 'vall');
		},
		onSubmit() {
			this.$api.sample.create(this.form, (rs) => {
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
