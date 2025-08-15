import LucideFacebook from "$lib/Lucide/LucideFacebook.svelte";
import type { RouteInterface } from "./route.interface";

export const SilverSoulRoute: RouteInterface[] = [
    {
        name: "Home",
        path: "/exampleRoutes/Homez",
        icon: LucideFacebook
    },
    {
        name: "About",
        path: "/exampleRoutes/About",
        icon: LucideFacebook
    },
    {
        name: "Donate",
        path: "/exampleRoutes/Donate",
        icon: LucideFacebook
    }
]