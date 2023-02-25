import { canvas } from '../store';

export default {
  create: (component) => {
    canvas.update((cStore) => {
      // determine parent key
      const parentId = component.parent ? component.parent.id : 'index';
      // add component as child
      cStore[parentId].children.push(component.id);
      // create child key in the store and assign default obj
      cStore[component.id] = { children: [], scriptId: component.type, component };
      // return updated store
      return cStore;
    });
  },
  removeParent: (component) => {
    canvas.update((cStore) => {
      // determine parent key
      const parentId = component.parent ? component.parent.id : 'index';
      // index of component in children array
      const index = cStore[parentId].children.indexOf(component.id);
      // remove target
      cStore[parentId].children.splice(index, 1);
      // return updated store
      return cStore;
    });
  },
  updateParent: (component) => {
    canvas.update((cStore) => {
      // determine parent key
      const parentId = component.parent ? component.parent.id : 'index';
      // add component as a child
      cStore[parentId].children.push(component.id);
      // return updated store
      return cStore;
    });
  },
  delete: (component) => {
    canvas.update((cStore) => {
      // determine parent key
      const parentId = component.parent ? component.parent.id : 'index';
      // determine component index in children array
      const index = cStore[parentId].children.indexOf(component.id);
      // remove the child
      cStore[parentId].children.splice(index, 1);
      // add grandchildren to parent (making them children)
      const grandChildren = cStore[component.id].children;
      // update each grandchild component rect to new parent component rect
      grandChildren.forEach((grandChildId) => {
        cStore[grandChildId].component.parent = (cStore[parentId].component || null);
      });
      // add the grandchildren to the children array
      cStore[parentId].children.push(...grandChildren);
      // delete the component
      delete cStore[component.id];
      // return the store
      return cStore;
    });
  },
  parse: (component, exporting = false) => {
    let canvasStore;
    const unsubscribe = canvas.subscribe((val) => { canvasStore = val; });
    unsubscribe();

    const components = [];
    const queue = [component];

    while (queue.length) {
      const storeKey = queue.shift();
      const { children } = canvasStore[storeKey];

      for (let i = 0; i < children.length; i += 1) {
        const childId = children[i];
        if (exporting) queue.push(childId);
        components.push(canvasStore[childId].component);
      }
    }
    return components;
  },
  reset: () => {
    const defaultCanvas = {
      index: {
        children: [],
        scriptId: 'main',
        counter: 0,
      },
    };
    canvas.set(defaultCanvas);
  }
}