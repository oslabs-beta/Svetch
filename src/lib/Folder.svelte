<script>
  import File from './File.svelte';

  export let name;
  export let children;
  export let expanded = false;
  
  const toggleExpansion = () => {
    expanded = !expanded;
  };
</script>

<h4 class:expanded on:click={toggleExpansion}>{name}</h4>
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
  h4 {
		padding: 0 0 0 2rem;
		background: url(../../static/folder.svg) 0 0rem no-repeat;
		background-size: 1.1rem 1.1rem;
		font-weight: bold;
		cursor: pointer;
		border: none;
		margin: 0;
	}
  h4.expanded {
    background: url(../../static/folder-open.svg) 0 0rem no-repeat;
    background-size: 1.1rem 1.1rem;
  }
  ul {
    padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
  }
  h4 {
    color: white;
  }
  h4:hover {
    cursor: pointer;
  }
</style>