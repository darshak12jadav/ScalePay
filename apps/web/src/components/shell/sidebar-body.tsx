'use client';

import { primaryNavigation, type NavItem } from './navigation';
import { NavigationItem } from './navigation-item';
import { ScalePayLogo } from './scalepay-logo';
import { UserMenu } from './user-menu';
import { cn } from '@/lib/utils';

type SidebarBodyProps = {
  activeKey: string;
  onNavigate?: (item: NavItem) => void;
  /** Hides the top logo row when the header already renders it (mobile sheet). */
  showLogo?: boolean;
};

export function SidebarBody({ activeKey, onNavigate, showLogo = true }: SidebarBodyProps) {
  return (
    <div className="flex h-full flex-col">
      {showLogo && (
        <div className="flex h-16 items-center px-5">
          <ScalePayLogo />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Workspace
        </p>
        <nav className="flex flex-col gap-0.5" aria-label="Primary">
          {primaryNavigation.map((item) => (
            <NavigationItem
              key={item.key}
              item={item}
              active={activeKey === item.key}
              onSelect={onNavigate}
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto px-3 py-3">
        <div className={cn('mt-3 border-t border-sidebar-border pt-3')}>
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
