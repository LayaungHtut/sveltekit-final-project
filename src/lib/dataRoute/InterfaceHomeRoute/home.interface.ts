import type { SvelteComponentTyped } from "svelte";
import type { IconProps } from "lucide-svelte";

export interface HomeRouteInterface {
  name: string;
  path: string;
  icon: new (...args: any[]) => SvelteComponentTyped<IconProps>; 
}
