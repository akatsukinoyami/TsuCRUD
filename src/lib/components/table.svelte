<script lang="ts">
  let {
    typename="user",
    description="A list of all the users in your account including their name, title, email and role.",
    headers=[],
    data=[]
  } = $props();
</script>

<div class="px-4 sm:px-6 lg:px-8">
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-base font-semibold text-gray-900">{typename}</h1>
      <p class="mt-2 text-sm text-gray-700">{description}</p>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <button type="button" class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add {typename}</button>
    </div>
  </div>

  <div class="mt-8 flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              {#each headers as header, i}
                <th 
                  scope="col" 
                  class="
                    {i ? "px-3 py-3.5" : "py-3.5 pr-3 pl-4 sm:pl-0"}
                    text-left text-sm font-semibold text-gray-900
                  "
                >{header}</th>
              {/each}
              <th scope="col" class="relative py-3.5 pr-4 pl-3 sm:pr-0">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each data as row}
              <tr>
                {#each row as column, i}
                  <td 
                    class="
                      {i ? 'px-3 py-4 text-gray-500' : 'py-4 pr-3 pl-4 sm:pl-0 text-gray-900'} 
                      text-sm font-medium whitespace-nowrap 
                  ">{column}</td>
                  
                {/each}
                <td class="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                  <a href={"#"} class="text-indigo-600 hover:text-indigo-900">Edit</a>
                  <a href={"#"} class="text-indigo-600 hover:text-indigo-900">Delete</a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>