<template>
	<main class="cloud-main">
		<diskHeader ref="drag" :data="diskInfo" :type.sync="navType"></diskHeader>

		<section class="cloud-disk-main">
			<div class="left">
				<diskCategory ref="diskCategory" :data="diskInfo" :type="navType" @change="categoryChange"></diskCategory>
			</div>

			<div class="right">
				<diskNavigation
					ref="diskNavigation"
					:data="diskInfo"
					:type="navType"
					:loading="loading"
					:curData="curData"
					@callback="diskNavigationControl"
					@action="diskFeatureControl"
					@change="changeGenerate"
					@handleSelectFamily="handleSelectFamily"
				></diskNavigation>
				<div
					ref="diskFileArea"
					class="cloud-disk-content"
					:class="diskFileShowType"
					@scroll="loadMoreDiskData"
					@mousedown="mainMouseControl"
					@dragover.prevent.stop="dropUploadTips(true)"
					@dragleave.prevent.stop="dropUploadTips(false)"
					@drop.prevent.stop="dropUpload"
					v-contextmenu:contextmenuWrap
				>
					<input type="file" @change="uploadFolder" webkitdirectory style="display: none" ref="inputFolderFile" multiple="multiple" />

					<input type="file" @change="prepareUpload" style="display: none" ref="inputFile" multiple="multiple" />

					<diskFile
						v-for="(item, index) in diskData"
						:key="item.id"
						:item="item"
						@mousedown.stop="selectFile($event, item, index)"
						@open="diskFeatureControl"
					></diskFile>

					<div class="mouse-select" v-show="mouseSelectData.width" :style="mouseSelectData" />

					<div class="upload-tips" v-if="showUploadTips">松开鼠标开始上传文件</div>

					<contextmenu ref="contextmenuWrap">
						<template v-if="mouseDownWhere === 'area'">
							<contextmenu-item @click="diskFeatureControl('upload')" :disabled="diskInfo.categoryType !== 'all'">上传文件</contextmenu-item>

							<contextmenu-item @click="diskFeatureControl('uploadFolder')" :disabled="diskInfo.categoryType !== 'all'">上传文件夹</contextmenu-item>

							<contextmenu-item @click="diskFeatureControl('newFolder')" :disabled="diskInfo.categoryType !== 'all'">新建文件夹</contextmenu-item>

							<contextmenu-item divider></contextmenu-item>

							<contextmenu-item @click="diskFeatureControl('clear')" :disabled="diskInfo.clipboard.length === 0 || diskInfo.categoryType !== 'all'"
								>清空剪贴板</contextmenu-item
							>

							<contextmenu-item @click="diskFeatureControl('paste')" :disabled="diskInfo.clipboard.length === 0 || diskInfo.categoryType !== 'all'"
								>粘贴</contextmenu-item
							>

							<contextmenu-item divider></contextmenu-item>

							<contextmenu-item @click="diskFeatureControl('reload')">刷新</contextmenu-item>
						</template>

						<template v-else>
							<template v-if="diskInfo.categoryType !== 'all' && diskInfo.categoryType !== 'trash' && navType === 'disk'">
								<contextmenu-item @click="diskFeatureControl('go-where')" :disabled="moreThanOneSelect">打开文件所在位置</contextmenu-item>

								<contextmenu-item divider></contextmenu-item>
							</template>

							<contextmenu-item @click="diskFeatureControl('open')" :disabled="moreThanOneSelect">打开</contextmenu-item>

							<template v-if="navType === 'disk' && diskInfo.categoryType !== 'trash'">
								<contextmenu-item @click="diskFeatureControl('download')">下载</contextmenu-item>

								<!-- <contextmenu-item divider></contextmenu-item> -->

								<!-- <contextmenu-item @click="diskFeatureControl('move')">移动到</contextmenu-item> -->

								<!-- <contextmenu-item @click="diskFeatureControl('copy')">复制</contextmenu-item> -->

								<!-- <contextmenu-item @click="diskFeatureControl('cut')">剪切</contextmenu-item> -->

								<!-- <contextmenu-item divider></contextmenu-item> -->

								<!-- <contextmenu-item @click="diskFeatureControl('rename')" :disabled="moreThanOneSelect">重命名</contextmenu-item> -->
							</template>

							<!-- <contextmenu-item divider v-else></contextmenu-item> -->

							<!-- <template v-if="diskInfo.categoryType === 'trash'"> -->

							<!-- <contextmenu-item @click="diskFeatureControl('restore')">还原<	/contextmenu-item> -->

							<!-- </template> -->

							<template v-if="navType !== 'share'">
								<contextmenu-item @click="diskFeatureControl(diskInfo.categoryType === 'trash' ? 'delete' : 'trash')">删除</contextmenu-item>

								<contextmenu-item divider></contextmenu-item>
							</template>

							<template v-if="navType === 'share'">
								<contextmenu-item @click="diskFeatureControl('share')" :disabled="moreThanOneSelect">取消分享</contextmenu-item>
							</template>

							<template v-else-if="diskInfo.categoryType !== 'trash'">
								<contextmenu-item @click="diskFeatureControl('share')" :disabled="moreThanOneSelect"
									>{{ diskInfo.select.share ? '取消' : '' }}分享</contextmenu-item
								>
							</template>

							<contextmenu-item @click="diskFeatureControl('info')" :disabled="moreThanOneSelect">属性</contextmenu-item>
						</template>
					</contextmenu>

					<!-- <loading :loading="loading" :length="diskData.length"></loading> -->

					<div id="draggingFile" :style="draggingFilesStyle">
						<div class="icon sf-icon-file">
							<span>{{ diskInfo.selectFiles.length }}</span>
						</div>
					</div>
				</div>
				<div class="tool-box">
					<div class="tool">
						<div class="tool-font" v-if="handleOpenDrawer == 'fontFamily'">
							<div class="list" v-for="(item, index) in fontFamilyArr" :key="index" @click="handleSelectStyle('fontFamily', item)">
								<span class="G-Fsize-14 G-color-333">{{ item.name }}</span>
								<i class="iconfont G-Fsize-16 G-color-333 icon-duigou"></i>
							</div>
						</div>
						<div class="tool-color" v-else-if="handleOpenDrawer == 'fontColor' || handleOpenDrawer == 'bgColor'">
							<div class="demonstration G-bold">自设样式</div>
							<div class="block G-Mt-10">
								<el-color-picker
									v-model="isTF"
									@active-change="handleColor"
									:show-alpha="false"
									:predefine="predefineColors"
									color-format="hsv"
								></el-color-picker>
							</div>
							<div class="G-bold">默认颜色</div>
							<div>
								<div
									class="list G-Mt-10"
									v-for="(item, index) in colorArr"
									:key="index"
									:style="{ 'background-color': 'rgb(' + item + ')' }"
									:class="{ active: item == curData.fColor }"
									@click="handleSelectStyle('fontColor', item)"
								></div>
							</div>
						</div>
						<div class="tool-filter" v-else-if="handleOpenDrawer == 'fontOften'">
							<div class="list" v-for="(citem, index) in fontOften" :key="index">
								<p
									:style="{
										color: `rgb(${citem.fColor})`,
										fontSize: citem.fSize + 'px',
										fontFamily: citem.fFamily,
										fontStyle: citem.fStyle,
										textAlign: citem.fAlign,
										opacity: citem.fOpcity / 100,
										fontWeight: citem.fWeight,
										writingMode: citem.fMode,
										transform: citem['fScale'] || '',
									}"
								>
									{{ citem.name }}
								</p>
							</div>
						</div>
						<div class="tool-filter" v-else-if="handleOpenDrawer == 'imageFilter'">
							<div class="list" v-for="(item, index) in filterArr" :key="index">
								<img
									:class="[item.style, curData.iFilter == item.style ? 'active' : '']"
									@click="handleSelectStyle('imageFilter', item)"
									src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp06%2F20111116192A364-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655220839&t=590d59cd546171c54d87187829038cef"
									alt
								/>
								<span>{{ item.name }}</span>
							</div>
						</div>
						<div class="tool-imgstyle" v-else-if="handleOpenDrawer == 'imageStyle'">
							<div class="list" v-for="(item, index) in imgStyleArr" :key="index" @click="handleSelectStyle('imageStyle', item)">
								<div class="list-box" :class="item.style"></div>
								<span>{{ item.name }}</span>
							</div>
						</div>
						<div class="tool-image" v-else-if="handleOpenDrawer == 'imageSource'">
							<div style="display: flex">
								<Poptip
									trigger="hover"
									placement="bottom-start"
									width="85"
									padding="0"
									@on-popper-show="hoverUpload = true"
									@on-popper-hide="hoverUpload = false"
								>
									<button class="btn primary">
										<div class="upload-text">
											<span>上传</span>
											<Icon :class="['arrow', { rotate: hoverUpload }]" type="ios-arrow-up" />
										</div>
									</button>
									<ul class="upload-type" slot="content">
										<li @click="actionControl('upload')">文件</li>
										<li @click="actionControl('uploadFolder')">文件夹</li>
									</ul>
								</Poptip>
								<button class="btn default" @click="actionControl('newFolder')">新建文件夹</button>
								<button class="btn default" @click="actionControl('newAllFolder')">新建子文件夹</button>
							</div>
							<!-- 网盘 -->
							<div class="navigation-container">
								<div class="container">
									<button class="sf-icon-home G-bg-white G-Mr-5" @click="navControl('home')" style="font-size: 15px" />
									<div class="item" @click="navControl('home')">{{ diskInfo.category }}</div>
									<div v-for="(item, index) in diskInfo.navData" :key="index" @mouseover="handleDragEnter" class="item" @click="navControl(item)">
										{{ item.name }}
									</div>
								</div>
							</div>
							<div class="G-Mt-15">
								<div
									ref="diskFileArea"
									class="cloud-disk-content"
									:class="diskFileShowType"
									@scroll="loadMoreDiskData"
									@mousedown="mainMouseControl"
									@dragover.prevent.stop="dropUploadTips(true)"
									@dragleave.prevent.stop="dropUploadTips(false)"
									@drop.prevent.stop="dropUpload"
									v-contextmenu:contextmenuWrap
								>
									<input type="file" @change="uploadFolder" webkitdirectory style="display: none" ref="inputFolderFile" multiple="multiple" />

									<input type="file" @change="prepareUpload" style="display: none" ref="inputFile" multiple="multiple" />
									<diskFile
										v-for="(item, index) in diskData"
										:key="item.id"
										:item="item"
										@mousedown.stop="selectFile($event, item, index)"
										@open="diskFeatureControl"
									></diskFile>
									<!-- @open="diskFeatureControl" -->
									<div class="mouse-select" v-show="mouseSelectData.width" :style="mouseSelectData" />

									<div class="upload-tips" v-if="showUploadTips">松开鼠标开始上传文件</div>

									<contextmenu ref="contextmenuWrap">
										<template v-if="mouseDownWhere === 'area'">
											<contextmenu-item @click="diskFeatureControl('upload')" :disabled="diskInfo.categoryType !== 'all'">上传文件</contextmenu-item>

											<contextmenu-item @click="diskFeatureControl('uploadFolder')" :disabled="diskInfo.categoryType !== 'all'">上传文件夹</contextmenu-item>

											<contextmenu-item @click="diskFeatureControl('newFolder')" :disabled="diskInfo.categoryType !== 'all'">新建文件夹</contextmenu-item>

											<contextmenu-item divider></contextmenu-item>

											<contextmenu-item @click="diskFeatureControl('clear')" :disabled="diskInfo.clipboard.length === 0 || diskInfo.categoryType !== 'all'"
												>清空剪贴板</contextmenu-item
											>

											<contextmenu-item @click="diskFeatureControl('paste')" :disabled="diskInfo.clipboard.length === 0 || diskInfo.categoryType !== 'all'"
												>粘贴</contextmenu-item
											>

											<contextmenu-item divider></contextmenu-item>

											<contextmenu-item @click="diskFeatureControl('reload')">刷新</contextmenu-item>
										</template>

										<template v-else>
											<template v-if="diskInfo.categoryType !== 'all' && diskInfo.categoryType !== 'trash' && navType === 'disk'">
												<contextmenu-item @click="diskFeatureControl('go-where')" :disabled="moreThanOneSelect">打开文件所在位置</contextmenu-item>

												<contextmenu-item divider></contextmenu-item>
											</template>

											<contextmenu-item @click="diskFeatureControl('open')" :disabled="moreThanOneSelect">打开</contextmenu-item>

											<template v-if="navType === 'disk' && diskInfo.categoryType !== 'trash'">
												<contextmenu-item @click="diskFeatureControl('download')">下载</contextmenu-item>

												<!-- <contextmenu-item divider></contextmenu-item> -->

												<!-- <contextmenu-item @click="diskFeatureControl('move')">移动到</contextmenu-item> -->

												<!-- <contextmenu-item @click="diskFeatureControl('copy')">复制</contextmenu-item> -->

												<!-- <contextmenu-item @click="diskFeatureControl('cut')">剪切</contextmenu-item> -->

												<!-- <contextmenu-item divider></contextmenu-item> -->

												<!-- <contextmenu-item @click="diskFeatureControl('rename')" :disabled="moreThanOneSelect">重命名</contextmenu-item> -->
											</template>

											<!-- <contextmenu-item divider v-else></contextmenu-item> -->

											<!-- <template v-if="diskInfo.categoryType === 'trash'"> -->

											<!-- <contextmenu-item @click="diskFeatureControl('restore')">还原<	/contextmenu-item> -->

											<!-- </template> -->

											<template v-if="navType !== 'share'">
												<contextmenu-item @click="diskFeatureControl(diskInfo.categoryType === 'trash' ? 'delete' : 'trash')">删除</contextmenu-item>

												<contextmenu-item divider></contextmenu-item>
											</template>

											<template v-if="navType === 'share'">
												<contextmenu-item @click="diskFeatureControl('share')" :disabled="moreThanOneSelect">取消分享</contextmenu-item>
											</template>

											<template v-else-if="diskInfo.categoryType !== 'trash'">
												<contextmenu-item @click="diskFeatureControl('share')" :disabled="moreThanOneSelect"
													>{{ diskInfo.select.share ? '取消' : '' }}分享</contextmenu-item
												>
											</template>

											<contextmenu-item @click="diskFeatureControl('info')" :disabled="moreThanOneSelect">属性</contextmenu-item>
										</template>
									</contextmenu>

									<!-- <loading :loading="loading" :length="diskData.length"></loading> -->

									<div id="draggingFile" :style="draggingFilesStyle">
										<div class="icon sf-icon-file">
											<span>{{ diskInfo.selectFiles.length }}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!-- 数据 -->
						<div class="tool-filter" v-else-if="handleOpenDrawer == 'tableText'">
							<el-collapse>
								<el-collapse-item v-for="(item,index) in Object.keys(tagArr)" :key="index" :title="item" :name="index + 1">
									<button class="btn warning" @click="actionControl('addTableText',item)">{{item}}</button>
									<span v-for="(citem,cindex) in tagArr[item]" :key="cindex" class="G-Mr-10 G-Mt-5 G-Fsize-15 G-dis-block G-cursor" @dblclick="handleTag(citem)">{{citem}}</span>
								</el-collapse-item>
							</el-collapse>
						</div>
						<div class="tool-filter" v-else-if="handleOpenDrawer == 'tableAll'">
							<el-table
							:data="tableData"
							style="width: 100%">
							<el-table-column type="expand">
								<template slot-scope="props">
									<el-form label-position="left" inline class="demo-table-expand">
										<el-form-item label="产品名称：">
											<span class="G-cursor">{{ props.row.name }}</span>
										</el-form-item>
										<el-form-item label="别称：">
											<span class="G-cursor">{{ props.row.shopId }}</span>
										</el-form-item>
										<el-form-item label="品牌：">
											<span class="G-cursor">{{ props.row.shop }}</span>
										</el-form-item>
										<el-form-item label="分类：">
											<span class="G-cursor">{{ props.row.id }}</span>
										</el-form-item>
										<el-form-item label="功效：">
											<span class="G-cursor">{{ props.row.category }}</span>
										</el-form-item>
									</el-form>
								</template>
							</el-table-column>
							<el-table-column
								label="产品名称"
								prop="name">
							</el-table-column>
						</el-table>
						</div>
						<div class="tool-allFont" hidden>
							<el-button type="primary" size="small" plain @click="handleChange('official')">我的字体</el-button>
							<el-button type="success" size="small" plain @click="handleChange('my')">官方字体</el-button>
							<div
								style="
									width: 50%;
									float: left;
									text-align: center;
									cursor: pointer;
									margin-top: 10px;
									font-weight: 400;
									font-style: normal;
									color: rgb(136, 255, 227);
									text-decoration: none;
									font-size: 30px;
									text-shadow: rgba(118, 85, 180, 0.74) 3.84525px 3.84525px 0px;
								"
							>
								美好人生
							</div>
						</div>
						<!-- <div class="tool-filter"></div> -->
					</div>

					<div class="template">
						<div class="template-main" v-for="(item, index) in templateList" ref="mainBox" :key="index">
							<div class="fl-row-justy">
								<div class="G-t-r G-bold G-color-333 G-Fsize-16">第{{ toChinesNum(index + 1) }}页</div>
								<div class="icon G-t-r">
									<el-tooltip class="item" effect="dark" content="删除模板" v-if="templateList.length != 1" placement="top-start">
										<i class="iconfont icon-shanchu G-Fsize-22 G-Mr-10" @click="handleChange('delete', index)"></i>
									</el-tooltip>
									<el-tooltip class="item" effect="dark" content="背景色" placement="top-start">
										<i class="iconfont icon-beijingse G-Fsize-20 G-Mr-10" @click="handleChange('bgColor', index)"></i>
									</el-tooltip>
									<el-tooltip class="item" effect="dark" content="背景图" placement="top-start">
										<i class="iconfont icon-beijingtupian G-Fsize-20 G-Mr-10" @click="handleChange('bgImage', index)"></i>
									</el-tooltip>
									<el-tooltip class="item" effect="dark" content="添加一个新模板" placement="top-start">
										<i class="iconfont icon-tianjia G-Fsize-20 G-Mr-10" @click="handleChange('add', index)"></i>
									</el-tooltip>

									<el-tooltip class="item" effect="dark" content="复制一个新模板" placement="top-start">
										<i class="iconfont icon-fuzhi G-Fsize-20 G-Mr-10" @click="handleChange('clone', index)"></i>
									</el-tooltip>
								</div>
							</div>
							<div
								class="box"
								@click="handleTemplateIndex(index)"
								:class="{ active: index == templateIdx }"
								:style="{
									backgroundColor: `rgb(${templateListBgc[index].bgColor})`,
									backgroundImage: `url(${templateListBgc[index].bgImage})`,
								}"
								ref="mainChildBox"
							>
								<div v-for="(citem, cindex) in item" :key="citem.rand">
									<vue-draggable-resizable
										style="display: flex; align-items: center; justify-content: center"
										class-name-active="my-active-class"
										v-if="citem.type == 'text'"
										:w="citem.w || 'auto'"
										:h="citem.h || 'auto'"
										:x="citem.x"
										:y="citem.y"
										:lock-aspect-ratio="true"
										@dragstop="(left, top, width, height) => dragstop(citem, left, top, width, height)"
										@activated="(left, top, width, height) => onActivated(citem, index, cindex)"
										@resizing="(left, top, width, height) => onResize(citem, left, top, width, height, index, cindex)"
									>
										<p
											:ref="citem.rand"
											:tabindex="citem.rand"
											@keyup="handleQuick($event, index, cindex)"
											:style="{
												color: `rgb(${citem.fColor})`,
												fontSize: citem.fSize + 'px',
												fontFamily: citem.fFamily,
												fontStyle: citem.fStyle,
												textAlign: citem.fAlign,
												opacity: citem.fOpcity / 100,
												fontWeight: citem.fWeight,
												writingMode: citem.fMode,
												transform: citem['fScale'] || '',
											}"
										>
											{{ citem.name }}
										</p>
									</vue-draggable-resizable>
									<vue-draggable-resizable
										:w="citem.w || 'auto'"
										:h="citem.h || 'auto'"
										:x="citem.x"
										:y="citem.y"
										:lock-aspect-ratio="true"
										class-name-active="my-active-class"
										v-if="citem.type == 'image'"
										@dragstop="(left, top, width, height) => dragstop(citem, left, top, width, height)"
										@activated="(left, top, width, height) => onActivated(citem, index)"
										@resizing="(left, top, width, height) => onResize(citem, left, top, width, height, index, cindex)"
									>
										<img
											:src="citem.url"
											:tabindex="citem.rand"
											:ref="citem.rand"
											@keyup="handleQuick($event, index, cindex)"
											@load="urlInfo($event, index,cindex)"
											:class="[citem.iFilter, citem.iStyle]"
											:style="{
												transform: citem['fScale'] || '',
												maxWidth: citem.w ? citem.w + 'px' : '100px'
											}"
										/>
									</vue-draggable-resizable>
								</div>
							</div>
						</div>

						<!-- <div class="template-foot">Bottom</div> -->
					</div>
				</div>

				<div class="cloud-disk-content" v-if="navType === 'trans'">
					<transferList type="upload" :data="uploadList" :category="diskInfo.categoryType" @remove="removeTrans" @update="updateCount"></transferList>

					<transferList type="download" :data="downloadList" :category="diskInfo.categoryType" @remove="removeTrans" @update="updateCount"></transferList>
				</div>

				<ectdIndex v-if="navType === 'ectd'" :diskInfo="diskInfo"></ectdIndex>

				<!-- 生成图片 -->

				<bannerImage v-if="navType === 'image' && diskInfo.categoryType == 'all'" @change="childChange" :popupData.sync="generateData"></bannerImage>

				<latticeIndex v-if="navType === 'image' && diskInfo.categoryType == 'lattice'" @change="childChange" :popupData.sync="generateData"></latticeIndex>

				<!-- 模板 -->
			</div>
		</section>

		<div class="silder-icon">
			<el-slider v-model="mainScale" vertical @input="handleMainScale($event)" height="200px"></el-slider>
		</div>

		<audio v-if="noticeSrc" style="display: none" ref="audio" :src="noticeSrc"></audio>
	</main>
</template>

<script>
// JS

import { toChinesNum } from '../../../../utils/index.js';
import diskHeader from '../components/diskHeader';

import diskCategory from '../components/diskCategory';

import diskNavigation from '../components/diskNavigation';

import diskFile from '../components/diskFile';

import uploadHandle from '../tools/uploadHandle';

import uploadFolder from '../tools/uploadFolder';

import dropHandle from '../tools/dropHandle';

import treeViewer from '../tools/treeViewer';

import downloadHandle from '../tools/downloadHandle';

import transferList from '../components/transferList';

import '../components/contextmenu/styles/index.css';

import { directive, Contextmenu, ContextmenuItem } from '../components/contextmenu';

import loading from '../components/loading';

import ectdIndex from './ectd/ectdIndex.vue';

// 生成图片

import bannerImage from './banner/index.vue';

import latticeIndex from './banner/lattice.vue';
// 模板
let shareWin = null;

export default {
	name: 'diskIndex',

	components: {
		diskHeader,

		diskCategory,

		diskNavigation,

		diskFile,

		transferList,

		Contextmenu,

		ContextmenuItem,

		loading,

		ectdIndex,

		bannerImage,

		latticeIndex,
	},

	data() {
		return {
			navType: 'disk',
			diskData: [],

			isTure: true,

			diskInfo: {
				id: 1, //顶级目录id

				keyFlag: null, //按住的按键

				select: {}, //当前选择的（单个）

				selectFiles: [], //多选

				selectTips: '', //选择提示

				clipboard: [], //剪贴板

				clipboardType: '', //剪切板类型

				category: '网盘',

				categoryType: 'all',

				navData: [],

				count: 0,

				page: 1,

				size: {
					used: 0,

					total: 0,

					left: 0,
				},

				selectAll: false,
			},
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
			filterArr: [
				{
					name: '默认1',
					style: 'aden',
				},
				{
					name: '默认1',
					style: 'aden',
				},
				{
					name: '默认1',
					style: 'aden',
				},
				{
					name: '默认1',
					style: 'aden',
				},
			],
			fontOften: [
				{
					fScale: '1',
					type: 'text',
					name: '你好',
					fColor: '0,0,0',
					fSize: 20,
					fFamily: 'cursive',
					fWeight: '400',
					fStyle: 'inherit',
					fMode: 'inherit',
					fAlign: 'center',
					fOpcity: 100,
				},
			],
			imgStyleArr: [
				{
					name: '圆角黑边',
					style: 'style1',
				},
				{
					name: '圆角金边',
					style: 'style2',
				},
				{
					name: '圆角黑边',
					style: 'style1',
				},
				{
					name: '圆角金边',
					style: 'style1',
				},
			],
			colorArr: [
				'0, 0, 0',
				'84, 84, 84',
				'115, 115, 115',
				'166, 166, 166',
				'217, 217, 217',
				'255, 255, 255',
				'255, 22, 22',
				'255, 87, 87',
				'255, 102, 196',
				'203, 108, 230',
				'140, 82, 255',
				'94, 23, 235',
				'3, 152, 158',
				'0, 194, 203',
				'92, 225, 230',
				'56, 182, 255',
				'82, 113, 255',
				'0, 74, 173',
				'0, 128, 55',
				'126, 217, 87',
				'201, 226, 101',
				'255, 222, 89',
				'255, 189, 89',
				'255, 145, 77',
			],
			tagArr:{
				'产品文案':['绝绝子','绝绝子','绝绝子绝绝子','绝绝子绝绝子绝绝子绝绝子绝绝子绝绝子','第四个','绝绝子','绝绝子','第四个','第五个','第四个','第五个','第五个','第四个','第五个'],
				'分类文案':['第二个'],
				'标签文案':['第三个'],
				'其他文案':['第四个','第五个']
			},
			tableData: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }],
			loading: true,

			/*拖拽选择参数*/

			mouseSelectData: {
				left: 0,

				top: 0,

				width: 0,

				height: 0,
			},

			mouseDownWhere: 'area',

			showUploadTips: false,

			uploadList: [],

			downloadList: [],

			popupWindowOpen: false, //是否有弹窗

			fileViewer: {},

			maxFileSize: 4294967296, //4GB

			maxFileSizeText: '0B',

			draggingFilesStyle: {
				display: 'none',

				left: 0,

				top: 0,
			},

			settingConfig: {
				maxUpTrans: 3,

				maxDownTrans: 3,

				noticeBubble: true, //气泡提示

				noticeFlag: true, //提醒声音
			},
			curData: {},
			noticeSrc: false,
			mainScale: 0,
			fontFamilyArr: [
				{
					name: '第一个',
					path: 'Family-1',
				},
				{
					name: '第二个',
					path: 'Family-2',
				},
			],
			templateList: [
				[
					{
						rand: '1',
						fScale: '1', //缩放度
						type: 'text', // 类型
						name: '你好', //
						fColor: '0,0,0', // 颜色
						fSize: 20, // 字号
						fFamily: 'cursive', // 字体
						fWeight: '400', // 宽度
						fStyle: 'inherit', // 倾斜度
						fMode: 'inherit', // 横竖
						fAlign: 'center', // 居中
						fOpcity: 100, // 透明度
						fShadow: '', // 阴影
						familyText: '第一个', //
					},
					{
						rand: '2',
						fScale: '1',
						type: 'image',
						url: 'https://aliyun-wb-bvqq7ezi1t.oss-cn-beijing.aliyuncs.com/image/2022/4-5/8.png',
						iFilter: '',
						iStyle: '',
					},
				],
				// [{type:'image',url:'https://aliyun-wb-bvqq7ezi1t.oss-cn-beijing.aliyuncs.com/image/2022/4-5/12.png',iFilter:''}],
			],
			// templateList:[[]],
			templateListBgc: [
				{
					bgColor: '255,255,255',
					bgImage: '',
				},
			],
			templateIdx: null,
			handleOpenDrawer: '',
			generateData: {
				type: '',

				isDrawer: false,

				currentIndex: '',

				// type: 'table',

				// isDrawer: true,
			},
		};
	},

	directives: {
		contextmenu: directive,
	},

	computed: {
		diskFileShowType: function () {
			return this.$store.state.fileStateIcon === 'sf-icon-th-large' ? 'block-file' : 'block-file';
		},
		isTF() {
			return this.handleOpenDrawer === 'fontColor' ? this.curData.fColor : this.templateListBgc[this.templateIdx].bgColor;
		},

		haveSelect: function () {
			return this.diskInfo.selectFiles.length !== 0;
		},

		isWebCloudDisk: function () {
			return this.$projectInfo.projectName === 'CloudDisk' && !this.$isElectron;
		},

		moreThanOneSelect: function () {
			return this.diskInfo.selectFiles.length > 1;
		},
	},

	watch: {
		diskData: {
			handler() {
				this.diskInfo.selectFiles = [];

				this.diskData.forEach((item, index) => {
					if (item.active) {
						this.diskInfo.selectFiles.push(item);
					}
				});

				if (this.diskInfo.selectFiles.length) {
					this.diskInfo.selectTips = '选中' + this.diskInfo.selectFiles.length + '个项目';
				} else {
					this.diskInfo.selectTips = this.diskData.length + '个项目';
				}

				this.diskInfo.selectAll = this.diskInfo.selectFiles.length === this.diskData.length;
			},

			deep: true,
		},
	},

	mounted() {
		console.error('mounted', this.navType);

		this.initKeyDown();

		if (this.$isElectron) {
			this.initDiskProfile(() => {
				this.$getUserInfo();

				this.getDiskData();

				this.$api.localFile.read('setting', (setting) => {
					this.settingConfig = Object.assign(this.settingConfig, setting);

					uploadHandle.maxLimit = this.settingConfig.maxUpTrans;

					downloadHandle.maxLimit = this.settingConfig.maxDownTrans;

					this.noticeSrc = localStorage.noticeVoice;

					this.$ipc.send('system', 'download-update', setting.transDownFolder);

					this.initDiskInfo(this.initTransData);
				});
			});
		} else {
			this.noticeSrc = '/CloudDisk/voice/1.wav';

			if (this.isWebCloudDisk) {
				let query = this.$route.query;

				this.navType = query.type || 'disk';

				this.diskInfo.id = parseInt(query.id) || 1;

				this.diskInfo.categoryType = query.category || 'all';

				this.diskInfo.category = query.category_name || '全部文件';

				if (this.diskInfo.id !== 1 && this.navType !== 'trans') {
					this.$api.disk.fileInfo(
						{
							id: this.diskInfo.id,
						},

						(rs) => {
							this.diskInfo.navData = rs.data.address;
						}
					);
				}
			}

			this.$getUserInfo();

			if (this.navType === 'disk') {
				this.getDiskData();
			}

			this.initDiskInfo();
		}
	},

	beforeDestroy() {
		this.initKeyDown('stop');
	},

	methods: {
		navControl(type) {
			console.log(type, 'deded');
			this.diskNavigationControl(type);
		},
		urlInfo(e,index,cindex){
			this.templateList[index][cindex].h =  e.target.height
			this.templateList[index][cindex].w =  e.target.width
		},
		handleTag(item,index){
			this.templateList[this.templateIdx].push(
				{
						rand: '1',
						fScale: '1', //缩放度
						type: 'text', // 类型
						name: item, //
						fColor: '0,0,0', // 颜色
						fSize: 20, // 字号
						fFamily: 'cursive', // 字体
						fWeight: '400', // 宽度
						fStyle: 'inherit', // 倾斜度
						fMode: 'inherit', // 横竖
						fAlign: 'center', // 居中
						fOpcity: 100, // 透明度
						fShadow: '', // 阴影
						familyText: '第一个', //
					},
			)
		},
		handleTemplateIndex(index) {
			this.templateIdx = index;
		},
		handleDragEnter(e) {
			console.log(e);
		},
		actionControl(commend,type) {
			this.diskFeatureControl(commend,type);
		},
		handleMainScale(e) {
			console.log(this.toChinesNum(1), '1212');
			this.$refs.mainBox.map((item, index) => {
				// this.$refs.mainBox[index].style.transform = 'scale(1.1)'
				// this.$refs.mainChildBox[index].style.transform = 'scale(1.1)'
			});
		},
		handleQuick(e, index, cindex) {
			if (e.keyCode === 17) {
				// ctrl+c事件
				let item = JSON.parse(JSON.stringify(this.templateList[index][cindex]));
				item.rand = (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + new Date().getTime() + '-' + Math.random().toString().substr(2, 5);
				item.x = item.x ? item.x + 10 : 10;
				item.y = item.y ? item.y + 10 : 10;
				this.templateList[index].push(item);
			} else if (e.keyCode === 8) {
				// 删除事件
				this.templateList[index].splice(cindex, 1);
			}
		},
		handleColor(e) {
			let str = e.match(/\d+(\.\d+)?/g);
			this.curData.fColor = str.toString();
		},
		handleSelectStyle(type, item) {
			if (type === 'fontFamily') {
				this.curData.fFamily = item.path;
				this.curData.familyText = item.name;
			} else if (type === 'fontColor') {
				this.handleOpenDrawer === 'fontColor'
					? (this.curData.fColor = item)
					: this.$set(this.templateListBgc, this.templateIdx, { ...this.templateListBgc[this.templateIdx], bgColor: item });
			} else if (type === 'imageFilter') {
				this.curData.iFilter = item.style;
			} else if (type === 'imageStyle') {
				this.curData.iStyle = item.style;
			}
		},
		handleSelectFamily(e) {
			if (e.status === 'tableText' || e.status === 'tableAll') {
				this.curData = { type: 'table' };
			}
			this.handleOpenDrawer = e.status;
		},
		dragstop(data, x, y, width, height) {
			data.x = x;
			data.y = y;
		},
		onResize(data, x, y, width, height, index, cindex) {
			var dom_width = data.w ||this.$refs[data.rand][0].clientWidth;
			var dom_height = data.h ||this.$refs[data.rand][0].clientHeight;
			// console.log(data,dom_height,"cdcd")
			this.$set(this.templateList[index][cindex], 'fScale', `scale(${width / dom_width},${height / dom_height})`);
			this.$refs[data.rand][0].style.transform = `scale(${width / dom_width},${height / dom_height})`;
			data.w = width;
			data.h = height;
		},
		onActivated(ele, index, cindex) {
			if (ele.type === 'text') {
				this.curData = ele;
				this.handleOpenDrawer = 'fontOften';
			} else if (ele.type === 'image') {
				this.curData = ele;
				this.handleOpenDrawer = 'imageSource';
			}
			// let width = this.$refs[ele.rand][0].clientWidth;
			// let height = this.$refs[ele.rand][0].clientHeight;
			// let scaleW = 1;
			// let scaleH = 1;
			// if (ele.transformScale !== '' && ele.transformScale !== undefined) {
			// 	(scaleW = parseFloat(ele.transformScale.split(',')[0].split('scale(')[1])), (scaleH = parseFloat(ele.transformScale.split(',')[1]));
			// }
			// if (ele.paddingStyle === undefined || ele.paddingStyle === '0px') {
			// 	ele.w = width * scaleW;
			// 	ele.h = height * scaleH;
			// } else {
			// 	ele.w = width * scaleW;
			// 	ele.h = height * scaleH;
			// }
			// if (ele.type === 'text') {
			// 	this.$emit('change', { type: 'table', isDrawer: true, currentIndex: ele.rand });
			// }
			// this.imgStyleToData = [];
			// this.templateList.map((item, index) => {
			// 	if (item.type === 'text') {
			// 		let splitArrr = this.getStyle(this.$refs[item.rand][item.index], 'textShadow');
			// 		let obj = {
			// 			...item,
			// 			'font-size': this.getStyle(this.$refs[item.rand][item.index], 'fontSize'),
			// 			color: this.getStyle(this.$refs[item.rand][item.index], 'color'),
			// 			fontFamily: this.getStyle(this.$refs[item.rand][item.index], 'fontFamily'),
			// 			'text-shadow': this.getStyle(this.$refs[item.rand][item.index], 'textShadow'),
			// 			fontStyle: this.getStyle(this.$refs[item.rand][item.index], 'fontStyle'),
			// 			transformScale: this.getStyle(this.$refs[item.rand][item.index], 'transform'),
			// 			textColor: splitArrr.split(' 1px 0px 0px, ')[0],
			// 			textAlign: this.getStyle(this.$refs[item.rand][item.index], 'textAlign'),
			// 			writingMode: this.getStyle(this.$refs[item.rand][item.index], 'writingMode'),
			// 			class: this.$refs[item.rand][item.index].getAttribute('class'),
			// 			backgroundColor: this.getStyle(this.$refs[item.rand][item.index], 'backgroundColor'),
			// 			paddingStyle: this.getStyle(this.$refs[item.rand][item.index], 'padding'),
			// 			borderRadius: this.getStyle(this.$refs[item.rand][item.index], 'borderRadius'),
			// 		};
			// 		this.imgStyleToData.push(obj);
			// 	}
			// });
		},
		toChinesNum(num) {
			let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
			let unit = ['', '十', '百', '千', '万'];
			num = parseInt(num);
			let getWan = (temp) => {
				let strArr = temp.toString().split('').reverse();
				let newNum = '';
				let newArr = [];
				strArr.forEach((item, index) => {
					newArr.unshift(item === '0' ? changeNum[item] : changeNum[item] + unit[index]);
				});
				let numArr = [];
				newArr.forEach((m, n) => {
					if (m !== '零') numArr.push(n);
				});
				if (newArr.length > 1) {
					newArr.forEach((m, n) => {
						if (newArr[newArr.length - 1] === '零') {
							if (n <= numArr[numArr.length - 1]) {
								newNum += m;
							}
						} else {
							newNum += m;
						}
					});
				} else {
					newNum = newArr[0];
				}
				return newNum;
			};
			let overWan = Math.floor(num / 10000);
			let noWan = num % 10000;
			if (noWan.toString().length < 4) {
				noWan = '0' + noWan;
			}
			return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num);
		},
		initDiskProfile(callback) {
			this.$ipc.on('win-data', (e, data) => {
				if (data) {
					this.$api.user.login(
						data,

						() => {
							callback && callback();
						},

						() => {
							this.$ipc.send('system', 'logoff');
						}
					);
				} else {
					callback && callback();
				}
			});
		},

		handleChange(commend = 'normal', index) {
			switch (commend) {
				case 'delete': //删除
					this.templateList.splice(index, 1);
					this.templateListBgc.splice(index, 1);
					break;
				case 'add':
					this.templateList.push([{ text: 'text' }]);
					this.templateListBgc.push({ bgColor: 'white', bgImage: '' });
					break;
				case 'clone':
					this.templateList.push(this.templateList[index]);
					this.templateListBgc.push(this.templateListBgc[index]);
					break;

				case 'down':
					//

					break;

				case 'official':
					//

					break;

				case 'my':
					//

					break;
				case 'bgColor':
					// 背景色
					this.templateIdx = index;
					this.handleOpenDrawer = 'bgColor';
					break;
				case 'bgImage':
					// 背景图
					this.templateIdx = index;
					this.handleOpenDrawer = 'imageSource';
					break;
			}
		},

		childChange(data) {
			this.generateData = {
				type: data.type,

				isDrawer: true,

				currentIndex: data.currentIndex,
			};
		},

		changeGenerate(data) {
			this.generateData = {
				type: data.type,

				isDrawer: true,

				currentIndex: data.currentIndex,
			};
		},

		initTransData() {
			this.$nextTick(() => {
				this.$ipc.on('read-file', (e, data) => {
					let file = new File([data.result], data.name);

					this.prepareUpload({ files: [file] }, 'drop', data.parentId, true);
				});

				this.$api.localFile.read('download', (data) => {
					if (data && data.length) {
						let needDownload = data.filter((item) => {
							return item._state !== 'finish' && item._state !== 'cancelled';
						});

						this.prepareDownload(needDownload, true);
					}
				});

				this.$api.localFile.read('upload', (data) => {
					if (data && data.length) {
						data.forEach((item) => {
							if (item._state !== 'finish' && item._state !== 'cancelled' && item._state !== 'cancelling' && item.path) {
								this.$ipc.send('system', 'read-file', [item.path, item.name, item.data.parentId]);
							}
						});
					}
				});
			});
		},

		initDiskInfo(callback) {
			this.maxFileSizeText = this.maxFileSize.fileSize();

			this.$api.disk.info((rs) => {
				this.diskInfo.size = rs.data;

				callback && callback();
			});
		},

		initKeyDown(flag) {
			if (flag === 'stop') {
				document.documentElement.removeEventListener('keydown', () => {}, true);

				document.documentElement.removeEventListener('keyup', () => {}, true);

				return;
			}

			document.addEventListener('keydown', (e) => {
				if (this.popupWindowOpen || shareWin) {
					return false;
				}

				if (!this.$isElectron) {
					let count = 0;

					for (let i in this.fileViewer) {
						count++;
					}

					if (count) {
						return false;
					}
				}

				if (e.ctrlKey) {
					if (e.key === 'c' && this.haveSelect) {
						this.diskFeatureControl('copy');
					} else if (e.key === 'x' && this.haveSelect) {
						this.diskFeatureControl('cut');
					} else if (e.key === 'v') {
						this.diskFeatureControl('paste');
					} else if (e.key === 'm' && this.diskInfo.selectFiles.length === 1) {
						this.diskFeatureControl('rename');
					} else if (e.key === 'o' && this.diskInfo.selectFiles.length === 1) {
						this.diskFeatureControl('open');
					} else if (e.key === 'd' && this.haveSelect) {
						this.diskFeatureControl('download');
					} else if (e.key === 'Delete' && this.haveSelect) {
						this.diskFeatureControl('delete');
					}
				} else if (e.altKey) {
					if (e.key === 'Enter' && this.diskInfo.selectFiles.length === 1) {
						this.diskFeatureControl('info');
					}
				} else {
					if (e.key === 'Delete' && this.haveSelect) {
						this.diskFeatureControl(this.diskInfo.categoryType === 'trash' ? 'delete' : 'trash');
					}
				}

				if (e.key === 'F2' && this.diskInfo.selectFiles.length === 1) {
					this.diskFeatureControl('rename');
				}

				if (e.key === 'Control') {
					this.diskInfo.keyFlag = 'Control';
				}

				if (e.key === 'Shift') {
					this.diskInfo.keyFlag = 'Shift';
				}
			});

			document.addEventListener('keyup', (e) => {
				this.diskInfo.keyFlag = null;
			});
		},

		categoryChange(category, type) {
			this.diskInfo.categoryType = category.data;

			this.diskInfo.category = category.name === '全部文件' ? '网盘' : category.name;

			this.resetData();

			this.diskNavigationControl('clear');

			/** 切换到e-CTD */

			if (type === 'ectd') {
				/** 国家规范 */

				this.diskInfo.country = category.country;
			} else if (type !== 'trans') {
				this.getDiskData();
			} else {
				this.saveInfoToRoute();

				this.updateCount();
			}
		},

		resetData(id) {
			this.diskInfo.id = id || 1;

			this.diskInfo.page = 1;

			this.diskData = [];

			this.loading = true;

			this.clearSelect();
		},

		getDiskData(keyword) {
			let obj = {
				page: this.diskInfo.page,

				parentId: this.diskInfo.id,

				category: this.diskInfo.categoryType,
			};

			this.saveInfoToRoute();

			keyword ? (obj.keyWord = keyword) : '';

			this.$api.disk.list(obj, (rs) => {
				this.loading = false;

				this.diskInfo.count = rs.data.count;
				this.diskData = [...this.diskData, ...rs.data.rows];
			});
		},

		loadMoreDiskData(e) {
			this.$scrollEnd(
				e,

				() => {
					if (!this.loading && this.diskData.length < this.diskInfo.count) {
						this.diskInfo.page++;

						this.getDiskData();
					}
				},

				0
			);
		},

		mainMouseControl(e) {
			if (e.button === 0) {
				this.clearSelect();
			} else {
				this.mouseDownWhere = 'area';
			}

			this.mouseSelect();
		},

		selectFile(event, item, index) {
			this.mouseDownWhere = 'file';

			//左键//右键

			if (event.button === 0 || event.button === 2) {
				event.stopPropagation();

				let area = this.$refs.diskFileArea;

				if (this.diskInfo.categoryType !== 'trash' && this.navType !== 'share') {
					if (!this.diskInfo.keyFlag) {
						if (this.diskInfo.selectFiles.length === 0) {
							item.active = true;

							this.diskInfo.select = item;
						} else {
							let hasFlag = this.diskInfo.selectFiles.filter((select) => {
								return select.id === item.id;
							});

							if (!hasFlag.length) {
								this.clearSelect();

								item.active = true;

								this.diskInfo.select = item;
							}
						}
					}

					document.onmousemove = (e) => {
						e.stopPropagation();

						e.preventDefault();

						this.draggingFilesStyle = {
							display: 'flex',

							left: e.clientX - area.getBoundingClientRect().left + 5 + 'px',

							top: e.clientY - area.getBoundingClientRect().top + 5 + 'px',
						};
					};
				}

				document.onmouseup = () => {
					document.onmousemove = null;

					if (this.draggingFilesStyle.display === 'flex') {
						let dropItem = this.diskData.filter((item) => {
							return item.hover && item.type === 'folder';
						});

						//拖拽移动文件不会经过默认的条件判断，所以在这里做了

						if (dropItem.length) {
							dropItem = dropItem[0];

							let flag = this.diskInfo.selectFiles.filter((item) => {
								return item.id === dropItem.id;
							});

							/*判断拖拽的文件在放置的时候是否包含自身*/

							if (!flag.length) {
								this.diskFeatureControl('cut');

								this.diskFeatureControl('paste');
							}
						}

						this.draggingFilesStyle = {
							display: 'none',

							left: 0,

							top: 0,
						};

						return;
					}

					if (this.diskInfo.keyFlag === 'Control') {
						//Ctrl多选

						item.active = !item.active; //反选
					} else if (this.diskInfo.keyFlag === 'Shift') {
						//Shift多选

						let Start = index,
							End;

						item.active = true;

						if (this.diskInfo.select.id) {
							for (let i = 0; i < this.diskData.length; i++) {
								if (this.diskData[i].id === this.diskInfo.select.id) {
									Start = i;
								}

								if (this.diskData[i].id === item.id) {
									End = i;
								}
							}
						}

						this.clearSelect(true);

						for (let j = Math.min(End, Start); j < Math.max(End, Start) + 1; j++) {
							this.diskData[j].active = true;
						}
					} else if (!this.diskInfo.keyFlag) {
						if (event.button === 2) {
							//如果是右键，判断当前是否在已选中的里面

							let hasIndex = this.diskInfo.selectFiles.filter((file) => {
								return file.id === item.id;
							});

							if (!hasIndex.length) {
								//单选

								this.clearSelect();

								item.active = true;

								this.diskInfo.select = item;
							}
						} else {
							//左键直接取消原有的选中

							this.clearSelect();

							item.active = true;

							this.diskInfo.select = item;
						}
					}
				};
			}
		},

		dropUploadTips(show) {
			if (this.diskInfo.categoryType === 'all') {
				this.showUploadTips = show;
			}
		},

		dropUpload(e) {
			if (this.diskInfo.categoryType === 'all') {
				dropHandle.init(e, (data) => {
					this.uploadFolder(data.folder, 'drop');

					if (data.file.length) {
						this.prepareUpload(data.file, 'drop');
					}
				});

				this.showUploadTips = false;
			}
		},

		mouseSelect() {
			event.preventDefault();

			event.stopPropagation();

			let area = this.$refs.diskFileArea;

			let start = {
				x: event.clientX - area.getBoundingClientRect().left + area.scrollLeft,

				y: event.clientY - area.getBoundingClientRect().top + area.scrollTop,

				maxy: area.scrollHeight,
			};

			this.mouseSelectData.left = start.x;

			this.mouseSelectData.top = start.y;

			document.onmouseup = () => {
				this.mouseSelectData = {
					left: 0,

					top: 0,

					width: 0,

					height: 0,
				};

				document.onmousemove = null;
			};

			document.onmousemove = (ev) => {
				let end = {
					x: ev.clientX - area.getBoundingClientRect().left + area.scrollLeft,

					y: ev.clientY - area.getBoundingClientRect().top + area.scrollTop,

					scrolldown: Math.min(ev.clientY - area.getBoundingClientRect().top, event.clientY - area.getBoundingClientRect().top) + 10 + area.offsetHeight,

					scrollup: Math.min(ev.clientY - area.getBoundingClientRect().top, event.clientY - area.getBoundingClientRect().top),
				};

				this.mouseSelectData = {
					left: Math.min(start.x, end.x) + 'px',

					top: Math.min(start.y, end.y) + 'px',

					width: Math.abs(end.x - start.x) + 'px',

					height: Math.abs(end.y - start.y) + 'px',
				};

				let area_data = {
					left: Math.min(start.x, end.x),

					top: Math.min(start.y, end.y),

					width: Math.abs(end.x - start.x),

					height: Math.abs(end.y - start.y),
				};

				let selList = document.getElementsByClassName('file');

				this.clearSelect();

				for (let i = 0; i < selList.length; i++) {
					let sl = selList[i].offsetWidth + selList[i].offsetLeft,
						st = selList[i].offsetHeight + selList[i].offsetTop;

					let area_l = area_data.left + area_data.width;

					let area_t = area_data.top + area_data.height;

					if (sl > area_data.left && st > area_data.top && selList[i].offsetLeft < area_l && selList[i].offsetTop < area_t) {
						if (this.diskData[i].active !== true) {
							this.diskData[i].active = true;
						}
					} else {
						if (this.diskData[i].active) {
							this.diskData[i].active = false;
						}
					}
				}
			};
		},

		clearSelect(flag) {
			this.diskData.forEach((item, index) => {
				item.active = false;

				item.hover = false;
			});

			if (!flag) {
				this.diskInfo.select = {};
			}

			//this.diskInfo.selectFiles = [];
		},

		verifyUploadSize(files) {
			let result = [];

			let totalSize = 0;

			for (let i = 0; i < files.length; i++) {
				if (files[i].size < this.maxFileSize) {
					result.push(files[i]);

					totalSize = totalSize + files[i].size;
				} else {
					this.$Message.warning(files[i].name + '超过' + this.maxFileSizeText + '已过滤');
				}
			}

			let uploadingSize = this.uploadList.reduce((a, b) => {
				if (b._state !== 'finish') {
					a = a + b.size;
				}

				return a;
			}, 0);

			if (totalSize && totalSize > this.diskInfo.size.left - uploadingSize) {
				this.$Message.error('剩余空间不足');

				return [];
			}

			return result;
		},

		uploadFolder(e, type = 'normal') {
			let files = [];

			if (type === 'drop') {
				files = e;
			} else {
				files = e.target.files;
			}

			files = this.verifyUploadSize(files);

			if (files.length > 500) {
				if (type === 'normal') {
					e.target.value = '';
				}

				this.$Message.warning('文件/目录过多');

				return;
			}

			this.$Message.info('空文件夹将不会创建');

			this.$api.disk.uploadFolder(
				{
					folder: uploadFolder.init(files),

					parentId: this.diskInfo.id,
				},

				(rs) => {
					this.diskData.push(this.$api.disk.diskData(rs.data.main));

					let data = uploadFolder.mateParent(files, rs.data.folders);

					for (let parentId in data) {
						if (data.hasOwnProperty(parentId)) {
							this.prepareUpload(data[parentId], 'folder', parentId, true);
						}
					}

					uploadHandle.canStart();

					if (type === 'normal') {
						e.target.value = '';
					}
				},

				() => {
					if (type === 'normal') {
						e.target.value = '';
					}
				}
			);
		},

		prepareUpload(e, type, parentId, paused) {
			let files = [];

			if (type === 'folder' || type === 'drop') {
				files = e;
			} else {
				files = e.target.files;
			}

			if (type !== 'folder') {
				if (files.length === 0) {
					if (!type) {
						e.target.value = '';
					}

					return;
				}

				files = this.verifyUploadSize(files);
			}

			uploadHandle.init(
				files,

				{
					parentId: parentId || this.diskInfo.id,
				},

				(data, fileData) => {
					console.log(data, fileData, 'xxx');

					this.uploadList = data;

					if (fileData && type !== 'folder') {
						this.diskData.push(this.$api.disk.diskData(fileData));

						this.transFinish(fileData, 'upload');

						this.initDiskInfo();
					}
				},

				paused
			);

			if (!type) {
				e.target.value = '';
			}
		},

		prepareDownload(files, paused) {
			downloadHandle.init(
				files,

				this.$isElectron,

				(data, finish) => {
					this.downloadList = data;

					if (finish) {
						this.transFinish(finish, 'download');
					}
				},

				paused
			);
		},

		transFinish(item, type) {
			if (this.settingConfig.noticeBubble) {
				this.$notify(item.name, type === 'upload' ? '上传完成' : '下载完成');
			}

			if (this.settingConfig.noticeFlag) {
				if (this.noticeSrc) {
					this.$refs.audio.play();
				}
			}
		},

		diskNavigationControl(commend, func) {
			switch (commend) {
				case 'back': //后退
					if (this.diskInfo.navData.length > 1) {
						this.diskNavigationControl(this.diskInfo.navData[this.diskInfo.navData.length - 2]);
					} else {
						this.diskNavigationControl('home');
					}

					break;

				case 'home': //返回顶层
					if (this.diskInfo.categoryType === 'share') {
						this.SwitchType('share');

						this.diskNavigationControl('clear');
					} else if (this.diskInfo.category !== '搜索') {
						this.resetData(1);

						this.getDiskData();

						this.diskNavigationControl('clear');
					} else if (this.diskInfo.category === '搜索') {
						this.SwitchType('disk');

						this.diskNavigationControl('clear');
					}

					break;

				case 'reload': //刷新
					this.resetData(this.diskInfo.id);

					this.initDiskInfo();

					this.getDiskData();

					break;

				case 'clear':
					this.diskInfo.navData = [];

					break;

				case 'sort':
					this.diskData = func(this.diskData);

					break;

				case 'search':
					this.resetData();

					this.diskInfo.categoryType = 'all';

					this.diskInfo.category = '网盘';

					this.getDiskData(func);

					break;

				default:
					//默认切换

					for (let i = this.diskInfo.navData.length - 1; i > 0; i--) {
						if (commend === this.diskInfo.navData[i]) {
							break;
						}

						this.diskInfo.navData.splice(i, 1);
					}

					this.resetData(commend.id);

					this.getDiskData();

					break;
			}
		},

		diskFeatureControl(commend,type) {
			let isDragMove = this.draggingFilesStyle.display === 'flex';

			switch (commend) {
				case 'addTableText':
					this.popupWindow({
						title: '',
						tips: `请输入${type}(逗号分割上传多条)`,
						callback: (value) => {
							if (value.length === 0) {
								return this.$Message.error('文件夹名称不能为空');
							}
							this.$api.disk.newFolder(
								{
									parentId: this.diskInfo.id,
									name: value,
								},
								(rs) => {
									this.diskData.push(this.$api.disk.diskData(rs.data));
									this.$Message.success(value + '已创建');
								}
							);
						},
					});

				break;
				case 'quick-open':
					if (this.diskData[0]) {
						this.$set(this.diskData[0], 'active', true);
					}

					this.openFileHandle(this.diskData[0]);

					break;

				case 'go-where':
					this.$api.disk.fileInfo(
						{
							id: this.diskInfo.select.id,
						},

						(rs) => {
							this.diskInfo.categoryType = 'all';

							this.diskInfo.category = '网盘';

							if (rs.data.address.length === 1) {
								this.resetData(1);
							} else {
								rs.data.address.splice(rs.data.address.length - 1, 1);

								let navData = rs.data.address;

								this.resetData(navData[navData.length - 1].id);

								this.diskInfo.navData = navData;
							}

							this.getDiskData();
						}
					);

					break;

				case 'open':
					if (this.navType === 'share') {
						return;
					}

					let item = this.diskInfo.select;

					if (item.type === 'folder') {
						this.resetData(item.id);

						this.diskInfo.categoryType = 'all';

						this.getDiskData();

						this.diskInfo.navData.push(item);
					} else {
						if (item.openType === 'image') {
							this.templateList[this.templateIdx].push({
								rand: '2',
								fScale: '1',
								type: 'image',
								url: `https://aliyun-wb-bvqq7ezi1t.oss-cn-beijing.aliyuncs.com` + item.content,
								iFilter: '',
								iStyle: '',
							});
						} else {
							console.log(item, 'dede');
							this.openFileHandle(item);
						}
					}

					break;

				case 'uploadFolder':
					this.$refs.inputFolderFile.click();

					break;

				case 'upload':
					this.$refs.inputFile.click();

					break;

				case 'download':
					let selectDownload = [];

					if (this.diskInfo.selectFiles.length) {
						selectDownload = this.diskInfo.selectFiles.filter((item) => {
							return item.type === 'file';
						});
					} else {
						if (this.diskInfo.select && this.diskInfo.select.type === 'file') {
							selectDownload.push(this.diskInfo.select);
						}
					}

					let tips = selectDownload.length > 1 ? '所选' + selectDownload.length + '个项目' : selectDownload[0].name;

					this.prepareDownload(selectDownload);

					selectDownload = [];

					this.$Message.info(tips + '已加入下载列队');

					break;

				case 'reload':
					this.diskNavigationControl('reload');

					break;

				case 'move':
					treeViewer(
						'请选择要移动到的目录',

						(select) => {
							if (select) {
								let data = this.getSelectData(this.diskInfo.selectFiles);

								this.$api.disk.move(
									{
										id: data,

										target: select.id,
									},

									() => {
										this.removeSelect(data);
									}
								);
							}
						},

						this.diskInfo.selectFiles
					);

					break;

				case 'copy':

				case 'cut':
					this.diskFeatureControl('clear');

					this.diskInfo.clipboard = this.diskInfo.selectFiles;

					if (this.diskInfo.clipboard.length) {
						if (!isDragMove) {
							let tips = this.diskInfo.clipboard.length > 1 ? '所选' + this.diskInfo.clipboard.length + '个项目' : this.diskInfo.clipboard[0].name;

							tips = tips + '已' + (commend === 'copy' ? '复制' : '剪切') + '到剪贴板';

							this.$Message.info(tips);
						}

						this.diskInfo.clipboardType = commend === 'cut' ? 'move' : commend;
					}

					break;

				case 'paste': //粘贴
					let cutFlag = true;

					let copySize = 0;

					let clipboardType = this.diskInfo.clipboardType;

					let targetId = this.diskInfo.id;

					if (this.diskInfo.clipboard.length === 0) {
						return;
					}

					this.diskInfo.clipboard.forEach((item) => {
						copySize = copySize + parseInt(item.disk_size);

						if (this.diskInfo.id === item.id || (!isDragMove && item.parentId === this.diskInfo.id)) {
							//剪切文件和目标地址相同

							this.diskFeatureControl('clear');

							cutFlag = false;
						}
					});

					if (clipboardType === 'copy') {
						if (copySize > this.diskInfo.size.left) {
							return this.$Message.error('空间不足！请清理一些文件后重试');
						}
					} else {
						if (isDragMove) {
							targetId = this.diskData.filter((item) => {
								return item.hover && item.type === 'folder';
							})[0].id;
						}
					}

					if (!cutFlag) {
						return this.$Message.warning('剪贴板内包含粘贴目标，请重新选择');
					}

					if (!isDragMove) {
						this.$Message.info(`正在${clipboardType === 'copy' ? '复制' : '剪切'}文件，请稍候`);
					}

					let clipboardData = this.getSelectData(this.diskInfo.clipboard);

					this.$api.disk[clipboardType](
						{
							id: clipboardData,

							target: targetId,
						},

						() => {
							let data = JSON.handle(this.diskInfo.clipboard);

							let CopyFlag = data.filter((item) => {
								return item.parentId === this.diskInfo.id;
							}); //判断是否有复制和粘贴时同一个目录的

							if (CopyFlag.length) {
								this.diskNavigationControl('reload');
							} else {
								data.forEach((item) => {
									if (this.diskInfo.clipboardType === 'copy') {
										item.name = item.name + '-复制';
									}

									item.parentId = this.diskInfo.id;

									this.diskData.push(item);
								});
							}

							if (!isDragMove) {
								this.$Message.success(`${clipboardType === 'copy' ? '复制' : '剪切'}成功，共${this.diskInfo.clipboard.length}个项目`);
							}

							this.diskFeatureControl('clear');
						}
					);

					break;

				case 'clear':
					this.diskInfo.clipboard = [];

					break;

				case 'newFolder':
					this.popupWindow({
						title: '新建文件夹',

						tips: '请输入文件夹名称',

						callback: (value) => {
							if (value.length === 0) {
								return this.$Message.error('文件夹名称不能为空');
							}

							if (this.validateFileName(value)) {
								return this.$Message.error('文件夹名称不能包含【\\\\\\\\/:*?\\"<>|】');
							}

							this.$api.disk.newFolder(
								{
									parentId: this.diskInfo.id,

									name: value,
								},

								(rs) => {
									this.diskData.push(this.$api.disk.diskData(rs.data));

									this.$Message.success(value + '已创建');
								}
							);
						},
					});

					break;

				case 'newAllFolder':
					this.popupWindow({
						title: '新建文件夹',

						tips: '请输入生成的个数',

						callback: (value) => {
							if (value.length === 0) {
								return this.$Message.error('文件夹名称不能为空');
							}

							if (this.validateFileName(value)) {
								return this.$Message.error('文件夹名称不能包含【\\\\\\\\/:*?\\"<>|】');
							}

							let arr = [];

							if (this.diskInfo.navData.length) {
								this.diskInfo.navData.map((item, index) => {
									arr.push(item.name);
								});

								arr.push(value);
							} else {
								arr.push(value);
							}

							for (let i = 1; i <= value; i++) {
								this.$api.disk.newFolder(
									{
										parentId: this.diskInfo.id,

										name: Number(i),
									},

									(rs) => {
										this.$Message.success(i + '已创建');

										this.diskData.push(this.$api.disk.diskData(rs.data));
									}
								);
							}
						},
					});

					break;

				case 'rename':
					this.popupWindow({
						title: '重命名',

						tips: '请输入新的文件/文件夹名称',

						value: this.diskInfo.selectFiles[0].name,

						callback: (value) => {
							if (value.length === 0) {
								return this.$Message.error('文件名不能为空');
							}

							if (this.validateFileName(value)) {
								return this.$Message.error('文件名称不能包含【\\\\\\\\/:*?\\"<>|】');
							}

							this.$api.disk.rename(
								{
									id: this.diskInfo.selectFiles[0].id,

									name: value,
								},

								() => {
									this.diskInfo.select.name = value;

									this.$Message.success('重命名成功');
								}
							);
						},
					});

					break;

				case 'trash': //移入回收站
					let data = this.getSelectData();

					this.$confirm('移入回收站', '是否将所选' + data.length + '个项目移入回收站', {}).then(() => {
						this.$api.disk.trash(
							{
								id: data,
							},

							() => {
								this.removeSelect(data);

								this.$Message.success('移入回收站成功');
							}
						);
					});

					break;

				case 'restore': //文件还原
					let restoreData = this.getSelectData();

					this.$confirm('移出回收站', '是否将所选' + restoreData.length + '个项目移出回收站', {}).then(() => {
						this.$api.disk.recover(
							{
								id: restoreData,
							},

							() => {
								this.removeSelect(restoreData);

								this.$Message.success('还原成功');
							}
						);
					});

					break;

				case 'delete': //文件删除
					let deleteData = this.getSelectData();

					this.$confirm('删除', '是否将所选' + deleteData.length + '个项目彻底删除', {}).then(() => {
						this.$api.disk.delete(
							{
								id: deleteData,
							},

							() => {
								this.removeSelect(deleteData);

								this.initDiskInfo();

								this.$Message.success('删除成功');
							}
						);
					});

					break;

				case 'info':
					let infoId = this.diskInfo.select.id + 'info';

					if (this.fileViewer[infoId] && !this.$isElectron) {
						return this.fileViewer[infoId].active();
					}

					this.fileViewer[infoId] = this.$cloudWindow({
						url: 'disk-file-info',

						component: require('./viewer/diskInfo'),

						data: this.diskInfo.select,

						only: true,

						name: infoId,

						width: 350,

						height: 450,

						title: '文件属性',

						maximizable: false,

						minimizable: false,

						resizable: false,

						frame: this.isWebCloudDisk,

						close: () => {
							delete this.fileViewer[infoId];
						},

						callback: (com) => {
							com.init(this.diskInfo.select);
						},
					});

					break;

				case 'share':
					let file = this.diskInfo.selectFiles[0];

					if (file.share) {
						this.$confirm('取消分享', '取消后将无法通过链接访问该分享', {}).then(() => {
							this.$api.disk.cancelShare(
								{
									id: file.id,
								},

								() => {
									this.diskInfo.select.share = '';

									this.$Message.success('分享已取消');

									if (this.navType === 'share') {
										this.removeSelect([file.id]);
									}
								}
							);
						});

						return;
					}

					if (shareWin) {
						shareWin.component.init(this.diskInfo.select);

						shareWin.config.title = '分享文件:' + file.name;

						shareWin.active();

						return;
					}

					shareWin = this.$cloudWindow({
						component: require('./viewer/shareViewer'),

						only: true,

						width: 600,

						height: 400,

						background: '#eee',

						color: '#606060',

						title: '分享文件:' + file.name,

						minimizable: false,

						maximizable: false,

						resizable: false,

						frame: true,

						close: (data) => {
							shareWin = false;

							if (data) {
								file.share = data;
							}
						},

						callback: (com) => {
							com.init(this.diskInfo.select);
						},
					});

					break;
			}
		},

		openFileHandle(item) {
			let openType = item.openType;

			let mediaFileType = ['image', 'video', 'audio'];

			if (openType === 'zip') {
				this.openFile(openType, item);
			} else if (openType) {
				let mediaFile = [];

				if (mediaFileType.includes(openType)) {
					if (this.diskInfo.categoryType === openType) {
						mediaFile = JSON.handle(this.diskData);
					} else {
						this.diskData.forEach((file) => {
							if (file.openType === openType) {
								mediaFile.push(file);
							}
						});
					}

					this.openFile(openType, mediaFile);
				} else {
					this.openFile(openType, item);
				}
			} else {
				this.$Message.warning('暂不支持打开该类型文件');
			}
		},

		openFile(type, data) {
			let config = {
				audio: {
					url: 'disk-music-player',

					component: require('./viewer/musicPlayer'),

					data: data,

					only: true,

					name: 'diskMusicPlayer',

					title: '音乐播放器',

					hideTitle: true,

					width: 350,

					height: 535,

					maximizable: false,

					minimizable: false,

					resizable: false,

					frame: this.isWebCloudDisk,

					close: () => {
						delete this.fileViewer[type];
					},

					callback: (com) => {
						com.init(data);
					},
				},

				video: {
					url: 'disk-video-player',

					component: require('./viewer/videoPlayer'),

					data: data,

					only: true,

					name: 'diskVideoPlayer',

					title: '视频播放器',

					width: 750,

					height: 500,

					minWidth: 750,

					minHeight: 500,

					background: '#1e1e1e',

					color: '#fff',

					minimizable: !this.isWebCloudDisk,

					frame: this.isWebCloudDisk,

					close: () => {
						delete this.fileViewer[type];
					},

					callback: (com) => {
						com.init(data);
					},
				},

				pdf: {
					url: 'disk-pdf-viewer',

					component: require('./viewer/pdfViewer'),

					data: data,

					only: true,

					name: 'diskPdfViewer',

					title: 'PDF阅读器',

					width: 800,

					height: 600,

					minWidth: 800,

					minHeight: 600,

					background: '#323639',

					color: '#fff',

					minimizable: !this.isWebCloudDisk,

					frame: this.isWebCloudDisk,

					close: () => {
						delete this.fileViewer[type];
					},

					callback: (com) => {
						com.init(data);
					},
				},

				image: {
					url: 'disk-image-viewer',

					component: require('./viewer/imageViewer'),

					data: data,

					only: true,

					name: 'diskImageViewer',

					title: '图片查看器',

					width: 800,

					height: 600,

					minWidth: 800,

					minHeight: 600,

					background: '#f8fdff',

					color: '#6d6d6d',

					minimizable: !this.isWebCloudDisk,

					frame: this.isWebCloudDisk,

					close: () => {
						delete this.fileViewer[type];
					},

					callback: (com) => {
						com.init(data);
					},
				},

				text: {
					url: 'disk-text-viewer',

					component: require('./viewer/textViewer'),

					data: data,

					only: true,

					name: 'diskTextViewer',

					title: '文本查看器',

					width: 800,

					height: 600,

					minWidth: 800,

					minHeight: 600,

					background: '#fff',

					color: '#6d6d6d',

					minimizable: !this.isWebCloudDisk,

					frame: this.isWebCloudDisk,

					close: () => {
						delete this.fileViewer[type];
					},

					callback: (com) => {
						com.init(data);
					},
				},

				office: {
					url: 'disk-office-viewer',

					component: require('./viewer/officeViewer'),

					data: data,

					only: true,

					name: 'diskOfficeViewer',

					title: 'office预览',

					width: 800,

					height: 600,

					minWidth: 800,

					minHeight: 600,

					background: '#fff',

					color: '#6d6d6d',

					minimizable: !this.isWebCloudDisk,

					frame: this.isWebCloudDisk,

					eleCallback: 'listenOpen()',

					close: () => {
						delete this.fileViewer[type];
					},

					callback: (com) => {
						com.init(data);
					},
				},

				zip: {
					url: 'disk-zipper-viewer',

					component: require('./viewer/zipViewer'),

					data: data,

					only: true,

					name: 'diskZipperViewer',

					title: data.name + '-压缩文件查看',

					width: 750,

					height: 500,

					minWidth: 750,

					minHeight: 500,

					background: 'linear-gradient(to right, #38f 0%, #00f2fe 100%)',

					color: '#fff',

					minimizable: !this.isWebCloudDisk,

					frame: this.isWebCloudDisk,

					close: () => {
						delete this.fileViewer[type];
					},

					callback: (com) => {
						com.init(data);
					},
				},
			};

			if (this.fileViewer[type] && !this.$isElectron) {
				return this.fileViewer[type].active((com) => {
					com.init(data);
				});
			}

			this.fileViewer[type] = this.$cloudWindow(config[type]);
		},

		getSelectData(data) {
			data = data ? data : this.diskInfo.selectFiles;

			let result = data.reduce((a, b) => {
				a.push(b.id);

				return a;
			}, []);

			if (this.diskInfo.select && result.length === 0) {
				result.push(this.diskInfo.select.id);
			}

			return result;
		},

		removeSelect(data) {
			for (let i = 0; i < this.diskData.length; i++) {
				for (let j = 0; j < data.length; j++) {
					if (this.diskData[i] && data[j] === this.diskData[i].id) {
						this.diskData.splice(i, 1);
					}
				}
			}
		},

		removeTrans(data) {
			if (data._type === 'download') {
				downloadHandle.removeList(data.key);
			} else {
				uploadHandle.removeList(data.key);
			}
		},

		updateCount() {
			let uploading = this.uploadList.filter((item) => {
				return item._state !== 'finish';
			}).length;

			let downloading = this.downloadList.filter((item) => {
				return item._state !== 'finish';
			}).length;

			let finish = this.downloadList.length + this.uploadList.length - uploading - downloading;

			let data = {
				uploading,

				downloading,

				finish,

				count: uploading + downloading,
			};

			if (this.navType === 'trans') {
				this.$nextTick(() => {
					this.$refs.diskCategory.updateMenuCount(data);
				});
			}

			return data;
		},

		popupWindow(options) {
			this.popupWindowOpen = true;

			let { title, tips, value } = options;

			this.$inputConfirm({
				title,

				tips,

				value,

				callback: options.callback,

				close: () => {
					this.popupWindowOpen = false;
				},
			});
		},

		confirm(options) {
			this.popupWindowOpen = true;

			let { title, tips } = options;

			this.$confirm({
				title,

				tips,

				callback: options.callback,

				close: () => {
					this.popupWindowOpen = false;
				},
			});
		},

		validateFileName: function (fileName) {
			let reg = new RegExp('[\\\\/:*?"<>|]');

			return reg.test(fileName);
		},

		saveInfoToRoute() {
			if (this.isWebCloudDisk) {
				this.$router.replace({
					query: {
						// id: this.diskInfo.id,

						// type: this.navType,

						category: this.diskInfo.categoryType,

						// category_name: this.diskInfo.category,
					},
				});
			}
		},
	},
};
</script>

<style scoped lang="scss">
::v-deep .el-collapse-item__content{
	padding: 0 0 10px 0;
}
::v-deep .el-collapse-item__content{
	padding: 0 0 10px 0;
}
::v-deep .el-form-item{
	margin-bottom: 0;
}
::v-deep .el-table td{
	padding: 6px 0;
}
::v-deep .el-form-item__content, ::v-deep .el-form-item__label{
	line-height: 30px;
}
::v-deep .el-table__expanded-cell[class*=cell]{
	padding: 10px 50px;
}
.my-active-class {
	box-sizing: content-box;
	border: 2px dashed rgb(136, 255, 227) !important;
	box-sizing: border-box;
}
.vdr {
	border: 0;
}
#draggingFile {
	position: absolute;

	width: 100px;

	height: 100px;

	background: -webkit-gradient(linear, center top, center bottom, from(#dcebfdd9), to(#c2dcfddb));

	border: solid 1px #7da2ce;

	box-shadow: inset 0 0 1px #fff;

	display: flex;

	align-items: center;

	justify-content: center;

	div {
		font-size: 60px;

		display: flex;

		align-items: center;

		justify-content: center;

		color: #c0c4cc;

		span {
			color: #fff;

			background: #38f;

			font-size: 12px;

			position: absolute;

			padding: 1px 6px;
		}
	}
}

.cloud-main {
	display: flex;

	flex-direction: column;

	background: #f8f8f8;
}

::v-deep .disk-func {
	background-color: #fff;
}

.cloud-disk-main {
	width: 100%;

	height: calc(100% - 60px);

	display: flex;

	justify-content: space-between;

	.left {
		height: 100%;
		background: #fdfdfd;
	}

	.right {
		width: 100%;

		height: 100%;

		display: flex;

		flex-direction: column;

		flex: 1px;

		background-color: rgba(236, 236, 236, 1);

		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);

		.cloud-disk-content {
			width: 100%;

			height: 100%;

			padding: 0 10px;

			overflow: auto;

			position: relative;
		}

		/*拖选框*/

		.mouse-select {
			position: absolute;

			background: #f4f5f7;

			opacity: 0.7;

			border: 2px solid #eee;

			z-index: 1;
		}

		/*拖拽上传提示*/

		.upload-tips {
			width: 100%;

			height: 35px;

			line-height: 35px;

			background: rgba(91, 91, 234, 0.71);

			position: absolute;

			text-indent: 20px;

			top: 0;

			left: 0;

			z-index: 3;

			animation-duration: 0.35s;

			animation-fill-mode: both;

			animation-name: slideInDown;

			color: #fff;
		}
	}
}

.tool-box {
	display: flex;

	position: relative;
}

.template {
	height: calc(100vh - 155px);

	background-color: rgba(236, 236, 236, 1);

	overflow-y: scroll;

	margin: 0 auto;

	&-main {
		width: 514.188px;

		margin-top: 10px;

		margin-bottom: 20px;

		.iconfont {
			cursor: pointer;
		}

		.box {
			background-color: #fff;
			width: 100%;
			height: 727.38px;
			position: relative;
			cursor: pointer;
			box-sizing: border-box;
			border: 2px solid white;
			&.active {
				border: 2px dashed #88ffe3 !important;
			}
		}
	}

	&-foot {
		width: 100%;

		height: 50px;

		position: absolute;

		bottom: 0;

		border: 1px solid blue;
	}
}

.template::-webkit-scrollbar {
	width: 0px;
}

.tool {
	width: 350px;

	height: calc(100vh - 155px);

	background-color: white;

	border-left: 1px solid white;

	position: relative;

	overflow-y: scroll;

	&-font {
		.list {
			height: 38px;

			color: white;

			background: white;

			display: flex;

			align-items: center;

			justify-content: space-between;

			padding: 0 15px;

			cursor: pointer;

			border: 1px solid #fff;
		}

		.list:hover {
			background-color: #ececec;
		}
	}

	&-color {
		margin: 20px;

		.list {
			width: 38px;

			height: 38px;

			border-radius: 4px;

			border: 1px solid #999;

			display: inline-block;

			cursor: pointer;

			margin-right: 15px;
		}

		.list:nth-child(6n) {
			margin-right: 0;
		}

		.list:hover {
			background-color: #ececec;
		}
		.list.active {
			border: 2px solid #ff4e60;
		}
	}

	&-image {
		margin: 15px;

		.list {
			width: 50px;

			margin-right: 17px;

			float: left;

			cursor: pointer;

			margin-bottom: 10px;

			img {
				width: 50px;

				height: 50px;

				margin: initial;

				text-align: center;
			}

			span {
				text-align: center;
			}
		}

		.list:nth-child(5n) {
			margin-right: 0;
		}
	}

	&-filter {
		margin: 15px;

		.list {
			float: left;

			cursor: pointer;

			margin-right: 15px;

			margin-bottom: 10px;

			text-align: center;
			img {
				width: 96px;
				height: 96px;
				border-radius: 8px;
				margin-left: 0;
			}
			img.active {
				border: 2px solid #333;
			}
		}

		.list:nth-child(3n) {
			margin-right: 0;
		}
	}
	&-imgstyle {
		padding: 8px;
		.list {
			float: left;
			margin-right: 15px;
			margin-bottom: 10px;
			text-align: center;
		}
		.list-box {
			width: 100px;
			height: 100px;
			cursor: pointer;
		}
		div:nth-child(3n) {
			margin-right: 0;
		}
	}
	&-allFont {
		background-color: rgb(47, 47, 47);
		padding: 15px;
		height: 100vh;
	}

	// .down {

	// 	position: absolute;

	// 	display: inline-block;

	// 	bottom: 50%;

	// 	top: 50%;

	// 	right: -25px;

	// 	z-index: 10;

	// 	// 设置大小合适的圆形容器(足够覆盖整个进度圆)

	// 	width: 25px;

	// 	height: 80px;

	// 	border-bottom-right-radius: 25px;

	// 	border-top-right-radius: 25px;

	// 	background: #2f2f2f;

	// 	display: flex;

	// 	align-items: center;

	// 	color: white;

	// 	font-size: 20px;

	// 	cursor: pointer;

	// }
}

.tool::-webkit-scrollbar {
	width: 0;
}

.silder-icon {
	position: fixed;

	right: 10px;

	bottom: 20px;
}

::v-deep .el-slider__button {
	border: 2px solid #333;
}

::v-deep .el-slider__bar {
	background: #333;
}
::v-deep .handle-tm,
::v-deep .handle-bm {
	width: 0 !important;
	height: 0 !important;
	padding: 0 !important;
	background: transparent;
	border: 0;
}
::v-deep .handle-tl,
::v-deep .handle-tr,
::v-deep .handle-mr,
::v-deep .handle-br,
::v-deep .handle-bl,
::v-deep .handle-ml {
	width: 12px;
	height: 12px;
	border-radius: 12px;
	background-color: #88ffe3;
	border: 1px solid #88ffe3;
}
.style1 {
	border: 1px dashed #333;
}
.style2 {
	border: 2px dashed #333;
	border-radius: 50%;
}
.btn {
	padding: 2px 10px;
	border-radius: 3px;
	font-size: 12px;
	display: flex;
	align-items: center;
	margin-right: 10px;
	border: 1px solid rgba(0, 0, 0, 0);
	.icon {
		margin-right: 5px;
	}
	&.primary {
		background: $diskMainColor;
		color: #fff;
	}
	&.default {
		background: #fff;
		color: #6d6d6d;
		border: 1px solid #eee;
	}
	&.text {
		color: #6d6d6d;
		background: none;
		&:hover {
			color: $diskMainColor;
		}
	}
	&.remove {
		color: #fff;
		background: #f5491f;
	}
	.upload-text {
		display: flex;
		align-items: center;
		.arrow {
			transition: all 350ms;
			font-size: 16px;
			margin-top: -1px;
			margin-left: 5px;
		}
		.rotate {
			transform: rotate(180deg) !important;
		}
	}
}
.container {
	width: 100%;
	height: 35px;
	flex: 1;
	display: flex;
	align-items: center;
	padding: 0 10px;
	.item {
		height: 35px;
		line-height: 35px;
		color: #757575;
		font-size: 14px;
		text-overflow: ellipsis;
		cursor: pointer;
		padding: 0 2px;
	}
	.item:before {
		content: '/';
		color: #dadada;
	}
	.item:first-child:before {
		display: none;
	}
	.item:hover {
		color: $diskMainColor;
	}
}
</style>

