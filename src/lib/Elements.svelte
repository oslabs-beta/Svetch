<script>
import { namespace } from "d3";

import Box from "../boxClass.js"
import drawNewRect from './Canvas.svelte'; 
import drawAll from '../boxClass.js'; 
	//import { drawNewRect } from './Canvas.svelte'
	const htmlElements = [
		{id: 1, name: "h1"}, 
		{id: 2, name: "img"}, 
		{id: 3, name: "paragraph"}
	]; 



	import createBox from '../routes/index.svelte';

	import context from './Canvas.svelte'; 

	export let boxArray; 

</script>


<!-- //div contains html elements list declared above -->
<div id = "el">
	<h1>HTML Elements</h1>
	<ul>
		{#each htmlElements as element}
		<!-- on:click should trigger DrawNewRect -->
			<button on:click = {() => {boxArray.push(new Box(50,50,100,50, element.name, context)); drawAll(boxArray)}}>{element.name}</button>
		{/each}
	</ul>
</div>

<style>
	h1 {
		text-align: center; 
	}
	#el{
		border: 2px solid black;
        /* height: 40em; */
        height: 70vh;
        width: 20vw;
        border-radius: 15px;
	}
	div {
		height: 500%; 
		width: 19%; 
		border: solid 1px gray; 
	}
	.elementItem{
		width: 80%;
		border: solid blue; 
		padding: 1px; 
	}
</style>