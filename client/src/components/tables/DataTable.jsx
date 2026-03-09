const DataTable = ({ columns, rows, actions }) => (
  <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-800">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-left dark:border-slate-700">
          {columns.map((col) => (
            <th key={col.key} className="px-4 py-3 font-semibold">{col.title}</th>
          ))}
          {actions ? <th className="px-4 py-3 text-right font-semibold">Actions</th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="border-b border-slate-100 dark:border-slate-700">
            {columns.map((col) => (
              <td key={`${row.id}-${col.key}`} className="px-4 py-3">
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
            {actions ? <td className="px-4 py-3 text-right"><div className="flex justify-end gap-2">{actions(row)}</div></td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
