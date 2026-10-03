const SUBMIT_API =
	"https://script.google.com/macros/s/AKfycbxYhbQZ1FPidOVedmVQeegUk2pZA888NNoBk2qLKF819L1sZ722qmYRHu5834bCTSR6/exec";


export async function onRequestPost(context) {

	try {

		const request =
			context.request;

		const contentType =
			request.headers.get(
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
			await request.json();


		/*
		 * ========================================
		 * DATA APK
		 * ========================================
		 */

		const name =
			clean(body.name);

		const title =
			clean(body.title);

		const slug =
			sanitizeSlug(
				body.slug || name
			);

		const description =
			clean(body.description);

		const version =
			clean(body.version);

		const size =
			clean(body.size);

		const developer =
			clean(body.developer);

		const category =
			clean(body.category);

		const packageName =
			clean(body.package_name);

		const updated =
			clean(body.updated) ||
			getDate();

		const apkFile =
			clean(body.apk_file);

		const icon =
			clean(body.icon);

		const screenshots =
			clean(body.screenshots);


		/*
		 * ========================================
		 * VALIDASI
		 * ========================================
		 */

		if (!name) {

			return json({

				success: false,

				error:
					"Nama aplikasi wajib diisi"

			}, 400);

		}


		if (!title) {

			return json({

				success: false,

				error:
					"Judul aplikasi wajib diisi"

			}, 400);

		}


		if (!slug) {

			return json({

				success: false,

				error:
					"Slug aplikasi tidak valid"

			}, 400);

		}


		if (!category) {

			return json({

				success: false,

				error:
					"Kategori wajib diisi"

			}, 400);

		}


		if (!description) {

			return json({

				success: false,

				error:
					"Deskripsi aplikasi wajib diisi"

			}, 400);

		}


		/*
		 * ========================================
		 * ID SUBMISSION
		 * ========================================
		 *
		 * ID hanya untuk proses internal.
		 *
		 * Tidak dimasukkan ke kolom Sheet
		 * karena struktur Sheet kamu dimulai
		 * dari slug.
		 */

		const id =
			"APK-" +
			Date.now()
				.toString(36)
				.toUpperCase();


		/*
		 * ========================================
		 * PAYLOAD
		 * ========================================
		 *
		 * HARUS KONSISTEN DENGAN SHEET:
		 *
		 * slug
		 * name
		 * title
		 * description
		 * version
		 * size
		 * developer
		 * category
		 * package_name
		 * updated
		 * apk_file
		 * icon
		 * screenshots
		 * status
		 */

		const payload = {

			slug,

			name,

			title,

			description,

			version,

			size,

			developer,

			category,

			package_name:
				packageName,

			updated,

			apk_file:
				apkFile,

			icon,

			screenshots,

			status:
				"pending"

		};


		/*
		 * ========================================
		 * KIRIM KE GOOGLE APPS SCRIPT
		 * ========================================
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
						JSON.stringify(
							payload
						)

				}
			);


		/*
		 * ========================================
		 * RESPONSE GOOGLE SCRIPT
		 * ========================================
		 */

		let result = null;

		try {

			result =
				await response.json();

		} catch {

			result = null;

		}


		if (!response.ok) {

			return json({

				success: false,

				error:
					"Google Apps Script gagal menerima submission",

				status:
					response.status,

				result

			}, 502);

		}


		/*
		 * ========================================
		 * JIKA APPS SCRIPT MENGIRIM ERROR
		 * ========================================
		 */

		if (
			result &&
			result.success === false
		) {

			return json({

				success: false,

				error:
					result.error ||
					"Gagal menyimpan data APK",

				result

			}, 400);

		}


		/*
		 * ========================================
		 * BERHASIL
		 * ========================================
		 */

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
 * ============================================
 * OPTIONS / CORS
 * ============================================
 */

export async function onRequestOptions() {

	return new Response(
		null,
		{

			status: 204,

			headers: {

				"access-control-allow-origin":
					"*",

				"access-control-allow-methods":
					"POST, OPTIONS",

				"access-control-allow-headers":
					"Content-Type"

			}

		}
	);

}


/*
 * ============================================
 * JSON RESPONSE
 * ============================================
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
 * ============================================
 * CLEAN INPUT
 * ============================================
 */

function clean(
	value = ""
) {

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

		.slice(
			0,
			5000
		);

}


/*
 * ============================================
 * SANITIZE SLUG
 * ============================================
 */

function sanitizeSlug(
	value = ""
) {

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


/*
 * ============================================
 * TANGGAL
 * ============================================
 */

function getDate() {

	const date =
		new Date();

	return date
		.toISOString()
		.slice(
			0,
			10
		);

}
