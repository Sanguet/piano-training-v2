"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MusicIcon, DumbbellIcon, BarChartIcon, FileTextIcon } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Piano', icon: MusicIcon },
  { href: '/exercises', label: 'Exercises', icon: DumbbellIcon },
  { href: '/progress', label: 'Progress', icon: BarChartIcon },
  { href: '/scores', label: 'Scores', icon: FileTextIcon },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-center space-x-4 py-4 bg-secondary overflow-x-auto">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} passHref>
          <Button
            variant="ghost"
            className={cn(
              "flex items-center space-x-2 whitespace-nowrap",
              pathname === href && "bg-primary text-primary-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Button>
        </Link>
      ))}
    </nav>
  );
}