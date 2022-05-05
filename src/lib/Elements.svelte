<script>
	//import H1Element from "./DraggableComponents/H1Element.svelte"; 
	//import PElement from "./DraggableComponents/PElement.svelte"; 
	//import ImgElement from "./DraggableComponents/ImgElement.svelte"; 
	//import Draggable from "./DraggableComponents/Draggable.svelte"; 

	const htmlElements = [
		{id: 1, name: "H1 Header"}, 
		{id: 2, name: "Image"}, 
		{id: 3, name: "Paragraph"}
	]; 

	//import {flip} from 'svelte/animate'; 
	//import { dndzone, TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';

	let inCanvas = false; 

	const dragging = (e) => {
		//triggered on mousedown of list item
		e.dataTransfer.dropEffect = "move"; 
		e.dataTransfer.setData("text", e.target.getAttribute("id"))

		//grab the current left and top position

		//track left and top position
			//update dynamically
	}

	const dropItem = () => {
		//triggered on mouseup of list item

		//if position of the list item is within canvas
			//add to canvas
			//rerender the list of html elements

		//else animate return to 

	}





</script>


<!-- //div contains html elements list declared above -->
<div id = "el">
	<h1>HTML Elements</h1>
		<ul>
			<!--loops through the htmlElements array and displays each value as a list item-->
			{#each htmlElements as element}
				<li on:mousedown={dragging}>
					{element.name}
				</li>
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
</style>