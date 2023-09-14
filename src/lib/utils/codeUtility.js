export default {
  // NOTE: method contains reference to this, cannot use arrow fn syntax
  process(children, id) {
    // Declare array to store variable declarations (used in script tag)
    const declarations = [];

    // Store html string as result of helper function
    const html = this.composeHTML(children, id, declarations);

    // Store script string as result of helper function
    const script = this.composeScript(children, declarations);

    // Return string with tags: script, html (from html string), style
    return `<script>${script}</script>\n\n${html}\n\n<style>\n\n</style>`;
  },

  composeEachBlock: (name, number, id) => {
    // Store the lowercase version of name
    const lcName = `${name[0].toLowerCase()}${name.slice(1)}`;

    // Store an array of objects representing comonents in a list
    const objects = [];

    // Puts the components into array with id set to index
    for (let i = 0; i < number; i += 1) {
      objects.push(`{ id: ${i} }`);
    }

    // Tab is empty when not in '+page.svelte'
    const tab = id === '+page' ? '\t' : '';

    // Store the variable declations (declaring the array of components in script tag)
    const scriptDeclaration = `\tconst ${lcName}s = [\n\t\t${objects.join(',\n\t\t')}\n\t];`;

    // Store the string representing the each block
    const eachBlock = `{#each ${lcName}s as ${lcName} (${lcName}.id)}\n\t${tab}<${name}/>\n${tab}{/each}`;

    // Return an object with both the each block and corresponding declartions
    return { eachBlock, scriptDeclaration };
  },

  // NOTE: method contains reference to this, cannot use arrow fn syntax
  composeHTML(children, id, declarations) {
    // If no elements are passed, file will not have html content (noContent = true)
    const noContent = !children.length;

    // Store component names in new array
    const statements = this.composeHTMLStatements(children, id, declarations);

    // Declare variable to store html string, default value of one component per line
    let html = `${statements.join('\n\n')}`;

    // If file is '+page' and no content (noContent = true), overwrite html string
    if (id === '+page' && noContent) html = '<main>\n\n</main>';
    // Else, if file is '+page', wrap default html string in main tags
    else if (id === '+page') html = `<main>\n\t${statements.join('\n\n\t')}\n</main>`;
    // Else, if no content (and not file is not '+page'), html string is a comment
    else if (noContent) html = '<!-- Enter your HTML here -->';

    // Return the html string
    return html;
  },

  composeImports: (children) => {
    // Create an array of import statements (as strings)
    const imports = new Set(
      children.map(({ name }) => `import ${name} from '../lib/${name}.svelte';`)
    );

    // Define imports string to be indented statments (one per line)
    return `\n\t${[...imports].join('\n\t')}\n`;
  },

  // NOTE: method contains reference to this, cannot use arrow fn syntax
  composeScript(children, declarations) {
    // Get import statements (as  single string)
    const imports = this.composeImports(children);

    // If declarations are present, concatenate them after import statements
    if (declarations.length) return `${imports}\n${declarations.join('\n')}\n`;

    // If no declarations, return import statements string
    return imports;
  },

  // NOTE: method contains reference to this, cannot use arrow fn syntax
  composeHTMLStatements(children, id, declarations) {
    // Declare a cache to track name usage
    const cache = {};

    // Declare a set to track names that are duplicated
    const duplicates = new Set();

    // Declare an empty array to store duplicated names (duplicates will become a list)
    const deduplicated = [];

    // Iterate over children, track names and duplicates
    for (let i = 0; i < children.length; i += 1) {
      // Store name from current child
      const { name } = children[i];

      // Increment name cache for name, or set to 1
      cache[name] = (cache[name] || 0) + 1;

      // If the name is alread in the cache, add the name as a duplicate
      if (cache[name] > 1) duplicates.add(name);

      // If this is name's first use, add it to array
      if (cache[name] === 1) deduplicated.push(name);
    }

    // Store statements in new array (use set to deduplicate)
    const statements = deduplicated.map((name) => {
      // If it is duplicated, it should be a list (each block)
      if (duplicates.has(name)) {
        // Compose the each block and associated variable declaration
        const { eachBlock, scriptDeclaration } = this.composeEachBlock(name, cache[name], id);

        // Push the declaration into the array
        declarations.push(scriptDeclaration);

        // Return the string for the each block
        return eachBlock;
      }

      // Otherwise return the string for component
      return `<${name} />`;
    });

    // Return the HTML statements
    return statements;
  }
};
