<script>
	import { canvas } from './store.js';
  import Folder from './Folder.svelte';
	let testCanvas = {
		"index":{
			"children":[
				"div1"
			],
			"scriptId":"index"
		},
		"div1":{
			"children":[],
			"scriptId":"div"}
	};
	function parseCanvas(obj) {
		const fileDirectory = {
			name: 'Src',
			children: []
		}
		//add the index
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
					name: 'App.svelte'
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
// 	root = parseCanvas({...$canvas});
	root = parseCanvas({testCanvas});
	root.children.sort(sortFiles);
</script>

<h1>Component Directory</h1>
<Folder name={root.name} children={root.children}></Folder>