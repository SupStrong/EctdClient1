import Vue from 'vue';
import router from './router';
if (!Vue.isElectron) {
	router.beforeEach((to, from, next) => {
		if (to.meta) {
			if (to.name === 'diskIndex') {
				document.title = `${to.query.category_name || '网盘'}-C-DISK`;
			} else {
				document.title = to.meta.title;
			}
		}
		next();
	});
}
Vue.config.productionTip = false;
