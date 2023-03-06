<script>
  import File from './File.svelte';


  export let name;
  export let children;
  export let expanded = false;
  
  const toggleExpansion = () => {
    expanded = !expanded;
  };
</script>

<h4 on:click={toggleExpansion}>{name}</h4>
{#if expanded}
  <ul>
    {#each children as file}
      <li>
        {#if file.children}
          <svelte:self {...file}/>
        {:else}
          <File {...file}/>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  li {
    margin-left: 1rem;
  }
</style>