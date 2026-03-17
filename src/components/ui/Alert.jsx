import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const alertConfig = {
  info: { icon: Info, classes: 'border-primary/20 bg-primary/5 text-primary-dark' },
  success: { icon: CheckCircle, classes: 'border-secondary/20 bg-secondary/5 text-secondary-dark' },
  warning: { icon: AlertTriangle, classes: 'border-amber-200 bg-amber-50 text-amber-800' },
  danger: { icon: XCircle, classes: 'border-destructive/20 bg-destructive/5 text-destructive' },
  error: { icon: XCircle, classes: 'border-destructive/20 bg-destructive/5 text-destructive' }
};

export function Alert({ type = 'info', title, children, onClose, className = '' }) {
  const config = alertConfig[type] || alertConfig.info;
  const Icon = config.icon;

  return (
    <div className={cn('flex items-start gap-3 rounded-lg border p-4 text-sm', config.classes, className)} role="alert">
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="flex-1">
        {title && <h5 className="mb-1 font-semibold">{title}</h5>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-50 hover:opacity-100" aria-label="Fechar">
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;
