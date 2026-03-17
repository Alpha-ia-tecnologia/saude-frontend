import { cn } from '@/lib/utils';

const inputClasses = 'h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

export function FormField({
  label, name, type = 'text', required = false,
  error, helpText, children, className = '', ...props
}) {
  const id = `field-${name}`;

  return (
    <div className={cn('mb-4', className)}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}
      {children || (
        <input
          id={id} name={name} type={type} required={required}
          className={cn(inputClasses, error && 'border-destructive focus:border-destructive focus:ring-destructive/20')}
          {...props}
        />
      )}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      {helpText && !error && <p className="mt-1 text-xs text-muted-foreground">{helpText}</p>}
    </div>
  );
}

export function FormSelect({ label, name, options = [], placeholder = 'Selecione', required, error, ...props }) {
  return (
    <FormField label={label} name={name} required={required} error={error}>
      <select
        id={`field-${name}`} name={name} required={required}
        className={cn(inputClasses, error && 'border-destructive')}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </FormField>
  );
}

export function FormTextarea({ label, name, rows = 3, required, error, ...props }) {
  return (
    <FormField label={label} name={name} required={required} error={error}>
      <textarea
        id={`field-${name}`} name={name} rows={rows} required={required}
        className={cn(
          'w-full rounded-lg border border-input bg-white px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
          error && 'border-destructive'
        )}
        {...props}
      />
    </FormField>
  );
}

export default FormField;
