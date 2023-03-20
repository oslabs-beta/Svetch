<script>
import { onMount } from 'svelte';
import d3TreeRenderer from '../utils/d3TreeRenderer.js';
import { canvas } from '../store.js';


let el;
let data;
let width;
export let height;

const parseCanvas= (component, name = 'index') => {
	const current = {...$canvas[component]};
	const data = {
		name: name,
		children: []
	}
	const childNameCache = {};
	const children = current.children;
	if (children) {
		children.forEach(child => {
			
			let childName = $canvas[child].component.type;

			if ($canvas[child].children.length) {
				childNameCache[childName] = (childNameCache[childName] || 0) + 1; 
				childName = `${childName}_${childNameCache[childName]}`;
			}
			data.children.push(parseCanvas(child, childName));
		});
	}

	return data;
}


data = parseCanvas('index');
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