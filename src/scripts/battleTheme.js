export const CLASSIC_THEME = 'classic';
export const ALT_THEME = 'blue-orange';

function updateToggleState(themeToggle, theme) {
	const currentThemeLabel = theme === ALT_THEME ? 'Blue/Orange' : 'Classic Green/Purple';
	const nextThemeLabel = theme === ALT_THEME ? 'Classic Green/Purple' : 'Blue/Orange';

	themeToggle.setAttribute(
		'aria-label',
		`Current theme is ${currentThemeLabel}. Activate to switch to ${nextThemeLabel} Theme`
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
	const themeStatus = documentRef.querySelector('[data-theme-status]');
	const root = documentRef.documentElement;

	if (!themeToggle || !root) {
		return null;
	}

	const applyBattleTheme = (theme) => {
		root.dataset.battleTheme = theme;
		updateToggleState(themeToggle, theme);
		if (themeStatus) {
			themeStatus.textContent =
				theme === ALT_THEME
					? 'Current theme: Blue/Orange'
					: 'Current theme: Classic Green/Purple';
		}
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
