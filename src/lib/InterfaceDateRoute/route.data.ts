import { Facebook, Info, Heart } from "lucide-svelte";
import type { RouteInterface } from "./route.interface";

export const SilverSoulRoute: RouteInterface[] = [
  {
    name: "Home",
    path: "/exampleRoutes/Home", 
    icon: Facebook
  },
  {
    name: "About",
    path: "/exampleRoutes/About",
    icon: Info
  },
  {
    name: "Donate",
    path: "/exampleRoutes/Donate",
    icon: Heart
  }
];
