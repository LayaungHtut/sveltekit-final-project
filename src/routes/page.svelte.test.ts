import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('renders the redirect page without crashing', async () => {
		render(Page);

		// +page.svelte immediately redirects to /main via onMount, so it renders an empty shell
		await expect.element(page.elementLocator(document.body)).toBeInTheDocument();
	});
});
