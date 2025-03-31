<script lang="ts">
	import Icon from './icon.svelte';

	let {
		class: className = '',
		iconClass = '',
		icon = '',
		text = '',
		color = {
			background: 'hover:bg-gray-700',
			icon: 'fill-gray-700'
		},
		...rest
	} = $props();
</script>

<button class="group rounded-lg {color.background} {className}" aria-label="button" {...rest}>
	{#if icon}
		<Icon class="m-1.5" pathClass="group-hover:fill-white {color.icon} {iconClass}" path={icon} />
	{:else}
		{text}
	{/if}
</button>
