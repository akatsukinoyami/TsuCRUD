import pg from 'pg';

const pool = new pg.Pool({
	connectionString: 'postgres://katsu:Dorkoz-boxpek-7hiqgu@192.168.31.10:5433/katsu'
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
