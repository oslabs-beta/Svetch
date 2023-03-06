<script>
	import { onMount } from 'svelte';
	import d3TreeRenderer from '../utils/d3TreeRenderer';
	import canvasUtility from '../utils/canvasUtility';


	export let height;

	let el;
	let data;
	let width;

	data = canvasUtility.createTree();
	const renderTree = () => d3TreeRenderer.render(data, el, width);

	onMount(() => {
		width = document.getElementById('tree').offsetWidth;
		renderTree();
	});
</script>

<div id="tree">
	<div class="center" style="height:{height}px">
		<svg bind:this={el}></svg>
	</div>
</div>

<style>
.center {
	display: flex;
	flex-direction: column;
	justify-content: center;
}
</style>