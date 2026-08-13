import type { ComponentType } from 'svelte';

export interface RouteInterface {
	name: string;
	path: string;
	icon: ComponentType;
}
