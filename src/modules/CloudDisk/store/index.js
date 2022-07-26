export default {
	state: {
		fileStateIcon: 'sf-icon-th-large',
	},
	mutations: {
		updateFileStateIcon(state) {
			state.fileStateIcon === 'sf-icon-th-large' ? (state.fileStateIcon = 'sf-icon-list-ul') : (state.fileStateIcon = 'sf-icon-th-large');
		},
	},
	getters: {},
};
