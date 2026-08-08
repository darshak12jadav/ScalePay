'use client';

import Link from 'next/link';
import type { NavItem } from './navigation';
import { cn } from '@/lib/utils';

type NavigationItemProps = {
  item: NavItem;
  active: boolean;
  onSelect?: (item: NavItem) => void;
};

export function NavigationItem({ item, active, onSelect }: NavigationItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={() => onSelect?.(item)}
      className={cn(
        'flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="size-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}
