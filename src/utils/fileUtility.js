import { canvas } from '../store.js';
const fileUtility = {};


fileUtility.parse = (component, exporting = false) => {
	let canvasStore;
	const unsubscribe = canvas.subscribe((val) => canvasStore = val);
	unsubscribe();

	const fileMap = new Map();
	const queue = [component];
	
	while(queue.length) {
		const storeKey = queue.shift();
		const current = canvasStore[storeKey];
		const tagName = current.scriptId;

		let fileName = storeKey === 'index' ? storeKey : tagName;
		let fileText = `<script>IMPORTS</script>\n\n<${tagName}>COMPONENTS</${tagName}>\n\n<style>\n\n</style>`;

		const importMap = new Map();
		const components = [];

		current.children.forEach(child => {
			let newComponent = canvasStore[child].scriptId;
			fileName = storeKey;
			if (exporting) queue.push(child);
			if (canvasStore[child].children.length) {
				newComponent = child;
			} 
			if (!importMap.has(newComponent)) importMap.set(newComponent,`import ${newComponent} from './${newComponent}.svelte'`);	
			components.push(`<${newComponent} />`);
		});

		const imports = [];
		importMap.forEach((value) => {
			imports.push(value);
		});
		const importsStr = '\n\t' + imports.join('\n\t') + '\n';

		const componentsStr = '\n\t' + components.join('\n\t') + '\n';

		fileText = fileText
			.replace('IMPORTS', importsStr)
			.replace('COMPONENTS', componentsStr);
		if (!fileMap.has(fileName)) fileMap.set(fileName, fileText);
	}
	const files = [];
	fileMap.forEach((value, key) => {
		files.push({name: key, data: value});
	});
	return files;
}

fileUtility.createFileTree = () => {
	const fileDirectory = {
		name: 'Src',
		children: []
	};
	fileDirectory.children.push({name:'index'});
	const files = fileUtility.parse('index', true);
	const lib = {name:'Lib', children: []}
	if (files.length > 1) fileDirectory.children.push(lib);
	files.shift();
	const queue = files;
	while (queue.length) {
		const current = queue.shift();
		lib.children.push({name:current.name});
	}
	return fileDirectory;
}
fileUtility.sort = files => {
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
	return files.sort(sortFiles);
}
export default fileUtility;