<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
	<div class="attr-list">
		<el-form>
			<div v-for="({ key, label }, index) in styleKeys" style="display: inline-block" :key="index">
				<!-- 文本的 -->
				{{key}}
				<el-tooltip v-if="key == 'yoTextWeight'" class="item" effect="dark" content="字体粗细" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoTextWeight', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoDecoration'" class="item" effect="dark" content="下划线" placement="bottom-start">
					<i class="iconfont icon-zitixiahuaxian" @click="handleChange('yoDecoration', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoTextSize'" class="item" effect="dark" content="文字大小" placement="bottom-start">
					1
					<i class="iconfont icon-jia_sekuai"></i>
					{{key}}{{label}}121
					<i class="iconfont icon-jian_sekuai"></i>
					2
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoTextColor'" class="item" effect="dark" content="文字颜色" placement="bottom-start">
					<i class="iconfont icon-yanse" @click="handleChange('yoTextColor', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoTextBgcColor'" class="item" effect="dark" content="文本背景颜色" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoTextBgcColor', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoTextBgImg'" class="item" effect="dark" content="文字背景图" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoTextBgImg', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoTextFillet'" class="item" effect="dark" content="文本圆角" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoTextFillet', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoTextPadding'" class="item" effect="dark" content="文本间距" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoTextPadding', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoTextShadow'" class="item" effect="dark" content="文本阴影" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoTextShadow', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoTextStyle'" class="item" effect="dark" content="字体风格" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoTextStyle', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoTextFamily'" class="item" effect="dark" content="字体类型" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoTextFamily', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoTextWriting'" class="item" effect="dark" content="排列方式" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoTextWriting', key)"></i>
				</el-tooltip>
				<!-- 图片 -->
				<el-tooltip v-else-if="key == 'yoImgStyle'" class="item" effect="dark" content="图片样式" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoImgStyle', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoImgFilter'" class="item" effect="dark" content="滤镜" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoImgFilter', key)"></i>
				</el-tooltip>
				<!-- 矩形 -->
				<el-tooltip v-else-if="key == 'yoBoxBgcolor'" class="item" effect="dark" content="背景颜色" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoBoxBgcolor', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoBoxFillet'" class="item" effect="dark" content="圆角" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoBoxFillet', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoBoxBorderColor'" class="item" effect="dark" content="背景颜色" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoBoxBorderColor', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoBoxBorderStyle'" class="item" effect="dark" content="边框颜色" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoBoxBorderStyle', key)"></i>
				</el-tooltip>
				<el-tooltip v-else-if="key == 'yoBoxBorderWidth'" class="item" effect="dark" content="边框宽度" placement="bottom-start">
					<i class="iconfont icon-zitijiacu" @click="handleChange('yoBoxBorderWidth', key)"></i>
				</el-tooltip>
			</div>
			<el-form-item v-if="curComponent && !excludes.includes(curComponent.component)" label="内容">
				<el-input v-model="curComponent.propValue" type="textarea" />
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { styleData } from '../../../../../utils/style';

export default {
	data() {
		return {
			excludes: ['Picture', 'Group'], // 这些组件不显示内容
			textAlignOptions: [
				{
					label: '左对齐',
					value: 'left',
				},
				{
					label: '居中',
					value: 'center',
				},
				{
					label: '右对齐',
					value: 'right',
				},
			],
			borderStyleOptions: [
				{
					label: '实线',
					value: 'solid',
				},
				{
					label: '虚线',
					value: 'dashed',
				},
			],
			verticalAlignOptions: [
				{
					label: '上对齐',
					value: 'top',
				},
				{
					label: '居中对齐',
					value: 'middle',
				},
				{
					label: '下对齐',
					value: 'bottom',
				},
			],
			selectKey: ['textAlign', 'borderStyle', 'verticalAlign'],
			styleData,
		};
	},
	computed: {
		styleKeys() {
			if (this.$store.state.curComponent) {
				const curComponentStyleKeys = Object.keys(this.$store.state.curComponent.style);
				return this.styleData.filter((item) => curComponentStyleKeys.includes(item.key));
			}
			return [];
		},
		curComponent() {
			return this.$store.state.curComponent;
		},
	},
	methods: {
		handleChange(type, key) {
			let obj = this.curComponent.style[key];
			switch (type) {
				case 'yoTextWeight': // 粗细
					var arr = ['400', '800'];
					obj === '400' ? this.curComponent.style[key] = '800' : this.curComponent.style[key] = '400';
					break;
				case 'yoDecoration': // 下横线
					var arr = ['auto','underline'];
					obj === 'auto' ? this.curComponent.style[key] = 'underline' : this.curComponent.style[key] = 'auto';
					break;
				case 'yoTextColor': // 文字颜色
				this.$emit('update',{
					component:this.curComponent,
					type:'yoTextColor'
				})
					break;
				case 'yoTextBgcColor': // 文字背景颜色
					break;
				case 'yoTextBgImg': // 文字背景颜色
					break;
				case 'yoTextPadding': // 文字背景颜色
					break;
				case 'yoTextShadow': // 文字阴影
					break;
				case 'yoTextSize': // 文字颜色
					break;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.attr-list {
	overflow: auto;
	padding: 20px;
	padding-top: 0;
	height: 100%;
}
</style>

