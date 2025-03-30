export const introspectionQueryOneToMany =  `
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
`;
