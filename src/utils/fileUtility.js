import { canvas } from '../store.js';
//import {server} from '../../Server/server.js'
import {createFolder} from '../../Server/server.js'
import fs from 'fs'
//const path = require('path');
// {
// 	name: 'Src',
// 	children: [
// 		{
// 			name: 'Index.svelte'
// 		},
// 		{
//   name: 'Lib',
// 	 children: [
// 	  { name: 'Div1.svelte' },
// 	   { name: 'Button.png' },
// 				{ name: 'Form.svelte' },
// 		{ name: 'Article.svelte' },
// 		{ name: 'Codebox.svelte' }
//   				]
// 		},
// 	{
// 	 name: 'Charts',
// 		children: [
// 	   { name: 'ChartContainer.svelte' },
// 	   { name: 'Link.svelte' }
// 	 ]
//    	},
// 	{
// 	 name: 'zebras',
// 		children: [
// 	   { name: 'ChartContainer.svelte' },
// 	   { name: 'Link.svelte' }
// 	 ]
//    },
// 	]
// }


export default {
  parse: (component, exporting = false) => {
		let canvasStore;
		const unsubscribe = canvas.subscribe((val) => canvasStore = val);
    unsubscribe();

		const queue = [component];
		const files = [];
		
		while(queue.length) {
			const current = queue.shift();
			console.log(current);
			const tagName = canvasStore[current].scriptId;
			let fileText = `<script>IMPORTS</script>\n\n<${tagName}>COMPONENTS</${tagName}>\n\n<style>\n\n</style>`;
			const imports = [];
			const imported = new Set();
			const components = [];
			canvasStore[current].children.forEach(child => {
				let component = child;
				if (exporting) queue.push(child);
				// console.log('children:',canvasStore[child].children);
				// console.log('bool:',!canvasStore[child].children.length);
				if (!canvasStore[child].children.length) {
					component = canvasStore[child].scriptId;
					// imports.push(`import ${childTag} from './${childTag}.svelte'`);
					// imported.add(childTag);
					// components.push(`<${childTag} />`);
				} 
				// else if (child.children && !imported.has(child)) {
				// 	component = child;
				// 	// imports.push(`import ${child} from './${child}.svelte'`);
				// 	// imported.add(child);	
				// 	// components.push(`<${child} />`);
				// }
					if (!imported.has(component)) imports.push(`import ${component} from './${component}.svelte'`);
					imported.add(component);	
					components.push(`<${component} />`);
			});
			const importsStr = '\n' + imports.join('\n') + '\n';
			const componentsStr = '\n' + components.join('\n') + '\n';
			fileText = fileText
				.replace('IMPORTS', importsStr)
				.replace('COMPONENTS', componentsStr);
			files.push({name: current, data: fileText});
		}
		return files;
	},

createFile : () => {
 //console.log(fs.readFile('../app.html'))
	// var blob = new Blob([data],
    //             { type: "text/plain;charset=utf-8" });

	// 			var file = new File([blob], "name.svelte");
	// 			console.log(file);
	// 			console.log(fso)
	

// 	function download(filename, text) {
// 		var element = document.createElement('a');
// 		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
// 		element.setAttribute('download', filename);
	  
// 		element.style.display = 'none';
// 		document.body.appendChild(element);
	  
// 		element.click();
	  
// 		document.body.removeChild(element);
// 	  }
// 	  //createFolder();
// 	 download('test.svelte', 'testttttttttt')
// }

//server.makeFile();

}
}
//const dirPath = path.join(__dirname, '/pictures');