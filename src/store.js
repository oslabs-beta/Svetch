import { writable } from 'svelte/store';

export const canvas = writable({
	'index' : {
		children : ['div1'],
		scriptId : 'main'
	},
	'div1' : {
		children : [],
		scriptId : 'div'
	}
});

export const session = writable({});