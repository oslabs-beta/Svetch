<script>
	import { canvas } from '../store.js';
  import Folder from './Folder.svelte';

	let root;
	
	const parse = (obj) => {
		const fileDirectory = {
			name: 'Src',
			children: []
		};
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
<<<<<<< HEAD
  //We need to construct an object of the same shape when reading/manipulating files & folders
  export let root = 
    {
			name: 'Src',
			children: [
				{
					name: 'Index.svelte'
				},
				{
          name: 'Lib',
         	children: [
          	{ name: 'Div1.svelte' },
           	{ name: 'Button.png' },
						{ name: 'Form.svelte' },
        		{ name: 'Article.svelte' },
        		{ name: 'Codebox.svelte' }
          ]
        },
        {
         	name: 'Charts',
       	 	children: [
         	  { name: 'ChartContainer.svelte' },
         	  { name: 'Link.svelte' }
         	]
       	},
				{
         	name: 'zebras',
       	 	children: [
         	  { name: 'ChartContainer.svelte' },
         	  { name: 'Link.svelte' }
         	]
       	},
			]
    };
=======
	
>>>>>>> 4fd09adfd2934ae6065f018f5c93428ab4aac55a
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

	const update = (canvas) => {
		root = parse(canvas);
		root.children.sort(sortFiles);
	}

	$: {
		update({...canvas})
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