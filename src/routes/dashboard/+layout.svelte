<script lang="ts">
	import Header from '$lib/components/header.svelte';

	let { data, children } = $props();

	let tables = $state(Object.keys(data.schema));
</script>

<Header {tables}>
  {@render children?.()}
</Header>
