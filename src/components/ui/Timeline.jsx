import { cn } from '@/lib/utils';

export function Timeline({ items = [], className = '' }) {
  return (
    <div className={cn('relative space-y-6 pl-6 before:absolute before:left-[3px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-border', className)}>
      {items.map((item, index) => (
        <TimelineItem
          key={index}
          title={item.title || item.type}
          date={item.date || item.time}
          description={item.description}
          subtitle={item.subtitle}
        />
      ))}
    </div>
  );
}

export function TimelineItem({ title, date, description, subtitle, children }) {
  return (
    <div className="relative">
      <div className="absolute -left-6 top-1.5 size-2.5 rounded-full border-2 border-primary bg-white" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {date && <span className="text-xs text-muted-foreground">{date}</span>}
      </div>
      {description && <p className="mt-0.5 text-sm text-foreground">{description}</p>}
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      {children}
    </div>
  );
}

export default Timeline;
