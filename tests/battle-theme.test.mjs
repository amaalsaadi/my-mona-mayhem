import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';

const DEV_SERVER_PORT = 4322;
const DEV_SERVER_URL = `http://127.0.0.1:${DEV_SERVER_PORT}/`;
const DEV_SERVER_READY_TEXT = `http://127.0.0.1:${DEV_SERVER_PORT}/`;
const REPO_ROOT = '/home/runner/work/my-mona-mayhem/my-mona-mayhem';
const ASTRO_BIN = path.join(
	REPO_ROOT,
	'node_modules',
	'.bin',
	process.platform === 'win32' ? 'astro.cmd' : 'astro'
);

async function startDevServer() {
	const server = spawn(ASTRO_BIN, ['dev', '--host', '127.0.0.1', '--port', String(DEV_SERVER_PORT)], {
		cwd: REPO_ROOT,
		stdio: ['ignore', 'pipe', 'pipe']
	});

	await new Promise((resolve, reject) => {
		const onData = (chunk) => {
			const text = chunk.toString();
			if (text.includes(DEV_SERVER_READY_TEXT)) {
				cleanup();
				resolve();
			}
		};

		const onExit = (code) => {
			cleanup();
			reject(new Error(`Dev server exited before becoming ready (code ${code ?? 'unknown'}).`));
		};

		const cleanup = () => {
			server.stdout.off('data', onData);
			server.stderr.off('data', onData);
			server.off('exit', onExit);
		};

		server.stdout.on('data', onData);
		server.stderr.on('data', onData);
		server.once('exit', onExit);
	});

	return server;
}

function stopDevServer(server) {
	return new Promise((resolve) => {
		const timeout = setTimeout(() => {
			server.kill('SIGKILL');
		}, 2_000);

		server.once('exit', () => {
			clearTimeout(timeout);
			resolve();
		});

		server.kill('SIGTERM');
	});
}

async function getBattleThemeScript() {
	const response = await fetch(DEV_SERVER_URL);
	const html = await response.text();
	const scriptMatch = html.match(/<script>\(function\(\)\{([\s\S]*?)\}\)\(\);<\/script>/);

	assert.ok(scriptMatch, 'Expected rendered page to include inline theme toggle script.');

	return scriptMatch[1];
}

function executeThemeScript(scriptBody, savedTheme) {
	const listeners = new Map();
	const attributes = new Map();
	const themeToggle = {
		textContent: '',
		setAttribute(name, value) {
			attributes.set(name, value);
		},
		getAttribute(name) {
			return attributes.get(name);
		},
		addEventListener(eventName, handler) {
			listeners.set(eventName, handler);
		}
	};
	const root = { dataset: {} };
	const writes = [];
	const context = {
		console: { warn() {} },
		document: {
			documentElement: root,
			querySelector(selector) {
				return selector === '[data-theme-toggle]' ? themeToggle : null;
			}
		},
		localStorage: {
			getItem(key) {
				assert.equal(key, 'monaMayhemBattleTheme');
				return savedTheme;
			},
			setItem(key, value) {
				writes.push([key, value]);
			}
		}
	};

	Function('context', `with (context) { ${scriptBody} }`)(context);

	return {
		root,
		themeToggle,
		click() {
			const clickHandler = listeners.get('click');
			assert.ok(clickHandler, 'Expected click handler to be registered.');
			clickHandler();
		},
		writes
	};
}

test('restores saved blue/orange battle theme from localStorage', async () => {
	const server = await startDevServer();

	try {
		const scriptBody = await getBattleThemeScript();
		const page = executeThemeScript(scriptBody, 'blue-orange');

		assert.equal(page.root.dataset.battleTheme, 'blue-orange');
		assert.equal(page.themeToggle.getAttribute('aria-pressed'), 'true');
		assert.equal(
			page.themeToggle.getAttribute('aria-label'),
			'Switch to classic green and purple battle theme'
		);
		assert.match(page.themeToggle.textContent, /Classic Green\/Purple Theme/);
	} finally {
		await stopDevServer(server);
	}
});

test('toggles from classic to blue/orange theme and persists the choice', async () => {
	const server = await startDevServer();

	try {
		const scriptBody = await getBattleThemeScript();
		const page = executeThemeScript(scriptBody, null);

		assert.equal(page.root.dataset.battleTheme, 'classic');
		assert.equal(page.themeToggle.getAttribute('aria-pressed'), 'false');
		assert.equal(page.themeToggle.getAttribute('aria-label'), 'Switch to blue and orange battle theme');

		page.click();

		assert.equal(page.root.dataset.battleTheme, 'blue-orange');
		assert.equal(page.themeToggle.getAttribute('aria-pressed'), 'true');
		assert.equal(
			page.themeToggle.getAttribute('aria-label'),
			'Switch to classic green and purple battle theme'
		);
		assert.deepEqual(page.writes, [['monaMayhemBattleTheme', 'blue-orange']]);
	} finally {
		await stopDevServer(server);
	}
});
