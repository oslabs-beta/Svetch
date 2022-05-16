import { options } from "../store";

export default {
  create: (name, color, y) => {
    options.update(o => {
      o[name] = {color, inUse: 0, y};
      return o;
    });
  },
  delete: (name) => {
    options.update(o => {
      delete o[name];
      return o;
    });
  },
  increment: (name) => {
    options.update(o => {
      o[name].inUse++;
      return o;
    });
  },
  decrement: (name) => {
    options.update(o => {
      o[name].inUse--;
      return o;
    });
  }
}