import type { APIRoute } from 'astro';
import { isValidGitHubUsername } from '../../../utils/githubUsername';

export const prerender = false;

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const UPSTREAM_TIMEOUT_MS = 8000;

function jsonResponse(body: unknown, status: number, cache: 'public' | 'no-store') {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': cache === 'public' ? 'public, max-age=300' : 'no-store',
			...CORS_HEADERS,
		},
	});
}

export const GET: APIRoute = async ({ params }) => {
	const username = params.username;
	if (!username) {
		return jsonResponse({ error: 'Username is required' }, 400, 'no-store');
	}
	if (!isValidGitHubUsername(username)) {
		return jsonResponse({ error: 'Invalid GitHub username' }, 400, 'no-store');
	}

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

	try {
		const upstreamUrl = `https://github.com/${encodeURIComponent(username)}.contribs`;
		const upstreamResponse = await fetch(upstreamUrl, { signal: controller.signal });

		if (upstreamResponse.status === 404) {
			return jsonResponse({ error: 'User not found' }, 404, 'no-store');
		}
		if (!upstreamResponse.ok) {
			return jsonResponse({ error: 'Upstream error' }, 502, 'no-store');
		}

		try {
			const data = await upstreamResponse.json();
			return jsonResponse(data, 200, 'public');
		} catch {
			return jsonResponse({ error: 'Invalid response from upstream' }, 502, 'no-store');
		}
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			return jsonResponse({ error: 'Upstream request timed out' }, 504, 'no-store');
		}
		return jsonResponse({ error: 'Failed to reach GitHub' }, 502, 'no-store');
	} finally {
		clearTimeout(timeout);
	}
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, { status: 204, headers: CORS_HEADERS });
};
