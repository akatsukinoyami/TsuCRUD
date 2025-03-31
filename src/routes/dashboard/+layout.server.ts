import { db } from '$lib/db';
import {
	introspectionQueryBasic,
	introspectionQueryManyToMany,
	introspectionQueryOneToMany
} from '$lib/queries';
import type { Schema } from '$lib/types';

export const load = async () => {
	const queries = [
		introspectionQueryBasic,
		introspectionQueryOneToMany,
		introspectionQueryManyToMany
	];
	const [tables, oneToMany, manyToMany] = await Promise.all(
		queries.map((query) => db.execute(query))
	);

	// Формируем JSON-объект
	const schema: Schema = {};
	tables.forEach(({ table_name, column_name, data_type, is_nullable }: any) => {
		if (!schema[table_name]) {
			schema[table_name] = { columns: [], relations: { oneToMany: [], manyToMany: [] } };
		}
		schema[table_name].columns.push({
			name: column_name,
			type: data_type,
			nullable: is_nullable === 'YES'
		});
	});

	oneToMany.forEach(({ parent_table, parent_column, child_table, child_column }: any) => {
		if (schema[child_table]) {
			schema[child_table].relations.oneToMany.push({
				column: child_column,
				references: { table: parent_table, column: parent_column }
			});
		}
	});

	manyToMany.forEach(
		({ first_table, second_table, link_table, first_column, second_column }: any) => {
			if (schema[first_table] && schema[second_table]) {
				// Добавляем связь к первой таблице
				schema[first_table].relations.manyToMany.push({
					via: link_table,
					targetTable: second_table,
					ownColumn: first_column,
					targetColumn: second_column
				});

				// Добавляем связь ко второй таблице
				schema[second_table].relations.manyToMany.push({
					via: link_table,
					targetTable: first_table,
					ownColumn: second_column,
					targetColumn: first_column
				});
			}
		}
	);

	return { schema };
};
