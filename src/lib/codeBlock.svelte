<script>
  import { HighlightSvelte } from 'svelte-highlight';
  import obsidian from 'svelte-highlight/styles/obsidian';

  export let code;
</script>

 
<svelte:head>
  {@html obsidian}
</svelte:head>

<div id = "codeBlock">
  <HighlightSvelte {code} style="overflow: hidden" />
</div>

<style>
  #codeBlock {
    overflow: hidden;
  }
</style>