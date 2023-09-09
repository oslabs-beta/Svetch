<script>
  import Canvas from '../lib/Canvas.svelte'
  import CodeBlock from '../lib/CodeBlock.svelte';
  import Directory from '../lib/Directory.svelte';
  import Guide from '../lib/Guide.svelte';
  import Switch from '../lib/Switch.svelte';
  import Tree from '../lib/Tree.svelte'
  import fileUtility from '../lib/utils/fileUtility';
  import canvasUtility from '../lib/utils/canvasUtility'
  import { canvas, library, selectedComponent } from '../store';

  export let data;

  let toggled = false;
  let code;
  let name;
  let treeHeight;


  $: {
    if ($canvas) $selectedComponent = $selectedComponent;
    const tree = canvasUtility.createTree({...$canvas});
    const { components, files } = fileUtility.parse(tree);
    const key = components.get($selectedComponent);
    code = files.get(key).content;
    name = `${key}.svelte`
  }
</script>

<section id='GuidePane'>
  <Guide />
</section>
<section id='CanvasPane' bind:clientHeight={treeHeight}>
  <div id='switch'>
    <Switch bind:checked={toggled} ></Switch>
  </div>
  {#if toggled}
    <Tree height={treeHeight}/>
  {:else}
    <Canvas state={data.state}/>
  {/if}
</section>
<section id='CodeBlockPane'>
  <CodeBlock code={code} fileName={name}/>
</section>
<section id='DirectoryPane'>
  <Directory />
</section>

<style>
  #GuidePane {
    grid-area: 2 / 1 / 4 / 2;
    padding-left: 10px;
    padding-right: 10px;
    overflow: hidden; 
    background-color: #B0B8BF;
    color: #001829;
    display: flex;
    flex-direction: column;
    border: 1px solid #003659;
  }
  #CanvasPane {
    grid-area: 2 / 2 / 3 / 5;
    background-color: #282b2e;
  }
  #CodeBlockPane {
    grid-area: 3 / 2 / 4 / 4;
    background: #282b2e;
    overflow: hidden;
    padding-right: 0.75rem;
    padding-left: 1rem;
    position: relative;
  }
  #switch{
    right: 2vw;
    top: 2vw;
    position: absolute;
  }
  section {
    background: #6B737B; 
    color: #fefefe;
    border: 1px solid #00274C;
    border-radius: 12px;
  }
  #DirectoryPane {
    grid-area: 3 / 4 / 4 / 4;
    padding: 2rem;
    overflow-y: auto;
    background-color: #282b2e;
    color: #d7dce0;
    position: relative;
  }
</style>