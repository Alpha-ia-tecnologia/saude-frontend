export function Timeline({ items = [], className = '' }) {
    return (
        <div className={`timeline ${className}`}>
            {items.map((item, index) => (
                <div key={index} className="timeline-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <strong>{item.title || item.type}</strong>
                        <span style={{ color: 'var(--sus-gray)', fontSize: '0.875rem' }}>
                            {item.date || item.time}
                        </span>
                    </div>
                    {item.description && <p style={{ margin: 0 }}>{item.description}</p>}
                    {item.subtitle && (
                        <small style={{ color: 'var(--sus-gray)' }}>{item.subtitle}</small>
                    )}
                </div>
            ))}
        </div>
    );
}

export function TimelineItem({ title, date, description, subtitle, children }) {
    return (
        <div className="timeline-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <strong>{title}</strong>
                {date && <span style={{ color: 'var(--sus-gray)', fontSize: '0.875rem' }}>{date}</span>}
            </div>
            {description && <p style={{ margin: 0 }}>{description}</p>}
            {subtitle && <small style={{ color: 'var(--sus-gray)' }}>{subtitle}</small>}
            {children}
        </div>
    );
}

export default Timeline;
