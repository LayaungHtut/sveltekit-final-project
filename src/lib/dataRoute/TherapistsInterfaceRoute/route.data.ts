import {
  Facebook,
  Info,
  Heart,
  Home,
  Hash,
  Smile,
  Calendar,
  Notebook,
  Settings
} from 'lucide-svelte';
import type { RouteInterface } from './route.interface';

export const MainRoute: RouteInterface[] = [
  { name: 'Home', path: '/main/Therapists/Home', icon: Home },
  { name: 'Dashboard', path: '/main/Therapists/Dashboard', icon: Hash },
  { name: 'Chats', path: '/main/Therapists/Chats', icon: Smile },
  { name: 'Calendar', path: '/main/Therapists/Calendar', icon: Calendar },
  { name: 'Notes', path: '/main/Therapists/notes', icon: Notebook },
  { name: 'Settings', path: '/main/Therapists/Settings', icon: Settings }
];
