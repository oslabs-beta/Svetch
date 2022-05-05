<script>
	import { Box } from "../boxClass.js" 

	const htmlElements = [
		{id: 1, name: "h1"}, 
		{id: 2, name: "img"}, 
		{id: 3, name: "paragraph"}
	]; 

	const createBox = (name) => {
		const result = new Box(10, 10, 100, 50, name); 
		result.drawNewRect(); 
		return result; 
	}

</script>


<!-- //div contains html elements list declared above -->
<div id = "el">
	<h1>HTML Elements</h1>
	<ul>
		{#each htmlElements as element}
		<!-- on:click should trigger DrawNewRect -->
			<button >{element.name}</button>
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