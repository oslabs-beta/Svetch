import { canvas } from '../store.js';

export default {
  createChild: (target, type, parent, component) => {
    canvas.update(c => {
      // determine parent key
      const parentId = parent ? parent.id : 'index';
      // add child
      c[parentId].children.push(target);
      // create child key in the store and assign default obj
      c[target] = {children:[], 'scriptId': type, 'component': component};
      // return updated store
      return c;
    });
  },
  removeChild: (target, parent) => {
    canvas.update(c => {
      // determine parent key
      const parentId = parent ? parent.id : 'index';
      // remove target index in children array
      const index = c[parentId].children.indexOf(target);
      // remove target 
      c[parentId].children.splice(index, 1);
      // return updated store
      return c;
    });
  },
  addChild: (target, parent) => {
    canvas.update(c => {
      // determine parent key
      const parentId = parent ? parent.id : 'index';
      // update parent property on component rect
      c[target].component.parent = parent ? parent : null;
      // add child
      c[parentId].children.push(target);
      // return updated store
      return c;
    });
  },
  deleteChild: (target, parent) => {
    canvas.update(c => {
      // determine parent key
      const parentId = parent ? parent.id : 'index';
      // determine target indext in children array
      const index = c[parentId].children.indexOf(target);
      // remove the target child
      c[parentId].children.splice(index, 1);
      // add grandchildren to parent (making them children)
      const grandChildren = c[target].children;
      // update each grandchilds component rect to new parent component rect
      grandChildren.forEach(grandChildId => {
        c[grandChildId].component.parent = c[parentId].component || null;
      });
      // add the grandchildren to the children array
      c[parentId].children.push(...grandChildren);
      // delete the target
      delete c[target];
      // return the store
      return c;
    });
  },
  parse: (component, exporting = false) => {
    let canvasStore;
    const unsubscribe = canvas.subscribe((val) => canvasStore = val);
    unsubscribe();
  
    const components = [];
    const queue = [component];
    
    while(queue.length) {
      const storeKey = queue.shift();
      const current = canvasStore[storeKey];
  
      current.children.forEach(childId => {
        if (exporting) queue.push(childId);
        components.push(canvasStore[childId].component)
      });

    }

    return components;

  }
}