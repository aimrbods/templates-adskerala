
export const SITE = {
	name: "APK Directory",

	description:
		"Download APK gratis untuk berbagai aplikasi Android terbaru. Temukan aplikasi berdasarkan kategori, versi, ukuran, dan developer.",

	domain: "https://apk.adskerala.com",

	defaultImage:
		"/images/default.webp"
};


/**
 * Buat URL absolut
 */
export function url(path = "") {

	if (!path) {
		return SITE.domain;
	}

	if (/^https?:\/\//i.test(path)) {
		return path;
	}

	return `${SITE.domain}${path.startsWith("/") ? path : `/${path}`}`;
}


/**
 * Escape HTML
 */
export function escapeHTML(value = "") {

	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}


/**
 * Bersihkan slug
 */
export function sanitizeSlug(value = "") {

	return String(value)
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9-]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}


/**
 * URL canonical
 */
export function canonical(path = "/") {

	if (!path || path === "/") {
		return `${SITE.domain}/`;
	}

	return `${SITE.domain}${
		path.startsWith("/") ? path : `/${path}`
	}`;
}


/**
 * URL gambar
 */
export function imageUrl(image = "") {

	if (!image) {
		return url(SITE.defaultImage);
	}

	if (/^https?:\/\//i.test(image)) {
		return image;
	}

	return url(
		`/images/${encodeURIComponent(image)}`
	);
}
