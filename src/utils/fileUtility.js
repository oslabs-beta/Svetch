import axios from 'axios';
import b64ToBlob from "b64-to-blob";
import fileSaver from "file-saver";
import JSZip from "jszip";
import { canvas } from '../store.js';


const fileUtility = {};

fileUtility.parse = (component, exporting = false) => {
	let canvasStore;
	const unsubscribe = canvas.subscribe((val) => canvasStore = val);
	unsubscribe();
	const fileMap = new Map();
	const queue = [component];
	const nameCache = {};
	
	while(queue.length) {
		const storeKey = queue.shift();
		const current = canvasStore[storeKey];
		const name = current.scriptId;

		let fileName = storeKey === 'index' ? storeKey : name;
		let fileText = `<script>IMPORTS</script>\n\n${name === 'main' ? '<main>' : ''}COMPONENTS${name === 'main' ? '</main>': ''}\n\n<style>\n\n</style>`;

		const importMap = new Map();
		const components = [];
		const childNameCache = {};

		current.children.forEach(child => {
			let childName = canvasStore[child].scriptId;
			if(nameCache[name]) nameCache[name]++;
			else nameCache[name] = 1;
			if(fileName !== 'index') fileName = name + '_' + nameCache[name];
			if (exporting) queue.push(child);
			if (canvasStore[child].children.length) {
				if (childNameCache[childName]) childNameCache[childName]++;
				else childNameCache[childName] = 1;
				childName = childName + '_' + childNameCache[childName];
			}
			childName = fileUtility.formatName(childName);
			if (!importMap.has(childName)) importMap.set(childName,`import ${childName} from '../lib/${childName}.svelte'`);	
			components.push(`<${childName} />`);
		});

		const imports = [];
		importMap.forEach((value) => {
			imports.push(value);
		});
		const importsStr = '\n\t' + imports.join('\n\t') + '\n';
		let componentsStr;
		if (name === 'main') componentsStr = '\n\t' + components.join('\n\t') + '\n';
		else if (!components.length) componentsStr = '<!-- Enter your HTML here -->';
		else componentsStr = components.join('\n');
		if (fileName !== 'index') fileName = fileUtility.formatName(fileName);

		fileText = fileText
			.replace('IMPORTS', importsStr)
			.replace('COMPONENTS', componentsStr);
		if (!fileMap.has(fileName)) fileMap.set(fileName, {fileText, id: storeKey});
	}
	const files = [];
	fileMap.forEach(({fileText, id}, key) => {
		files.push({name: key, data: fileText, id});
	});
	return files;
}

fileUtility.createFileTree = () => {
	const fileDirectory = {
		name: 'src',
		children: []
	};
	fileDirectory.children.push({name: 'routes', children: [{name:'index', id: 'index'}]});
	const files = fileUtility.parse('index', true);
	const lib = {name:'lib', children: []}
	if (files.length > 1) fileDirectory.children.push(lib);
	files.shift();
	const queue = files;
	while (queue.length) {
		const {name, id} = queue.shift();
		lib.children.push({name, id});
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

fileUtility.formatName = name => {
	return name.toLowerCase()
		.split(' ')
		.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
		.join('');
}

fileUtility.createFile = () => {
	// Get file template objects frome the parse method
	const filesTemplates = fileUtility.parse('index', true);

	// Create a new array of file objects from the file templates
	const files = filesTemplates.map(template => {
		// Store the name and data from the template
		const { name, data } = template;

		// Index file is stored in routes folder, all others stored in lib 
		const folder = name === 'index' ? 'src/routes' : 'src/lib';

		// Return the file-like object
		return { relativePath: `${folder}/${name}.svelte`, fileContent: data }
	});

	// Return the array of file obejcts
	return files;
}

fileUtility.downloadFiles = async (projectName = 'example-skeleton') => {
	// Get the user's protoyped component data
	const files = fileUtility.createFile();

	// Store new JSZip instance
	const zip = new JSZip();

	// Iterate through the file data and add each to the JSZip instance
	for (const { relativePath, fileContent } of files) {
		// Store the file content after converting it to a Uint8Array
		zip.file(`${relativePath}`, Uint8Array.from(fileContent, x => x.charCodeAt(0)));
	}

	// Get the static project files from the api
	const projectFiles = await axios.get('api/projectFiles')
		.then(({ data }) => JSON.parse(data)).then(({ zippedFiles }) => zippedFiles);
	
	// Add the static files to the  JSZip instance
	await zip.loadAsync(projectFiles, { base64: true });

	// Store the JSZip data as a base64 string
	const zipAsBase64 = await zip.generateAsync({ type: "base64" });

	// Create and store a blob from the base64 string
	const blob = b64ToBlob(zipAsBase64, "application/zip");

	// Use the fileSaver to present the file for download in the browser window
	fileSaver.saveAs(blob, `${projectName}.zip`);
}

fileUtility.deleteCookie = () => {
	axios.post('/deleteCookie');
}
 
	
export default fileUtility;