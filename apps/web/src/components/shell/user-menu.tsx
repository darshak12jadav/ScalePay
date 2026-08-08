'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type UserMenuProps = {
  /** "full" shows avatar + name (sidebar); "compact" shows just the avatar (header). */
  variant?: 'full' | 'compact';
};

// Static profile placeholder
const currentUser = {
  name: 'System Admin',
  initials: 'HR ',
};

export function UserMenu({ variant = 'full' }: UserMenuProps) {
  const compact = variant === 'compact';

  return (
    <div className="flex min-w-0 items-center gap-2.5 p-2 ">
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="text-[14px] font-medium">{currentUser.initials}</AvatarFallback>
      </Avatar>

      {!compact && (
        <span className="min-w-0 truncate text-sm font-medium leading-none text-foreground">
          {currentUser.name}
        </span>
      )}
    </div>
  );
}
