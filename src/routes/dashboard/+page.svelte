<script lang="ts">
	import Table from '$lib/components/table.svelte';
	import { fetchData } from '$lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let tables = Object.keys(data.schema);
	let selectedTable: string = $state('');
	let showedData: any[] = $state([]);
	let headers: any[] = $derived(data.schema[selectedTable]?.columns.map(({ name }) => name));

	$effect(() => {
		if (selectedTable)
			fetchData(selectedTable, data.schema).then(
				(data) => (showedData = data.map((row: any) => headers.map((name) => row[name])))
			);
	});
</script>

<select bind:value={selectedTable}>
	<option>Select Table</option>
	{#each tables as table}
		<option value={table}>{table}</option>
	{/each}
</select>

{#if selectedTable}
	<Table typename={selectedTable} {headers} data={showedData} />
{/if}
