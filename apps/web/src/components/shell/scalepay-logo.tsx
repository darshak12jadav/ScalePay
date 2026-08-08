import { cn } from '@/lib/utils';

type ScalePayLogoProps = {
  className?: string;
  showWordmark?: boolean;
};

export function ScalePayLogo({ className, showWordmark = true }: ScalePayLogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
          {/* Stylized "S" formed from two stacked bars — a nod to scale + ledger rows */}
          <path
            d="M17 6.5C17 5.12 15.88 4 14.5 4H9C7.34 4 6 5.34 6 7C6 8.66 7.34 10 9 10H15C16.66 10 18 11.34 18 13C18 14.66 16.66 16 15 16H9.5C8.12 16 7 17.12 7 18.5"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">ScalePay</span>
      )}
    </div>
  );
}
