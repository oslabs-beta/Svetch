<script>
  import { HighlightSvelte } from "svelte-highlight";
  import monokai from "svelte-highlight/styles/monokai";
  export let code = 'test code';
</script>

<svelte:head>
  {@html monokai}
</svelte:head>

<HighlightSvelte {code} />