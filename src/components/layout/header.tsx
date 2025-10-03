'use client';

import { usePathname } from 'next/navigation';
import {
  Bell,
  BookHeart,
  Bot,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  BellRing,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Vitals Dashboard',
  '/reminders': 'Medicine Reminders',
  '/first-aid': 'First-Aid Guide',
  '/symptom-checker': 'Symptom Checker',
};

const Header = () => {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'MediChain+';

  return (
    <header className="flex h-20 items-center justify-between border-b bg-card px-4 md:px-8">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col w-full">
              <nav className="grid gap-4 text-lg font-medium mt-10">
              <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
                <HeartPulse className="h-8 w-8 text-primary" />
                <span className="text-xl">MediChain+</span>
              </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/reminders"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <BellRing className="h-5 w-5" />
                  Reminders
                </Link>
                <Link
                  href="/first-aid"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <BookHeart className="h-5 w-5" />
                  First-Aid
                </Link>
                <Link
                  href="/symptom-checker"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Bot className="h-5 w-5" />
                  Symptom Checker
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="@user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
