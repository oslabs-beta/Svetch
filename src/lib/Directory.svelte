<script>
	import { canvas } from '../store.js';
  import Folder from './Folder.svelte';
	import fileUtility from '../utils/fileUtility.js';

	let root;

	const updateRoot = (canvasUpdated) => {
		root = fileUtility.createFileTree();
		fileUtility.sort(root.children);
	}

	$: {
		updateRoot({...$canvas})
	}
</script>
<!-- <h1>Component Directory</h1> -->
<div id ='dir'>
<Folder name={root.name} children={root.children} expanded={true}></Folder>
</div>

<style>
	#dir {
    width: 30vw;
    border: 2px solid black
  }
</style>