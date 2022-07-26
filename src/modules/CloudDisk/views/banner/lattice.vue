<template>
	<div class="main">
		<!-- 轮播图 -->
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
				<el-carousel-item class="test" v-for="(element, index) in swiperBanner" :ref="'swiper' + index" :key="index" οndragstart="return false">
					<img
						v-if="!element.children"
						class="swiper-img"
						:src="element.content ? 'http://118.31.70.36:3000/uploads/disk/' + element.content : '69284f94b79bf8b867bf513be25b9c74.webp'"
						alt=""
						οndragstart="return false"
					/>
					<div v-if="element.children" style="width: 100%; height: 100%; position: absolute">
						<div class="div2" style="width: 100%; height: 100%">
							<draggable @start="start" @end="end" style="width: 100%; height: 100%">
								<div v-for="item in element.children" :key="item" class="box-style" :class="item.style" style="overflow-y: auto">
									<img
										:src="item.content ? 'http://118.31.70.36:3000/uploads/disk/' + item.content : '69284f94b79bf8b867bf513be25b9c74.webp'"
										style="width: 100%; height: 100%"
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
						style="border: 0; display: flex; align-items: center; justify-content: center"
						v-for="(c_element, index) in imgToData"
						:parent="true"
						:key="c_element.rand"
						:lock-aspect-ratio="true"
						:style="c_element.index != swiperIndex ? 'display:none;' : 'display: flex;'"
						w="auto"
						h="auto"
						@resizing="(left, top, width, height) => onResize(c_element, left, top, width, height)"
						@activated="(left, top, width, height) => onActivated(c_element, index)"
						@deactivated="onDeactivated"
						@resizestop="onResizeStop"
					>
						<p
							:tabindex="c_element.rand"
							@keyup="textDelete($event, c_element)"
							:ref="c_element.rand"
							:class="c_element.class || 'G-font-6'"
							style="font-size: 26px; white-space: nowrap; display: inline-box; white-space: pre; font-weight: 700"
							:style="{
								'text-align': c_element.textAlign,
								'writing-mode': c_element.writingMode,
								color: c_element['color'],
								'text-shadow': c_element['text-shadow'],
							}"
							v-if="c_element.type == 'text'"
							v-html="c_element.val"
						></p>
						<img
							:tabindex="c_element.rand"
							@keyup="imgDelete($event, c_element)"
							:ref="c_element.rand"
							:src="c_element.val"
							v-if="c_element.type == 'image'"
							@load="urlInfo($event, c_element.rand)"
							style="width: 50px; height: 50px; white-space: nowrap; display: block"
							alt=""
						/>
						<div
							:tabindex="c_element.rand"
							:ref="c_element.rand"
							@keyup="imgDelete($event, c_element)"
							v-if="c_element.type == 'tool'"
							:class="c_element.val"
							alt=""
						>
							<input type="file" @change="changeUpload($event, c_element)" />
							<img :src="c_element.img" alt="" />
						</div>

						<svg
							class="icon"
							:ref="c_element.rand"
							v-if="c_element.type == 'icon'"
							style="width: 50px; height: 50px; white-space: nowrap; display: block"
							:key="index"
						>
							<use draggable="false" dragstart="return false;" :xlink:href="'#' + c_element.val"></use>
						</svg>
					</vue-draggable-resizable>
				</el-carousel-item>
			</el-carousel>
			<div class="imgDom"></div>
			<!-- <div class="swiper-container G-Mb-10" ref="html2canvas">
				<div class="swiper-wrapper swiper-no-swiping">
					<div class="swiper-slide test" v-for="(element, index) in swiperBanner" :ref="'swiper' + index" :key="index" οndragstart="return false">
						
					</div>
				</div>
				<div class="swiper-pagination"></div>
			</div> -->
			<!-- <div class="fl-row-justy tool-btn" style="height: 300px; border: 1px solid red"></div> -->
			<p>当前文件夹有{{ swiperBanner.length }}张图片122</p>
			<!-- <draggable class="drav" @start="start" @end="end"> -->

			<div class="current-swiper">
				<div v-for="item in newSwiperBanner" :key="item" style="margin-right: 10px">
					<img :src="'http://118.31.70.36:3000/uploads/disk/' + item.content" style="width: 60px; height: 60px; margin: 0; margin-bottom: 10px" alt="" />
					<el-input type="text" v-model="item.sort" min="1" placeholder="当前" />
				</div>
				<el-button class="btn" type="danger" style="width: 100px; height: 40px; display: flex; align-self: end; margin-left: 10px" @click="defineStyle()"
					>确定</el-button
				>
			</div>
			<!-- </draggable> -->
			<div class="fl-row-justy tool-btn G-Mt-10">
				<el-input placeholder="请输入当前查询的文件夹" v-model="currentSwiper" value="" style="width: 220px"></el-input>
				<el-button class="btn" type="danger" @click="getCurrentSwiper()">查询文件夹</el-button>
				<el-button class="btn" type="warning" @click="generateImg()" v-loading.fullscreen.lock="fullscreenLoading">生成图片</el-button>
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
				<bannerTableNav
					v-else-if="popupData.type == 'table'"
					:data="popupData"
					:listData="imgStyleToData"
					@select="resetData"
					@delete="deleteToData"
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
			currentSwiper: '2021/11/1/SP',
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
		//点击方法
		getData() {
			this.$api.brand.list({}, (rs) => {
				console.log(rs, 'resss');
			});
		},
		defineStyle() {
			let arr = [
				['G-width-100 G-height-100'],
				['G-width-100 G-height-50', 'G-width-100 G-height-50'],
				['G-width-100 G-height-33', 'G-width-100 G-height-33', 'G-width-100 G-height-33'],
				['G-width-50 G-height-50', 'G-width-50 G-height-50', 'G-width-50 G-height-50', 'G-width-50 G-height-50'],
				['G-width-50 G-height-50', 'G-width-50 G-height-50', 'G-width-100 G-height-50'],
				['G-width-100 G-height-66', 'G-width-50 G-height-33', 'G-width-50 G-height-33'],
				['G-width-100 G-height-60', 'G-width-50 G-height-40', 'G-width-50 G-height-40'],
			];
			let data = this.newSwiperBanner;
			console.log(data, 'data');
			let newData = [];
			let val = [];
			data.map((item, index) => {
				let split = String(item.sort).split('/');
				if (split[0] == 1 || item.sort == '1') {
					let obj = {
						...item,
						style: arr[0],
					};
					newData.push(item);
				} else {
					val.push(item.sort);
				}
			});
			let newVal = Array.from(new Set(val));
			newVal.map((item, index) => {
				let cont = this.funS(item);
				let a = String(item).split('/');
				let newCont = cont.map((c_item, index) => {
					return {
						...c_item,
						style: arr[a[0] - 1][index],
					};
				});
				newData[newData.length] = {
					children: newCont,
				};
			});
			console.log(newData, 'newDatanewDatanewData');
			this.swiperBanner = newData;
			// this.swiperBanner = newData;
			// this.swiperBanner = [
			// 	{
			// 		content: 'http://118.31.70.36:3000/uploads/disk/01054f21ded2ff49238991245130e2fe.jpg',
			// 	},
			// 	{
			// 		children: [
			// 			{
			// 				content: 'http://118.31.70.36:3000/uploads/disk/01054f21ded2ff49238991245130e2fe.jpg',
			// 			},
			// 			{
			// 				content: 'https://img2.baidu.com/it/u=1532752388,171944695&fm=26&fmt=auto',
			// 			},
			// 			{
			// 				content: 'https://img2.baidu.com/it/u=1532752388,171944695&fm=26&fmt=auto',
			// 			},
			// 			{
			// 				content: 'https://img2.baidu.com/it/u=1532752388,171944695&fm=26&fmt=auto',
			// 			},
			// 		],
			// 	},
			// ];
		},
		funS(val) {
			let newArray = [];
			let j = 0;
			for (let i in this.newSwiperBanner) {
				if (this.newSwiperBanner[i].sort == val) {
					newArray[j++] = this.newSwiperBanner[i];
				}
			}
			return newArray;
		},
		changeUpload(e, data) {
			// 上传图片
			var file = e.target.files[0];
			if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
				alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
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
				this.imgStyleToData = newImgToData;
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
				this.imgStyleToData = newImgToData;
			} else if (e.keyCode === 67) {
				let obj = {
					...val,
					rand: (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + new Date().getTime() + '-' + Math.random().toString().substr(2, 5),
				};
				this.imgToData.push(obj);
			}
		},
		urlInfo(e, rand) {
			// this.$refs[rand][this.swiperIndex].style.height = e.target.height / 4 + 'px';
			// this.$refs[rand][this.swiperIndex].style.width = e.target.width / 4 + 'px';
			// this.$refs[rand][this.swiperIndex].parentNode.style.height = e.target.height / 4 + 'px';
			// this.$refs[rand][this.swiperIndex].parentNode.style.width = e.target.width / 4 + 'px';
			// console.log(this.$refs[rand][this.swiperIndex].parentNode, 'this.$refs[rand][this.swiperIndex].parentNode');
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
				// this.swiperBanner = rs.data.allImg;
				let newData = rs.data.allImg.map((item) => {
					return {
						...item,
						sort: 1,
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
						scale: 5,
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
						textColor: data['textColor'],
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
			if (parentId) {
				imgsSrc.map((item, index) => {
					let files = [];
					files[0] = this.dataURLtoFile(item, new Date().getTime() + '.jpg');
					uploadHandle.init(
						files,
						{
							parentId: parentId,
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
		onResize(data, x, y, width, height) {
			let dom_height = this.$refs[data.rand][data.index].offsetHeight;
			let dom_width = this.$refs[data.rand][data.index].offsetWidth;
			this.$refs[data.rand][data.index].style.transform = `scale(${width / dom_width},${height / dom_height})`;
		},
		onResizeStop(x, y, width, height) {
			this.resizing = false;
		},
		onActivated(ele, index) {
			let width = this.$refs[ele.rand][this.swiperIndex].offsetWidth;
			let height = this.$refs[ele.rand][this.swiperIndex].offsetHeight;
			this.$refs[ele.rand][this.swiperIndex].style.width = width + 'px';
			this.$refs[ele.rand][this.swiperIndex].style.height = height + 'px';
			// this.$refs[ele.rand + index][this.swiperIndex].style.width = width + 'px';
			// this.$refs[ele.rand + index][this.swiperIndex].style.height = height + 'px';
			this.$emit('change', { type: 'table', isDrawer: true });
			this.imgStyleToData = [];
			this.imgToData.map((item, index) => {
				if (item.type === 'text') {
					let splitArrr = this.getStyle(this.$refs[item.rand][item.index], 'textShadow');
					let obj = {
						...item,
						'font-size': this.getStyle(this.$refs[item.rand][item.index], 'fontSize'),
						color: this.getStyle(this.$refs[item.rand][item.index], 'color'),
						'font-family': this.getStyle(this.$refs[item.rand][item.index], 'fontFamily'),
						'text-shadow': this.getStyle(this.$refs[item.rand][item.index], 'textShadow'),
						textColor: splitArrr.split(' 1px 0px 0px, ')[0],
						textAlign: this.getStyle(this.$refs[item.rand][item.index], 'textAlign'),
						writingMode: this.getStyle(this.$refs[item.rand][item.index], 'writingMode'),
						class: this.$refs[item.rand][item.index].getAttribute('class'),
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
	border: 1px solid red;
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
</style>
