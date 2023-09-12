// eslint-disable-next-line import/no-unresolved
import { writable } from 'svelte/store';

export const canvas = writable({
  '+page': {
    children: [],
    counter: 0
  }
});

export const library = writable({});

export const selectedComponent = writable('+page');
