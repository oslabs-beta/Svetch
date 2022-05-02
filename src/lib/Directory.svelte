<script>
	import { canvas } from '../store.js';
  import Folder from './Folder.svelte';

	let root;
	
	const parse = (obj) => {
		const fileDirectory = {
			name: 'Src',
			children: []
		}
		fileDirectory.children.push({name:'index'});
		const keys = Object.keys(obj);
		const lib = {name:'Lib', children: []}
		if (keys.length > 1) fileDirectory.children.push(lib);
		delete obj['index'];
		const queue = keys;
		while (queue.length) {
			const current = queue.shift();
			lib.children.push({name:current});
		}
		return fileDirectory;
	}
	
	const sortFiles = (a, b) => {
		if (a.children && !b.children) {
			a.children.sort(sortFiles);
			return -1
		}
		if (b.children && !a.children) {
			b.children.sort(sortFiles);
			return 1
		}
		if (a.name < b.name) return -1;
		if (b.name < a.name) return 1;
		return 0;
	}

	$: {
		root = parse({...$canvas});
		root.children.sort(sortFiles);
	}
</script>
<!-- <h1>Component Directory</h1> -->
<div id ='dir'>
<Folder name={root.name} children={root.children}></Folder>
</div>

<style>
	#dir {
    width: 30vw;
    border: 2px solid black
  }
</style>