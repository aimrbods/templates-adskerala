import { layout } from "../../lib/render";
import { getApp } from "../../lib/api";
import {
	SITE,
	canonical,
	sanitizeSlug,
	escapeHTML
} from "../../lib/config";

export async function onRequest(context) {
	try {
		let slug = sanitizeSlug(context.params.slug);

		if (!slug) {
			return new Response("404 Not Found", {
				status: 404
			});
		}

		const app = await getApp(slug);

		if (!app) {
			return new Response("404 Not Found", {
				status: 404
			});
		}

		const name = app.name || app.title || slug;

		const title =
			app.title ||
			`${name} APK`;

		const description =
			app.description ||
			`Download ${name} APK gratis.`;

		const version = app.version || "-";
		const size = app.size || "-";
		const developer = app.developer || "-";
		const category = app.category || "APK";
		const packageName = app.package_name || "-";
		const updated = app.updated || "-";

		const pageUrl =
			canonical(`/aplikasi/${slug}`);

		/*
		 * ICON
		 */
		let icon = "";

		if (app.icon) {
			icon =
				/^https?:\/\//i.test(app.icon)
					? app.icon
					: `/images/${encodeURIComponent(app.icon)}`;
		}

		/*
		 * SCREENSHOTS
		 */
		const screenshots = String(
			app.screenshots || ""
		)
			.split(",")
			.map(item => item.trim())
			.filter(Boolean);

		const screenshotHTML =
			screenshots.length > 0
				? `
<section class="apk-section">

	<div class="section-heading">
		<span class="section-icon">▣</span>

		<div>
			<h2>Screenshot</h2>
			<p>Lihat tampilan ${escapeHTML(name)}</p>
		</div>
	</div>

	<div class="apk-screenshots">

		${screenshots.map(file => `
			<a
				class="screenshot-card"
				href="/screenshots/${encodeURIComponent(file)}"
				target="_blank"
				rel="noopener"
			>
				<img
					src="/screenshots/${encodeURIComponent(file)}"
					alt="${escapeHTML(name)} screenshot"
					loading="lazy"
					decoding="async"
				>
			</a>
		`).join("")}

	</div>

</section>
`
				: "";

		/*
		 * ICON HTML
		 */
		const iconHTML = icon
			? `
<div class="apk-icon">
	<img
		src="${escapeHTML(icon)}"
		alt="${escapeHTML(name)}"
		width="112"
		height="112"
	>
</div>
`
			: `
<div class="apk-icon apk-icon-placeholder">
	<span>APK</span>
</div>
`;

		/*
		 * DOWNLOAD
		 */
		const downloadHTML = app.apk_file
			? `
<section class="download-card">

	<div class="download-info">

		<div class="download-icon">
			↓
		</div>

		<div>
			<h2>Download ${escapeHTML(name)} APK</h2>

			<p>
				Versi ${escapeHTML(version)}
				<span>•</span>
				${escapeHTML(size)}
			</p>
		</div>

	</div>

	<a
		class="download-button"
		href="/apk/${encodeURIComponent(app.apk_file)}"
		download
	>
		<span>↓</span>
		Download APK
	</a>

</section>
`
			: "";

		/*
		 * BREADCRUMB
		 */
		const breadcrumb = `
<nav class="apk-breadcrumb" aria-label="Breadcrumb">

	<a href="/">Home</a>

	<span>/</span>

	<a href="/kategori/${encodeURIComponent(
		sanitizeSlug(category)
	)}">
		${escapeHTML(category)}
	</a>

	<span>/</span>

	<strong>
		${escapeHTML(name)}
	</strong>

</nav>
`;

		/*
		 * SCHEMA
		 */
		const schema = `
<script type="application/ld+json">
${JSON.stringify({
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	"name": name,
	"description": description,
	"url": pageUrl,
	"applicationCategory": category,
	"operatingSystem": "Android",
	"softwareVersion": version,
	"fileSize": size,
	"identifier": packageName,
	"dateModified": updated,

	"author": {
		"@type": "Organization",
		"name": developer
	},

	...(icon
		? {
			"image": icon
		}
		: {})
})}
</script>
`;

		/*
		 * PAGE
		 */
		return layout({
			title,
			description,
			canonical: pageUrl,
			image: icon || SITE.defaultImage,
			schema,

			content: `

<style>

/* =========================
   APK DETAIL
========================= */

.apk-page{
	max-width:980px;
	margin:0 auto;
}

.apk-breadcrumb{
	display:flex;
	align-items:center;
	flex-wrap:wrap;
	gap:9px;
	margin:5px 0 22px;
	font-size:13px;
	color:#64748b;
}

.apk-breadcrumb a{
	color:#818cf8;
}

.apk-breadcrumb a:hover{
	color:#a5b4fc;
}

.apk-breadcrumb strong{
	color:#94a3b8;
	font-weight:500;
}


/* =========================
   APP HERO
========================= */

.apk-hero{
	display:flex;
	align-items:center;
	gap:25px;

	padding:28px;

	border:1px solid rgba(148,163,184,.12);
	border-radius:24px;

	background:
	linear-gradient(
		135deg,
		rgba(99,102,241,.12),
		rgba(15,23,42,.92)
	);

	box-shadow:
	0 18px 50px rgba(0,0,0,.22);
}

.apk-icon{
	width:112px;
	height:112px;

	flex:0 0 112px;

	display:flex;
	align-items:center;
	justify-content:center;

	overflow:hidden;

	border-radius:25px;

	background:#111827;

	border:1px solid rgba(255,255,255,.08);

	box-shadow:
	0 10px 30px rgba(0,0,0,.30);
}

.apk-icon img{
	width:100%;
	height:100%;

	object-fit:cover;
}

.apk-icon-placeholder{
	background:
	linear-gradient(
		135deg,
		#4f46e5,
		#7c3aed
	);
}

.apk-icon-placeholder span{
	font-size:25px;
	font-weight:800;
	color:#fff;
}

.apk-hero-info{
	min-width:0;
	flex:1;
}

.apk-category{
	display:inline-flex;
	align-items:center;

	padding:5px 10px;
	margin-bottom:9px;

	border-radius:999px;

	background:rgba(99,102,241,.14);

	color:#a5b4fc;

	font-size:11px;
	font-weight:700;
	text-transform:uppercase;
	letter-spacing:.04em;
}

.apk-hero h1{
	margin:0;

	color:#f8fafc;

	font-size:34px;
	line-height:1.2;

	letter-spacing:-.02em;
}

.apk-subtitle{
	margin-top:9px;

	color:#94a3b8;

	font-size:15px;
	line-height:1.65;

	max-width:700px;
}

.apk-meta-mini{
	display:flex;
	flex-wrap:wrap;
	gap:8px 18px;

	margin-top:14px;

	color:#94a3b8;
	font-size:12px;
}

.apk-meta-mini span{
	display:inline-flex;
	align-items:center;
	gap:5px;
}


/* =========================
   SECTION
========================= */

.apk-section{
	margin-top:25px;

	padding:25px;

	border-radius:22px;

	background:
	rgba(15,23,42,.70);

	border:1px solid rgba(148,163,184,.10);

	box-shadow:
	0 10px 35px rgba(0,0,0,.16);
}

.section-heading{
	display:flex;
	align-items:center;
	gap:12px;

	margin-bottom:18px;
}

.section-icon{
	width:38px;
	height:38px;

	display:flex;
	align-items:center;
	justify-content:center;

	border-radius:11px;

	background:rgba(99,102,241,.13);

	color:#a5b4fc;

	font-size:17px;
}

.section-heading h2{
	color:#f8fafc;

	font-size:21px;
	line-height:1.3;
}

.section-heading p{
	margin-top:2px;

	color:#64748b;

	font-size:12px;
}


/* =========================
   DESCRIPTION
========================= */

.apk-description{
	color:#cbd5e1;

	font-size:15px;

	line-height:1.8;
}

.apk-description p{
	margin:0 0 12px;
}

.apk-description p:last-child{
	margin-bottom:0;
}


/* =========================
   INFORMATION
========================= */

.apk-info-grid{
	display:grid;

	grid-template-columns:
	repeat(2,minmax(0,1fr));

	gap:1px;

	overflow:hidden;

	border:1px solid rgba(148,163,184,.10);

	border-radius:15px;

	background:rgba(148,163,184,.10);
}

.apk-info-item{
	display:grid;

	grid-template-columns:
	150px minmax(0,1fr);

	gap:15px;

	padding:15px;

	background:#0f172a;
}

.apk-info-item strong{
	color:#64748b;

	font-size:13px;
	font-weight:600;
}

.apk-info-item span{
	color:#e2e8f0;

	font-size:13px;

	overflow-wrap:anywhere;
}


/* =========================
   DOWNLOAD
========================= */

.download-card{
	display:flex;
	align-items:center;
	justify-content:space-between;

	gap:20px;

	margin-top:25px;
	padding:22px 24px;

	border-radius:20px;

	background:
	linear-gradient(
		135deg,
		rgba(79,70,229,.18),
		rgba(124,58,237,.10)
	);

	border:1px solid rgba(99,102,241,.28);

	box-shadow:
	0 15px 45px rgba(79,70,229,.12);
}

.download-info{
	display:flex;
	align-items:center;
	gap:14px;
}

.download-icon{
	width:46px;
	height:46px;

	display:flex;
	align-items:center;
	justify-content:center;

	flex:0 0 46px;

	border-radius:13px;

	background:#4f46e5;

	color:#fff;

	font-size:24px;
	font-weight:700;
}

.download-card h2{
	color:#fff;

	font-size:18px;
	line-height:1.4;
}

.download-card p{
	margin-top:4px;

	color:#94a3b8;

	font-size:12px;
}

.download-card p span{
	margin:0 5px;

	color:#475569;
}

.download-button{
	display:inline-flex;
	align-items:center;
	justify-content:center;
	gap:8px;

	padding:12px 20px;

	flex-shrink:0;

	border-radius:12px;

	background:#6366f1;

	color:#fff;

	font-size:14px;
	font-weight:700;

	box-shadow:
	0 8px 25px rgba(99,102,241,.25);

	transition:
	transform .2s ease,
	background .2s ease;
}

.download-button:hover{
	background:#818cf8;
	transform:translateY(-2px);
}

.download-button span{
	font-size:18px;
}


/* =========================
   SCREENSHOTS
========================= */

.apk-screenshots{
	display:grid;

	grid-template-columns:
	repeat(auto-fit,minmax(180px,1fr));

	gap:15px;
}

.screenshot-card{
	display:block;

	overflow:hidden;

	border-radius:15px;

	background:#020617;

	border:1px solid rgba(148,163,184,.12);

	transition:
	transform .2s ease,
	border-color .2s ease;
}

.screenshot-card:hover{
	transform:translateY(-3px);

	border-color:
	rgba(99,102,241,.55);
}

.screenshot-card img{
	width:100%;

	display:block;

	aspect-ratio:9/16;

	object-fit:cover;
}


/* =========================
   MOBILE
========================= */

@media(max-width:700px){

	.apk-hero{
		align-items:flex-start;
		padding:20px;

		gap:16px;
	}

	.apk-icon{
		width:82px;
		height:82px;
		flex-basis:82px;

		border-radius:19px;
	}

	.apk-icon-placeholder span{
		font-size:19px;
	}

	.apk-hero h1{
		font-size:25px;
	}

	.apk-subtitle{
		font-size:13px;
	}

	.apk-meta-mini{
		gap:6px 12px;
	}

	.apk-section{
		padding:19px;

		border-radius:18px;
	}

	.apk-info-grid{
		grid-template-columns:1fr;
	}

	.apk-info-item{
		grid-template-columns:
			115px minmax(0,1fr);

		padding:13px;
	}

	.download-card{
		align-items:stretch;
		flex-direction:column;

		padding:19px;
	}

	.download-button{
		width:100%;
	}

	.apk-screenshots{
		grid-template-columns:
			repeat(2,minmax(0,1fr));

		gap:10px;
	}

}

@media(max-width:420px){

	.apk-hero{
		flex-direction:column;
	}

	.apk-hero h1{
		font-size:24px;
	}

	.apk-info-item{
		grid-template-columns:1fr;
		gap:3px;
	}

}

</style>


<div class="apk-page">

	${breadcrumb}


	<!-- APP HERO -->

	<section class="apk-hero">

		${iconHTML}

		<div class="apk-hero-info">

			<span class="apk-category">
				${escapeHTML(category)}
			</span>

			<h1>
				${escapeHTML(title)}
			</h1>

			<p class="apk-subtitle">
				${escapeHTML(description)}
			</p>

			<div class="apk-meta-mini">

				<span>
					▣ ${escapeHTML(version)}
				</span>

				<span>
					● ${escapeHTML(size)}
				</span>

				<span>
					♟ ${escapeHTML(developer)}
				</span>

			</div>

		</div>

	</section>


	<!-- DESCRIPTION -->

	<section class="apk-section">

		<div class="section-heading">

			<span class="section-icon">
				ℹ
			</span>

			<div>

				<h2>
					Tentang ${escapeHTML(name)}
				</h2>

				<p>
					Informasi dan deskripsi aplikasi
				</p>

			</div>

		</div>

		<div class="apk-description">

			<p>
				${escapeHTML(description)}
			</p>

		</div>

	</section>


	<!-- INFORMATION -->

	<section class="apk-section">

		<div class="section-heading">

			<span class="section-icon">
				⚙
			</span>

			<div>

				<h2>
					Informasi Aplikasi
				</h2>

				<p>
					Detail ${escapeHTML(name)}
				</p>

			</div>

		</div>

		<div class="apk-info-grid">

			<div class="apk-info-item">
				<strong>Versi</strong>
				<span>${escapeHTML(version)}</span>
			</div>

			<div class="apk-info-item">
				<strong>Ukuran</strong>
				<span>${escapeHTML(size)}</span>
			</div>

			<div class="apk-info-item">
				<strong>Developer</strong>
				<span>${escapeHTML(developer)}</span>
			</div>

			<div class="apk-info-item">
				<strong>Kategori</strong>
				<span>${escapeHTML(category)}</span>
			</div>

			<div class="apk-info-item">
				<strong>Package Name</strong>
				<span>${escapeHTML(packageName)}</span>
			</div>

			<div class="apk-info-item">
				<strong>Diperbarui</strong>
				<span>${escapeHTML(updated)}</span>
			</div>

		</div>

	</section>


	<!-- DOWNLOAD -->

	${downloadHTML}


	<!-- SCREENSHOTS -->

	${screenshotHTML}

</div>

`
		});

	} catch (error) {

		return new Response(
			"Error: " + error.message,
			{
				status: 500,
				headers: {
					"Content-Type":
						"text/plain; charset=UTF-8"
				}
			}
		);

	}
}

