<script>
	import { onMount } from 'svelte';
	import fileUtility from '../utils/fileUtility';
	import canvasUtility from '../utils/canvasUtility';
	import optionsUtility from '../utils/optionsUtility';
	import { goto } from '$app/navigation';
	import { canvas, options } from '../store';
	import svetchSVG from '../../static/svetch.svg?raw';
	import Modal, {getModal} from './Modal.svelte';
	
	export let user;

	let projectName;
	let repoName;
	let logo;

	const saveState = async (url) => {
		const state = {};
		state.canvas = { ...$canvas };
		state.options = { ...$options };
		if (url === `/login?repoName=${repoName.value}`) goto(url+'&state='+JSON.stringify(state));
		else goto(url+'?state='+JSON.stringify(state));
	};

	onMount(() => {
		logo.innerHTML = svetchSVG;
		logo.children[0].style = "flex: auto; margin: -0.5rem;";
	});
</script>


<div style="flex:1;">
	<button on:click={()=>getModal('newProject').open()}>
		New Project
	</button>

	<Modal id="newProject">
		<p>Creating a new project will delete the current project. Are you sure?</p>
		<button on:click = {() => {canvasUtility.reset(); optionsUtility.reset(); getModal('newProject').close()}} >Confirm</button>
	</Modal>

	<button on:click = {() => getModal('download').open()}>
			Download Project
	</button>
	<Modal id="download">
		<p>Enter a name for your project</p>
		<input bind:this={projectName} type="text" length = 20 value="" >
		<button on:click = {() => {fileUtility.downloadProject(projectName.value); getModal('download').close()}}>Save</button>
	</Modal>

	<Modal id="export">
		<p>Enter a name for your new repository</p>
		<input bind:this={repoName} type="text" length = 20 value="" >
		<button on:click = {() => {saveState(`/login?repoName=${repoName.value}`); getModal('export').close()}}>Export</button>
	</Modal>

	<!-- conditionally render these two buttons -->
		{#if user}
			<button on:click = {() => getModal('export').open()}>Export</button>
		{/if}
</div>
<div id="logoContainer" bind:this={logo}>
	<!-- logo added to div after mounting to the DOM -->
</div>
<div style="display: flex; justify-content: end; flex: 1;">
	{#if user}
		<button on:click = {() => saveState('/logout')} style="margin: unset;">Sign out</button>
	{:else}
		<button on:click = {() => saveState('/login')} style="margin: unset;">Sign In with GitHub</button>
	{/if}
</div>

	<style>
		button {
			border-radius: 5px;
		}
		
		#logoContainer {
			display: flex; 
			flex: 1; 
			overflow: hidden;
		}
	</style>