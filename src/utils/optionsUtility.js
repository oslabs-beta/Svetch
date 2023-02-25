import { options } from '../store';

export default {
  create: (name, color, y) => {
    options.update((optionsStore) => {
      optionsStore[name] = { color, quantity: 0, y };
      return optionsStore;
    });
  },
  delete: (name) => {
    options.update((optionsStore) => {
      delete optionsStore[name];
      return optionsStore;
    });
  },
  reset: () => options.set([]),
};
