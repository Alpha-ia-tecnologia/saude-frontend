import { useState, useMemo } from 'react';

export function DataTable({
    columns = [],
    data = [],
    searchable = true,
    sortable = true,
    emptyMessage = 'Nenhum registro encontrado',
    className = ''
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(row =>
            columns.some(col => {
                const value = row[col.key];
                return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [data, columns, searchTerm]);

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    const handleSort = (key) => {
        if (!sortable) return;
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <div className={className}>
            {searchable && (
                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ maxWidth: '300px' }}
                    />
                </div>
            )}

            <table className="table">
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                onClick={() => handleSort(col.key)}
                                style={{ cursor: sortable ? 'pointer' : 'default' }}
                            >
                                {col.label}
                                {sortable && sortConfig.key === col.key && (
                                    <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}
                                        style={{ marginLeft: '0.5rem' }}></i>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--sus-gray)' }}>
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        sortedData.map((row, index) => (
                            <tr key={row.id || index}>
                                {columns.map(col => (
                                    <td key={col.key}>
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;
