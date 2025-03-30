<script lang="ts">
	import { Table } from '$lib/components';
	import Header from '$lib/components/header.svelte';
	import { fetchData } from '$lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let tables = $state(Object.keys(data.schema));
	let selectedTable: string = $state('');
	let showedData: any[] = $state([]);
	let headers: any[] = $derived(data.schema[selectedTable]?.columns.map(({ name }) => name));

	$effect(() => {
		if (!selectedTable) return;
		fetchData(selectedTable, data.schema).then((data) => {
			showedData = data.map((row: any) => headers.map((name) => row[name]))
		});
	});
</script>

<Header bind:selectedTable bind:tables>
	{#if selectedTable}
		<Table typename={selectedTable} {headers} data={showedData} />
	{/if}
</Header>
