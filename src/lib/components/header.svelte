<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { TextTransformer } from "$lib/utils";
	import Select from "./select.svelte";

  let {
    links = [
      { href: 'dashboard', label: "Dashboard" },
    ],
    tables,
    children
  } = $props(); 

  let mobileMenuState = $state(false);

  function changeTable(value: string) {
    const path = page.url.pathname.split('/');
    console.log(path, `/${path[1]}/${value}`);
    goto(`/${path[1]}/${value}`);
  }

  function linkClasses(href: string, mobile: boolean = false) {
    return {
      "block": mobile,
      "rounded-md px-3 py-2 text-sm font-medium": true,
      "bg-gray-900 text-white": page?.url?.pathname.startsWith(`${href}/`),
      "text-gray-300 hover:bg-gray-700 hover:text-white": !page?.url?.pathname.startsWith(`${href}/`),
    }
  }
</script>
<div class="min-h-full">
  <div class="bg-gray-800 pb-32">
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="border-b border-gray-700">
          <div class="flex h-16 items-center justify-between px-4 sm:px-0">
            <div class="flex items-center">
              <div class="shrink-0">
                <img class="size-8" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company">
              </div>
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                  {#each links as { href, label }}
                    <a href="{page.url.origin}/{href}" class={linkClasses(href)} aria-current="page">{label}</a>
                  {/each}
                </div>
              </div>
            </div>
            <div class="hidden md:block">
              <div class="ml-4 flex items-center md:ml-6">
                <Select
                  onselect={changeTable}
                  options={tables.map((table: string) => ({ id: table, name: new TextTransformer(table).capitalize() }))}
                  defaultName="Select Table"
                  right
                />
              </div>
            </div>
            <div class="-mr-2 flex md:hidden">
              <!-- Mobile menu button -->
              <button type="button" class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden" aria-controls="mobile-menu" aria-expanded="false" onclick={() => mobileMenuState = !mobileMenuState}>
                <span class="absolute -inset-0.5"></span>
                <span class="sr-only">Open main menu</span>
                <!-- Menu open: "hidden", Menu closed: "block" -->
                <svg 
                  class={{ "size-6": true, block: !mobileMenuState, hidden: mobileMenuState }}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke-width="1.5" 
                  stroke="currentColor" 
                  aria-hidden="true" 
                  data-slot="icon"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <!-- Menu open: "block", Menu closed: "hidden" -->
                <svg 
                  class={{ "size-6": true, block: mobileMenuState, hidden: !mobileMenuState }}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke-width="1.5" 
                  stroke="currentColor" 
                  aria-hidden="true" 
                  data-slot="icon"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {#if mobileMenuState}
        <div class="border-b border-gray-700 md:hidden" id="mobile-menu">
          <div class="space-y-1 px-2 py-3 sm:px-3">
            {#each links as { href, label }}
              <a href="{page.url.origin}/{href}" class={linkClasses(href, true)} aria-current="page">{label}</a>
            {/each}

            <Select
              onselect={changeTable}
              options={tables.map((table: string) => ({ id: table, name: table }))}
              defaultName="Select Table"
            />
          </div>
        </div>
      {/if}
    </nav>
    <header class="py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-white">
          {links.find(({ href }) => page?.url?.pathname.startsWith(`/${href}`))?.label}
        </h1>
      </div>
    </header>
  </div>

  <main class="-mt-32">
    <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div class="rounded-lg bg-white px-5 py-6 shadow-sm sm:px-6">
        {@render children?.()}
      </div>
    </div>
  </main>
</div>
