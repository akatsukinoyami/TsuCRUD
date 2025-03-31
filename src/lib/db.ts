import pg from 'pg';

const pool = new pg.Pool({
	connectionString: import.meta.env.VITE_DB_URL
});

export const db = {
	async execute(query: string, params = []) {
		const client = await pool.connect();
		try {
			const res = await client.query(query, params);
			return res.rows;
		} finally {
			client.release();
		}
	}
};
