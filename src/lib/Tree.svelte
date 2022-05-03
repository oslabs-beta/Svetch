<script>
import { onMount } from 'svelte';
import d3TreeRenderer from '../utils/d3TreeRenderer.js';
import Switch from './Switch.svelte';
export let toggled = false;

let el;
const width = document.body.clientWidth * 0.5;
export let data = {
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

onMount(() => {
	d3TreeRenderer.render(data, el, width);
});


</script>

<div id = 'tree'>
    <label id = "switch" >
        <Switch bind:checked={toggled} ></Switch>
    </label>
    <div class="center" >
        <svg bind:this={el}></svg>	
    </div>
</div>               

<style>
    #tree{
       border: 2px solid black;
        /* height: 40em; */
        height: 70vh;
        width: 75vw;
        margin-left: 2%;
        border-radius: 15px;
    }
    #switch{
        position: absolute;
        right: 2vw;
    }
    .center {
        height: 70vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>