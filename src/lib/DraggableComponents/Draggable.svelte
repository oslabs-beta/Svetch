<script>
	let left = 20; 
	let top = 200; 
	let moving = false; 
	export let name; 
	let rightBoundary = 800; 
	let leftBoundary = 200; 
	let lowerBoundary = 650; 
	let upperBoundary = 50; 

	//const boundingObj = document.getElementById
	
	const start = () => moving = true; 

	//put conditional inside stop
		//if ouside of the boundaries of canvas, return to starting position
	const stop = () => {
		moving = false;

		//if the left or top positions are outside of the canvas boundaries, return to original position
			//otherwise leave in canvas and repopulate the draggables
		if ((left < leftBoundary | left > rightBoundary) | (top > lowerBoundary | top < upperBoundary )) {
			//reset the positions 
			console.log('Out of Bounds')
			
		}

		console.log(`${name} position at stop is left: ${left}, top: ${top}`);
		
		} 
	const move = (e) => {
		if (moving){
			// let originLeft = left; 
			// let originTop = top; 
			left += e.movementX;
			top += e.movementY; 
		}
	}
	
	
</script>

<style>
	.draggable {
		user-select: none; 
		position: absolute;
		border: solid 2px gray; 
		cursor: move; 
		/* height: 5%; 
		width: 15%;  */
		text-align: center;
	}
</style>

<svelte:window on:mouseup={stop} on:mousemove={move}/>

<section class="draggable" on:mousedown={start} style="left: {left}px; top: {top}px;">
<slot><h2>{name}</h2></slot>
</section>