<script>
	import { onMount } from 'svelte';
	import fileUtility from '../utils/fileUtility';
	import canvasUtility from '../utils/canvasUtility';
	import optionsUtility from '../utils/optionsUtility';
	import { goto } from '$app/navigation';
	import { canvas, options } from '../store';
	import svetchSVG from '../../static/svetch.svg?raw';
	import Modal, {getModal} from './Modal.svelte';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { faDownload, faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
	import Icon from './Icon.svelte';
	import Button from './Button.svelte';
	
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
		logo.children[0].style = "flex: auto; margin: -0.4rem;";
	});
</script>


<div style="flex:1; display:flex; gap:0.4rem;" >
	<Button on:click = {()=> getModal('newProject').open()}>
		<slot slot='icon' class='icon'>
			<Icon faIcon={faPlus} style={'width: 18px; height: 18px;'}></Icon>
		</slot>
		<slot slot='text'>
			New Project
		</slot>
	</Button>

	<Modal id="newProject">
		<p>Creating a new project will delete the current project.</p>
		<p>Are you sure?</p>
		<Button rightAlign={true} on:click = {() => {canvasUtility.reset(); optionsUtility.reset(); getModal('newProject').close()}}>
			<slot slot='text'>
				Confirm
			</slot>
		</Button>
	</Modal>

	<Button on:click = {() => getModal('download').open()}>
		<slot slot='icon' class='icon'>
			<Icon faIcon={faDownload} style={'width: 18px; height: 18px;'}></Icon>
		</slot>
		<slot slot='text'>
			Download
		</slot>
	</Button>

	<Modal id="download">
		<p>Enter a name for your project</p>
		<input bind:this={projectName} type="text" length = 20 value="" >
		<Button rightAlign={true} on:click = {() => {fileUtility.downloadProject(projectName.value); getModal('download').close()}}>
			<slot slot='text'>Save</slot>
		</Button>
	</Modal>

	{#if user}
		<Button iconAfter={true} on:click = {() => getModal('export').open()}>
			<slot slot='text'>Export to</slot>
			<slot slot='icon'>
				<Icon faIcon={faGithub} style={'width: 20px; height: 20px;'}></Icon>
			</slot>
		</Button>
	{/if}

	<Modal id="export">
		<p>Enter a name for your new repository</p>
		<input bind:this={repoName} type="text" length = 20 value="" >
		<Button rightAlign={true} on:click = {() => {saveState(`/login?repoName=${repoName.value}`); getModal('export').close()}}>
			<slot slot='text'>Export</slot>
		</Button>
	</Modal>
</div>

<div id="logoContainer" bind:this={logo}>
	<!-- logo added to div after mounting to the DOM -->
</div>

<div style="flex: 1; display:flex; flex-direction:row-reverse;">
	{#if user}
		<Button class='right' iconAfter={true} on:click = {() => saveState('/logout')}>
			<slot slot='text'>Sign out</slot>
			<slot slot='icon'>
				<Icon faIcon={faRightFromBracket} style={'width: 18px; height: 18px;'}></Icon>
			</slot>
		</Button>
	{:else}
		<Button class='right' iconAfter={true} on:click = {() => saveState('/login')}>
			<slot slot='text'>Sign in with</slot>
			<slot slot='icon'>
				<Icon faIcon={faGithub} style={'width: 20px; height: 20px;'}>
				</Icon>
			</slot>
		</Button>
	{/if}
</div>

	<style>
		#logoContainer {
			display: flex; 
			flex: 1; 
			overflow: hidden;
			height: 2rem;
		}
	</style>