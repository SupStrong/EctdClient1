<template>
	<el-drawer title="滤镜" :wrapperClosable="false" :visible.sync="data.isDrawer" direction="rtl">
		<ul class="demo__list">
			<li class="demo__item" v-for="(item, index) in mapList" :key="index" @click="clickFun(item)">
				<figure :class="item">
					<img src="https://img2.baidu.com/it/u=1000551505,2077899926&fm=26&fmt=auto" />
				</figure>
			</li>
		</ul>
	</el-drawer>
</template>
<script>
export default {
	data() {
		return {
			mapList: ['aden', 'reyes', 'perpetua', 'inkwell', 'earlybird', 'toaster', 'walden', 'hudson', 'gingham', 'mayfair', 'lofi', 'xpro2', '_1977', 'brooklyn'],
		};
	},
	props: { data: { type: Object, default: () => {} } },
	methods: {
		clickFun(val) {
			this.$emit('change', { val: val, type: 'filter' });
		},
	},
};
</script>
<style lang="scss" scoped>
.demo__item {
	width: 100px;
	height: 100px;
	cursor: pointer;
	.figure {
		cursor: pointer;
	}
	img {
		width: 100%;
		height: 100%;
		cursor: pointer;
	}
}
</style>
