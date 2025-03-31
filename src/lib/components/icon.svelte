<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		[k: string]: string | number | Snippet | undefined;
		class?: string;
		path?: string;
		size?: number;
		height?: number;
		width?: number;
		pathClass?: string;
		fill?: string;
		children?: Snippet;
	};

	let {
		class: className = '',
		path = '',
		size = 24,
		height = size,
		width = size,
		pathClass = '',
		fill = 'none',
		children,
		...rest
	}: Props = $props();
</script>

<svg
	class={className}
	{width}
	{height}
	{fill}
	viewBox="0 0 {width} {height}"
	xmlns="http://www.w3.org/2000/svg"
	style:min-width={width}
	style:min-height={height}
>
	{#if children}
		{@render children()}
	{:else if Array.isArray(path)}
		{#each path as d}
			<path {d} {...rest} class={pathClass} />
		{/each}
	{:else}
		<path d={path} {...rest} class={pathClass} />
	{/if}
</svg>
