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
<Folder name={root.name} children={root.children} expanded={true}></Folder>
