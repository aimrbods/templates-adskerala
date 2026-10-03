const SUBMIT_API =
	"https://script.google.com/macros/s/AKfycbxYhbQZ1FPidOVedmVQeegUk2pZA888NNoBk2qLKF819L1sZ722qmYRHu5834bCTSR6/exec";


export async function onRequest(context) {

	if (context.request.method === "GET") {
		return renderPage();
	}

	if (context.request.method === "POST") {
		return submitAPK(context);
	}

	return new Response(
		"Method Not Allowed",
		{
			status: 405,
			headers: {
				"Allow": "GET, POST"
			}
		}
	);
}


/* =========================
   SUBMIT APK
========================= */

async function submitAPK(context) {

	try {

		const form =
			await context.request.formData();


		/*
		 * FIELD HARUS SAMA DENGAN
		 * STRUKTUR SHEET
		 */

		const data = {

			slug:
				String(
					form.get("slug") || ""
				).trim(),

			name:
				String(
					form.get("name") || ""
				).trim(),

			title:
				String(
					form.get("title") || ""
				).trim(),

			description:
				String(
					form.get("description") || ""
				).trim(),

			version:
				String(
					form.get("version") || ""
				).trim(),

			size:
				String(
					form.get("size") || ""
				).trim(),

			developer:
				String(
					form.get("developer") || ""
				).trim(),

			category:
				String(
					form.get("category") || ""
				).trim(),

			package_name:
				String(
					form.get("package_name") || ""
				).trim(),

			updated:
				String(
					form.get("updated") || ""
				).trim(),

			apk_file:
				String(
					form.get("apk_file") || ""
				).trim(),

			icon:
				String(
					form.get("icon") || ""
				).trim(),

			screenshots:
				String(
					form.get("screenshots") || ""
				).trim(),

			status:
				"pending"

		};


		/*
		 * =========================
		 * VALIDASI
		 * =========================
		 */

		if (!data.name) {

			return renderPage(
				"Nama aplikasi wajib diisi.",
				data
			);

		}


		if (!data.title) {

			return renderPage(
				"Judul aplikasi wajib diisi.",
				data
			);

		}


		if (!data.description) {

			return renderPage(
				"Deskripsi aplikasi wajib diisi.",
				data
			);

		}


		if (!data.category) {

			return renderPage(
				"Kategori wajib dipilih.",
				data
			);

		}


		/*
		 * =========================
		 * SLUG OTOMATIS
		 * =========================
		 */

		data.slug =
			sanitizeSlug(
				data.slug ||
				data.name
			);


		if (!data.slug) {

			return renderPage(
				"Slug aplikasi tidak valid.",
				data
			);

		}


		/*
		 * =========================
		 * UPDATED OTOMATIS
		 * =========================
		 */

		if (!data.updated) {

			data.updated =
				new Date()
					.toISOString()
					.slice(0, 10);

		}


		/*
		 * =========================
		 * KIRIM KE APPS SCRIPT
		 * =========================
		 */

		const response =
			await fetch(
				SUBMIT_API,
				{

					method:
						"POST",

					headers: {

						"content-type":
							"application/json",

						"accept":
							"application/json"

					},

					body:
						JSON.stringify(data)

				}
			);


		let result = {};


		try {

			result =
				await response.json();

		} catch {

			result = {};

		}


		/*
		 * =========================
		 * RESPONSE ERROR
		 * =========================
		 */

		if (
			!response.ok ||
			result.success === false
		) {

			return renderPage(

				result.error ||
				"Gagal mengirim data aplikasi.",

				data

			);

		}


		/*
		 * =========================
		 * SUCCESS
		 * =========================
		 */

		return renderPage(
			"",
			{},
			true
		);


	} catch (error) {

		return renderPage(

			"Gagal mengirim data: " +
			(
				error?.message ||
				"Kesalahan tidak diketahui"
			),

			{}

		);

	}

}


/* =========================
   PAGE
========================= */

function renderPage(
	error = "",
	data = {},
	success = false
) {

	const safe = value =>
		escapeHTML(value || "");


	const categories = [

		"Tools",
		"Games",
		"Social",
		"Entertainment",
		"Productivity",
		"Education",
		"Photography",
		"Music",
		"Video",
		"Communication",
		"Business",
		"Other"

	];


	const categoryOptions =
		categories
			.map(category => {

				const selected =
					data.category === category
						? " selected"
						: "";

				return `
					<option
						value="${safe(category)}"
						${selected}
					>
						${safe(category)}
					</option>
				`;

			})
			.join("");


	const alertHTML =
		success

			? `
				<div class="alert success">

					<div class="alert-icon">
						✓
					</div>

					<div>

						<strong>
							Berhasil dikirim
						</strong>

						<p>
							Data aplikasi telah diterima
							dan akan diperiksa sebelum
							dipublikasikan.
						</p>

					</div>

				</div>
			`

			: error

				? `
					<div class="alert error">

						<div class="alert-icon">
							!
						</div>

						<div>

							<strong>
								Gagal mengirim
							</strong>

							<p>
								${safe(error)}
							</p>

						</div>

					</div>
				`

				: "";


	const content =
		success

			? `

				<div class="success-page">

					<div class="success-circle">
						✓
					</div>

					<h1>
						APK Berhasil Dikirim
					</h1>

					<p>
						Data aplikasi sudah kami terima.
					</p>

					<p class="muted">
						Aplikasi akan diperiksa terlebih
						dahulu sebelum ditampilkan
						di direktori.
					</p>

					<div class="success-actions">

						<a
							href="/"
							class="btn primary"
						>
							Kembali ke Home
						</a>

						<a
							href="/submit-apk"
							class="btn secondary"
						>
							Submit APK Lain
						</a>

					</div>

				</div>

			`

			: `

				<form
					method="POST"
					class="submit-form"
				>


					<!-- =====================
					     INFORMASI APLIKASI
					===================== -->

					<div class="form-section">

						<div class="section-heading">

							<span>
								01
							</span>

							<div>

								<h2>
									Informasi Aplikasi
								</h2>

								<p>
									Informasi dasar aplikasi
									Android yang ingin dikirim.
								</p>

							</div>

						</div>


						<div class="form-grid">


							<div class="field">

								<label for="name">
									Nama Aplikasi
									<span>*</span>
								</label>

								<input
									id="name"
									name="name"
									type="text"
									value="${safe(data.name)}"
									placeholder="Contoh App"
									required
								>

							</div>


							<div class="field">

								<label for="title">
									Judul
									<span>*</span>
								</label>

								<input
									id="title"
									name="title"
									type="text"
									value="${safe(data.title)}"
									placeholder="Contoh App APK"
									required
								>

							</div>


							<div class="field full">

								<label for="description">
									Deskripsi
									<span>*</span>
								</label>

								<textarea
									id="description"
									name="description"
									rows="5"
									placeholder="Jelaskan aplikasi secara singkat..."
									required
								>${safe(data.description)}</textarea>

							</div>


						</div>

					</div>


					<!-- =====================
					     DETAIL APK
					===================== -->

					<div class="form-section">

						<div class="section-heading">

							<span>
								02
							</span>

							<div>

								<h2>
									Detail APK
								</h2>

								<p>
									Informasi teknis aplikasi.
								</p>

							</div>

						</div>


						<div class="form-grid">


							<div class="field">

								<label for="version">
									Versi
								</label>

								<input
									id="version"
									name="version"
									type="text"
									value="${safe(data.version)}"
									placeholder="1.0.0"
								>

							</div>


							<div class="field">

								<label for="size">
									Ukuran
								</label>

								<input
									id="size"
									name="size"
									type="text"
									value="${safe(data.size)}"
									placeholder="25 MB"
								>

							</div>


							<div class="field">

								<label for="developer">
									Developer
								</label>

								<input
									id="developer"
									name="developer"
									type="text"
									value="${safe(data.developer)}"
									placeholder="Nama Developer"
								>

							</div>


							<div class="field">

								<label for="category">
									Kategori
									<span>*</span>
								</label>

								<select
									id="category"
									name="category"
									required
								>

									<option value="">
										Pilih kategori
									</option>

									${categoryOptions}

								</select>

							</div>


							<div class="field full">

								<label for="package_name">
									Package Name
								</label>

								<input
									id="package_name"
									name="package_name"
									type="text"
									value="${safe(data.package_name)}"
									placeholder="com.example.app"
								>

							</div>


						</div>

					</div>


					<!-- =====================
					     FILE & MEDIA
					===================== -->

					<div class="form-section">

						<div class="section-heading">

							<span>
								03
							</span>

							<div>

								<h2>
									File & Media
								</h2>

								<p>
									Link file APK dan aset aplikasi.
								</p>

							</div>

						</div>


						<div class="form-grid">


							<div class="field full">

								<label for="apk_file">
									APK File
								</label>

								<input
									id="apk_file"
									name="apk_file"
									type="text"
									value="${safe(data.apk_file)}"
									placeholder="nama-file.apk atau URL"
								>

							</div>


							<div class="field full">

								<label for="icon">
									Icon
								</label>

								<input
									id="icon"
									name="icon"
									type="text"
									value="${safe(data.icon)}"
									placeholder="icon.webp atau URL"
								>

							</div>


							<div class="field full">

								<label for="screenshots">
									Screenshots
								</label>

								<input
									id="screenshots"
									name="screenshots"
									type="text"
									value="${safe(data.screenshots)}"
									placeholder="screen1.webp, screen2.webp"
								>

								<small>
									Pisahkan beberapa file dengan koma.
								</small>

							</div>


						</div>

					</div>


					<!-- =====================
					     SUBMIT
					===================== -->

					<div class="form-footer">

						<p>
							Dengan mengirim formulir ini,
							kamu menyatakan bahwa informasi
							yang diberikan benar dan tidak
							melanggar hak pihak lain.
						</p>

						<button
							type="submit"
							class="btn primary submit-btn"
						>
							Kirim APK
						</button>

					</div>


				</form>

			`;


	const html = `

<!DOCTYPE html>

<html lang="id">

<head>

	<meta charset="UTF-8">

	<meta
		name="viewport"
		content="width=device-width, initial-scale=1"
	>

	<title>
		Submit APK - APK Directory
	</title>

	<meta
		name="description"
		content="Submit aplikasi Android ke APK Directory."
	>

	<meta
		name="robots"
		content="index,follow"
	>

	<link
		rel="canonical"
		href="https://apk.adskerala.com/submit-apk"
	>

	<meta
		name="theme-color"
		content="#020617"
	>


	<style>

		:root{

			--bg:#020617;
			--card:#0f172a;
			--text:#f8fafc;
			--muted:#94a3b8;
			--border:#1e293b;
			--primary:#6366f1;
			--primary2:#8b5cf6;

		}


		*{

			box-sizing:border-box;
			margin:0;
			padding:0;

		}


		body{

			min-height:100vh;

			font-family:
				Inter,
				Arial,
				sans-serif;

			color:var(--text);

			background:

				radial-gradient(
					circle at top left,
					rgba(99,102,241,.14),
					transparent 32%
				),

				radial-gradient(
					circle at bottom right,
					rgba(139,92,246,.10),
					transparent 30%
				),

				var(--bg);

			line-height:1.6;

		}


		a{

			color:inherit;
			text-decoration:none;

		}


		.header{

			position:sticky;
			top:0;
			z-index:20;

			border-bottom:
				1px solid rgba(255,255,255,.06);

			background:
				rgba(2,6,23,.82);

			backdrop-filter:
				blur(16px);

		}


		.header-inner{

			max-width:1050px;
			margin:auto;

			padding:16px 20px;

			display:flex;
			align-items:center;
			justify-content:space-between;

		}


		.logo{

			font-size:21px;
			font-weight:800;

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


		.back{

			color:var(--muted);
			font-size:14px;

		}


		.container{

			max-width:900px;
			margin:auto;

			padding:
				55px 20px 80px;

		}


		.hero{

			text-align:center;
			margin-bottom:38px;

		}


		.badge{

			display:inline-flex;

			padding:6px 12px;
			margin-bottom:16px;

			border-radius:999px;

			background:
				rgba(99,102,241,.12);

			border:
				1px solid rgba(99,102,241,.25);

			color:#c7d2fe;

			font-size:12px;
			font-weight:700;

		}


		.hero h1{

			font-size:
				clamp(32px,5vw,48px);

			line-height:1.1;
			margin-bottom:14px;

		}


		.hero p{

			max-width:650px;
			margin:auto;

			color:var(--muted);
			font-size:16px;

		}


		.alert{

			display:flex;
			gap:14px;

			padding:17px 18px;
			margin-bottom:22px;

			border-radius:16px;

			border:
				1px solid var(--border);

			background:
				rgba(255,255,255,.025);

		}


		.alert.success{

			border-color:
				rgba(34,197,94,.3);

			background:
				rgba(34,197,94,.07);

		}


		.alert.error{

			border-color:
				rgba(239,68,68,.3);

			background:
				rgba(239,68,68,.07);

		}


		.alert-icon{

			width:32px;
			height:32px;

			flex-shrink:0;

			display:flex;
			align-items:center;
			justify-content:center;

			border-radius:50%;

			background:
				rgba(255,255,255,.08);

			font-weight:800;

		}


		.alert p{

			color:var(--muted);
			font-size:14px;

		}


		.submit-form{

			display:grid;
			gap:20px;

		}


		.form-section{

			padding:27px;

			border-radius:22px;

			background:
				linear-gradient(
					180deg,
					rgba(255,255,255,.035),
					rgba(255,255,255,.018)
				);

			border:
				1px solid var(--border);

			box-shadow:
				0 12px 40px rgba(0,0,0,.18);

		}


		.section-heading{

			display:flex;
			gap:14px;

			margin-bottom:25px;

		}


		.section-heading > span{

			width:38px;
			height:38px;

			flex-shrink:0;

			display:flex;
			align-items:center;
			justify-content:center;

			border-radius:12px;

			background:
				rgba(99,102,241,.14);

			color:#a5b4fc;

			font-size:12px;
			font-weight:800;

		}


		.section-heading h2{

			font-size:19px;
			line-height:1.3;

		}


		.section-heading p{

			margin-top:3px;

			color:var(--muted);
			font-size:13px;

		}


		.form-grid{

			display:grid;

			grid-template-columns:
				repeat(2,minmax(0,1fr));

			gap:19px;

		}


		.field{

			min-width:0;

		}


		.field.full{

			grid-column:1/-1;

		}


		label{

			display:block;

			margin-bottom:7px;

			font-size:13px;
			font-weight:700;

			color:#e2e8f0;

		}


		label span{

			color:#f87171;

		}


		input,
		select,
		textarea{

			width:100%;

			border:
				1px solid var(--border);

			border-radius:12px;

			background:
				rgba(2,6,23,.65);

			color:#f8fafc;

			padding:
				12px 14px;

			font:inherit;
			font-size:14px;

			outline:none;

		}


		input,
		select{

			height:46px;

		}


		textarea{

			resize:vertical;
			min-height:110px;

		}


		input::placeholder,
		textarea::placeholder{

			color:#64748b;

		}


		input:focus,
		select:focus,
		textarea:focus{

			border-color:
				rgba(99,102,241,.8);

			box-shadow:
				0 0 0 3px
				rgba(99,102,241,.12);

		}


		small{

			display:block;

			margin-top:6px;

			color:#64748b;
			font-size:12px;

		}


		.form-footer{

			padding:8px 3px;

			display:flex;
			align-items:center;
			justify-content:space-between;

			gap:20px;

		}


		.form-footer p{

			max-width:600px;

			color:#64748b;
			font-size:12px;

		}


		.btn{

			display:inline-flex;

			align-items:center;
			justify-content:center;

			min-height:46px;

			padding:
				11px 20px;

			border-radius:12px;

			font-size:14px;
			font-weight:800;

			cursor:pointer;

		}


		.btn.primary{

			border:0;

			background:
				linear-gradient(
					135deg,
					var(--primary),
					var(--primary2)
				);

			color:#fff;

		}


		.btn.secondary{

			border:
				1px solid var(--border);

			background:
				rgba(255,255,255,.03);

			color:#e2e8f0;

		}


		.submit-btn{

			min-width:150px;

		}


		.success-page{

			padding:55px 25px;

			text-align:center;

			border:
				1px solid var(--border);

			border-radius:24px;

			background:
				rgba(255,255,255,.025);

		}


		.success-circle{

			width:72px;
			height:72px;

			margin:
				0 auto 22px;

			display:flex;
			align-items:center;
			justify-content:center;

			border-radius:50%;

			background:
				rgba(34,197,94,.12);

			border:
				1px solid
				rgba(34,197,94,.3);

			color:#4ade80;

			font-size:32px;
			font-weight:800;

		}


		.success-page h1{

			font-size:30px;
			margin-bottom:10px;

		}


		.success-page p{

			color:#cbd5e1;

		}


		.success-page .muted{

			max-width:500px;
			margin:
				8px auto 0;

			color:var(--muted);
			font-size:14px;

		}


		.success-actions{

			margin-top:28px;

			display:flex;
			justify-content:center;

			gap:10px;
			flex-wrap:wrap;

		}


		.footer{

			padding:
				25px 20px 35px;

			text-align:center;

			color:#64748b;
			font-size:12px;

		}


		@media(max-width:700px){

			.container{

				padding:
					38px 14px 60px;

			}


			.form-section{

				padding:21px 17px;
				border-radius:18px;

			}


			.form-grid{

				grid-template-columns:1fr;

			}


			.field.full{

				grid-column:auto;

			}


			.form-footer{

				flex-direction:column;
				align-items:stretch;

			}


			.submit-btn{

				width:100%;

			}

		}

	</style>

</head>


<body>


	<header class="header">

		<div class="header-inner">

			<a
				href="/"
				class="logo"
			>
				⚡ <span>APK Directory</span>
			</a>

			<a
				href="/"
				class="back"
			>
				← Kembali
			</a>

		</div>

	</header>


	<main class="container">


		<div class="hero">

			<div class="badge">
				APK SUBMISSION
			</div>

			<h1>
				Submit Aplikasi APK
			</h1>

			<p>
				Kirim aplikasi Android kamu ke
				APK Directory. Isi informasi
				aplikasi dengan lengkap.
			</p>

		</div>


		${alertHTML}

		${content}


	</main>


	<footer class="footer">

		© ${new Date().getFullYear()}
		APK Directory
		• All Rights Reserved

	</footer>


</body>

</html>
`;


	return new Response(

		html,

		{

			status:200,

			headers:{

				"content-type":
					"text/html;charset=UTF-8",

				"cache-control":
					"no-store"

			}

		}

	);

}


/* =========================
   SLUG
========================= */

function sanitizeSlug(value = "") {

	return String(value)

		.toLowerCase()

		.trim()

		.replace(
			/[^a-z0-9]+/g,
			"-"
		)

		.replace(
			/^-+|-+$/g,
			""
		)

		.slice(
			0,
			100
		);

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value = "") {

	return String(value)

		.replace(
			/&/g,
			"&amp;"
		)

		.replace(
			/</g,
			"&lt;"
		)

		.replace(
			/>/g,
			"&gt;"
		)

		.replace(
			/"/g,
			"&quot;"
		)

		.replace(
			/'/g,
			"&#039;"
		);

}
