export const GITHUB_USERNAME_PATTERN = /^(?!-)(?!.*--)[A-Za-z0-9-]{1,39}(?<!-)$/;

export function isValidGitHubUsername(username: string): boolean {
	return GITHUB_USERNAME_PATTERN.test(username);
}
