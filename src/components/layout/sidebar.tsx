import { Separator } from '@/components/ui/separator';
import { BellRing, BookHeart, Bot, HeartPulse, LayoutDashboard, MapPin, Settings } from 'lucide-react';
import Link from 'next/link';
import NavLink from './nav-link';

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r shadow-md">
      <div className="flex items-center justify-center h-20 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <HeartPulse className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">MediChain+</h1>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink href="/dashboard">
          <LayoutDashboard className="h-5 w-5" />
          <span>Vitals Dashboard</span>
        </NavLink>
        <NavLink href="/reminders">
          <BellRing className="h-5 w-5" />
          <span>Medicine Reminders</span>
        </NavLink>
        <NavLink href="/first-aid">
          <BookHeart className="h-5 w-5" />
          <span>First-Aid Guide</span>
        </NavLink>
        <NavLink href="/symptom-checker">
          <Bot className="h-5 w-5" />
          <span>Symptom Checker</span>
        </NavLink>
        <NavLink href="/nearby">
          <MapPin className="h-5 w-5" />
          <span>Nearby Health Centers</span>
        </NavLink>
      </nav>
      <div className="px-4 py-6 mt-auto">
        <Separator className="my-4" />
        <NavLink href="#">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
