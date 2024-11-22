/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		// Add CORS headers for actual requests
		const allowedOrigin = env.ENVIRONMENT === 'production' ? 'https://wijndex.com' : 'http://localhost:5173';

		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': allowedOrigin,
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
					'Access-Control-Max-Age': '86400',
				},
			});
		}

		// Handle email signup for POST requests
		if (request.method === 'POST') {
			try {
				const { email } = await request.json();

				if (!email) {
					return new Response(JSON.stringify({ error: 'Email is required' }), {
						status: 400,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': allowedOrigin,
						},
					});
				}

				const emailOctopusResponse = await fetch('https://emailoctopus.com/api/1.6/lists/f81383fc-a8cf-11ef-82ec-b5e6c62197f0/contacts', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						api_key: env.EMAILOCTOPUS_API_KEY,
						email_address: email,
						status: 'SUBSCRIBED',
					}),
				});

				if (!emailOctopusResponse.ok) {
					const errorBody = await emailOctopusResponse.json();
					if (errorBody.error && errorBody.error.code === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
						return new Response(JSON.stringify({ message: 'Email already subscribed' }), {
							headers: {
								'Content-Type': 'application/json',
								'Access-Control-Allow-Origin': allowedOrigin,
							},
						});
					}
					throw new Error(`EmailOctopus API error: ${JSON.stringify(errorBody)}`);
				}

				return new Response(JSON.stringify({ message: 'Signup successful' }), {
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': allowedOrigin,
					},
				});
			} catch (error) {
				console.log(error);
				return new Response(JSON.stringify({ error: error.message }), {
					status: 500,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': allowedOrigin,
					},
				});
			}
		}

		// Default response for unsupported methods
		return new Response(JSON.stringify({ error: 'Method not allowed' }), {
			status: 405,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': allowedOrigin,
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			},
		});
	},
};
