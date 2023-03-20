import { options } from "../store";

export default {
  create: (name, color, y) => {
    options.update(o => {
      o[name] = {color, quantity: 0, y};
      return o;
    });
  },
  delete: (name) => {
    options.update(o => {
      delete o[name];
      return o;
    });
  },
  reset: () => options.set([])
}