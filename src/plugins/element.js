import Vue from 'vue';
import { MessageBox, Dialog } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.use(Dialog);
Vue.prototype.$confirm = (options) => {
	MessageBox.confirm(options.tips, options.title, {
		confirmButtonText: options.confirmButtonText || '确定',
		cancelButtonText: '取消',
		dangerouslyUseHTMLString: true,
		type: options.type || 'warning',
	})
		.then(() => {
			options.callback();
			options.close && options.close();
		})
		.catch(() => {
			options.close && options.close();
		});
};
Vue.prototype.$inputConfirm = (options) => {
	MessageBox.prompt(options.tips, options.title, {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputValue: options.value || '',
		inputPattern: options.inputPattern || '',
		inputErrorMessage: options.inputErrorMessage || '',
		closeOnClickModal: false,
	})
		.then(({ value }) => {
			options.callback(value);
			options.close && options.close();
		})
		.catch(() => {
			options.close && options.close();
		});
};
