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
	.h1Drag {
		user-select: none; 
		position: absolute; 
		border: solid 2px gray; 
		cursor: move; 
	}
</style>

<svelte:window on:mouseup={stop} on:mousemove={move}/>

<section class="h1Drag" on:mousedown={start} style="left: {left}px; top: {top}px;">
<h2>H1 Header</h2>
</section>