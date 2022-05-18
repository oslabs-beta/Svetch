import { writable } from 'svelte/store';

export const canvas = writable({
	'index' : {
		children : [],
		scriptId : 'main'
	}
});

export const options = writable([
	{x : 20 , y : 20, width : 150 , height : 50, type : 'Component 1', color : 'green'},
	{x : 20 , y : 80, width : 150 , height : 50, type : 'Component 2', color : 'red'},
	{x : 20 , y : 140, width : 150 , height : 50, type : 'Component 3', color : 'pink'},
	{x : 20 , y : 200, width : 150 , height : 50, type : 'Component 4', color : 'yellow'},
	{x : 20 , y : 260, width : 150 , height : 50, type : 'Component 5', color : 'orange'},
	{x : 20 , y : 320, width : 150 , height : 50, type : 'Component 6', color : 'blue'},
	{x : 20 , y : 380, width : 150 , height : 50, type : 'Component 7', color : 'pink'},
	{x : 20 , y : 440, width : 150 , height : 50, type : 'Component 8', color : 'yellow'},
	{x : 20 , y : 500, width : 150 , height : 50, type : 'Component 9', color : 'orange'},
	{x : 20 , y : 560, width : 150 , height : 50, type : 'Component 10', color : 'blue'}
  ])

// export const session = writable({});

