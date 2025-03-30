import { json } from '@sveltejs/kit';
import { db } from '$lib/db';

export async function GET({ params }) {
	const table = params.table;
	const data = await db.execute(`SELECT * FROM ${table}`);
	return json(data);
}

export async function POST({ params, request }) {
	const table = params.table;
	const values = await request.json();
	const keys = Object.keys(values).join(',');
	const vals = Object.values(values)
		.map((v) => `'${v}'`)
		.join(',');
	await db.execute(`INSERT INTO ${table} (${keys}) VALUES (${vals})`);
	return json({ success: true });
}

export async function DELETE({ params, url }) {
	const table = params.table;
	const id = url.searchParams.get('id');
	await db.execute(`DELETE FROM ${table} WHERE id = ${id}`);
	return json({ success: true });
}
