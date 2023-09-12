import axios from 'axios';
import b64ToBlob from 'b64-to-blob';
import fileSaver from 'file-saver';
import JSZip from 'jszip';
import { canvas } from '../../store';
import canvasUtility from './canvasUtility';
import codeUtility from './codeUtility';

export default {
  // parse method contains reference to this, cannot use arrow fn syntax
  parse(tree) {
    // Hash of files (deduplicated if duplicate components exist)
    const files = new Map();

    // Hash of components (ids map to appropriate values in files hash map)
    const components = new Map();

    const parseChildren = ({ name, children, id }) => {
      // Store string representing file content for current component
      const content = codeUtility.process(children, id);

      // Parse all children
      children.forEach((child) => parseChildren(child));

      // If not a saved object from map (or undefined)
      if (!files.get(name)) {
        // Update files hash with object for this component (id used in createFileTree method)
        files.set(name, {
          name,
          children,
          content,
          id
        });
      }

      // Update component hash with reference to file obejct for this id
      components.set(id, name);
    };

    // Call helper function to assign files and components hash values
    parseChildren(tree);

    // Return new object containing both hashes
    return { files, components };
  },

  // createFileTree method contains reference to this, cannot use arrow fn syntax
  createFileTree() {
    // Define `lib` folder object
    const libFolder = {
      name: 'lib',
      children: []
    };

    // Define `routes` folder object, which contains +page
    const routesFolder = {
      name: 'routes',
      children: [{ name: '+page', id: '+page' }]
    };

    // Define file tree return object
    const fileTree = {
      name: 'src',
      children: [routesFolder]
    };

    // Store tree created from current canvas
    const tree = canvasUtility.createTree();

    // Iterate over the files hash, filter out +page, return name & id for each
    libFolder.children = [...this.parse(tree).files.values()]
      .filter(({ name }) => name !== '+page')
      .map(({ name, id }) => ({ name, id }));

    // If lib folder has children, then add it to the file tree object
    if (libFolder.children) fileTree.children.push(libFolder);

    // Return the file tree object
    return fileTree;
  },

  sort: (files) => {
    // Custom sort method
    const sortFiles = (a, b) => {
      // Sort a's children if they exist (key may not exist)
      if (a.children) a.children.sort(sortFiles);

      // Sort b's children if they exist (key may not exist)
      if (b.children) b.children.sort(sortFiles);

      // Use default sort on names (order before)
      if (a.name < b.name) return -1;

      // Use default sort on names (order after)
      if (a.name > b.name) return 1;

      // Return 0 if default sort logic does not apply
      return 0;
    };
    return files.sort(sortFiles);
  },

  // Format name to be PascalCase
  formatName: (name) =>
    name
      .toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(''),

  // createFiles method contains reference to this, cannot use arrow fn syntax
  createFiles(_canvasUpdate = null) {
    // If updates needed, update canvas store from argument
    if (_canvasUpdate) canvas.set(JSON.parse(_canvasUpdate).prevCanvas);
    // Store tree from latest canvas version
    const tree = canvasUtility.createTree();

    // Get files hash map from the parse method
    const hash = this.parse(tree).files;

    // Create an array of file-like objects from the files hash map
    const files = [...hash.values()].map(({ name, content }) => {
      // +page file is stored in 'routes' folder, all others stored in 'lib'
      const folder = name === '+page' ? 'src/routes' : 'src/lib';

      // Create path-like string representing a relative path
      const path = `${folder}/${name}.svelte`;

      // Return the file-like object
      return { path, content };
    });

    // Return the array of file obejcts
    return files;
  },

  async downloadProject(_name = 'Svetch-Project') {
    
    // Get the user's protoyped component data
    const files = this.createFiles();

    // Store new JSZip instance
    const zip = new JSZip();

    // Iterate through the file data and add each to the JSZip instance
    files.forEach(({ path, content }) => {
      // Store the file content after converting it to a Uint8Array
      zip.file(
        `${path}`,
        Uint8Array.from(content, (x) => x.charCodeAt(0))
      );
    });

    // Get the static project files from the api
    const projectFiles = await axios
      .get('/api/projectFiles')
      .then(({ data }) => data)
      .then(({ zippedFiles }) => zippedFiles);

    // Add the static files to the  JSZip instance
    await zip.loadAsync(projectFiles, { base64: true });

    // Store the JSZip data as a base64 string
    const zipAsBase64 = await zip.generateAsync({ type: 'base64' });

    // Create and store a blob from the base64 string
    const blob = b64ToBlob(zipAsBase64, 'application/zip');

    // Use the fileSaver to present the file for download in the browser window
    fileSaver.saveAs(blob, `${_name}.zip`);
  },

  deleteCookie: () => {
    // Make post request to remove state cookie
    axios.post('/deleteCookie');
  }
};
