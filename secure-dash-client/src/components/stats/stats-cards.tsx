import { ArrowUpRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  description = 'vs última hora',
}: StatsCardProps) {
  return (
    <div className="relative p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden">
      <div className="relative flex items-center gap-4">
        <ArrowUpRight
          className="absolute right-0 top-0 opacity-0 group-has-[a:hover]:opacity-100 transition-opacity text-emerald-500"
          size={20}
          aria-hidden="true"
        />
        {/* Icon */}
        <div className="max-[480px]:hidden size-10 shrink-0 rounded-full bg-emerald-600/25 border border-emerald-600/50 flex items-center justify-center text-emerald-500">
          {icon}
        </div>
        {/* Content */}
        <div>
          <h3 className="font-medium tracking-widest text-xs uppercase text-muted-foreground/60 before:absolute before:inset-0 mb-2">
            {title}
          </h3>
          <div className="text-2xl font-semibold mb-2">
            {Number.isFinite(Number(value)) ? Number(value).toFixed(1) : value}
          </div>
          <div className="text-xs text-muted-foreground/60">{description}</div>
        </div>
      </div>
    </div>
  );
}
