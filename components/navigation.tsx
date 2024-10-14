"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MusicIcon,
  DumbbellIcon,
  BarChartIcon,
  FileTextIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";

const navItems = [
  { href: '/', label: 'Piano', icon: MusicIcon },
  { href: '/exercises', label: 'Exercises', icon: DumbbellIcon },
  { href: '/progress', label: 'Progress', icon: BarChartIcon },
  { href: '/scores', label: 'Scores', icon: FileTextIcon },
];

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="flex justify-center items-center py-4 bg-secondary overflow-x-auto px-4">
      <div className="flex space-x-4 items-center">
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
        <Button variant="ghost" onClick={toggleTheme} className="ml-4">
          {theme === "dark" ? (
            <SunIcon className="h-4 w-4" />
          ) : (
            <MoonIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </nav>
  );
}
