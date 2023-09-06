/* eslint-disable no-underscore-dangle */
import { canvas } from '../store';
import EditableRect from './editableRect';

export default {
  // NOTE: method contains reference to this, cannot use arrow fn syntax
  create(rectProps) {
    // Store id and type from component object
    const { x, y, width, height, type, color } = rectProps;

    // NOTE: keyword this uses arrow syntax here (uses context of 'create' call, not 'update' call)
    canvas.update((cStore) => {
      // Store an id for the new rect that will be created
      const id = `component${cStore.index.counter}`;

      // Increment the number of components in store by 1
      cStore.index.counter += 1;

      // Define a new rect (from destructured rectProps)
      const newRect = new EditableRect(x, y, width, height, type, color, id);

      // Store an array of current component rects on canvas
      const rects = this.parse();

      // Iterate through the component rects to find the parent rect of new rect (if any)
      rects.forEach((rect) => {
        if (rect.containsRect(newRect)) newRect.parent = rect;
      });

      // Update the rect's parent
      this.updateParent(newRect);

      // Create child key in the store and assign default obj
      cStore[id] = { children: [], type, rect: newRect };

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

  // NOTE: method contains reference to this, cannot use arrow fn syntax
  delete({ id, parent }) {
    // Update the canvas store
    canvas.update((cStore) => {
      // Store parent key
      const parentId = parent ? parent.id : 'index';

      // Remove child from parent component
      this.removeParent({ id, parent });

      // Add grandchildren to parent (making them children)
      const grandChildren = cStore[id].children;

      // Update each grandchild component rect to be new parent component rect
      grandChildren.forEach((grandChildId) => {
        cStore[grandChildId].rect.parent = cStore[parentId].rect || null;
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
    const unsubscribe = canvas.subscribe((val) => {
      canvasStore = val;
    });

    // Unsubscribe from store to prevent changing the data
    unsubscribe();

    // Decleare array for component rects (will filter out index, children come after parents)
    const rects = [];

    // Define queue, initially contains only index key
    const queue = ['index'];

    // Process the queue while it has keys
    while (queue.length) {
      // Store the data store key by removing first item
      const id = queue.shift();

      // Store references to current children
      const { children } = canvasStore[id];

      for (let i = 0; i < children.length; i += 1) {
        // Store id for current child
        const childId = children[i];

        // Enqueue the current child id
        queue.push(childId);

        // Add each child component rect to the array
        rects.push(canvasStore[childId].rect);
      }
    }

    // Return the array of component rects
    return rects;
  },

  createTree: () => {
    // Declare variable to hold canvas store data
    let cStore;

    // Store unsubscribe method, and update value of canvasStore
    const unsubscribe = canvas.subscribe((val) => {
      cStore = val;
    });

    // Unsubscribe from store to prevent changing the data
    unsubscribe();

    // Hash of components (deduplicated if duplicate components exist)
    let map = new Map();

    // Cache object used to store component name usage (number of times used)
    const customCache = {
      _increment(key) {
        this[key] = (this[key] || 0) + 1;
        return this[key];
      },
      _singleUse: new Set()
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
    };

    // Define helper function to traverse children
    const parseChildren = (id = 'index', path = '') => {
      // Store component type or 'index'
      const { type } = cStore[id].rect || { type: 'index' };

      // Define name as component type, changes if component has children (and deduplication)
      let componentName = type;

      // Define children array result of recursing over each child in canvas store
      const children = cStore[id].children.map((child) => parseChildren(child, `${path}_${type}`));

      // Generate hash string from children array (sort so hash is irrespective of insertion order)
      const hash = children
        .map(({ name }) => name)
        .sort()
        .join('');

      // When current component is not index, and component has children
      if (children.length && type !== 'index') {
        // Update the component name to be `type_cache value` (incremented by one)
        componentName = getName(type, hash);

        // Update components hash with object for this component
        map.set(`${type}_${hash}`, componentName);

        // When component is index, or if compenent does not have children
      } else cache._singleUse.add(type);

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
        counter: 0
      }
    };

    // Set the canvas store value to default
    canvas.set(defaultCanvas);
  },

  // NOTE: method contains reference to this, cannot use arrow fn syntax
  updateRelationships(selected) {
    // Define helper function to update parent relationships
    const performUpdates = (rect, parent) => {
      // Remove the parent from rect
      this.removeParent(rect);

      // Update the parent on rect to be reference from parent argument
      // eslint-disable-next-line no-param-reassign
      rect.parent = parent;

      // Update the parents in the store
      this.updateParent(rect);
    };

    // Declare variable to hold canvas store data
    let cStore;

    // Store unsubscribe method, and update value of canvasStore
    const unsubscribe = canvas.subscribe((val) => {
      cStore = val;
    });

    // Unsubscribe from store to prevent changing the data
    unsubscribe();

    // Store an array of component rects
    const componentRects = this.parse();

    // Define oldChilren to be the rects associated with children ids (in the store)
    const oldChildren = new Set(cStore[selected.id].children.map((id) => cStore[id].rect));

    // Declare newChildren to store new children rects
    const newChildren = new Set();

    // Declare var to store reference to new parent rect
    let newParent;

    // Iterate over rects, find newParent rect for selected, and new children rects of selected
    componentRects.forEach((rect) => {
      // When current rect contains the selected rect, it is the parent (can be reassigned)
      if (rect.containsRect(selected)) newParent = rect;

      // When selected contains current rect and is not an establish parent of current rect
      if (selected.containsRect(rect) && (!rect.parent || !selected.containsRect(rect.parent))) {
        // Add current rect to the newChildren set
        newChildren.add(rect);
      }
    });

    // Remove new children from their old parents, add them to selected rect
    newChildren.forEach((child) => {
      if (!oldChildren.has(child)) performUpdates(child, selected);
    });

    // Remove old children from selected rect, add them to selected rect's old parent
    oldChildren.forEach((child) => {
      if (!newChildren.has(child)) performUpdates(child, selected.parent);
    });

    // Re-add selected rect as child so that its last in children array (will render on top)
    performUpdates(selected, newParent);
  },

  restore: (oldStore) => {
    // Store the component (values) from oldStore
    const components = Object.keys(oldStore)
      .filter((key) => key !== 'index')
      .map((id) => oldStore[id]);

    // Iterate over components, update prototype of rect to be EditableRect
    components.forEach(({ rect }) => {
      Object.setPrototypeOf(rect, EditableRect.prototype);
    });

    // Set the value of canvas store to be the oldStore (with prototypes updated)
    canvas.set(oldStore);
  }
};
