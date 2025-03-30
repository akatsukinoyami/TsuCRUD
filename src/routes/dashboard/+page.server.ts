import { db } from '$lib/db';
import type { PageServerLoad } from './$types';
import type { Schema } from '$lib/types';

export const load: PageServerLoad = async () => {
	// Получаем таблицы и их колонки
	const tables = await db.execute(`
    SELECT table_name, column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
  `);

	// Получаем связи one-to-many
	const oneToMany = await db.execute(`
    SELECT 
      tc.table_name AS child_table, 
      kcu.column_name AS child_column,
      ccu.table_name AS parent_table,
      ccu.column_name AS parent_column
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu 
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu 
      ON ccu.constraint_name = tc.constraint_name
    WHERE constraint_type = 'FOREIGN KEY'
  `);

	// Получаем связи many-to-many (через таблицы-связки)
	const manyToMany = await db.execute(`
    SELECT
      kc1.table_name AS link_table,
      kc1.column_name AS first_key,
      cc1.table_name AS first_table,
      cc1.column_name AS first_column,
      kc2.column_name AS second_key,
      cc2.table_name AS second_table,
      cc2.column_name AS second_column
    FROM information_schema.key_column_usage kc1
    JOIN information_schema.referential_constraints rc1 
      ON kc1.constraint_name = rc1.constraint_name
    JOIN information_schema.constraint_column_usage cc1 
      ON rc1.constraint_name = cc1.constraint_name
    JOIN information_schema.key_column_usage kc2 
      ON kc1.table_name = kc2.table_name 
      AND kc1.column_name != kc2.column_name
    JOIN information_schema.referential_constraints rc2 
      ON kc2.constraint_name = rc2.constraint_name
    JOIN information_schema.constraint_column_usage cc2 
      ON rc2.constraint_name = cc2.constraint_name
    WHERE kc1.table_name IN (
      SELECT table_name FROM information_schema.tables
    )
    AND cc1.table_name != cc2.table_name;
  `);

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
