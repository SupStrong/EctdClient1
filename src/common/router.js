export default [
	{
		path: '/about',
		name: 'about',
		component: require('../views/aboutWindow').default,
	},
	{
		path: '/feedBack',
		name: 'feedBack',
		component: require('../views/feedBackWindow').default,
	},
	{
		path: '/userAccount',
		name: 'userAccount',
		component: require('../views/userAccountWindow').default,
	},
	{
		path: '/test',
		name: 'test',
		component: require('../views/test').default,
	},
	{
		path: '/404',
		name: 'notFound',
		component: require('../views/notFound').default,
		meta: {
			title: '找不到该页面',
		},
	},
	{
		path: '*', // 此处需特别注意置于最底部
		redirect: '/404',
	},
];
