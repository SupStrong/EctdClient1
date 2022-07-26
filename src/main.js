import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import routerTool from './common/routerTool';
import commonRouter from './common/router';
import commonStore from '../src/modules/CloudDisk/store/index';
import './common/svg';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'swiper/dist/css/swiper.min.css';
import 'swiper/dist/js/swiper.min';

import VueDraggableResizable from 'vue-draggable-resizable';
import 'vue-draggable-resizable/dist/VueDraggableResizable.css';
import './assets/common/css/font.scss';
Vue.component('vue-draggable-resizable', VueDraggableResizable);


// 公共组件
import Picture from './modules/CloudDisk/components/custom-component/Picture.vue';
import VText from './modules/CloudDisk/components/custom-component/VText.vue';
import VButton from './modules/CloudDisk/components/custom-component/VButton.vue';
import Group from './modules/CloudDisk/components/custom-component/Group.vue';
import RectShape from './modules/CloudDisk/components/custom-component/RectShape.vue';


Vue.component('Picture', Picture)
Vue.component('VText', VText)
Vue.component('VButton', VButton)
Vue.component('Group', Group)
Vue.component('RectShape', RectShape)
const projectConfig = require('./common/projectInfo.js').default; // 引入子系统运行打包配置
let mode = routerTool(VueRouter);
let router = tryGetModuleRoute();
let store = tryGetModuleStore();
function tryGetModuleRoute() {
	Vue.use(VueRouter);
	try {
		let route = require(`./modules/${projectConfig.projectName}/router/index`).default;
		route.routes = [...route.routes, ...commonRouter];
		route.mode = 'history';
		return new VueRouter(route);
	} catch (e) {
		return new VueRouter({
			mode: 'history',
			routes: commonRouter,
		});
	}
}
function tryGetModuleStore() {
	Vue.use(Vuex);
	try {
		let store = require(`./modules/${projectConfig.projectName}/store/index`).default;
		store.state = Object.assign(store.state || {}, commonStore.state);
		store.mutations = Object.assign(store.mutations || {}, commonStore.mutations);
		store.getters = Object.assign(store.getters || {}, commonStore.getters);
		store.modules = Object.assign(store.modules || {}, commonStore.modules);
		
		return new Vuex.Store(commonStore);
	} catch (e) {	
		return new Vuex.Store(commonStore);
	}
}
function tryGetModuleMain() {
	try {
		require(`./modules/${projectConfig.projectName}/main`);
	} catch (e) {}
}
tryGetModuleMain();
require('./common/units'); //引入通用unit
Vue.use(Element);
Vue.prototype.$store = commonStore;
Vue.config.productionTip = false;
new Vue({
	router,
	store:commonStore,
	render: (h) => h(App),
}).$mount('#app');
