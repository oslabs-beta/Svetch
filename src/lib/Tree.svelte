<script>
import { onMount } from 'svelte';
import d3TreeRenderer from '../utils/d3TreeRenderer.js'; 
import { canvas } from '../store.js';
export let toggled = false;

let el;
let data;
const width = document.body.clientWidth * 0.5;
let fakeData = {
	name: 'App.svelte',
	children: [
		{
			name: 'Folder.svelte',
			children: [
				{ name: 'File.svelte' },
				{ name: 'fileIcon.png' }
			]
		},
		{
			name: 'Charts',
			children: [
				{ name: 'ChartContainer.svelte' },
				{ name: 'Link.svelte' }
			]
		},
		{ name: 'Header.svelte' },
		{ name: 'Canvas.svelte' },
		{ name: 'Codebox.svelte' }
	]
};

function parseCanvas(component) {
	const storeKey = component;
	const current = {...$canvas[storeKey]};

	const data = {
		name: component,
		children: []
	}

	const children = current.children;
	if (children) {
	children.forEach(child => {
		let scriptId = $canvas[child].scriptId;
		let childName = scriptId;

		if ($canvas[child].children.length) {
			childName = child;
		}
		data.children.push(parseCanvas(childName, scriptId));
	});
	}

	return data;
}

data = parseCanvas('index');
const renderTree = () => d3TreeRenderer.render(data, el, width);

onMount(() => {
	renderTree();
});


</script>

<div id="tree">
	<!-- <Switch bind:checked={toggled} ></Switch> -->
	<div class="center" >
		<svg bind:this={el}></svg>
	</div>
</div>

<style>
/* .switch {
	position: absolute;
	right: 2vw;
} */
.center {
	display: flex;
	flex-direction: column;
	justify-content: center;
}
</style>