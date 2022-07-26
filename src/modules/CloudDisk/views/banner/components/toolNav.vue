<template>
	<div>
		<el-drawer title="小工具" :wrapperClosable="false" :visible.sync="data.isDrawer" :size="30" direction="rtl">
			<div class="content">
				<span>图片</span>
				<div style="display: flex">
					<div class="image-normal" @dblclick="clickFun('image-normal')">
						<img src="http://118.31.70.36:3000/uploads/disk/ea5b93653d12630aea095319ed612a54.jpg" alt="" />
					</div>
					<div class="image-dashed" @dblclick="clickFun('image-dashed')">
						<img src="http://118.31.70.36:3000/uploads/disk/ea5b93653d12630aea095319ed612a54.jpg" alt="" />
					</div>
					<div class="image-dotted" @dblclick="clickFun('image-dotted')">
						<img src="http://118.31.70.36:3000/uploads/disk/ea5b93653d12630aea095319ed612a54.jpg" alt="" />
					</div>
					<div class="image1-dotted" @dblclick="clickFun('image1-dotted')">
						<img src="http://118.31.70.36:3000/uploads/disk/ea5b93653d12630aea095319ed612a54.jpg" alt="" />
					</div>
					<div class="image1-normal" @dblclick="clickFun('image1-normal')">
						<img src="http://118.31.70.36:3000/uploads/disk/ea5b93653d12630aea095319ed612a54.jpg" alt="" />
					</div>
					<div class="image1-dashed" @dblclick="clickFun('image1-dashed')">
						<img src="http://118.31.70.36:3000/uploads/disk/ea5b93653d12630aea095319ed612a54.jpg" alt="" />
					</div>
				</div>
				<!-- <span>放大镜</span>
				<div style="display: flex">
					<div class="image-normal" @dblclick="clickFun('image-normal')">
						<img src="http://118.31.70.36:3000/uploads/disk/1a8b70f1b264eb02ca56b9ccdf8d1df8.jpg" alt="" />
					</div>
				</div> -->
				<span hidden>常见字体</span>
				<div hidden>
					<p class="name1">补水</p>
					<p class="name2">敏感肌</p>
					<p class="name3">温和清洁</p>
					<p class="name4">温和清洁 !</p>
				</div>
				<span hidden>背景样式</span>
				<div hidden>
					<p v-for="(item, index) in colorArr" :key="index" :style="{ 'background-color': item }" class="name">香奈儿</p>
				</div>
			</div>
		</el-drawer>
	</div>
</template>
<script>
export default {
	data() {
		return {
			options: [],
			colorArr: ['#DEC3CA', '#546E89', '#B8C0D3', '#B7817C', '#3E5C60', '#A77919', '#C39391', '#4E6F76', '#68809F', '#DF7330'],
		};
	},
	props: {
		data: {
			type: Object,
			default: function () {
				return {};
			},
		},
		listData: {
			type: Object,
			default: function () {
				return {};
			},
		},
	},
	created() {
		for (let i = 0; i < 19; i++) {
			let obj = {
				value: `G-font-${i}`,
				label: `常用字体${i}`,
			};
			this.options.push(obj);
		}
	},
	methods: {
		handleClick(row) {
			console.log(row);
		},
		handleEdit(value, row) {
			this.$emit('select', row);
		},
		handleDelete(value, row) {
			this.$emit('delete', row);
		},
		clickFun(val) {
			this.$emit('change', { val: val, type: 'tool' });
		},
		addSpacing() {},
		cancelSpacing() {},
	},
};
</script>
<style lang="scss" scoped>
.content {
	background: seagreen;
}
.image {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	overflow: hidden;
	cursor: pointer;
	border: 2px solid white;
	float: left;
	img {
		width: 100%;
		height: 100%;
		background-size: auto;
	}
}
.dashed {
	border: 2px dashed white;
}
.dotted {
	border: 2px dotted white;
}
.name {
	// padding: ;
	padding: 1px 3px;
	display: inline-block;
	font-weight: 700;
	font-family: 'Family-98';
}
.name1 {
	background: white;
	border-radius: 5px 3px 7px 5px;
	padding: 2px 5px;
	display: inline-block;
	font-family: 'Family-98';
	color: #555;
}
.name2 {
	// color: #f2ebd9;
	background: #f2ebd9;
	padding: 2px 25px;
	color: #e78955;
	border-radius: 20px;
	font-family: 'Family-105';
	display: inline-block;
}
.name3 {
	background: #e7b7a6;
	padding: 2px 25px;
	color: #705243;
	font-style: italic;
	border-radius: 20px;
	font-family: 'Family-105';
	display: inline-block;
}
.name4 {
	background: white;
	border: 1px solid #fe860e;
	color: #fe860e;
	display: inline-block;
	padding: 0 18px;
	font-weight: bold;
	border-radius: 20px;
}
.style1 {
	padding: 3px 10px;
	background: white;
	display: inline-block;
	border-radius: 5px;
	position: relative;
}
.style1::before {
	content: '';
	width: 100px;
	height: 100px;
	position: absolute;
	top: -20px;
	right: -20px;
	background-size: cover;
}
</style>
