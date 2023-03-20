import { options } from '../store';

export default {
  create: (name, color, y) => {
    // Update the options store value
    options.update((optionsStore) => {
      // Set key name to be value of new option object
      optionsStore[name] = { color, quantity: 0, y };

      // Return the updated store value
      return optionsStore;
    });
  },

  delete: (name) => {
    // Update the options store value
    options.update((optionsStore) => {
      // Delete the option at the name key
      delete optionsStore[name];

      // Return the updated store value
      return optionsStore;
    });
  },
  
  reset: () => options.set([]),
};
