<!--  -->
<template>
	<Modal :value="value" title="导入" @on-cancel="$emit('input', false)">
		<Row :gutter="8" index="0" type="flex" justify="center">
			<Col span="4" class="form-lable">项目名称:</Col>
			<Col span="20">
				<Select v-model="projectName">
					<Option value="test1" key="test1">项目1</Option>
					<Option value="test2" key="test2">项目2</Option>
					<Option value="test3" key="test3">项目3</Option>
					<Option value="test4" key="test4">项目4</Option>
				</Select>
			</Col>
		</Row>
		<Row :gutter="16" style="margin-top: 16px">
			<Col span="19">
				<div class="ivu-input" @click="$refs.inputFile.click()">{{ fileName }}</div>
			</Col>
			<Col span="4">
				<Button @click="$refs.inputFile.click()">选择文件</Button>
				<input placeholder="请选择文件" type="file" style="display: none" ref="inputFile"
			/></Col>
		</Row>
	</Modal>
</template>

<script>
export default {
	name: 'importFile',
	props: { value: { type: Boolean, default: true } },
	data() {
		return { projectName: null, fileName: '测试.jpg' };
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
