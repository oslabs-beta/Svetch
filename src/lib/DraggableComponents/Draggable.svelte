<script>
	export let left = 20; 
	export let top = 20; 
	let moving = false; 
	
	const start = () => moving = true; 
	const stop = () => moving = false; 
	const move = (e) => {
		if (moving){
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
	}
</style>

<svelte:window on:mouseup={stop} on:mousemove={move}/>

<section class="draggable" on:mousedown={start} style="left: {left}px; top: {top}px;">
<slot></slot>
</section>