import { writable } from 'svelte/store';

export const canvas = writable({
	'index' : {
		children : [],
		scriptId : 'main'
	}
});

// export const options = writable([
// 	{x : 20 , y : 20, width : 150 , height : 50, type : 'Component 1', color : 'green'},
// 	{x : 20 , y : 80, width : 150 , height : 50, type : 'Component 2', color : 'red'}
//   ])

export const options = writable({
	'Component 1': { color: 'green', quantity: 0, y: 20 },
	'Component 2': { color: 'red', quantity: 0, y: 80 }
});

// export const session = writable({});

