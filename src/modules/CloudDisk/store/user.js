export default {
	state: {
		userInfo: {
			name: '未登录',
			avatar: null,
		},
	},
	mutations: {
		updateUserInfo(state, data) {
			state.userInfo = data;
		},
	},
	getters: {},
	modules: {},
};
