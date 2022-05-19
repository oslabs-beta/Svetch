import { writable } from 'svelte/store';

export const canvas = writable({
	'index' : {
		children : [],
		scriptId : 'main',
		counter : 0
	}
});

export const options = writable([
  ])

export const selectedComponent = writable('index');

