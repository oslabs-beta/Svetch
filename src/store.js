import { writable } from 'svelte/store';

export const canvas = writable({
	'index' : {
		children : [],
		scriptId : 'main',
		counter : 0
	}
});

export const options = writable([
	// {x : 20 , y : 20, width : 150 , height : 50, type : 'Component 1', color : 'green'},
	// {x : 20 , y : 80, width : 150 , height : 50, type : 'Component 2', color : 'red'}
  ])

export const selectedComponent = writable('index');

