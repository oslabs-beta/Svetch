import { canvas } from '../store.js';

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

}