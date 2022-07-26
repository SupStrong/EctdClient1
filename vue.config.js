'use strict';
const projectConfig = require('./src/common/projectInfo.js').default; // 引入子系统运行打包配置
const projectName = projectConfig.projectName;
const menuCategory = 'Cloud';
const electronIcon = `public/${projectName}/icon/icon.`;
const path = require('path');
const codeShield = require('./src/common/main/codeShield');
let isSplitProject = false; //是否是切割过后的项目
let _projectList = {};
try {
	_projectList = require('./config/_projectList.json');
} catch (e) {
	isSplitProject = true;
}
let extraResources = projectConfig.needAria2
	? {
			// 拷贝dll等静态文件到指定位置
			from: './public/aria2',
			to: './aria2',
	  }
	: {};
function resolve(dir) {
	return path.join(__dirname, dir);
}
function createProjectConfig(config) {
	let pages = {};
	pages[config.projectName] = {
		entry: config.entry || `src/main.js`,
		template: 'public/index.html',
		filename: 'index.html',
		title: config.title || config.projectName,
		chunks: ['chunk-vendors', 'chunk-common', config.projectName],
		favicon: `public/${config.projectName}/favicon.ico`,
	};
	return { pages };
}
function getIgnoreFolder(ignore) {
	if (_projectList !== 'index') {
		for (let i in _projectList) {
			if (i !== projectName) {
				ignore.push('**/' + i + '/**');
			}
		}
	}
	ignore.push('**/' + projectName + '/favicon.ico');
	return ignore;
}
require('./src/common/tool');
module.exports = {
	...createProjectConfig(projectConfig),
	publicPath: '/',
	outputDir: 'build/web/' + (!isSplitProject ? projectName : ''),
	assetsDir: 'static',
	lintOnSave: process.env.NODE_ENV === 'development',
	productionSourceMap: false,
	configureWebpack(config) {
		if (process.env.NODE_ENV === 'production' && projectConfig.runType === 'web') {
			const compressionWebpackPlugin = require('compression-webpack-plugin');
			config.plugins.push(
				new compressionWebpackPlugin({
					algorithm: 'gzip',
					test: /\.js$|\.html$|\.json$|\.css/,
					threshold: 10240,
					minRatio: 0.8,
				})
			);
		}
	},
	chainWebpack(config) {
		if (!isSplitProject) {
			config.plugin('copy').tap((arg) => {
				arg[0][0].ignore = getIgnoreFolder(arg[0][0].ignore);
				return [...arg];
			});
		}
		config.plugin('define').tap((args) => {
			args[0]['config'] = JSON.stringify({
				useDevTools: projectConfig.runType === 'web' && process.env.NODE_ENV !== 'development',
				runType: projectConfig.runType,
				needMap: projectConfig.needMap,
				buildTime: new Date().format(),
			});
			return args;
		});
		/*config
			.plugin('webpack-bundle-analyzer')
			.use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)*/
		config.resolve.alias.set('@', resolve('src'));
		return config;
	},
	css: {
		// 配置css模块
		loaderOptions: {
			// 向预处理器 Loader 传递配置选项
			less: {
				// 配置less（其他样式解析用法一致）
				javascriptEnabled: true, // 设置为true
			},
		},
	},
	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'scss',
			patterns: ['./src/assets/common/css/value.scss'],
		},
		electronBuilder: {
			builderOptions: {
				productName: projectName,
				appId: projectConfig.appId,
				publish: [
					{
						provider: 'generic',
						author: 'ZJINH',
						url: 'https://zjinh.cn/',
						name: projectName,
						uuid: codeShield.init(),
					},
				],
				extraResources,
				directories: {
					output: 'build/electron/' + (!isSplitProject ? projectName : ''),
				},
				win: {
					icon: electronIcon + 'ico',
					artifactName: '${productName}_setup_${version}.${ext}',
					target: ['nsis'],
				},
				nsis: {
					oneClick: false,
					menuCategory: menuCategory,
					shortcutName: projectConfig.logoText,
					allowToChangeInstallationDirectory: true,
					perMachine: true,
					runAfterFinish: true,
				},
				appx: {
					identityName: `CloudSeries.${projectName}`,
					displayName: projectName,
					publisher: 'CN=LongNumber',
					publisherDisplayName: 'ZJINH',
					applicationId: projectConfig.appId,
				},
				dmg: {
					contents: [
						{
							x: 410,
							y: 150,
							type: 'link',
							path: '/Applications',
						},
						{
							x: 130,
							y: 150,
							type: 'file',
						},
					],
				},
				mac: {
					icon: electronIcon + `icns`,
				},
				linux: {
					icon: electronIcon + `ico`,
					target: ['AppImage', 'snap', 'deb', 'rpm', 'freebsd', 'pacman', 'p5p', 'apk', '7z', 'zip', 'tar.xz', 'tar.lz', 'tar.gz', 'tar.bz2'],
				},
			},
		},
	},
};
