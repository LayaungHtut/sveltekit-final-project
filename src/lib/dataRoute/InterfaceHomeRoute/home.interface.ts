import type { ComponentType } from 'svelte';

export interface HomeRouteInterface {
	name: string;
	path: string;
	icon: ComponentType;
}
