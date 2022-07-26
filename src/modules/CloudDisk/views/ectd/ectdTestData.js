const apiColConfig = {
	sample: [
		{ title: '品牌名称', key: 'brandName', element: '<application-id>', fixed: 'left' },
		{ title: '品牌别称', key: 'nicename', element: '<sequence-number>' },
		{ title: '名称', key: 'name', element: '<application-type>' },
		{ title: '含量', key: 'content', element: '<regulatory-activity-type>' },
		{ title: '分类', key: 'classify', element: '<sequence-type>' },
		{ title: '国籍', key: 'nationality', element: '<sequence-description>' },
		{ title: '价格', key: 'price' },
		{ title: '功效', key: 'effect' },
		{ title: '详情', key: 'details' },
		{ title: '图片', key: 'image' },
		{
			title: '操作',
			key: 'action',
			render() {
				return `<i-button type="primary" size="small" @click="show(${index})">查看</i-button> <i-button type="error" size="small" @click="remove(${index})">删除</i-button>`;
			},
		},
	],
	brand: [
		{ title: '品牌名称', key: 'name', element: '<application-id>', fixed: 'left' },
		{ title: '别称', key: 'nickName', element: '<application-id>', fixed: 'left' },
		{ title: '国籍', key: 'nationality', element: '<application-id>', fixed: 'left' },
		{
			title: '操作',
			key: 'action',
			render: (h, params) => {
				console.log(params);
				return h('div', [
					h(
						'span',
						{
							style: {
								fontSize: '14px',
								cursor: 'pointer',
								color: '#fc1',
							},
							on: {
								click: () => {
									this.isShow = true;
									this.editId = params.row.id;
								},
							},
							class: 'btn',
						},
						'编辑'
					),
					h(
						'span',
						{
							style: {
								fontSize: '14px',
								padding: '5px 10px',
								cursor: 'pointer',
								color: 'green',
							},
							on: {
								click: () => {
									this.deleteData('brand');
								},
							},
							class: 'btn',
						},
						'删除'
					),
				]);
			},
		},
	],
	category: [
		{ title: '分类名称', key: 'name', element: '<application-id>', fixed: 'left' },
		{
			title: '操作',
			key: 'action',
			render: (h, params) => {
				console.log(params);
				return h('div', [
					h(
						'span',
						{
							style: {
								fontSize: '14px',
								cursor: 'pointer',
								color: '#fc1',
							},
							on: {
								click: () => {
									this.isShow = true;
									this.editId = params.row.id;
								},
							},
							class: 'btn',
						},
						'编辑'
					),
					h(
						'span',
						{
							style: {
								fontSize: '14px',
								padding: '5px 10px',
								cursor: 'pointer',
								color: 'green',
							},
							on: {
								click: () => {
									this.$confirm({
										title: '删除',
										tips: '确认删除此数据？',
										callback: () => {
											this.delPopup = true;
										},
									});
								},
							},
							class: 'btn',
						},
						'删除'
					),
				]);
			},
		},
	],
	company: [
		{ title: '单位名称', key: 'name', element: '<application-id>', fixed: 'left' },
		{
			title: '操作',
			key: 'action',
			render: (h, params) => {
				console.log(params);
				return h('div', [
					h(
						'span',
						{
							style: {
								fontSize: '14px',
								cursor: 'pointer',
								color: '#fc1',
							},
							on: {
								click: () => {
									this.isShow = true;
									this.editId = params.row.id;
								},
							},
							class: 'btn',
						},
						'编辑'
					),
					h(
						'span',
						{
							style: {
								fontSize: '14px',
								padding: '5px 10px',
								cursor: 'pointer',
								color: 'green',
							},
							on: {
								click: () => {
									this.$confirm({
										title: '删除',
										tips: '确认删除此数据？',
										callback: () => {
											this.delPopup = true;
										},
									});
								},
							},
							class: 'btn',
						},
						'删除'
					),
				]);
			},
		},
	],
};

export { apiColConfig };
