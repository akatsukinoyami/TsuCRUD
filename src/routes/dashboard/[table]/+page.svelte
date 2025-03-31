<script lang="ts">
	import { Table } from '$lib/components';
	import type { PageProps } from './$types';

	let props: PageProps = $props();
</script>

<Table {...props.data} />
