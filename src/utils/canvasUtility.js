import { canvas } from '../store';

export default {
  
  // create method contains reference to this, cannot use arrow fn syntax
  create(component) {
    // Store id and type from component object
    const { id, type } = component;

    // NOTE: this keyword relies on arrow syntax here (refers to context of 'create' call, not 'update' call)
    canvas.update((cStore) => {
      // Update the component's parent
      this.updateParent(component);

      // Create child key in the store and assign default obj
      cStore[id] = { children: [], scriptId: type, component };

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

    // Return a new an array of components, filter out index
    return Object.values(canvasStore)
      .filter((element, index) => index !== 0)
      .map(({ component }) => component);
  },

  createTree: () => {
    // Declare variable to hold canvas store data
    let cStore;

    // Store unsubscribe method, and update value of canvasStore
    const unsubscribe = canvas.subscribe((val) => { cStore = val; });

    // Unsubscribe from store to prevent changing the data
    unsubscribe();

  // Hash of components (deduplicated if duplicate components exist)
    const map = new Map();

    // Cache object used to store component name usage (number of times used)
	  const cache = {
      increment: function (key) {
        this[key] = (this[key] || 0) + 1;
        return this[key];
      }
	  };

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
        componentName = map.get(`${type}_${hash}`) || `${type}_${cache.increment(type)}`;

        // Update components hash with object for this component
        map.set(`${type}_${hash}`, componentName);
      }
      
      // Return the component object
      return { name: componentName, children, id };
    };
    
    // Return the tree created from invoking helper function
    return parseChildren();
  },

  reset: () => {
    // Define the default canvas store
    const defaultCanvas = {
      index: {
        children: [],
        scriptId: 'main',
        counter: 0,
      },
    };

    // Set the canvas store value to default
    canvas.set(defaultCanvas);
  },
};
