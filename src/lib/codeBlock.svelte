<script>
  import { HighlightSvelte } from "svelte-highlight";
  import obsidian from "svelte-highlight/styles/obsidian";
  export let code = 'test code';
</script>

<svelte:head>
  {@html obsidian}
</svelte:head>

<HighlightSvelte {code} />