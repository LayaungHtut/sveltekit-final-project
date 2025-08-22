import { Facebook, Info, Heart } from "lucide-svelte";
import type { RouteInterface } from "./route.interface";

export const MainRoute: RouteInterface[] = [
  {
    name: "Home",
    path: "/main/Home", 
    icon: Facebook
  },
  {
    name: "About",
    path: "/main/Dashboard",
    icon: Info
  },
  {
    name: "About",
    path: "/main/Clients",
    icon: Info
  },
  {
    name: "Donate",
    path: "/main/Calendar",
    icon: Heart
  },
  {
    name: "Donate",
    path: "/main/Notes",
    icon: Heart
  },
  {
    name: "Donate",
    path: "/main/Settings",
    icon: Heart
  },
];
