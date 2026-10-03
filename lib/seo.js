
import { SITE, url, escapeHTML } from "./config";

export function seo({
	title = SITE.name,
	description = SITE.description,
	canonical = "/",
	image = "",
	type = "WebPage"
} = {}) {

	const canonicalUrl = url(canonical);

	const imageUrl = image
		? (/^https?:\/\//i.test(image) ? image : url(image))
		: url(SITE.defaultImage);

	return `
<script type="application/ld+json">
${JSON.stringify({
	"@context": "https://schema.org",
	"@type": type,
	"name": title,
	"description": description,
	"url": canonicalUrl,
	"image": imageUrl,
	"isPartOf": {
		"@type": "WebSite",
		"name": SITE.name,
		"url": SITE.domain
	},
	"publisher": {
		"@type": "Organization",
		"name": SITE.name,
		"url": SITE.domain
	}
}, null, 2)}
</script>
`;
}


/**
 * Schema khusus aplikasi APK
 */
export function appSchema(app) {

	if (!app) {
		return "";
	}

	const appUrl = url(
		`/aplikasi/${encodeURIComponent(app.slug)}`
	);

	const icon = app.icon
		? url(`/images/${encodeURIComponent(app.icon)}`)
		: url(SITE.defaultImage);

	const schema = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",

		"name": app.name || app.title || app.slug,

		"alternateName":
			app.title || app.name || app.slug,

		"description":
			app.description ||
			`Download ${app.name || app.slug} APK.`,

		"url": appUrl,

		"image": icon,

		"applicationCategory":
			app.category || "Application",

		"operatingSystem":
			"Android",

		"softwareVersion":
			app.version || undefined,

		"fileSize":
			app.size || undefined,

		"author": {
			"@type": "Organization",
			"name":
				app.developer ||
				"Unknown Developer"
		},

		"publisher": {
			"@type": "Organization",
			"name": SITE.name,
			"url": SITE.domain
		}
	};

	return `
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
`;
}
