import { canvas } from '../store';

export default {
  
  // create method contains reference to this, cannot use arrow fn syntax
  create(component) {
    // Store id and type from component object
    const { id, type } = component;

    // NOTE: 'this' keyword relies on arrow syntax here (refers to context of 'create' call, not 'update' call)
    canvas.update((cStore) => {
      // Update the component's parent
      this.updateParent(component);

      // Create child key in the store and assign default obj
      cStore[id] = { children: [], type, component };

      // Return updated store
      return cStore;
    });
  },

  removeParent: ({ id, parent }) => {
    // Update the canvas store
    canvas.update((cStore) => {
      // Store parent key
      const parentId = parent ? parent.id : 'index';

      // Store index of component in children array
      const index = cStore[parentId].children.indexOf(id);

      // Remove target element (child id)
      cStore[parentId].children.splice(index, 1);

      // Return updated store
      return cStore;
    });
  },

  updateParent: ({ id, parent }) => {
    // Update the canvas store
    canvas.update((cStore) => {
      // Store parent key
      const parentId = parent ? parent.id : 'index';

      // Add component as a child
      cStore[parentId].children.push(id);

      // Return updated store
      return cStore;
    });
  },

  // delete method contains reference to this, cannot use arrow fn syntax
  delete({ id, parent }) {
    // Update the canvas store
    canvas.update((cStore) => {
      // Store parent key
      const parentId = parent ? parent.id : 'index';

      // Remove child from parent component
      this.removeParent({id, parent});

      // Add grandchildren to parent (making them children)
      const grandChildren = cStore[id].children;

      // Update each grandchild component rect to new parent component rect
      grandChildren.forEach((grandChildId) => {
        cStore[grandChildId].component.parent = (cStore[parentId].component || null);
      });

      // Add the grandchildren to the children array
      cStore[parentId].children.push(...grandChildren);

      // Delete the component
      delete cStore[id];

      // Return the store
      return cStore;
    });
  },

  parse: () => {
    // Declare variable to hold canvas store data
    let canvasStore;

    // Store unsubscribe method, and update value of canvasStore
    const unsubscribe = canvas.subscribe((val) => { canvasStore = val; });

    // Unsubscribe from store to prevent changing the data
    unsubscribe();

    // Decleare array for components (will filter out index, children come after parents)
    const components = [];

    // Define queue, initially contains only index key
    const queue = ['index'];

    // Process the queue while it has keys
    while(queue.length) {
      // Store the data store key by removing first item
      const id = queue.shift();

      // Store reference to current component
      const current = canvasStore[id];
  
      // Iteration over the current components children
      current.children.forEach(childId => {
        // Add each child to the queue (pushing data store key)
        queue.push(childId);

        // Add each child component to the array
        components.push(canvasStore[childId].component)
      });

    }

    // Return the array of components
    return components;
  },

  createTree: () => {
    // Declare variable to hold canvas store data
    let cStore;

    // Store unsubscribe method, and update value of canvasStore
    const unsubscribe = canvas.subscribe((val) => { cStore = val; });

    // Unsubscribe from store to prevent changing the data
    unsubscribe();

  // Hash of components (deduplicated if duplicate components exist)
    let map = new Map();

    // Cache object used to store component name usage (number of times used)
	  const customCache = {
      _increment: function (key) {
        this[key] = (this[key] || 0) + 1;
        return this[key];
      },
      _singleUse: new Set(),
	  };

    // Store a new cache object
    let cache = Object.create(customCache);

    // Store var indicating if it's first canvas parse in current createTree call
    let initalParse = true;

    // Declare helper function to determine component name
    const getName = (type, hash) => {
      // Read the stored component name, if any
      const saved = map.get(`${type}_${hash}`);

      // If name is saved, return it
      if (saved) return saved;

      // Subsequent parse and component only appears in canvas with children
      if (!cache._singleUse.has(type) && !initalParse) {

        // Else, if type is not recorded in cache
        if (cache[type] === undefined) {

          // Record type in cache
          cache[type] = 0;
          
          // Return type as the component name
          return `${type}`;
        }
      }

      // When initial parse of canvas OR component is unmapped
      return `${type}${cache._increment(type)}`;
    }

    // Define helper function to traverse children
    const parseChildren = (id = 'index', path = '') => {
      // Store component type or 'index'
      const { type } = (cStore[id].component || { type: 'index'});

      // Define name as component type, changes if component has children (and deduplication)
      let componentName = type;
      
      // Define children array result of recursing over each child in canvas store
      const children = cStore[id].children.map(child => parseChildren(child,`${path}_${type}`));
  
      // Generate hash string from children array (sort so hash is irrespective of insertion order)
      const hash = children.map(({ name }) => name).sort().join('');
      
      // When current component is not index, and component has children
      if (children.length && type !== 'index') {
        // Update the component name to be `type_cache value` (incremented by one)
        componentName = getName(type, hash);

        // Update components hash with object for this component
        map.set(`${type}_${hash}`, componentName);
      } 
      // When component is index, or if compenent does not have children
      else  cache._singleUse.add(type);
      
      // Return the component object
      return { name: componentName, children, id };
    };
    
    // Initial parse, determines which components appear w/o children
    parseChildren();

    // Update boolean to reflect inital parse completion
    initalParse = false;

    // Temporarily store the single use set
    const singleUse = cache._singleUse;

    // Overwrite the cache to be a new empty cache
    cache = Object.create(customCache);

    // Overwrite the empty cache's single use set
    cache._singleUse = singleUse;

    // Overwrite the map to be a new Map
    map = new Map();

    // Return the result of the secondary invocation of helper function
    return parseChildren();
  },

  reset: () => {
    // Define the default canvas store
    const defaultCanvas = {
      index: {
        children: [],
        counter: 0,
      },
    };

    // Set the canvas store value to default
    canvas.set(defaultCanvas);
  },
};
