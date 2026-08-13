import { goto } from '$app/navigation';
import { page } from '$app/state';

export function goToRoute(path: string) {
	goto(path);
}

export function getCurrentFullRoute(): string {
	return page.url.pathname;
}

export function getCurrentRoutePathSegments(): string[] {
	const pathname = getCurrentFullRoute();
	return pathname
		.replace(/^\/|\/$/g, '')
		.split('/')
		.filter((segment) => segment !== '');
}

export function goBackRoute() {
	window.history.back();
}
