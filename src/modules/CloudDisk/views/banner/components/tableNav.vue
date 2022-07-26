<template>
	<div>
		<el-drawer title="选中文字" :wrapperClosable="false" :visible.sync="data.isDrawer" :size="100" direction="rtl">
			<el-table :data="listData" border style="width: 100%" @row-click="changeRow" :row-class-name="tableRowClassName">
				<el-table-column fixed="left" label="页" width="60">
					<template slot-scope="scope">
						{{ scope.row.index + 1 }}
					</template>
				</el-table-column>
				<el-table-column label="文字" width="200">
					<template slot-scope="scope">
						<el-input v-model="scope.row.val" :value="scope.row.val" @change="handleEdit($event, scope.row)"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="" label="样式" width="110">
					<template slot-scope="scope">
						<el-select v-model="scope.row.class" placeholder="请选择" @change="handleEdit($event, scope.row, 'text')">
							<el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value" :class="item.value"> </el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="" label="样式1" width="100">
					<template slot-scope="scope">
						<el-select v-model="scope.row.classone" placeholder="请选择" @change="handleEdit($event, scope.row, 'ku')">
							<el-option
								v-for="(item, index) in saveStyleData"
								:key="index"
								:label="item.label"
								:value="item.value"
								:style="{
									'text-align': item.textAlign,
									'writing-mode': item.writingMode,
									color: item['color'],
									'text-shadow': item['text-shadow'],
									'font-family': item['fontFamily'],
									'font-style': item['fontStyle'],
								}"
								>样式{{ index }}</el-option
							>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="" label="排列" width="100">
					<template slot-scope="scope">
						<el-select v-model="scope.row.writingMode" placeholder="请选择" @change="handleEdit($event, scope.row)">
							<el-option v-for="(item, index) in writingModeOptions" :key="index" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="" label="字体" width="90">
					<template slot-scope="scope">
						<el-select v-model="scope.row.fontFamily" placeholder="请选择" @change="handleEdit($event, scope.row)">
							<el-option v-for="(item, index) in fontFamilyArr" :key="index" :label="item.label" :value="item.value" :style="{ 'font-family': item.value }">
								{{ item.value }}
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="" label="字体" width="100">
					<template slot-scope="scope">
						<el-select v-model="scope.row.fontStyle" placeholder="请选择" @change="handleEdit($event, scope.row)">
							<el-option v-for="(item, index) in fontStyleArr" :key="index" :label="item.label" :value="item.value" :style="{ 'font-style': item.value }">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="" label="颜色" width="50">
					<template slot-scope="scope">
						<el-color-picker
							size="mini"
							v-model="scope.row['color']"
							show-alpha
							@active-change="editTextColor($event, scope.row, 'color')"
							@change="editTextColor($event, scope.row, 'color')"
							:predefine="predefineColors"
						></el-color-picker>
					</template>
				</el-table-column>
				<el-table-column prop="" label="阴影" width="50" center>
					<template slot-scope="scope">
						<el-color-picker
							size="mini"
							v-model="scope.row['textColor']"
							show-alpha
							@active-change="editTextColor($event, scope.row, 'textShadow')"
							@change="editTextColor($event, scope.row, 'textShadow')"
							:predefine="predefineColors"
						></el-color-picker>
					</template>
				</el-table-column>
				<!-- 新增 -->
				<el-table-column prop="" label="背景" width="50">
					<template slot-scope="scope">
						<el-color-picker
							size="mini"
							v-model="scope.row['backgroundColor']"
							show-alpha
							@active-change="editTextColor($event, scope.row, 'backgroundColor')"
							@change="editTextColor($event, scope.row, 'backgroundColor')"
							:predefine="predefineColors"
						></el-color-picker>
					</template>
				</el-table-column>

				<el-table-column prop="" label="居中" width="100">
					<template slot-scope="scope">
						<el-select v-model="scope.row.textAlign" placeholder="请选择" @change="handleEdit($event, scope.row)">
							<el-option v-for="(item, index) in textCenterOptions" :key="index" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="" label="圆角" width="100">
					<template slot-scope="scope">
						<el-select v-model="scope.row.borderRadius" placeholder="请选择" @change="handleEdit($event, scope.row)">
							<el-option v-for="(item, index) in radiusArr" :key="index" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="110">
					<template slot-scope="scope">
						<el-button @click="handleDelete($event, scope.row)" type="text" size="small">删除</el-button>
						<el-button @click="saveStyle($event, scope.row)" type="text" size="small">保存</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-drawer>
	</div>
</template>
<script>
export default {
	data() {
		return {
			options: [],
			fontFamily: [
				98, 13, 14, 18, 19, 48, 49, 54, 55, 56, 57, 62, 74, 76, 79, 80, 89, 103, 105, 106, 107, 111, 112, 114, 118, 120, 121, 123, 124, 126, 127, 129, 131, 139,
				154, 162, 183, 186, 192, 198, 199, 203,
			],
			newV: {},
			textImgOptions: [],
			fontFamilyArr: [],
			saveStyleData: [],
			predefineColors: [
				'#ff4500',
				'#ff8c00',
				'#ffd700',
				'#90ee90',
				'#00ced1',
				'#1e90ff',
				'#c71585',
				'rgba(255, 69, 0, 0.68)',
				'rgb(255, 120, 0)',
				'hsv(51, 100, 98)',
				'hsva(120, 40, 94, 0.5)',
				'hsl(181, 100%, 37%)',
				'hsla(209, 100%, 56%, 0.73)',
				'#c7158577',
			],
			textCenterOptions: [
				{
					value: 'start',
					label: '左',
				},
				{
					value: 'center',
					label: '中',
				},
				{
					value: 'right',
					label: '右',
				},
			],
			fontStyleArr: [
				{
					value: 'italic',
					label: '倾斜',
				},
				{
					value: 'inherit',
					label: '正常',
				},
			],
			writingModeOptions: [
				{
					value: 'horizontal-tb',
					label: '横向',
				},
				{
					value: 'vertical-lr',
					label: '纵向',
				},
			],
			sortArr: [
				{
					value: '',
					balel: '',
				},
			],
			radiusArr: [
				{
					value: '5px',
					balel: '5',
				},
				{
					value: '8px',
					balel: '8',
				},
				{
					value: '10px',
					balel: '10',
				},
				{
					value: '12px',
					balel: '12',
				},
				{
					value: '15px',
					balel: '15',
				},
			],
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
			type: Array,
			default: function () {
				return [];
			},
		},
	},
	created() {
		// 获取库里的样式
		this.getStyle();
		for (let i = 0; i < 23; i++) {
			let obj = {
				value: `G-font-${i}`,
				label: `${i}`,
			};
			this.options.push(obj);
		}
		for (let i = 0; i < this.fontFamily.length; i++) {
			let obj = {
				value: `Family-${this.fontFamily[i]}`,
				label: `${this.fontFamily[i]}`,
			};
			this.fontFamilyArr.push(obj);
		}
		// 文字图片
		// for (let i = 1; i <= 14; i++) {
		// 	let obj = {
		// 		value: require(`../image/${i}.png`),
		// 	};
		// 	this.textImgOptions.push(obj);
		// }
	},
	methods: {
		tableRowClassName({ row, rowIndex }) {
			if (row.rand === this.data.currentIndex) {
				return 'G-skyblue';
			}
			return '';
		},
		getStyle() {
			this.$api.styleAll.list({}, (rs) => {
				if (rs.code === 0) {
					let newData = [];
					rs.data.rows.map((item, index) => {
						newData.push({
							value: JSON.parse(item.styleLevel),
							lable: index,
						});
					});
					this.saveStyleData = newData;
				}
			});
		},
		saveStyle(e, row) {
			let obj = {
				styleLevel: JSON.stringify(row),
			};
			this.$api.styleAll.create(obj, (rs) => {
				if (rs.code === 0) {
					this.$Message.success('新增成功');
					this.getStyle();
				}
			});
		},
		changeRow(row) {
			this.$emit('changeIndex', row.index);
		},
		editTextColor(val, item, type) {
			if (type === 'color') {
				item['color'] = val;
			}
			if (type === 'textShadow' && val != null) {
				item['text-shadow'] = `${val} 1px 0px, ${val} 0px 1px, ${val} -2px 0px, ${val} 0px -2px`;
				item['textColor'] = `${val}`;
			} else if (type === 'textShadow' && val == null) {
				item['text-shadow'] = '';
				item['textColor'] = '';
			} else if (type === 'backgroundColor' && val != null) {
				item['backgroundColor'] = val;
				item['paddingStyle'] = '3px 5px 3px 5px';
				item['text-align'] = 'center';
			}
			this.$emit('select', item);
		},
		handleEdit(value, row, type) {
			let index = this.listData.findIndex(function (item) {
				return item.rand === row.rand;
			});
			if (type === 'ku') {
				row = {
					...row,
					class: value['class'],
					color: value['color'],
					'font-size': value['font-size'],
					'font-style': value['font-style'],
					fontFamily: value['fontFamily'],
					'text-shadow': value['text-shadow'],
					textAlign: value['textAlign'],
					textColor: value['textColor'],
					transformScale: value['transformScale'],
					writingMode: value['writingMode'],
					backgroundColor: value['backgroundColor'],
					fontStyle: value['fontStyle'],
					paddingStyle: value['paddingStyle'],
					borderRadius: value['borderRadius'],
					classone: this.saveStyleData.findIndex((v) => v.value.rand === row.rand),
				};
			}

			if (type === 'text') {
				row.color = '';
				row['text-shadow'] = '';
			}
			this.$emit('select', row);
			this.$set(this.listData, index, row);
		},
		handleDelete(value, row) {
			this.$emit('delete', row);
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep .G-skyblue {
	background: rgba(233, 236, 238, 1) !important;
}
.el-drawer__wrapper {
	width: 50% !important;
	right: 0 !important;
	float: right;
	left: auto !important;
}
</style>
