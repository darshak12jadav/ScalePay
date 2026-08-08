'use client';

import type { NavItem } from './navigation';
import { SidebarBody } from './sidebar-body';

type SidebarProps = {
  activeKey: string;
  onNavigate?: (item: NavItem) => void;
};

export function Sidebar({ activeKey, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
      <div className="fixed flex h-svh w-64 flex-col">
        <SidebarBody activeKey={activeKey} onNavigate={onNavigate} />
      </div>
    </aside>
  );
}
