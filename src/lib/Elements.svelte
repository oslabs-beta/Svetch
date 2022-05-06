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
<h1>HTML Elements</h1>
<ul>
	<!--loops through the htmlElements array and displays each value as a list item-->
	{#each htmlElements as element}
		<li on:mousedown={dragging}>
			{element.name}
		</li>
	{/each}
</ul>

<style>
h1 {
	padding-top: 1rem;
	text-align: center;
}
ul {
	padding: 2.25rem;
}
</style>