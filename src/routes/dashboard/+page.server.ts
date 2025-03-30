import { db } from '$lib/db';
import { introspectionQueryBasic, introspectionQueryManyToMany, introspectionQueryOneToMany } from '$lib/queries';
import type { PageServerLoad } from './$types';
import type { Schema } from '$lib/types';

export const load: PageServerLoad = async () => {
	const queries = [introspectionQueryBasic, introspectionQueryOneToMany, introspectionQueryManyToMany];
	const [tables, oneToMany, manyToMany] = await Promise.all(queries.map(query => db.execute(query)));

	// Формируем JSON-объект
	const schema: Schema = {};
	tables.forEach((row: any) => {
		if (!schema[row.table_name]) {
			schema[row.table_name] = { columns: [], relations: { oneToMany: [], manyToMany: [] } };
		}
		schema[row.table_name].columns.push({
			name: row.column_name,
			type: row.data_type,
			nullable: row.is_nullable === 'YES'
		});
	});

	oneToMany.forEach((rel: any) => {
		if (schema[rel.child_table]) {
			schema[rel.child_table].relations.oneToMany.push({
				column: rel.child_column,
				references: { table: rel.parent_table, column: rel.parent_column }
			});
		}
	});

	manyToMany.forEach((rel: any) => {
		if (schema[rel.first_table] && schema[rel.second_table]) {
			// Добавляем связь к первой таблице
			schema[rel.first_table].relations.manyToMany.push({
				via: rel.link_table,
				targetTable: rel.second_table,
				ownColumn: rel.first_column,
				targetColumn: rel.second_column
			});

			// Добавляем связь ко второй таблице
			schema[rel.second_table].relations.manyToMany.push({
				via: rel.link_table,
				targetTable: rel.first_table,
				ownColumn: rel.second_column,
				targetColumn: rel.first_column
			});
		}
	});

	return { schema };
};
