<template>
	<div class="main">
		<!-- 轮播图sd -->
		input
		<div class="tool-swiper">
			<el-carousel
				indicator-position="outside"
				class="swiper-wrapper"
				height="640"
				ref="carousel"
				:initial-index="swiperIndex"
				:autoplay="false"
				@change="changeSwiper"
			>
				<el-carousel-item class="test" v-for="(element, index) in swiperBanner" :key="index" :ref="'swiper1' + index" οndragstart="return false">
					<img
						v-if="!element.children"
						class="swiper-img"
						:src="element.content ? 'http://118.31.70.36:3000/uploads/disk/' + element.content : '69284f94b79bf8b867bf513be25b9c74.webp'"
						alt=""
						draggable="false"
						οndragstart="return false"
					/>
					<div v-if="element.children" style="width: 100%; height: 100%; position: absolute">
						<div class="div2" style="width: 100%; height: 100%">
							<draggable style="width: 100%; height: 100%">
								<div v-for="(item, d_index) in element.children" :key="d_index" class="box-style" :class="item.style" style="overflow-y: auto">
									<img
										:src="item.content ? 'http://118.31.70.36:3000/uploads/disk/' + item.content : '69284f94b79bf8b867bf513be25b9c74.webp'"
										style="width: 100%; height: 100%"
										draggable="false"
										alt=""
									/>
								</div>
							</draggable>
						</div>
						<!-- <div style="height: 50%; overflow-y: auto; width: 100%">
							<img class="swiper-img" src="https://img2.baidu.com/it/u=1000551505,2077899926&fm=26&fmt=auto" alt="" οndragstart="return false" />
						</div> -->
					</div>
					<vue-draggable-resizable
						class-name-active="my-active-class"
						style="display: flex; align-items: center; justify-content: center"
						v-for="(c_element, index) in imgToData"
						:key="c_element.rand"
						:w="c_element.p_width || 'auto'"
						:h="c_element.p_height || 'auto'"
						:x="c_element.x"
						:y="c_element.y"
						:style="{
							visibility: c_element['index'] != swiperIndex ? 'hidden' : 'inherit',
						}"
						:lock-aspect-ratio="c_element.type != 'text'"
						@dragstop="(left, top, width, height) => dragstop(c_element, left, top, width, height)"
						@activated="(left, top, width, height) => onActivated(c_element, index)"
						@resizing="(left, top, width, height) => onResize(c_element, left, top, width, height, index)"
					>
						<p
							:tabindex="c_element.rand"
							@keyup="textDelete($event, c_element)"
							:ref="c_element.rand"
							class="img_text"
							:class="c_element.class || 'G-font-6'"
							style="
								font-size: 32px;
								white-space: nowrap;
								display: inline-box;
								white-space: pre;
								font-weight: 500;
								line-height: 1;
								text-align: center;
								cursor: pointer;
								letter-spacing: -2px;
								box-sizing: content-box;
								line-height: 1;
								border: 1px solid transparent;
							"
							:style="{
								'text-align': c_element.textAlign,
								'writing-mode': c_element.writingMode,
								color: c_element['color'],
								'text-shadow': c_element['text-shadow'],
								'font-family': c_element['fontFamily'],
								transform: c_element['transformScale'] || '',
								background: c_element['backgroundColor'] || '',
								'font-style': c_element['fontStyle'] || '',
								padding: c_element['paddingStyle'] || '',
								'border-radius': c_element['borderRadius'] || '',
							}"
							v-if="c_element.type == 'text'"
							v-html="c_element.val"
						></p>
						<img
							:tabindex="c_element.rand"
							@keyup="imgDelete($event, c_element)"
							:ref="c_element.rand"
							:key="c_element.rand"
							:src="c_element.val"
							class="lazy_load"
							v-if="c_element.type == 'image'"
							@load="urlInfo($event, c_element.rand)"
							style="white-space: nowrap; display: block; cursor: pointer"
							:style="{
								transform: c_element['transformScale'] || '',
								width: c_element['w'] ? `${c_element['w']}px` : '50px',
								height: c_element['h'] ? `${c_element['h']}px` : '50px',
							}"
							alt=""
						/>
						<div
							:tabindex="c_element.rand"
							:ref="c_element.rand"
							@keyup="imgDelete($event, c_element)"
							v-if="c_element.type == 'tool'"
							:class="c_element.val"
							alt=""
							style="display: grid; overflow: scroll"
						>
							<input type="file" @change="changeUpload($event, c_element)" />
							<img :src="c_element.img" alt="" />
						</div>
					</vue-draggable-resizable>
				</el-carousel-item>
			</el-carousel>
			<div class="imgDom"></div>
			<p>当前文件夹有{{ swiperBanner.length }}张图片，当前是第{{ this.swiperIndex + 1 }}张图片</p>
			<div class="current-swiper">
				<draggable
					style="width: 100%"
					v-model="newSwiperBanner"
					chosen-class="chosen"
					force-fallback="true"
					group="people"
					animation="1000"
					@end="onEndNewSwiper"
				>
					<div v-for="(item, index) in newSwiperBanner" :key="index" style="margin-right: 10px; float: left">
						<img :src="'http://118.31.70.36:3000/uploads/disk/' + item.content" style="width: 60px; height: 60px; margin: 0; margin-bottom: 10px" alt="" />
						<el-input type="text" v-model="item.sort" min="1" style="width: 60px" placeholder="当前" />
					</div>
				</draggable>
				<el-button class="btn" type="danger" style="width: 100px; height: 40px; display: flex; align-self: end; margin-left: 10px" @click="defineStyle()"
					>确定</el-button
				>
			</div>
			<!-- </draggable> -->
			<div class="fl-row-justy tool-btn G-Mt-10">
				<el-input placeholder="请输入当前查询的文件夹" v-model="currentSwiper" value="" style="width: 220px"></el-input>
				<el-button class="btn" type="danger" @click="getCurrentSwiper()">查询文件夹</el-button>
				<el-button class="btn" type="warning" @click="generateImg()" v-loading.fullscreen.lock="fullscreenLoading">生成图片</el-button>
				<el-button class="btn" type="warning" @click="saveTemplate()">保存模板</el-button>
			</div>
			<div class="fl-row-justy tool-btn G-Mt-10"></div>
		</div>
		<domStyle></domStyle>
		<div>
			<div class="popup">
				<bannerData v-if="popupData.type == 'data'" :data="popupData" @change="addToData"></bannerData>
				<bannerImage v-else-if="popupData.type == 'image'" :data="popupData" @change="addToData"></bannerImage>
				<bannerText v-else-if="popupData.type == 'text'" :data="popupData" @change="addToData"></bannerText>
				<bannerIcon v-else-if="popupData.type == 'icon'" :data="popupData" @change="addToData"></bannerIcon>
				<bannerclassify v-else-if="popupData.type == 'classify'" :data="popupData" @change="addToData"></bannerclassify>
				<bannerFilter v-else-if="popupData.type == 'filter'" :data="popupData" @change="addToData"></bannerFilter>
				<bannerTemplate v-else-if="popupData.type == 'template'" :data="popupData" @handleTemplate="handleTemplate" @change="addToData"></bannerTemplate>
				<bannerTableNav
					v-else-if="popupData.type == 'table'"
					:data="popupData"
					:listData="imgStyleToData"
					@select="resetData"
					@delete="deleteToData"
					@changeIndex="changeIndex"
					@change="addToData"
				></bannerTableNav>
				<toolNav v-if="popupData.type == 'tool'" :data="popupData" @change="addToData"> </toolNav>
			</div>
		</div>
	</div>
</template>
<script>
import Swiper from 'swiper';
import $ from 'jquery';
import * as imageConversion from 'image-conversion';
import draggable from 'vuedraggable';
import html2canvas from 'html2canvas';
import bannerData from './components/dataNav.vue';
import bannerImage from './components/imageNav.vue';
import bannerText from './components/textNav.vue';
import bannerIcon from './components/iconNav.vue';
import bannerclassify from './components/classifyNav.vue';
import bannerFilter from './components/filterNav.vue';
import bannerTableNav from './components/tableNav.vue';
import domStyle from './components/domStyle.vue';
import toolNav from './components/toolNav.vue';
import bannerTemplate from './components/templateNav.vue';
import uploadHandle from '../../tools/uploadHandle';

export default {
	components: {
		bannerData,
		bannerImage,
		bannerText,
		bannerIcon,
		bannerclassify,
		bannerFilter,
		bannerTableNav,
		bannerTemplate,
		toolNav,
		draggable,
		domStyle,
	},
	props: {
		popupData: {
			type: Object,
			default: function () {
				return {
					type: 'data',
					isDrawer: false,
					currentIndex: '',
				};
			},
		},
	},
	data() {
		return {
			swiperIndex: 0,
			swiperBanner: [],
			currentFolder: {},
			imgToData: [],
			imgStyleToData: [],
			fontArr: [],
			r: 1,
			currentSwiper: '11-25/8',
			diskData: [],
			maxFileSize: 4294967296, //4GB
			maxFileSizeText: '0B',
			diskInfo: {},
			settingConfig: {
				maxUpTrans: 3,
				maxDownTrans: 3,
				noticeBubble: true, //气泡提示
				noticeFlag: true, //提醒声音
			},
			fullscreenLoading: false,
			newSwiperBanner: [],
		};
	},
	created() {
		this.getData();
		this.getCurrentSwiper();
		this.defineStyle();
	},
	mounted() {
		new Swiper('.swiper-container', {
			loop: true,
			// 如果需要分页器
			pagination: '.swiper-pagination',
			loop: false,
			noSwiping: true,
			initialSlide: this.swiperIndex,
			onSlideChangeStart: (swiper) => {
				this.swiperIndex = swiper.activeIndex;
			},
		});
	},
	// computed: {},
	methods: {
		setLeftScale(ele) {
			return ele.x * 1;
		},
		onEndNewSwiper() {
			this.swiperBanner = this.newSwiperBanner;
		},
		handleTemplate(id) {
			this.getCurrentTemplate(id);
		},
		//点击方法
		getData() {
			this.$api.brand.list({}, (rs) => {});
		},
		changeIndex(val) {
			this.$refs.carousel.setActiveItem(val);
		},
		getCurrentTemplate(id) {
			let that = this;
			this.$api.templateAll.get({ id }, (rs) => {
				this.newSwiperBanner = JSON.parse(rs.data.newSwiperBanner);
				this.swiperBanner = JSON.parse(rs.data.swiperBanner);
				this.currentSwiper = JSON.parse(rs.data.currentSwiper);
				this.$nextTick(function () {
					JSON.parse(rs.data.imgToData).map((item, index) => {
						that.$set(this.imgToData, index, {
							...item,
							rand: (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + new Date().getTime() + '-' + Math.random().toString().substr(2, 5),
						});
					});
					this.imgStyleToData = JSON.parse(rs.data.imgToData);
				});
			});
		},
		defineStyle() {
			let data = this.newSwiperBanner;
			let newData = [];
			let newDataArr = [];
			let val = [];
			data.map((item, index) => {
				let obj = {};
				obj[item.sort] = item;
				newData.push(obj);
			});
			let a = [];
			for (let i in newData) {
				if (Object.keys(newData[i])[0] === '1' || Object.keys(newData[i])[0] === 1) {
					newDataArr.push(Object.values(newData[i])[0]);
				} else {
					if (!a.includes(Object.keys(newData[i])[0])) {
						newDataArr.push({ children: this.getNew(Object.keys(newData[i])[0]) });
					}
				}
				a.push(Object.keys(newData[i])[0]);
			}
			this.swiperBanner = newDataArr;
		},
		getNew(val) {
			let arr = [
				['G-width-100 G-height-100'],
				['G-width-100 G-height-50', 'G-width-100 G-height-50'],
				['G-width-100 G-height-33', 'G-width-100 G-height-66'],
				['G-width-100 G-height-33', 'G-width-100 G-height-33', 'G-width-100 G-height-33'],
				['G-width-50 G-height-50', 'G-width-50 G-height-50', 'G-width-50 G-height-50', 'G-width-50 G-height-50'],
				['G-width-50 G-height-50', 'G-width-50 G-height-50', 'G-width-100 G-height-50'],
				['G-width-100 G-height-66', 'G-width-50 G-height-33', 'G-width-50 G-height-33'],
				['G-width-100 G-height-60', 'G-width-50 G-height-40', 'G-width-50 G-height-40'],
			];
			let split = val.split('/');
			if (split == 0 || split == '') {
				return;
			}
			let newData = [];
			let news = [];
			var o = {};
			this.newSwiperBanner.map((item, index) => {
				if (item.sort === val) {
					var items = item.sort;
					if (o[items]) {
						o[items]++;
					} else {
						o[items] = 1;
					}
					let obj = {
						...item,
						style: arr[split[0] - 1][o[items] - 1],
					};
					news.push(obj);
				}
			});
			return news;
		},
		unique(arr) {
			let arr1 = [];
			for (var i = 0, len = arr.length; i < len; i++) {
				if (arr[i] === 1) {
					arr1.push(arr[i]);
				} else if (!arr1.includes(arr[i])) {
					// 检索arr1中是否含有arr中的值
					arr1.push(arr[i]);
				}
			}
			return arr1;
		},
		saveTemplate() {
			let obj = {
				imgToData: JSON.stringify(this.imgToData),
				swiperBanner: JSON.stringify(this.swiperBanner),
				currentSwiper: JSON.stringify(this.currentSwiper),
				newSwiperBanner: JSON.stringify(this.newSwiperBanner),
			};
			this.$api.templateAll.create(obj, (rs) => {
				if (rs.code === 0) {
					this.$Message.success('新增成功');
					this.form = {};
					this.getData();
				}
			});
		},
		funS(val) {
			let newArray = [];
			let j = 0;
			for (let i in this.newSwiperBanner) {
				if (this.newSwiperBanner[i].sort === val.sort) {
					newArray[j++] = this.newSwiperBanner[i];
				}
			}
			return newArray;
		},
		changeUpload(e, data) {
			// 上传图片
			imageConversion.compress(e.target.files[0], 0.5).then((res) => {
				var file = res;
				if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
					return false;
				}
				let reader = new FileReader();
				reader.onload = (e) => {
					let file;
					if (typeof e.target.result === 'object') {
						// 把Array Buffer转化为blob 如果是base64不需要
						file = window.URL.createObjectURL(new Blob([e.target.result]));
					} else {
						file = e.target.result;
					}
					this.defaultImg = '';
					// this.cropperOptions.img = data;
					// items.img = data;
					let obj = JSON.parse(JSON.stringify(this.imgToData));
					this.imgToData = obj;
					this.swiperIndex = data.index;
					this.$refs.carousel.setActiveItem(data.index);
					this.imgToData.map((item, index) => {
						if (item.rand === data.rand) {
							this.$set(this.imgToData, index, {
								...this.imgToData[index],
								img: file,
							});
						}
					});
					// this.imgToData[]
				};
				reader.readAsDataURL(file);
			});
		},
		// 删除图片
		imgDelete(e, val) {
			if (e.keyCode === 8) {
				let newImgToData = [];
				this.imgToData.map((item, index) => {
					if (item.rand !== val.rand) {
						newImgToData.push(item);
					}
				});
				this.imgToData = newImgToData;
			} else if (e.keyCode === 67) {
				let obj = {
					...val,
					rand: (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + new Date().getTime() + '-' + Math.random().toString().substr(2, 5),
				};
				this.imgToData.push(obj);
			}
		},
		// 删除文案
		textDelete(e, val) {
			if (e.keyCode === 8) {
				let newImgToData = [];
				this.imgToData.map((item, index) => {
					if (item.rand !== val.rand) {
						newImgToData.push(item);
					}
				});
				this.imgToData = newImgToData;
			} else if (e.keyCode === 67) {
				let obj = {
					...val,
					rand: (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + new Date().getTime() + '-' + Math.random().toString().substr(2, 5),
				};
				this.imgToData.push(obj);
			}
		},
		urlInfo(e, rand) {},
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
		prepareUpload() {},
		transFinish(item, type) {
			if (this.settingConfig.noticeBubble) {
				this.$notify(item.name, type === 'upload' ? '上传完成' : '下载完成');
			}
		},
		getCurrentSwiper() {
			if (this.currentSwiper === '') {
				this.$Message.info('不可以查询空文件夹哦！');
				return;
			}
			this.$api.disk.search({ parentName: this.currentSwiper }, (rs) => {
				let newData = rs.data.allImg.map((item, index) => {
					return {
						...item,
						sort: 1,
						// index: ++index,
					};
				});
				this.swiperBanner = newData;
				this.newSwiperBanner = newData;
				this.currentFolder = rs.data.parent_data;
			});
		},
		changeSwiper(index) {
			this.swiperIndex = index;
		},
		initDiskInfo(callback) {
			this.maxFileSizeText = this.maxFileSize.fileSize();
			this.$api.disk.info((rs) => {
				this.diskInfo.size = rs.data;
				callback && callback();
			});
		},
		generateImg() {
			if (!this.swiperBanner.length) {
				this.$Message.info('现在没有图片哦');
				return;
			}
			let arr = this.currentFolder.parentName.split('/');
			arr[arr.length - 1] = '样品';
			let str = arr.join('/');
			this.$api.disk.isFolderList({ parentName: str.toString() }, (rs) => {
				if (rs.data.id !== undefined) {
					this.$confirm('已有样品数据，是否再次生成?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(() => {
							this.getJs(rs.data.id);
						})
						.catch(() => {
							this.$message({
								type: 'info',
								message: '已取消删除',
							});
						});
				} else {
					this.getJs();
				}
			});
		},
		dataURLtoFile(dataurl, filename) {
			//将base64转换为文件
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new File([u8arr], filename, { type: mime });
		},
		getJs(parentId = null) {
			this.fullscreenLoading = true;
			this.$refs.carousel.setActiveItem(0);
			let self = this;
			let length = $('.swiper-wrapper .test').length;
			let imgsSrc = [];
			var canvas2 = document.createElement('canvas');
			let _canvas = document.querySelector('.test');
			var w = parseInt(window.getComputedStyle(_canvas).width);
			var h = parseInt(window.getComputedStyle(_canvas).height);
			//将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
			window.pageYoffset = 0;
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
			var context = canvas2.getContext('2d');
			for (let i = 0; i < length; i++) {
				setTimeout(() => {
					this.$refs.carousel.setActiveItem(i + 1);
					html2canvas(document.querySelector('.tool-swiper'), {
						logging: false,
						scrollY: 0,
						scrollX: 0,
						useCORS: true,
						allowTaint: false,
						tainTaint: false,
						scale: 7,
						height: $('.tool-swiper .test').eq(i).find('.div2').length ? 640 : $('.tool-swiper .test').eq(i).find('img').height(),
						width: $('.tool-swiper').width(),
						windowWidth: document.body.scrollWidth,
						windowHeight: document.body.scrollHeight,
					}).then(function (canvas) {
						imgsSrc.push(canvas.toDataURL());
						if (imgsSrc.length === self.swiperBanner.length) {
							if (parentId) {
								self.packageImages(imgsSrc, parentId);
							} else {
								self.packageImages(imgsSrc);
							}
						}
					});
				}, 0);
			}
		},
		resetData(data) {
			let obj = JSON.parse(JSON.stringify(this.imgToData));
			this.imgToData = obj;
			this.swiperIndex = data.index;
			this.$refs.carousel.setActiveItem(data.index);
			this.imgToData.map((item, index) => {
				if (item.rand === data.rand) {
					this.$set(this.imgToData, index, {
						...this.imgToData[index],
						class: data.class,
						val: data.val,
						textAlign: data.textAlign,
						writingMode: data.writingMode,
						color: data.color,
						'text-shadow': data['text-shadow'],
						fontFamily: data['fontFamily'],
						textColor: data['textColor'],
						backgroundColor: data['backgroundColor'],
						fontStyle: data['fontStyle'],
						paddingStyle: data['paddingStyle'],
						borderRadius: data['borderRadius'],
					});
				}
			});
		},
		deleteToData(data) {
			let newImgToData = [];
			this.imgToData.map((item, index) => {
				if (item.rand !== data.rand) {
					newImgToData.push(item);
				}
			});
			this.imgToData = newImgToData;
			this.imgStyleToData = newImgToData;
		},
		addToData(data) {
			if (data.type === 'filter') {
				$('.test').eq(this.swiperIndex).find('img').removeClass().addClass('swiper-img').addClass(data.val);
				return;
			}
			this.imgToData.push({
				...data,
				...{
					index: this.swiperIndex,
					rand: (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + new Date().getTime() + '-' + Math.random().toString().substr(2, 5),
				},
			});
		},
		setFontStyle(item) {
			$('.test').eq(this.swiperIndex).find('p').css({
				color: item.color,
				'text-shadow': item.shadow,
				'font-family': item.font,
			});
		},
		packageImages(imgsSrc, parentId = null) {
			let that = this;
			if (parentId) {
				imgsSrc.map((item, index) => {
					let files = [];
					files[0] = that.dataURLtoFile(item, new Date().getTime() + '.jpg');
					imageConversion.compress(files[0], 1200).then((res) => {
						const reader = new FileReader();
						reader.readAsDataURL(res);
						reader.onload = function (e) {
							uploadHandle.init(
								[that.dataURLtoFile(e.target.result, new Date().getTime() + '.jpg')],
								{
									parentId: parentId,
								},
								(data, fileData) => {
									that.uploadList = data;
									if (fileData) {
										that.transFinish(fileData, 'upload');
										that.initDiskInfo();
									}
								},
								undefined
							);
						};
					});
				});
				this.fullscreenLoading = false;
				this.$Message.success('生成成功');
				return;
			}
			let arr = this.currentFolder.parentName.split('/');
			arr[arr.length - 1] = '样品';
			this.$api.disk.newFolder(
				{
					parentId: this.currentFolder.parentId,
					name: '样品',
					parentName: arr.join('/'),
					type: 'news',
				},
				(rs) => {
					imgsSrc.map((item, index) => {
						let files = [];
						files[0] = this.dataURLtoFile(item, new Date().getTime() + '.jpg');
						uploadHandle.init(
							files,
							{
								parentId: rs.data.id,
							},
							(data, fileData) => {
								this.uploadList = data;
								if (fileData) {
									this.diskData.push(this.$api.disk.diskData(fileData));
									this.transFinish(fileData, 'upload');
									this.initDiskInfo();
								}
							},
							undefined
						);
					});
					this.fullscreenLoading = false;
					this.$Message.success('生成成功');
				}
			);
		},
		onResize(data, x, y, width, height, index) {
			let dom_height = this.$refs[data.rand][data.index].clientHeight;
			let dom_width = this.$refs[data.rand][data.index].clientWidth;
			this.$set(this.imgToData[index], 'transformScale', `scale(${width / dom_width},${height / dom_height})`);
			this.$refs[data.rand][data.index].style.transform = `scale(${width / dom_width},${height / dom_height})`;
			data.p_width = width;
			data.p_height = height;
		},
		dragstop(data, x, y, width, height) {
			data.x = x;
			data.y = y;
		},
		onActivated(ele, index) {
			let width = this.$refs[ele.rand][this.swiperIndex].clientWidth;
			let height = this.$refs[ele.rand][this.swiperIndex].clientHeight;
			let scaleW = 1;
			let scaleH = 1;
			if (ele.transformScale !== '' && ele.transformScale !== undefined) {
				(scaleW = parseFloat(ele.transformScale.split(',')[0].split('scale(')[1])), (scaleH = parseFloat(ele.transformScale.split(',')[1]));
			}
			if (ele.paddingStyle === undefined || ele.paddingStyle === '0px') {
				ele.p_width = width * scaleW;
				ele.p_height = height * scaleH;
			} else {
				ele.p_width = width * scaleW;
				ele.p_height = height * scaleH;
			}
			if (ele.type === 'text') {
				this.$emit('change', { type: 'table', isDrawer: true, currentIndex: ele.rand });
			}
			this.imgStyleToData = [];
			this.imgToData.map((item, index) => {
				if (item.type === 'text') {
					let splitArrr = this.getStyle(this.$refs[item.rand][item.index], 'textShadow');
					let obj = {
						...item,
						'font-size': this.getStyle(this.$refs[item.rand][item.index], 'fontSize'),
						color: this.getStyle(this.$refs[item.rand][item.index], 'color'),
						fontFamily: this.getStyle(this.$refs[item.rand][item.index], 'fontFamily'),
						'text-shadow': this.getStyle(this.$refs[item.rand][item.index], 'textShadow'),
						fontStyle: this.getStyle(this.$refs[item.rand][item.index], 'fontStyle'),
						transformScale: this.getStyle(this.$refs[item.rand][item.index], 'transform'),
						textColor: splitArrr.split(' 1px 0px 0px, ')[0],
						textAlign: this.getStyle(this.$refs[item.rand][item.index], 'textAlign'),
						writingMode: this.getStyle(this.$refs[item.rand][item.index], 'writingMode'),
						class: this.$refs[item.rand][item.index].getAttribute('class'),
						backgroundColor: this.getStyle(this.$refs[item.rand][item.index], 'backgroundColor'),
						paddingStyle: this.getStyle(this.$refs[item.rand][item.index], 'padding'),
						borderRadius: this.getStyle(this.$refs[item.rand][item.index], 'borderRadius'),
					};
					this.imgStyleToData.push(obj);
				}
			});
		},
		getStyle(obj, attr) {
			var ie = !+'\v1'; //简单判断ie6~8
			if (attr === 'backgroundPosition') {
				//IE6~8不兼容backgroundPosition写法，识别backgroundPositionX/Y
				if (ie) {
					return obj.currentStyle.backgroundPositionX + ' ' + obj.currentStyle.backgroundPositionY;
				}
			}
			if (attr === 'transform') {
				return obj.style['transform'];
			}
			if (obj.currentStyle) {
				return obj.currentStyle[attr];
			} else {
				return document.defaultView.getComputedStyle(obj, null)[attr];
			}
		},
		onDeactivated() {
			// this.$emit('change', { type: '', isDrawer: false });
		},
	},
};
</script>
<style scoped lang="scss">
.main {
	display: flex;
	position: relative;
	z-index: 999;
	// justify-content: space-between;
}
.tool-swiper {
	width: 480px;
	height: 640px;
	.tool-btn {
		width: 480px;
	}
	.swiper-img {
		position: absolute;
		height: auto;
	}
	.swiper-container {
		width: 480px;
		height: 670px;
		float: left;
		cursor: pointer;
	}
}
.swiper-wrapper {
	display: inherit;
}
.tool-r {
	display: inline-grid;
}
.my-active-class {
	box-sizing: content-box;
	border: 1px dashed #000 !important;
}
// .my-class {
// 	border: 0;
// }
.G-Mt-10 {
	margin-top: 10px;
}
.box-style {
	display: grid;
	overflow-x: scroll;
}
.handle,
.vdr {
	padding: 0;
	border: 0;
}
::v-deep .el-carousel__indicators--outside {
	display: none;
}
::v-deep .el-carousel__container {
	height: 640px;
	// border: 1px solid #dcdfe6;
}
::v-deep .handle-tm,
::v-deep .handle-mr,
::v-deep .handle-bm,
::v-deep .handle-ml {
	width: 0 !important;
	height: 0 !important;
	padding: 0 !important;
	background: transparent;
	border: 0;
}
::v-deep .handle-tl,
::v-deep .handle-tm,
::v-deep .handle-tr,
::v-deep .handle-mr,
::v-deep .handle-br,
::v-deep .handle-bm,
::v-deep .handle-bl,
::v-deep .handle-ml {
	position: absolute;
	z-index: 999;
	padding: 3px;
}
::v-deep .swiper-pagination-bullet-active {
	width: 15px;
	height: 15px;
}
::v-deep .swiper-pagination-bullet {
	width: 15px;
	height: 15px;
}
::v-deep .swiper-container-horizontal > .swiper-pagination-bullets,
.swiper-pagination-custom,
.swiper-pagination-fraction {
	bottom: 0;
}
.current-swiper {
	display: flex;
	input {
		width: 80px;
		border: 1px solid red;
	}
}
.img_text::before {
	// content: '';
	// background-image: var(--bgurl);
	// left: 0;
	// background-size: cover;
	// background-size: cover;
	// position: absolute;
	// background-size: cover;
	// top: -18px;
	// width: 60px;
	// height: 60px;
	// position: absolute;
	// left: 95px;
}

img[src=''],
img:not([src]) {
	// opacity: 0;
}
*::-webkit-scrollbar {
	width: 0 !important;
	height: 0 !important;
}
.var {
	border: 0 !important;
}
</style>
