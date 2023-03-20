<script>
  import { HighlightSvelte } from 'svelte-highlight';
  import Label from './Label.svelte';
  import hlcss from '../../static/hl.css';


  export let code;
  export let fileName;
  let styles = `
    padding-right: 1rem; 
    font-family: 'Courier New', Courier, monospace;
    `;

</script>

 
<svelte:head>
  {@html `<style>${hlcss}</style>`}
</svelte:head>

<div id = "codeBlock">
  <Label text={fileName} styles={styles}/>
  <HighlightSvelte {code} style="overflow: auto; tab-size:2; height:100%" />
</div>

<style>
  #codeBlock {
   height: 100%;
   overflow: hidden;
  }
</style>