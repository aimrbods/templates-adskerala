const SUBMIT_API =
	"https://script.google.com/macros/s/AKfycbxYhbQZ1FPidOVedmVQeegUk2pZA888NNoBk2qLKF819L1sZ722qmYRHu5834bCTSR6/exec";


export async function onRequestPost(context) {

	try {

		const contentType =
			context.request.headers.get(
				"content-type"
			) || "";


		if (
			!contentType
				.toLowerCase()
				.includes("application/json")
		) {

			return json({
				success: false,
				error:
					"Request harus menggunakan application/json"
			}, 400);

		}


		const body =
			await context.request.json();


		const name =
			clean(body.name);

		const title =
			clean(
				body.title ||
				`${name} APK`
			);

		const slug =
			sanitizeSlug(
				body.slug || name
			);

		const category =
			clean(body.category);

		const icon =
			clean(body.icon);

		const version =
			clean(body.version);

		const size =
			clean(body.size);

		const developer =
			clean(body.developer);

		const packageName =
			clean(body.package_name);

		const description =
			clean(body.description);

		const screenshots =
			clean(body.screenshots);

		const apkFile =
			clean(body.apk_file);

		const submitterName =
			clean(body.submitter_name);

		const submitterEmail =
			clean(body.submitter_email);

		const notes =
			clean(body.notes);


		if (!name) {
			return json({
				success: false,
				error: "Nama aplikasi wajib diisi"
			}, 400);
		}


		if (!slug) {
			return json({
				success: false,
				error: "Slug aplikasi tidak valid"
			}, 400);
		}


		if (!category) {
			return json({
				success: false,
				error: "Kategori wajib diisi"
			}, 400);
		}


		if (!description) {
			return json({
				success: false,
				error: "Deskripsi aplikasi wajib diisi"
			}, 400);
		}


		if (!submitterName) {
			return json({
				success: false,
				error: "Nama pengirim wajib diisi"
			}, 400);
		}


		if (!submitterEmail) {
			return json({
				success: false,
				error: "Email pengirim wajib diisi"
			}, 400);
		}


		if (!isValidEmail(submitterEmail)) {
			return json({
				success: false,
				error: "Format email tidak valid"
			}, 400);
		}


		const id =
			"APK-" +
			Date.now()
				.toString(36)
				.toUpperCase();


		const payload = {

			id,

			slug,

			name,

			title,

			category,

			icon,

			version,

			size,

			developer,

			package_name:
				packageName,

			description,

			screenshots,

			apk_file:
				apkFile,

			updated:
				getDate(),

			/*
			 * Guest post selalu pending.
			 */
			status:
				"pending",

			submitter_name:
				submitterName,

			submitter_email:
				submitterEmail,

			notes,

			created_at:
				new Date().toISOString(),

			reviewed_at:
				""

		};


		const response =
			await fetch(
				SUBMIT_API,
				{
					method: "POST",

					headers: {
						"content-type":
							"application/json",

						"accept":
							"application/json"
					},

					body:
						JSON.stringify(payload)
				}
			);


		if (!response.ok) {

			return json({

				success: false,

				error:
					"Google Apps Script gagal menerima submission",

				status:
					response.status

			}, 502);

		}


		let result = null;

		try {

			result =
				await response.json();

		} catch {

			result = null;

		}


		return json({

			success: true,

			message:
				"APK berhasil dikirim dan sedang menunggu review.",

			id,

			slug,

			status:
				"pending",

			result

		});


	} catch (error) {

		return json({

			success: false,

			error:
				error?.message ||
				"Terjadi kesalahan server"

		}, 500);

	}

}


/*
 * OPTIONS
 */

export async function onRequestOptions() {

	return new Response(
		null,
		{
			status: 204,

			headers: {
				"access-control-allow-origin": "*",
				"access-control-allow-methods":
					"POST, OPTIONS",
				"access-control-allow-headers":
					"Content-Type"
			}
		}
	);

}


/*
 * JSON
 */

function json(
	data,
	status = 200
) {

	return new Response(
		JSON.stringify(
			data,
			null,
			2
		),
		{
			status,

			headers: {
				"content-type":
					"application/json;charset=UTF-8",

				"cache-control":
					"no-store",

				"access-control-allow-origin":
					"*"
			}
		}
	);

}


/*
 * CLEAN
 */

function clean(value = "") {

	return String(value)

		.replace(
			/<[^>]*>/g,
			""
		)

		.replace(
			/\s+/g,
			" "
		)

		.trim()

		.slice(0, 5000);

}


/*
 * SLUG
 */

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

		.slice(0, 100);

}


/*
 * EMAIL
 */

function isValidEmail(email) {

	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		.test(email);

}


/*
 * DATE
 */

function getDate() {

	return new Date()
		.toISOString()
		.slice(0, 10);

}
