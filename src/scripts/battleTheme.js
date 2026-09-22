export const CLASSIC_THEME = 'classic';
export const ALT_THEME = 'blue-orange';

function updateToggleState(themeToggle, theme) {
	themeToggle.setAttribute(
		'aria-label',
		theme === ALT_THEME
			? 'Switch to classic green and purple battle theme'
			: 'Switch to blue and orange battle theme'
	);
	themeToggle.setAttribute('aria-pressed', String(theme === ALT_THEME));
	themeToggle.textContent =
		theme === ALT_THEME
			? '🟢 Switch to Classic Green/Purple Theme'
			: '🎨 Switch to Blue/Orange Theme';
}

function readStoredTheme(storage, themeStorageKey) {
	if (!storage) return CLASSIC_THEME;

	try {
		return storage.getItem(themeStorageKey) === ALT_THEME ? ALT_THEME : CLASSIC_THEME;
	} catch (error) {
		console.warn('Unable to read saved battle theme preference.', error);
		return CLASSIC_THEME;
	}
}

function persistTheme(storage, themeStorageKey, theme) {
	if (!storage) return;

	try {
		storage.setItem(themeStorageKey, theme);
	} catch (error) {
		console.warn('Unable to save battle theme preference.', error);
	}
}

export function initializeBattleThemeToggle({
	themeStorageKey,
	documentRef = document,
	storage = globalThis.localStorage
}) {
	const themeToggle = documentRef.querySelector('[data-theme-toggle]');
	const root = documentRef.documentElement;

	if (!themeToggle || !root) {
		return null;
	}

	const applyBattleTheme = (theme) => {
		root.dataset.battleTheme = theme;
		updateToggleState(themeToggle, theme);
	};

	applyBattleTheme(readStoredTheme(storage, themeStorageKey));

	const toggleTheme = () => {
		const nextTheme = root.dataset.battleTheme === ALT_THEME ? CLASSIC_THEME : ALT_THEME;
		applyBattleTheme(nextTheme);
		persistTheme(storage, themeStorageKey, nextTheme);
	};

	themeToggle.addEventListener('click', toggleTheme);

	return { applyBattleTheme, toggleTheme };
}
