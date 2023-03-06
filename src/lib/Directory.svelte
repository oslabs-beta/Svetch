<script>
	import { canvas } from '../store';
	import Folder from './Folder.svelte';
	import fileUtility from '../utils/fileUtility';

	let root;

	const updateRoot = () => {
		root = fileUtility.createFileTree();
		fileUtility.sort(root.children);
	};

	$: updateRoot($canvas);
</script>

<Folder name={root.name} children={root.children} expanded={true}></Folder>
