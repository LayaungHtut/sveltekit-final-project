import { Facebook, Info, Heart, Music2, HandHeart, Users } from "lucide-svelte";
import type { HomeRouteInterface } from "./home.interface";


export const HomeRoute: HomeRouteInterface[] = [
  {
    name: "Lofi Zone",
    path: "/main/Therapists/Home/LofiZone", 
    icon: Music2
  },
  {
    name: "Treatments",
    path: "/main/Therapists/Home/Treatments",
    icon: HandHeart
  },
  {
    name: "Therapists",
    path: "/main/Therapists/Home/Therapists",
    icon: Users
  }
];
