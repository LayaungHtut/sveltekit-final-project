import { Facebook, Info, Heart, Music2, HandHeart, Users } from "lucide-svelte";
import type { HomeRouteInterface } from "./home.interface";


export const HomeRoute: HomeRouteInterface[] = [
  {
    name: "Home",
    path: "/main/Home/LofiZone", 
    icon: Music2
  },
  {
    name: "About",
    path: "/main/Home/Treatments",
    icon: HandHeart
  },
  {
    name: "Donate",
    path: "/main/Home/Therapists",
    icon: Users
  }
];
