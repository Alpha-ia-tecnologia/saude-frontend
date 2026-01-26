export function Card({ children, className = '', header, headerStyle = {} }) {
    return (
        <div className={`card ${className}`}>
            {header && (
                <div className="card-header" style={headerStyle}>
                    {header}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}

export function CardGrid({ children, columns = 4, gap = '1rem' }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
            gap
        }}>
            {children}
        </div>
    );
}

export default Card;
