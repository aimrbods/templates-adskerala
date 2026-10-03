import { SITE, escapeHTML, url } from "./config";

export function layout({
	title = SITE.name,
	description = SITE.description,
	canonical = "/",
	image = "",
	content = "",
	schema = "",
	robots = ""
} = {}) {

	const canonicalUrl = url(canonical);

	const ogImage = image
		? (/^https?:\/\//i.test(image) ? image : url(image))
		: url(SITE.defaultImage);

	return new Response(`<!DOCTYPE html>
<html lang="id">

<head>

<meta charset="UTF-8">

<meta
	name="viewport"
	content="width=device-width,initial-scale=1"
>

<title>${escapeHTML(title)}</title>

<meta
	name="description"
	content="${escapeHTML(description)}"
>

<meta
	name="robots"
	content="${robots || "index,follow,max-image-preview:large"}"
>

<link
	rel="canonical"
	href="${escapeHTML(canonicalUrl)}"
>

<meta
	name="theme-color"
	content="#020617"
>

<meta
	name="author"
	content="${escapeHTML(SITE.name)}"
>

<!-- OPEN GRAPH -->

<meta
	property="og:type"
	content="website"
>

<meta
	property="og:site_name"
	content="${escapeHTML(SITE.name)}"
>

<meta
	property="og:title"
	content="${escapeHTML(title)}"
>

<meta
	property="og:description"
	content="${escapeHTML(description)}"
>

<meta
	property="og:url"
	content="${escapeHTML(canonicalUrl)}"
>

<meta
	property="og:image"
	content="${escapeHTML(ogImage)}"
>

<!-- TWITTER -->

<meta
	name="twitter:card"
	content="summary_large_image"
>

<meta
	name="twitter:title"
	content="${escapeHTML(title)}"
>

<meta
	name="twitter:description"
	content="${escapeHTML(description)}"
>

<meta
	name="twitter:image"
	content="${escapeHTML(ogImage)}"
>

<link
	rel="alternate"
	type="application/rss+xml"
	title="${escapeHTML(SITE.name)}"
	href="${url("/rss.xml")}"
>

${schema || ""}

<style>

:root{
	--bg:#020617;
	--card:#0f172a;
	--text:#e5e7eb;
	--muted:#94a3b8;
	--primary:#6366f1;
	--border:#1e293b;
	--shadow:0 10px 30px rgba(0,0,0,.30);
}

*{
	box-sizing:border-box;
	margin:0;
	padding:0;
}

html{
	scroll-behavior:smooth;
}

body{
	font-family:
	Inter,
	Arial,
	sans-serif;

	background:
	radial-gradient(
		circle at top left,
		rgba(99,102,241,.12),
		transparent 30%
	),
	radial-gradient(
		circle at bottom right,
		rgba(139,92,246,.10),
		transparent 30%
	),
	var(--bg);

	color:var(--text);
	line-height:1.7;

	-webkit-font-smoothing:antialiased;
}

a{
	color:inherit;
	text-decoration:none;
}

img{
	display:block;
	max-width:100%;
	height:auto;
}

/* HEADER */

.header{
	position:sticky;
	top:0;
	z-index:999;

	backdrop-filter:blur(16px);

	background:
		rgba(2,6,23,.82);

	border-bottom:
		1px solid rgba(255,255,255,.06);
}

.header-wrap{
	max-width:1200px;
	margin:auto;

	padding:15px 20px;

	display:flex;
	align-items:center;
	justify-content:space-between;

	gap:20px;
}

.logo{
	font-size:22px;
	font-weight:800;
	color:#fff;
}

.logo span{
	background:
	linear-gradient(
		90deg,
		#8b5cf6,
		#06b6d4
	);

	-webkit-background-clip:text;
	-webkit-text-fill-color:transparent;
}

.nav{
	display:flex;
	gap:20px;
}

.nav a{
	font-size:14px;
	color:var(--muted);

	transition:.2s;
}

.nav a:hover{
	color:#fff;
}

/* CONTAINER */

.container{
	max-width:1100px;
	margin:auto;
	padding:30px 20px;
}

/* HERO */

.hero{
	padding:20px 0 30px;
}

.hero-box{
	position:relative;
	overflow:hidden;

	padding:55px 30px;

	border-radius:26px;

	text-align:center;

	background:
	linear-gradient(
		135deg,
		#4f46e5,
		#7c3aed
	);

	box-shadow:
	0 20px 60px
	rgba(79,70,229,.30);
}

.hero-box h1{
	font-size:46px;
	line-height:1.15;

	margin-bottom:16px;

	color:#fff;
}

.hero-box p{
	max-width:760px;
	margin:auto;

	font-size:17px;
	color:#e0e7ff;
}

.hero-badge{
	display:inline-block;

	margin-bottom:16px;

	padding:7px 13px;

	border-radius:999px;

	background:
	rgba(255,255,255,.14);

	font-size:12px;
	font-weight:700;

	color:#fff;
}

/* SECTION */

.section{
	padding:10px 0 40px;
}

.section-title{
	margin-bottom:20px;
}

.section-title h2{
	font-size:27px;
	color:#fff;
}

.section-title p{
	margin-top:6px;
	font-size:14px;
	color:var(--muted);
}

/* SEO BOX */

.seo-box{
	margin-bottom:30px;
	padding:24px;

	border-radius:22px;

	background:
	rgba(255,255,255,.025);

	border:
	1px solid rgba(255,255,255,.06);

	box-shadow:var(--shadow);
}

.seo-box h2{
	margin-bottom:10px;
	font-size:23px;
	color:#fff;
}

.seo-box p{
	margin:10px 0;
	color:#cbd5e1;
}

/* GRID */

.grid{
	display:grid;

	grid-template-columns:
	repeat(
		auto-fit,
		minmax(240px,1fr)
	);

	gap:20px;
}

/* CARD */

.card{
	overflow:hidden;

	border-radius:20px;

	background:
	linear-gradient(
		180deg,
		rgba(255,255,255,.035),
		rgba(255,255,255,.015)
	);

	border:
	1px solid var(--border);

	box-shadow:var(--shadow);

	transition:
		transform .2s ease,
		border-color .2s ease;
}

.card:hover{
	transform:translateY(-5px);

	border-color:
	rgba(99,102,241,.55);
}

.thumb{
	width:100%;

	aspect-ratio:16/9;

	display:flex;
	align-items:center;
	justify-content:center;

	overflow:hidden;

	background:#111827;
}

.thumb img{
	width:100%;
	height:100%;

	object-fit:contain;
}

.body{
	padding:16px;
}

.badge{
	display:inline-block;

	margin-bottom:10px;

	padding:5px 10px;

	border-radius:999px;

	background:#312e81;

	color:#c7d2fe;

	font-size:11px;
	font-weight:700;
}

.card h3{
	font-size:18px;
	line-height:1.45;

	color:#f8fafc;
}

.card p{
	margin-top:8px;

	font-size:14px;

	color:var(--muted);

	display:
	-webkit-box;

	-webkit-line-clamp:3;
	-webkit-box-orient:vertical;

	overflow:hidden;
}

/* APP DETAIL */

.app-detail{
	margin-bottom:30px;
}

.app-header{
	display:flex;
	align-items:center;

	gap:25px;

	padding:28px;

	border-radius:24px;

	background:
	rgba(255,255,255,.025);

	border:
	1px solid var(--border);

	box-shadow:var(--shadow);
}

.app-icon{
	width:128px;
	height:128px;

	flex-shrink:0;

	border-radius:24px;

	overflow:hidden;

	background:#111827;
}

.app-icon img{
	width:100%;
	height:100%;

	object-fit:cover;
}

.icon-placeholder{
	width:100%;
	height:100%;

	display:flex;
	align-items:center;
	justify-content:center;

	font-weight:800;

	color:#fff;
}

.app-info h1{
	font-size:36px;
	line-height:1.2;

	margin:8px 0 10px;

	color:#fff;
}

.app-info p{
	color:#cbd5e1;
	max-width:700px;
}

/* DOWNLOAD */

.download-btn{
	display:inline-block;

	margin-top:20px;

	padding:12px 20px;

	border-radius:12px;

	background:#4f46e5;

	color:#fff;

	font-size:14px;
	font-weight:700;

	transition:.2s;
}

.download-btn:hover{
	background:#6366f1;

	transform:translateY(-1px);
}

/* APP TABLE */

.app-table{
	display:grid;

	gap:0;

	border:
	1px solid var(--border);

	border-radius:16px;

	overflow:hidden;
}

.app-table div{
	display:grid;

	grid-template-columns:180px 1fr;

	padding:13px 15px;

	border-bottom:
	1px solid var(--border);
}

.app-table div:last-child{
	border-bottom:0;
}

.app-table strong{
	color:#fff;
}

.app-table span{
	color:#cbd5e1;
}

/* SCREENSHOTS */

.screenshots{
	display:grid;

	grid-template-columns:
	repeat(
		auto-fit,
		minmax(180px,1fr)
	);

	gap:16px;
}

.screenshots img{
	width:100%;

	border-radius:16px;

	border:
	1px solid var(--border);

	background:#111827;
}

/* BREADCRUMB */

.breadcrumb{
	margin-bottom:22px;

	font-size:14px;

	color:var(--muted);
}

.breadcrumb a{
	color:#a5b4fc;
}

/* FOOTER */

.footer{
	margin-top:50px;

	padding:45px 20px;

	border-top:
	1px solid rgba(255,255,255,.06);

	background:
	rgba(255,255,255,.02);
}

.footer-wrap{
	max-width:1100px;

	margin:auto;

	display:grid;

	grid-template-columns:
	2fr 1fr 1fr;

	gap:35px;
}

.footer h3{
	font-size:22px;

	color:#fff;

	margin-bottom:10px;
}

.footer h4{
	margin-bottom:12px;

	color:#fff;
}

.footer p,
.footer a{
	font-size:14px;

	color:var(--muted);
}

.footer-menu{
	display:flex;
	flex-direction:column;

	gap:8px;
}

.footer a:hover{
	color:#fff;
}

.footer-bottom{
	max-width:1100px;

	margin:35px auto 0;

	padding-top:18px;

	border-top:
	1px solid rgba(255,255,255,.06);

	text-align:center;

	font-size:13px;

	color:var(--muted);
}

/* MOBILE */

@media(max-width:768px){

	.container{
		padding:22px 14px;
	}

	.nav{
		display:none;
	}

	.hero-box{
		padding:40px 20px;
		border-radius:22px;
	}

	.hero-box h1{
		font-size:32px;
	}

	.hero-box p{
		font-size:15px;
	}

	.grid{
		grid-template-columns:1fr;
	}

	.app-header{
		flex-direction:column;

		align-items:flex-start;

		padding:22px;
	}

	.app-info h1{
		font-size:30px;
	}

	.app-table div{
		grid-template-columns:1fr;

		gap:4px;
	}

	.footer-wrap{
		grid-template-columns:1fr;
	}

}


/* CURATED COLLECTION UI */
body{--bg:#f7f8fc;--card:#fff;--text:#15182b;--muted:#6f7890;--primary:#5b5bf7;--border:#e7e9f2;--shadow:0 12px 34px rgba(29,36,74,.07);background:radial-gradient(ellipse at 82% 7%,rgba(117,103,255,.12),transparent 30%),#f7f8fc;color:#15182b;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.55}
.header{background:rgba(250,251,255,.86);border-bottom:1px solid #e8eaf2}.header-wrap{max-width:1200px;padding:17px 24px}.logo{color:#17192c;font-size:20px;letter-spacing:-.7px}.logo span{background:linear-gradient(100deg,#5558f7,#a34df1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.nav{gap:26px}.nav a{color:#6f7890}.nav a:hover{color:#5558f7}
.container{max-width:1200px;padding:24px}
.templates-hero{min-height:400px;display:grid;grid-template-columns:1.1fr .9fr;gap:28px;align-items:center;padding:50px 0 42px}.hero-copy{position:relative;z-index:2}.hero-eyebrow,.section-eyebrow{display:inline-flex;align-items:center;gap:8px;color:#5558e9;font-size:10px;font-weight:800;letter-spacing:1.5px}.hero-eyebrow{padding:8px 12px;border-radius:999px;background:#ececff;letter-spacing:.8px}.eyebrow-dot{width:7px;height:7px;border-radius:50%;background:#6263f6;box-shadow:0 0 0 4px #6263f61c}.templates-hero h1{font-size:clamp(39px,5vw,61px);line-height:1.06;letter-spacing:-2.8px;margin:21px 0 17px;color:#15182b}.gradient-text{background:linear-gradient(100deg,#535bf6,#a34eea);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.hero-description{max-width:560px;color:#69748c;font-size:15px;line-height:1.8;margin-bottom:22px}.template-search{display:flex;align-items:center;gap:10px;padding:6px;border:1px solid #e3e6f0;border-radius:15px;background:#fff;box-shadow:0 10px 28px rgba(31,39,80,.06);max-width:590px}.search-symbol{padding-left:9px;font-size:25px;color:#8a93a8}.template-search input{flex:1;min-width:0;border:0;outline:0;background:transparent;padding:10px 2px;color:#20243a;font-size:13px}.template-search button,.no-results button{border:0;border-radius:10px;padding:11px 15px;background:#17192b;color:white;font-size:12px;font-weight:700}.hero-benefits{display:flex;gap:19px;flex-wrap:wrap;margin-top:17px;color:#788198;font-size:11px}.hero-benefits span:first-letter{color:#5c5df4}
.hero-art{position:relative;min-height:330px;display:grid;place-items:center;overflow:hidden}.hero-art-glow{position:absolute;width:85%;height:78%;border-radius:44% 56% 62% 38%;transform:rotate(-11deg);background:linear-gradient(135deg,#e7e8ff,#f4eaff)}.floating-window{position:absolute;border:1px solid rgba(255,255,255,.9);border-radius:14px;box-shadow:0 25px 60px rgba(31,31,82,.16);overflow:hidden}.window-back{width:60%;height:190px;right:2%;top:13%;transform:rotate(7deg);background:#fff;padding:15px}.window-front{width:62%;height:225px;left:6%;top:22%;transform:rotate(-5deg);background:#15182b;padding:16px;color:#fff}.window-dots{display:flex;gap:4px}.window-dots i{width:5px;height:5px;background:#d8dbe8;border-radius:50%}.window-skeleton{height:7px;width:58%;background:#e9ebf4;border-radius:5px;margin-top:10px}.window-skeleton.wide{width:85%;height:10px;margin-top:18px}.window-skeleton.short{width:42%;background:#444866}.window-blocks{display:flex;gap:7px;margin-top:16px}.window-blocks i{height:56px;flex:1;border-radius:7px;background:linear-gradient(135deg,#e6e7ff,#b9b9ff)}.window-head{display:flex;align-items:center;justify-content:space-between;font-size:8px;color:#c3c7e1;letter-spacing:1px}.window-logo{display:grid;place-items:center;width:23px;height:23px;border-radius:7px;background:linear-gradient(135deg,#8d83ff,#5c55e9);color:#fff;font-size:13px}.window-abstract{width:92px;height:82px;position:absolute;right:14px;top:62px;border-radius:20px 45px 18px 40px;transform:rotate(25deg);background:linear-gradient(140deg,#a5a0ff,#5354ed);box-shadow:inset -15px -13px 24px #28269b66}.window-front .window-skeleton.wide{margin-top:24px;background:#373c58}.window-cta{width:62px;height:19px;border-radius:6px;background:#6d68fa;margin-top:16px}.hero-sticker{position:absolute;right:0;bottom:12%;z-index:4;padding:13px 17px;border-radius:13px;background:#fff;box-shadow:0 10px 30px #2324501b;color:#626b82;font-size:11px;transform:rotate(6deg)}.hero-sticker b{font-size:14px;color:#262947}
.collection-section{padding:18px 0 36px;scroll-margin-top:90px}.collection-heading{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:20px}.collection-heading h2{font-size:27px;letter-spacing:-.9px;color:#17192b;margin:7px 0 3px}.collection-heading p{font-size:13px;color:#7a8298}.collection-count{white-space:nowrap;padding:7px 11px;border:1px solid #e5e7f0;border-radius:999px;background:#fff;color:#737c94;font-size:11px}.category-bar{display:flex;gap:9px;overflow-x:auto;padding:2px 1px 18px;scrollbar-width:thin}.category-chip{white-space:nowrap;border:1px solid #e5e7f0;background:#fff;color:#717a91;border-radius:11px;padding:10px 15px;font-size:11px;font-weight:650;transition:.2s}.category-chip:hover,.category-chip.is-active{color:#fff;background:linear-gradient(110deg,#5b5cf6,#7771fa);border-color:transparent;box-shadow:0 6px 14px #5558f626}
.template-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:19px}.template-card{min-width:0;overflow:hidden;border:1px solid #e6e8f1;border-radius:17px;background:#fff;box-shadow:0 5px 18px rgba(30,39,80,.035);transition:transform .2s,box-shadow .2s}.template-card:hover{transform:translateY(-4px);box-shadow:0 15px 35px rgba(30,39,80,.1)}.template-card[hidden]{display:none}.template-card-link{display:block}.template-preview{height:205px;position:relative;overflow:hidden;padding:16px;background:linear-gradient(145deg,#15182b,#292b59);color:#fff}.template-card:nth-child(3n+2) .template-preview{background:linear-gradient(145deg,#f1f0eb,#dfe2ea);color:#24263a}.template-card:nth-child(3n+3) .template-preview{background:linear-gradient(145deg,#173b35,#091c1b)}.preview-top{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:9px}.preview-brand{display:flex;align-items:center;gap:6px;min-width:0}.preview-brand img{width:20px;height:20px;object-fit:cover;border-radius:6px;background:#fff}.preview-brand b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.template-placeholder{width:20px;height:20px;display:grid;place-items:center;border-radius:6px;background:linear-gradient(135deg,#8884ff,#4e4fe5);color:white;font-size:11px;font-weight:800}.preview-pill{padding:5px 8px;border:1px solid currentColor;border-radius:999px;opacity:.7;font-size:8px}.preview-copy{position:relative;z-index:2;max-width:76%;margin-top:30px}.preview-kicker{font-size:8px;letter-spacing:1.5px;text-transform:uppercase;opacity:.7}.preview-copy h3{font-size:23px;line-height:1.1;letter-spacing:-.7px;margin:8px 0;color:inherit;overflow-wrap:anywhere}.preview-copy p{font-size:9px;line-height:1.5;opacity:.72;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:inherit}.preview-orb{position:absolute;width:130px;height:130px;right:-26px;bottom:-38px;border-radius:35px;transform:rotate(30deg);background:linear-gradient(140deg,#a8a3ff,#5555e9);box-shadow:inset -18px -18px 25px #25239b55}.template-card:nth-child(3n+2) .preview-orb{background:linear-gradient(140deg,#fff,#a9b0c2);border-radius:50%}.template-card:nth-child(3n+3) .preview-orb{background:linear-gradient(140deg,#a1ddc4,#347b69);border-radius:50% 20% 50% 20%}.preview-bottom{position:absolute;bottom:12px;left:16px;z-index:2;font-size:7px;letter-spacing:1.2px;opacity:.5}.template-card-body{padding:15px 16px 17px}.template-title-row{display:flex;align-items:center;justify-content:space-between;gap:10px}.template-category{font-size:9px;font-weight:700;color:#5b5ce9;background:#efefff;border-radius:999px;padding:5px 9px}.template-arrow{color:#777e95;font-size:15px}.template-card-body h3{font-size:16px;line-height:1.4;color:#202239;margin:10px 0 5px;overflow-wrap:anywhere}.template-card-body p{font-size:12px;line-height:1.65;color:#7a8298;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:0 0 13px}.details-link{font-size:11px;color:#5658ee;font-weight:750}.details-link span{margin-left:5px;transition:margin .2s}.template-card:hover .details-link span{margin-left:9px}
.empty-state,.no-results{grid-column:1/-1;text-align:center;padding:45px 20px;border:1px dashed #d9dced;border-radius:17px;background:#fff;color:#778098}.empty-state h3,.no-results h3{font-size:18px;color:#272a42;margin:8px 0}.empty-state p,.no-results p{font-size:13px;margin:0 0 16px}.empty-icon,.no-results>span{font-size:25px;color:#6565f5}.no-results[hidden]{display:none}
.submit-banner{margin:38px 0 20px;padding:28px 30px;display:flex;align-items:center;gap:19px;border-radius:21px;background:radial-gradient(circle at 83% 0%,#4b438b,transparent 35%),linear-gradient(120deg,#17192c,#252449);color:#fff}.submit-banner-mark{width:48px;height:48px;flex:0 0 auto;display:grid;place-items:center;border-radius:14px;background:#ffffff18;color:#c9c5ff;font-size:25px}.submit-banner-copy{flex:1}.submit-banner .section-eyebrow{color:#bcb9ff}.submit-banner h2{font-size:21px;letter-spacing:-.5px;margin:5px 0}.submit-banner p{font-size:12px;color:#c1c5d8}.submit-banner-button{display:inline-flex;align-items:center;gap:15px;padding:12px 16px;border-radius:11px;background:#fff;color:#1b1c32;font-size:11px;font-weight:800;white-space:nowrap}.submit-banner-button span{font-size:16px}
.footer{margin-top:25px;padding:34px 20px 22px;background:#fff;border-top:1px solid #e8eaf2}.footer-wrap{max-width:1152px}.footer h3,.footer h4{color:#22243b}.footer p,.footer a{color:#798198}.footer-bottom{color:#9299ab;border-color:#eceef5}
@media(max-width:850px){.templates-hero{grid-template-columns:1fr .75fr;gap:12px}.templates-hero h1{font-size:44px}.hero-art{min-height:285px}.template-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.preview-copy h3{font-size:20px}.submit-banner{flex-wrap:wrap}.submit-banner-button{margin-left:67px}}
@media(max-width:620px){.header-wrap{padding:14px 16px}.container{padding:18px 16px}.logo{font-size:18px}.templates-hero{grid-template-columns:1fr;padding:35px 0 25px}.templates-hero h1{font-size:clamp(38px,10vw,50px);letter-spacing:-2px}.hero-description{font-size:13px}.hero-art{min-height:270px;margin-top:4px}.window-front{left:8%;width:65%}.window-back{right:4%;width:59%}.collection-heading{align-items:start}.collection-heading h2{font-size:23px}.collection-heading p{font-size:12px}.template-grid{gap:12px}.template-preview{height:155px;padding:12px}.preview-copy{margin-top:22px}.preview-copy h3{font-size:16px}.preview-orb{width:100px;height:100px;right:-30px;bottom:-25px}.preview-bottom{left:12px;bottom:9px;font-size:6px}.template-card-body{padding:12px}.template-card-body h3{font-size:13px}.template-card-body p{font-size:10px}.template-category{font-size:8px}.submit-banner{padding:22px;gap:13px}.submit-banner-mark{width:40px;height:40px}.submit-banner h2{font-size:18px}.submit-banner-button{margin-left:53px}.footer-wrap{grid-template-columns:1fr;gap:22px}}
@media(max-width:390px){.template-grid{grid-template-columns:1fr}.template-preview{height:190px}.preview-copy h3{font-size:22px}.template-card-body h3{font-size:15px}.template-card-body p{font-size:12px}.hero-benefits{gap:10px;font-size:10px}.template-search button{padding:10px}.submit-banner-button{margin-left:0}}

</style>

</head>

<body>

<header class="header">

	<div class="header-wrap">

		<a href="/" class="logo">
			⚡ <span>${escapeHTML(SITE.name)}</span>
		</a>

		<nav class="nav">

			<a href="/">
				Home
			</a>

			<a href="/kategori/">
				Kategori
			</a>

			<a href="/tentang">
				Tentang
			</a>

			<a href="/contact">
				Contact
			</a>

		</nav>

	</div>

</header>

<main class="container">

${content}

</main>

<footer class="footer">

	<div class="footer-wrap">

		<div>

			<h3>
				⚡ ${escapeHTML(SITE.name)}
			</h3>

			<p>
				A curated collection to inspire your next project.
				Explore ideas, discover resources, and create something great.
			</p>

		</div>

		<div class="footer-menu">

			<h4>
				Navigasi
			</h4>

			<a href="/">
				Home
			</a>

			<a href="/kategori/">
				Kategori
			</a>

			<a href="/tentang">
				Tentang
			</a>

			<a href="/contact">
				Contact
			</a>

		</div>

		<div class="footer-menu">

			<h4>
				Informasi
			</h4>

			<a href="/privacy-policy">
				Privacy Policy
			</a>

			<a href="/terms">
				Terms
			</a>

			<a href="/disclaimer">
				Disclaimer
			</a>

		</div>

	</div>

	<div class="footer-bottom">

		© ${new Date().getFullYear()}
		${escapeHTML(SITE.name)}
		• All Rights Reserved

	</div>

</footer>

</body>

</html>`, {
		status: 200,
		headers: {
			"content-type":
				"text/html;charset=UTF-8",

			"cache-control":
				"public,max-age=300"
		}
	});
}
