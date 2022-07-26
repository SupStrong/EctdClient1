<!--  -->
<template>
	<Modal :value="value" title="新建" @on-cancel="$emit('input', false)">
		<Form :model="editForm" :label-width="80" label-colon>
			<FormItem label="项目名称">
				<Select v-model="editForm.projectName">
					<Option value="test1" key="test1">项目1</Option>
					<Option value="test2" key="test2">项目2</Option>
					<Option value="test3" key="test3">项目3</Option>
					<Option value="test4" key="test4">项目4</Option>
				</Select>
			</FormItem>
			<FormItem label="标准">
				<Select v-model="editForm.stander">
					<Option value="test1" key="test1">CN</Option>
					<Option value="test2" key="test2">US</Option>
					<Option value="test3" key="test3">UK</Option>
				</Select>
			</FormItem>
			<FormItem label="序列号">
				<Input v-model="editForm.serialNumber" placeholder="请输入序列号"></Input>
			</FormItem>
			<FormItem label="负责人">
				<Select v-model="editForm.leader">
					<Option value="test1" key="test1">RIN</Option>
					<Option value="test2" key="test2">Bary</Option>
					<Option value="test3" key="test3">UK</Option>
				</Select>
			</FormItem>
			<FormItem label="协作人">
				<Select v-model="editForm.helper">
					<Option value="test1" key="test1">RIN</Option>
					<Option value="test2" key="test2">BARY</Option>
					<Option value="test3" key="test3">UK</Option>
				</Select>
			</FormItem>
			<FormItem label="计划时间">
				<DatePicker :value="editForm.planTime" format="yyyy/MM/dd" type="daterange" placement="bottom-end" style="width: 100%"></DatePicker>
			</FormItem>
			<FormItem label="项目说明">
				<Input v-model="editForm.info" placeholder="项目说明" type="textarea"></Input>
			</FormItem>
		</Form>
	</Modal>
</template>

<script>
export default {
	name: 'createFile',
	props: { value: { type: Boolean, default: true } },
	data() {
		return { ileName: '测试.jpg', editForm: {} };
	},
	methods: {
		inputKeyUp() {
			this.fileName = '测试.jpg';
		},
	},
};
</script>
<style scoped>
.form-lable {
	align-self: center;
}
</style>
