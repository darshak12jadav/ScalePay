import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, Banknote, ArrowLeftRight } from 'lucide-react';

export type NavItem = {
  /** Stable identifier used to track the active item. */
  key: string;
  label: string;
  /** Route the item points to. Kept for easy migration to real pages. */
  href: string;
  icon: LucideIcon;
};

export const primaryNavigation: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { key: 'employees', label: 'Employees', href: '/employees', icon: Users },
  { key: 'payroll', label: 'Payroll', href: '/payroll', icon: Banknote },
  {
    key: 'exchange-rates',
    label: 'Exchange Rates',
    href: '/exchange-rates',
    icon: ArrowLeftRight,
  },
];

export const allNavigation: NavItem[] = [...primaryNavigation];
