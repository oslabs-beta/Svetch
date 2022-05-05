<script>
  
  // @ts-ignore
import Elements from "../lib/Elements.svelte"; 
  // @ts-ignore
import Canvas from '../lib/Canvas.svelte'
  // @ts-ignore
import Tree from '../lib/Tree.svelte'
import CodeBlock from '../lib/codeBlock.svelte';
import fileUtility from '../utils/fileUtility';
import canvasUtility from '../utils/canvasUtility';
import Directory from '../lib/Directory.svelte';
import { canvas } from '../store.js';
import Draggable from "../lib/DraggableComponents/Draggable.svelte";
 
  let toggled = true;
  let selected = 'index';
  let code;

  $: {
    code = fileUtility.parse(selected)[0].data;
    console.log($canvas);
  }

  function toggle() {
		toggled = !toggled;
	}
  const updateSelected = (newSelection) => {
    if (selected === newSelection) selected = null;
    selected = newSelection;
  }
</script>

<main>
  <!-- <div id = "header">Svetch mock header</div> -->
  <!-- <button id = 'togBut' on:click = {toggle}> switch between canvas and tree </button> -->
  <div id = 'main' >

<Elements id = "el"/>
{#if toggled}
<Canvas bind:toggled = {toggled}/>
{:else}
<Tree bind:toggled = {toggled}/>
{/if}
</div>
<div id = "FileandCode">
<Directory />
<CodeBlock code={code}/> 

</div>

<button on:click = {() => {canvasUtility.createChild('div1', 'div', 'index'); updateSelected('div1'); }}>Add div1 </button>
<button on:click = {() => {canvasUtility.createChild('div2', 'div', 'index'); updateSelected('div2'); }}>Add div2 </button>
<!-- <button on:click = {() => {canvasUtility.createChild('button1', 'button', 'index');updateSelected('button1') }}>Add booty </button>  -->
<button on:click = {() => {canvasUtility.createChild('p1', 'p', 'index');updateSelected('p1')}}>Add p </button>
<button on:click = {() => {canvasUtility.createChild('p1', 'p', 'div1');updateSelected('p1')}}>Add p to div1 </button>
<button on:click = {() => {updateSelected('index')}}>Show Index </button>
<button on:click = {() => {updateSelected('div1')}}>Show Div1 </button>
<button on:click = {() => {updateSelected('div2')}}>Show Div2 </button>
<button on:click = {() => {() => console.log('all files:', fileUtility.parse('index', true))}}>grab files </button>
</main>
<style>
	#main {
    padding-top: .5vh;
    display: flex;
    flex-direction: row;

		text-align: center;
	
		width: 100vw;
    height: 100%;
		margin: 0 auto;
    margin-bottom: 0px;
    padding-bottom: 0px;
   
	}
  #FileandCode{
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 30vh;
  }
  
  
  
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>