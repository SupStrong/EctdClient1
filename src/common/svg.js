!(function (h) {
	var l,
		a,
		t,
		c,
		p,
		z =
		M = (M = document.getElementsByTagName('script'))[M.length - 1].getAttribute('data-injectcss'),
		i = function (h, l) {
			l.parentNode.insertBefore(h, l);
		};
	if (M && !h.__iconfont__svg__cssinject__) {
		h.__iconfont__svg__cssinject__ = !0;
		try {
			document.write('<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>');
		} catch (h) {
			console && console.log(h);
		}
	}
	function d() {
		p || ((p = !0), t());
	}
	function v() {
		try {
			c.documentElement.doScroll('left');
		} catch (h) {
			return void setTimeout(v, 50);
		}
		d();
	}
	(l = function () {
		var h, l;
		((l = document.createElement('div')).innerHTML = z),
			(z = null),
			(h = l.getElementsByTagName('svg')[0]) &&
				(h.setAttribute('aria-hidden', 'true'),
				(h.style.position = 'absolute'),
				(h.style.width = 0),
				(h.style.height = 0),
				(h.style.overflow = 'hidden'),
				(l = h),
				(h = document.body).firstChild ? i(l, h.firstChild) : h.appendChild(l));
	}),
		document.addEventListener
			? ~['complete', 'loaded', 'interactive'].indexOf(document.readyState)
				? setTimeout(l, 0)
				: ((a = function () {
						document.removeEventListener('DOMContentLoaded', a, !1), l();
				  }),
				  document.addEventListener('DOMContentLoaded', a, !1))
			: document.attachEvent &&
			  ((t = l),
			  (c = h.document),
			  (p = !1),
			  v(),
			  (c.onreadystatechange = function () {
					'complete' == c.readyState && ((c.onreadystatechange = null), d());
			  }));
})(window);