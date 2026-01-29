interface DataTableProps {
  data: Record<string, any>[]
}

export default function DataTable({ data }: DataTableProps) {
  if (!data?.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No hay datos para mostrar
      </div>
    )
  }

  const columns = Object.keys(data[0])

  return (
    <div className="h-full overflow-auto rounded-xl border">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-gray-100">
          <tr>
            {columns.map(col => (
              <th
                key={col}
                className="px-4 py-3 border-b text-left font-semibold text-gray-700 whitespace-nowrap"
              >
                {col.replaceAll('_', ' ')}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
            >
              {columns.map(col => (
                <td
                  key={col}
                  className="px-4 py-2 border-b text-gray-700 whitespace-nowrap"
                >
                  {formatValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatValue(value: any) {
  if (value === null) return '—'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
