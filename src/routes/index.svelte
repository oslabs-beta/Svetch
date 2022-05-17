<script>
import Elements from "../lib/Elements.svelte";
import Canvas from '../lib/Canvas.svelte'
import Tree from '../lib/Tree.svelte'
import CodeBlock from '../lib/codeBlock.svelte';
import fileUtility from '../utils/fileUtility';
import canvasUtility from '../utils/canvasUtility';
import Directory from '../lib/Directory.svelte';
import Header from '../lib/Header.svelte';
import Switch from '../lib/Switch.svelte';
import { canvas } from '../store.js';
import axios from "axios";
import { onMount } from 'svelte';
import { options } from "../store.js"



let toggled = true;
let selected = 'index';
let code;
let canvasStore;
canvas.subscribe((val) => canvasStore = val);

//$:console.log(selected)
$: {
  if (canvasStore.index.children.length === 0){
    updateSelected('index');
  }
}

//$: {console.log(canvasStore)}
$: {canvasStore;
  code = fileUtility.parse(selected)[0].data;
}

const updateSelected = (newSelection) => {
  if (selected === newSelection) selected = null;
  selected = newSelection;
}

function toggle() {
  toggled = !toggled;
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
<section class="visualizerPanel">
<div id = "switch">
    <Switch bind:checked={toggled} ></Switch>
</div>
{#if toggled}
  <!-- <Canvas bind:toggled={toggled}/> -->
  <Canvas bind:boxSelected= {selected}/>
{:else}
  <!-- <Tree bind:toggled={toggled}/> -->
  <Tree/>
{/if}
</section>
<section class="fileDirectoryPanel">
  <Directory />
</section>
<section class="codeBlockPanel">
  <CodeBlock code={code}/>

</section>
<section class="actionButtonsPanel">
  <button on:click = {() => {canvasUtility.createChild('div1', 'div', 'index'); updateSelected('div1'); }}>Add div1 </button>
  <button on:click = {() => {canvasUtility.createChild('div2', 'div', 'index'); updateSelected('div2'); }}>Add div2 </button>
  <!-- <button on:click = {() => {canvasUtility.createChild('button1', 'button', 'index');updateSelected('button1') }}>Add booty </button>  -->
  <button on:click = {() => {canvasUtility.createChild('p1', 'p', 'index');updateSelected('p1')}}>Add p </button>
  <button on:click = {() => {canvasUtility.createChild('p1', 'p', 'div1');updateSelected('p1')}}>Add p to div1 </button>
  <button on:click = {() => {updateSelected('index')}}>Show Index</button>
  <button on:click = {() => {updateSelected('div1')}}>Show Div1</button>
  <button on:click = {() => {updateSelected('div2')}}>Show Div2</button>
  <button on:click = {() => console.log($options)}>grab files</button>
  <!-- <button on:click = {console.log(boxes)}>boxes?</button> -->
</section>