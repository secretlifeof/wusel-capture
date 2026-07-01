import type { PageInfo } from '../types';

// Gathers page + browser metadata. MUST stay self-contained (only `window` /
// `document` / `navigator` globals, no imports/closures) so it can also be
// passed to `chrome.scripting.executeScript({ func: collectPageInfo })`, which
// serializes the function and runs it in the page.
export function collectPageInfo(): PageInfo {
	const ua = navigator.userAgent;
	const nav = navigator as Navigator & {
		brave?: unknown;
		userAgentData?: { platform?: string; mobile?: boolean };
	};
	const grab = (re: RegExp) => {
		const m = ua.match(re);
		return m ? m[1] : '';
	};

	let name = 'Unknown';
	let version = '';
	if (/Edg\//.test(ua)) {
		name = 'Edge';
		version = grab(/Edg\/([\d.]+)/);
	} else if (/OPR\//.test(ua) || /Opera/.test(ua)) {
		name = 'Opera';
		version = grab(/(?:OPR|Opera)\/([\d.]+)/);
	} else if (/Firefox\//.test(ua)) {
		name = 'Firefox';
		version = grab(/Firefox\/([\d.]+)/);
	} else if (/Chrome\//.test(ua)) {
		name = nav.brave ? 'Brave' : 'Chrome';
		version = grab(/Chrome\/([\d.]+)/);
	} else if (/Safari\//.test(ua) && /Version\//.test(ua)) {
		name = 'Safari';
		version = grab(/Version\/([\d.]+)/);
	}

	let platform = nav.userAgentData?.platform || navigator.platform || '';
	if (/Windows NT/.test(ua)) platform = 'Windows';
	else if (/Mac OS X/.test(ua)) platform = 'macOS';
	else if (/Android/.test(ua)) platform = 'Android';
	else if (/(iPhone|iPad|iPod)/.test(ua)) platform = 'iOS';
	else if (!platform && /Linux/.test(ua)) platform = 'Linux';

	const mobile =
		typeof nav.userAgentData?.mobile === 'boolean'
			? nav.userAgentData.mobile
			: /Mobile|Android|iPhone|iPad|iPod/.test(ua);

	return {
		url: location.href,
		title: document.title,
		userAgent: ua,
		viewport: { width: window.innerWidth, height: window.innerHeight },
		devicePixelRatio: window.devicePixelRatio,
		scroll: { x: Math.round(window.scrollX), y: Math.round(window.scrollY) },
		browser: {
			name,
			version,
			platform,
			language: navigator.language || '',
			screen: { width: window.screen?.width ?? 0, height: window.screen?.height ?? 0 },
			mobile,
			touchPoints: navigator.maxTouchPoints || 0,
		},
	};
}
