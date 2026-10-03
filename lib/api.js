const API_BASE = "https://api-apk.aimrbods.workers.dev";


async function request(path) {

	const response = await fetch(
		`${API_BASE}${path}`,
		{
			headers: {
				"accept": "application/json"
			}
		}
	);

	if (!response.ok) {

		throw new Error(
			`API request failed: ${response.status}`
		);

	}

	return response.json();
}


/* =========================
   GET ALL APPS
========================= */

export async function getApps() {

	const data = await request("/api/apps");

	if (!data?.success) {
		return [];
	}

	return Array.isArray(data.apps)
		? data.apps
		: [];

}


/* =========================
   GET SINGLE APP
========================= */

export async function getApp(slug) {

	if (!slug) {
		return null;
	}

	const data = await request(
		`/api/apps/${encodeURIComponent(slug)}`
	);

	if (!data?.success || !data.app) {
		return null;
	}

	return data.app;

}
