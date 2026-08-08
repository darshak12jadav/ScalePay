'use client';

import { Menu } from 'lucide-react';
import type { NavItem } from './navigation';
import { SidebarBody } from './sidebar-body';
import { ScalePayLogo } from './scalepay-logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';

type MobileNavigationProps = {
  activeKey: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: (item: NavItem) => void;
};

export function MobileNavigation({
  activeKey,
  open,
  onOpenChange,
  onNavigate,
}: MobileNavigationProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation menu"
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-sidebar p-0">
        <SheetHeader className="h-16 flex-row items-center border-b border-sidebar-border px-5">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">ScalePay main navigation menu</SheetDescription>
          <ScalePayLogo />
        </SheetHeader>
        <SidebarBody
          activeKey={activeKey}
          showLogo={false}
          onNavigate={(item) => {
            onNavigate?.(item);
            onOpenChange(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
