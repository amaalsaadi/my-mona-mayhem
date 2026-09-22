import test from 'node:test';
import assert from 'node:assert/strict';

import {
	ALT_THEME,
	CLASSIC_THEME,
	initializeBattleThemeToggle
} from '../src/scripts/battleTheme.js';

function createHarness(savedTheme) {
	const listeners = new Map();
	const attributes = new Map();
	const writes = [];
	const themeStatus = { textContent: '' };
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
	const storage = {
		getItem(key) {
			assert.equal(key, 'monaMayhemBattleTheme');
			return savedTheme;
		},
		setItem(key, value) {
			writes.push([key, value]);
		}
	};
	const documentRef = {
		documentElement: root,
		querySelector(selector) {
			if (selector === '[data-theme-toggle]') return themeToggle;
			if (selector === '[data-theme-status]') return themeStatus;
			return null;
		}
	};

	const controls = initializeBattleThemeToggle({
		themeStorageKey: 'monaMayhemBattleTheme',
		documentRef,
		storage
	});

	return {
		controls,
		root,
		themeStatus,
		themeToggle,
		click() {
			const clickHandler = listeners.get('click');
			assert.ok(clickHandler, 'Expected click handler to be registered.');
			clickHandler();
		},
		writes
	};
}

test('restores saved blue/orange battle theme from storage', () => {
	const page = createHarness(ALT_THEME);

	assert.equal(page.root.dataset.battleTheme, ALT_THEME);
	assert.equal(page.themeToggle.getAttribute('aria-pressed'), 'true');
	assert.equal(
		page.themeToggle.getAttribute('aria-label'),
		'Current theme is Blue/Orange. Activate to switch to Classic Green/Purple Theme'
	);
	assert.match(page.themeToggle.textContent, /Classic Green\/Purple Theme/);
	assert.equal(page.themeStatus.textContent, 'Current theme: Blue/Orange');
	assert.ok(page.controls, 'Expected initializer to return toggle controls.');
});

test('toggles from classic to blue/orange theme and persists the choice', () => {
	const page = createHarness(null);

	assert.equal(page.root.dataset.battleTheme, CLASSIC_THEME);
	assert.equal(page.themeToggle.getAttribute('aria-pressed'), 'false');
	assert.equal(
		page.themeToggle.getAttribute('aria-label'),
		'Current theme is Classic Green/Purple. Activate to switch to Blue/Orange Theme'
	);
	assert.equal(page.themeStatus.textContent, 'Current theme: Classic Green/Purple');

	page.click();

	assert.equal(page.root.dataset.battleTheme, ALT_THEME);
	assert.equal(page.themeToggle.getAttribute('aria-pressed'), 'true');
	assert.equal(
		page.themeToggle.getAttribute('aria-label'),
		'Current theme is Blue/Orange. Activate to switch to Classic Green/Purple Theme'
	);
	assert.equal(page.themeStatus.textContent, 'Current theme: Blue/Orange');
	assert.deepEqual(page.writes, [['monaMayhemBattleTheme', ALT_THEME]]);
});
