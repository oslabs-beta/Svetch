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
  grid-area: 2 / 1 / 3 / 2;
  height: 100%;
}
.visualizerPanel {
  grid-area: 2 / 2 / 3 / 4;
}
.fileDirectoryPanel {
  grid-area: 3 / 1 / 4 / 2;
  padding: 2.25rem;
}
.codeBlockPanel {
  grid-area: 3 / 2 / 4 / 3;
}
#switch{
  right: 2vw;
  position: absolute;
}

section {
  background: #282b2e;
  color: #fefefe;
  border-radius: 20px;
}
button {
  border-radius: 5px;
}
.actionButtonsPanel {
  grid-area: 3 / 3 / 4 / 4;
  padding: 15px;
}
</style>

<section class="elementsPanel">
  <Elements />
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
<section class="fileDirectoryPanel">
  <Directory />
</section>
<section class="codeBlockPanel">
  <CodeBlock code={code}/>
</section>
<section class="actionButtonsPanel">

</section>