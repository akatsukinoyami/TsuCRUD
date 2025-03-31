<script lang="ts">
  let {
    class: className = "",
    options = [],
    right = false,
    defaultOption = true,
    defaultValue = '',
    defaultName = '',
    value = $bindable(defaultOption ? defaultValue : options?.[0]?.id ?? ''),
    onselect = () => {},
  } = $props();

  let open = $state(false);
  let name = $state(defaultOption ? defaultName : options?.[0]?.name);

  function select(id: string, nameLocal: string) {
    value = id; 
    name = nameLocal; 
    open = false;
    onselect(id);
  }
</script>

{#snippet selectOption(id: string, nameLocal: string)}
  <button 
    class={{
      "block px-4 py-2 text-sm text-left text-gray-700 w-full": true,
      "bg-gray-100 text-gray-900 outline-hidden": id === value,
      "text-gray-700": id !== value,
    }}
    role="menuitem" 
    tabindex="-1" 
    onclick={() => select(id, nameLocal)}
  >
  {nameLocal}
  </button>
{/snippet}

<div class={className}>
  <div class="relative inline-block text-left">
    <div>
      <button 
        type="button" 
        onclick={() => open = !open}
        class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50" 
        aria-expanded="true" 
        aria-haspopup="true"
      >
        {name}
        <svg class="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
          <path 
            fill-rule="evenodd" 
            clip-rule="evenodd" 
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" 
          />
        </svg>
      </button>
    </div>

    <!--
      Dropdown menu, show/hide based on menu state.

      Entering: "transition ease-out duration-100"
        From: "transform opacity-0 scale-95"
        To: "transform opacity-100 scale-100"
      Leaving: "transition ease-in duration-75"
        From: "transform opacity-100 scale-100"
        To: "transform opacity-0 scale-95"
    -->
    {#if open}
      <div 
        class="absolute {right ? 'right-0' : ''} z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden" 
        role="menu" 
        aria-orientation="vertical" 
        aria-labelledby="menu-button" 
        tabindex="-1"
      >
        <div class="py-1" role="none">
          {#if defaultOption}
            {@render selectOption(defaultValue, defaultName)}
          {/if}
          {#each options as { id, name: nameLocal }}
            {@render selectOption(id, nameLocal)}
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>