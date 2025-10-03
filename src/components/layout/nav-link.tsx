'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type NavLinkProps = {
  href: string;
  children: ReactNode;
};

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all hover:bg-primary/10 hover:text-primary',
        isActive
          ? 'bg-primary/20 text-primary'
          : 'text-muted-foreground'
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
