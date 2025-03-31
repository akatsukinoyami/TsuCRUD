import { db } from "$lib/db";

export async function load({ params, parent }) {
  const { schema } = await parent();
  const table = params.table;
  const headers = schema[table]?.columns.map(({ name }) => name);

  const tableData = await db.execute(`SELECT * FROM ${table}`);
  const data = tableData.map((row: any) => headers.map((name) => row[name]));

  return { headers, data, typename: table };
}
