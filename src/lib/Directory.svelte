<script>
  import Label from './Label.svelte';
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
<Label text={'Directory'} fixedPos={{ parentSelector: '.fileDirectoryPanel' }}/>
<Folder name={root.name} children={root.children} expanded={true}></Folder>

<style>
	
</style>
