export default function (Router) {
	const originalPush = Router.prototype.push;
	Router.prototype.push = function push(location) {
		return originalPush.call(this, location).catch((err) => err);
	};
	const originalReplace = Router.prototype.replace;
	Router.prototype.replace = function push(location) {
		return originalReplace.call(this, location).catch((err) => err);
	};
	return !!process.versions ? 'hash' : process.env.NODE_ENV !== 'production' ? 'hash' : 'history';
}
