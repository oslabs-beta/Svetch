<script>
  import { HighlightSvelte } from 'svelte-highlight';
  import Label from './Label.svelte';

  export let code;
  export let fileName;

  let styles = `
    padding-right: 1rem; 
    font-family: 'Courier New', Courier, monospace;
    `;
</script>

<div id='CodeBlock'>
  <Label text={fileName} styles={styles}/>
  <HighlightSvelte {code} style='overflow: auto; tab-size:2; height:100%;' />
</div>

<style>
  #CodeBlock {
   height: 100%;
   overflow: hidden;
  }
</style>