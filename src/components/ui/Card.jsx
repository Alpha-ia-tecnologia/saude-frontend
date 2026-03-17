import { cn } from '@/lib/utils';

export function Card({ children, className = '', header, headerClassName = '' }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card shadow-sm', className)}>
      {header && (
        <div className={cn('border-b border-border px-5 py-3 text-sm font-semibold text-foreground', headerClassName)}>
          {header}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

export function CardGrid({ children }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}

export default Card;
