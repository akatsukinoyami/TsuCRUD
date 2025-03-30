export type Column = {
	name: string;
	type: string;
	nullable: boolean;
};
export type OneToMany = {
	column: string;
	references: {
		table: string;
		column: string;
	};
};
export type ManyToMany = {
	via: string;
	targetTable: string;
	ownColumn: string;
	targetColumn: string;
};
export type TableSchema = {
	columns: Column[];
	relations: {
		oneToMany: OneToMany[];
		manyToMany: ManyToMany[];
	};
};
export type Schema = Record<string, TableSchema>;
