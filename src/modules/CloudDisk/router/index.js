import login from './../views/login';
export default {
	routes: [
		{
			path: '/',
			name: 'diskLogin',
			component: login,
			meta: {
				title: '登录-C-DISK',
			},
		},
		{
			path: '/login',
			name: 'diskLogin2',
			component: login,
			meta: {
				title: '登录-C-DISK',
			},
		},
		{
			path: '/verify/:id/:name',
			name: 'verify',
			component: login,
			meta: {
				title: '激活账号-C-DISK',
			},
		},
		{
			path: '/disk-file-info',
			name: 'diskFileInfo',
			component: require('../views/viewer/diskInfo').default,
		},
		{
			path: '/index',
			name: 'diskIndex',
			component: require('../views/diskIndex').default,
			meta: {
				title: '我的网盘-C-DISK',
			},
		},
		{
			path: '/disk-music-player',
			name: 'diskMusicPlayer',
			component: require('../views/viewer/musicPlayer').default,
		},
		{
			path: '/disk-video-player',
			name: 'diskVideoPlayer',
			component: require('../views/viewer/videoPlayer').default,
		},
		{
			path: '/disk-pdf-viewer',
			name: 'diskPdfViewer',
			component: require('../views/viewer/pdfViewer').default,
		},
		{
			path: '/disk-image-viewer',
			name: 'diskImageViewer',
			component: require('../views/viewer/imageViewer').default,
		},
		{
			path: '/disk-text-viewer',
			name: 'diskTextViewer',
			component: require('../views/viewer/textViewer').default,
		},
		{
			path: '/disk-office-viewer',
			name: 'diskOfficeViewer',
			component: require('../views/viewer/officeViewer').default,
		},
		{
			path: '/disk-setting',
			name: 'setting',
			component: require('../views/setting').default,
		},
		{
			path: '/s/:share',
			name: 'share',
			component: require('../views/share').default,
			meta: {
				title: 'C-DISK-分享',
			},
		},
	],
};
