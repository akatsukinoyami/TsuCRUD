export const introspectionQueryManyToMany = `
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
`;
