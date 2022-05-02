export default {
  parse: (component) => {
		const queue = [component];
		const files = [];
		
		while(queue.length) {
			const current = queue.shift();
			let fileText = $templateCode[$canvas[current].scriptId];
			const imports = [];
			const components = [];
			$canvas[current].children.forEach(child => {
				queue.push(child);
				imports.push(`import ${child} from './${$canvas[child].scriptId}'`);
				components.push(`<${$canvas[child].scriptId} />`)
			});
			const importsStr = '\n' + imports.join('\n') + '\n';
			const componentsStr = '\n' + components.join('\n') + '\n';
			let split = fileText.split('IMPORTS');
			fileText = split.join(importsStr);
			split = fileText.split('COMPONENTS');
			fileText = split.join(componentsStr);
			files.push({name: current, data: fileText});
		}
		return files;
	}
}