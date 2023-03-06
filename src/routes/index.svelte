<script context="module" >
	export async function load({ session }) {
		return {
			props: {
				state: session.state
			}
		}
	}
</script>

<script>
  import Canvas from '../lib/Canvas.svelte'
  import CodeBlock from '../lib/CodeBlock.svelte';
  import Directory from '../lib/Directory.svelte';
  import Elements from "../lib/Elements.svelte";
  import Switch from '../lib/Switch.svelte';
  import Tree from '../lib/Tree.svelte'
  import fileUtility from '../utils/fileUtility';
  import canvasUtility from '../utils/canvasUtility'
  import { canvas, selectedComponent } from '../store';

  export let state;

  let toggled = false;
  let code;
  let treeHeight;

  $: {
    if ($canvas) $selectedComponent = $selectedComponent;
    const tree = canvasUtility.createTree();
    const { components, files } = fileUtility.parse(tree);
    const key = components.get($selectedComponent);
    code = files.get(key).content;
  }

</script>

<section class="elementsPanel">
  <Elements /><br>
</section>
<section class="visualizerPanel" bind:clientHeight={treeHeight}>
  <div id = "switch">
    <Switch bind:checked={toggled} ></Switch>
  </div>
  {#if toggled}
    <Tree height={treeHeight}/>
  {:else}
    <Canvas state={state}/>
  {/if}
</section>
<section class="codeBlockPanel">
  <br>
  <CodeBlock code={code}/>
</section>
<section class="fileDirectoryPanel">
  <Directory />
</section>
<style>

  .elementsPanel {
    grid-area: 2 / 1 / 4 / 2;
    padding-left: 10px;
    padding-right: 10px;
    height: 100%;
  }

  .visualizerPanel {
    grid-area: 2 / 2 / 3 / 5;
    box-shadow: 5px 5px 4px #003659;
    background-color: #7E858C;
  }

  .codeBlockPanel {
    grid-area: 3 / 2 / 4 / 4;
    background: #292929;
    overflow: scroll;
  }

  #switch{
    right: 2vw;
    position: absolute;
  }

  section {
    background: #6B737B; 
    color: #fefefe;
    border: 1px solid #003659;
    border-radius: 20px;
    box-shadow: 5px 5px 4px #003659;
  }

  .fileDirectoryPanel {
    grid-area: 3 / 4 / 4 / 4;
    padding-top: 15px;
    padding-left: 30px;
    box-shadow: 5px 5px 4px #003659;
    overflow: hidden;
    overflow-y: scroll;
  }

  .elementsPanel {
    box-shadow: 5px 5px 4px #003659;
    overflow: hidden; 
  }
</style>