export function FormField({
    label,
    name,
    type = 'text',
    required = false,
    error,
    helpText,
    children,
    className = '',
    ...props
}) {
    const id = `field-${name}`;

    return (
        <div className={`form-field ${className}`} style={{ marginBottom: '1rem' }}>
            {label && (
                <label htmlFor={id} className="form-label">
                    {label}
                    {required && <span style={{ color: 'var(--sus-red)' }}> *</span>}
                </label>
            )}

            {children || (
                <input
                    id={id}
                    name={name}
                    type={type}
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    required={required}
                    {...props}
                />
            )}

            {error && (
                <div className="invalid-feedback" style={{ display: 'block', color: 'var(--sus-red)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {error}
                </div>
            )}

            {helpText && !error && (
                <small style={{ color: 'var(--sus-gray)', marginTop: '0.25rem', display: 'block' }}>
                    {helpText}
                </small>
            )}
        </div>
    );
}

export function FormSelect({ label, name, options = [], placeholder = 'Selecione', required, error, ...props }) {
    return (
        <FormField label={label} name={name} required={required} error={error}>
            <select
                id={`field-${name}`}
                name={name}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                required={required}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </FormField>
    );
}

export function FormTextarea({ label, name, rows = 3, required, error, ...props }) {
    return (
        <FormField label={label} name={name} required={required} error={error}>
            <textarea
                id={`field-${name}`}
                name={name}
                rows={rows}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                required={required}
                {...props}
            />
        </FormField>
    );
}

export default FormField;
