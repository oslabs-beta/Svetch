import { writable } from 'svelte/store';

export const canvas = writable({
	'index' : {
		children : [],
		scriptId : 'main'
	}
});

export const session = writable({});