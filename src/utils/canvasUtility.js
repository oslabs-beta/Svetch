import { canvas } from '../store.js';

export default {
  createChild: (name, type, parent) => {
    canvas.update(c => {
      c[parent].children.push(name);
      c[name] = {children:[], 'scriptId': type}
      return c;
    });
  },
  removeChild: (name, parent) => {
    canvas.update(c => {
      const index = c[parent].children.indexOf(name);
      c[parent].children.splice(index, 1);
      return c;
    });
  },
  addChild: (name, parent) => {
    c[parent].children.push(name);
    return c;
  },
  deleteChild: (name, parent) => {
    canvas.update(c => {
      const index = c[parent].children.indexOf(name);
      c[parent].children.splice(index, 1);
      delete c[name];
      return c;
    });
  }
}