import { canvas } from '../store.js';

export default {
  create: (component) => {
    canvas.update(c => {
      // determine parent key
      const parentId = component.parent ? component.parent.id : 'index';
      // add component as child
      c[parentId].children.push(component.id);
      // create child key in the store and assign default obj
      c[component.id] = {children:[], 'scriptId': component.type, 'component': component};
      // return updated store
      return c;
    });
  },
  removeParent: (component) => {
    canvas.update(c => {
      // determine parent key
      const parentId = component.parent ? component.parent.id : 'index';
      // index of component in children array
      const index = c[parentId].children.indexOf(component.id);
      // remove target 
      c[parentId].children.splice(index, 1);
      // return updated store
      return c;
    });
  },
  updateParent: (component) => {
    canvas.update(c => {
      // determine parent key
      const parentId = component.parent ? component.parent.id : 'index';
      // add component as a child
      c[parentId].children.push(component.id);
      // return updated store
      return c;
    });
  },
  delete: (component) => {
    canvas.update(c => {
      // determine parent key
      const parentId = component.parent ? component.parent.id : 'index';
      // determine component index in children array
      const index = c[parentId].children.indexOf(component.id);
      // remove the child
      c[parentId].children.splice(index, 1);
      // add grandchildren to parent (making them children)
      const grandChildren = c[component.id].children;
      // update each grandchild component rect to new parent component rect
      grandChildren.forEach(grandChildId => {
        c[grandChildId].component.parent = c[parentId].component || null;
      });
      // add the grandchildren to the children array
      c[parentId].children.push(...grandChildren);
      // delete the component
      delete c[component.id];
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