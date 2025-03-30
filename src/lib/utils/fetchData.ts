export async function fetchData(
  table: string,
  schema: any,
  apiUrl: string = '/api'
) {
  let data = await fetch(`${apiUrl}/${table}`).then(res => res.json());
  const { oneToMany, manyToMany } = schema[table].relations;

  // Список всех таблиц, которые нужно загрузить
  const refTables = [
    ...oneToMany.map(r => r.references.table),
    ...manyToMany.map(r => r.via),
    ...manyToMany.map(r => r.targetTable)
  ];

  // Загружаем все данные параллельно
  const refDataMap = Object.fromEntries(
    await Promise.all(
      [...new Set(refTables)].map(async refTable => [
        refTable,
        await fetch(`${apiUrl}/${refTable}`).then(res => res.json())
      ])
    )
  );

  // Обрабатываем one-to-many
  data = data.map(row => ({
    ...row,
    ...Object.fromEntries(
      oneToMany.map(r => [
        r.column,
        refDataMap[r.references.table]?.find(refRow => refRow[r.references.column] === row[r.column])?.name || row[r.column]
      ])
    )
  }));

  // Обрабатываем many-to-many
  data = data.map(row => ({
    ...row,
    ...Object.fromEntries(
      manyToMany.map(r => {
        const linkedRows = refDataMap[r.via]?.filter(link => link[r.ownColumn] === row.id) || [];
        const fullData = linkedRows
          .map(link => refDataMap[r.targetTable]?.find(t => t[r.targetColumn] === link[r.targetColumn]))
          .filter(Boolean);
        return [r.targetTable, fullData];
      })
    )
  }));

  return data;
}