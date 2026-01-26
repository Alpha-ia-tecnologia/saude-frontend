const alertTypes = {
    info: { icon: 'fa-info-circle', className: 'alert-info' },
    success: { icon: 'fa-check-circle', className: 'alert-success' },
    warning: { icon: 'fa-exclamation-triangle', className: 'alert-warning' },
    danger: { icon: 'fa-times-circle', className: 'alert-danger' },
    error: { icon: 'fa-times-circle', className: 'alert-danger' }
};

export function Alert({ type = 'info', title, children, onClose, className = '' }) {
    const config = alertTypes[type] || alertTypes.info;

    return (
        <div className={`alert ${config.className} ${className}`} role="alert">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    {title && (
                        <h5 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className={`fas ${config.icon}`}></i>
                            {title}
                        </h5>
                    )}
                    <div>{children}</div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            opacity: 0.5
                        }}
                        aria-label="Fechar"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>
        </div>
    );
}

export default Alert;
