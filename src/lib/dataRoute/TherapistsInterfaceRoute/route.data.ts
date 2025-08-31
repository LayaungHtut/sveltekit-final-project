import {
  Home,
  Hash,
  Smile,
  Calendar,
  Notebook,
} from 'lucide-svelte';
import type { RouteInterface } from './route.interface';

export const MainRoute: RouteInterface[] = [
  { name: 'Dashboard', path: '/main/Therapists/Dashboard', icon: Hash },
  { name: 'Home', path: '/main/Therapists/Home', icon: Home },
  { name: 'Chats', path: '/main/Therapists/Chats', icon: Smile },
  { name: 'Calendar', path: '/main/Therapists/Calendar', icon: Calendar },
  { name: 'Notes', path: '/main/Therapists/notes', icon: Notebook }
];
