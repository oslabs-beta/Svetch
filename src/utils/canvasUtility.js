import { canvas } from '../store.js';

export default {
  createChild: (name, type, parent, box) => {
    canvas.update(c => {
      c[parent].children.push(name);
      c[name] = {children:[], 'scriptId': type, 'box': box}
      return c;
    });
  },
  removeChild: (name, parent) => {
    canvas.update(c => {
      const index = c[parent].children.indexOf(name);
      // remove the child
      c[parent].children.splice(index, 1);
      // add grandchildren to parent (making them children)
      c[parent].children.push(...c[name].children);
      return c;
    });
  },
  addChild: (name, parent) => {
    canvas.update(c => {
      c[parent].children.push(name);
      return c;
    });
  },
  deleteChild: (name, parent) => {
    canvas.update(c => {
      const index = c[parent].children.indexOf(name);
      // remove the child
      c[parent].children.splice(index, 1);
      // add grandchildren to parent (making them children)
      c[parent].children.push(...c[name].children);
      // deleting the child from the canvas
      delete c[name];
      return c;
    });
  },
  parse: (component, exporting = false) => {
    let canvasStore;
    const unsubscribe = canvas.subscribe((val) => canvasStore = val);
    unsubscribe();
  
    const boxes = [];
    const queue = [component];
    
    while(queue.length) {
      const storeKey = queue.shift();
      const current = canvasStore[storeKey];
  
      current.children.forEach(child => {
        if (exporting) queue.push(child);
        boxes.push(canvasStore[child].box)
      });

    }

    return boxes;

  }
}