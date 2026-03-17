import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        <div className="mb-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-white pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={cn(
                    'px-4 py-3 text-left font-semibold text-muted-foreground',
                    sortable && 'cursor-pointer select-none hover:text-foreground'
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortable && sortConfig.key === col.key && (
                      sortConfig.direction === 'asc'
                        ? <ArrowUp className="size-3" />
                        : <ArrowDown className="size-3" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-muted/30">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
