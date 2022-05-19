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
import Elements from "../lib/Elements.svelte";
import Canvas from '../lib/Canvas.svelte'
import Tree from '../lib/Tree.svelte'
import CodeBlock from '../lib/codeBlock.svelte';
import fileUtility from '../utils/fileUtility';
import canvasUtility from '../utils/canvasUtility';
import Directory from '../lib/Directory.svelte';
import Switch from '../lib/Switch.svelte';
import { canvas, options, selectedComponent } from '../store.js';



let toggled = false;
let code;
let treeHeight;
export let state;

$: {
  if ($canvas) $selectedComponent = $selectedComponent;
  code = fileUtility.parse($selectedComponent)[0].data;
}

</script>
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
.quickStartPanel {
  grid-area: 3 / 1 / 4 / 2;
  padding: 2.25rem;
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
  /* background: #707A81;  */
  background: #6B737B; 
  color: #fefefe;
  /* color: #070707; */
  border: 1px solid #003659;
  border-radius: 20px;
  box-shadow: 5px 5px 4px #003659;
}

button {
  border-radius: 5px;
}
.fileDirectoryPanel {
  grid-area: 3 / 4 / 4 / 4;
  padding-top: 15px;
  padding-left: 30px;
  box-shadow: 5px 5px 4px #003659;
}

.elementsPanel {
  box-shadow: 5px 5px 4px #003659;
  overflow: hidden; 
}
</style>

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
<!-- <section class="quickStartPanel">
  <h1>Quick Start will go here</h1>
</section> -->
<section class="codeBlockPanel">
  <br>
  <CodeBlock code={code}/>
</section>
<section class="fileDirectoryPanel">
  <Directory />
</section>