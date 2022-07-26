# cloud-web

## 这是一个多模块项目，模块可以独立打包成web或electron应用

### 安装依赖
```bash
cd CloudWeb
npm i
```
### 淘宝的npm源
```bash
npm config set registry 'https://registry.npm.taobao.org'
npm config set ELECTRON_MIRROR='https://npm.taobao.org/mirrors/electron/'
```

### 运行项目
```bash
npm run dev:web projectName #运行web版本项目
npm run dev:electron projectName #打包electron版本项目
```
### 打包项目
'https://aliyun-wb-bvqq7ezi1t.oss-cn-beijing.aliyuncs.com'
```bash
npm run build:web projectName #打包web版本项目
npm run build:electron projectName #打包electron版本项目
npm run build:all projectName #打包web和electron版本项目
npm run build:all #打包所有项目的web和electron版本
			<!-- <ul>
				<li v-for="(item, index) in categoryMenuData" :key="index" ripple :class="{ active: data.categoryType === item.data }" @click="change(index)">
					<i :class="item.icon" />{{ item.name }}
					<div class="count" v-show="item.count > 0">{{ item.count }}</div>
				</li>
			</ul> -->
			<!-- <div class="bottom">
				<div class="tower" :style="{ background: 'url(' + towerSrc + ')' }"></div>
				<p>{{ data.selectTips }}</p>
			</div> -->
