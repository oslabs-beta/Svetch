<script>
import {onMount} from 'svelte'
import Switch from './Switch.svelte';
import { canvas } from '../store.js'

import {boxArray} from '../store.js'

// export let toggled = true;

//BUTTON CLASS MUST BE DEFINED IN ADD BUTTON COMPONENT

//Box array must be defined outside of onmount
// const boxArray = []; 
  //loop through the store and add 
import {boxes} from "../store.js"



let boxArr;
boxes.subscribe((val) => boxArr = val);

let buttonStore = []; 
class Button {
  constructor(x, y, width, height, type, color) {
    this.x = x,
    this.y = y, 
    this.width = width,
    this.height = height,
    this.type = type, 
    this.color = color
  }
}

class Box {
  constructor(x, y, width, height, type, color) {
    this.x = x,
    this.y = y, 
    this.width = width,
    this.height = height,
    this.type = type, 
    this.color = color
  }
}
let mounted = false;
let createButton = (boxes) => {
  buttonStore = [];
  for (let i = 0; i < boxes.length; i++)
  { 
    buttonStore.push(new Button(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height, boxes[i].type, boxes[i].color))
  }
  return
 }
 //createButton(boxArr);

$:{createButton(boxArr)}
$:{ if (mounted) drawMenu(buttonStore)}

let ctx; 
let template;


//FUNCTIONS MOVED OUT OF ONMOUNT
const drawLabel = (obj) => {
  ctx.font = '20px serif'
  ctx.fillStyle = `${obj.color}`;
  ctx.fillText(obj.type, obj.x + 2, obj.y + 20, obj.width - 20)
  ctx.fillStyle = 'black'; 
}

const drawDeleteTab = (obj) => {
  ctx.strokeRect(obj.x + obj.width - 15, obj.y, 15, 15); 
  ctx.fillStyle = 'red';
  ctx.font = '10px'
  ctx.fillText('X', obj.x + obj.width - 15, obj.y + 15); 
  ctx.fillStyle = 'black'; 

}
 //Draws iputed box on the canvas
 const drawNewRect = (obj) => {
   ctx.strokeStyle = obj.color;
   ctx.lineWidth = 3;
   ctx.strokeRect(obj.x , obj.y, obj.width, obj.height);
   drawTab(obj);
   drawLabel(obj); 
   drawDeleteTab(obj); 
  }
 
 //Takes in an array of boxes and draws them to the canvas
 //calls drawMenu
 //Should be called whenever box coordinates or sizes change
 const drawAll = (arr) => {
  for (let i = 0; i < arr.length; i++){
    drawNewRect(arr[i]); 
  };
  drawMenu()
};
  
  //creates tab at bottom right of the box to drag and resize
const drawTab = (obj) => {
  ctx.fillStyle = 'black'; 
  let x = obj.x + obj.width - 10
  let y = obj.y + obj.height - 10
  ctx.fillRect(x,y,10,10);
}
  
//erases whole template
//should be called before updates are drawn
const clear = () => {
  console.log('clear triggered')
  ctx.clearRect(0, 0, template.width, template.height);
}

const drawMenu = () => {
  ctx.strokeStyle = 'black'; 
  ctx.moveTo(200, 0);
  ctx.lineTo(200, 600 );
  ctx.stroke(); 
  
  //ctx.strokeRect(buttonStore[0].x, buttonStore[0].y, buttonStore[0].width, buttonStore[0].height)
  
  for (let i = 0; i < buttonStore.length; i++) {
    ctx.strokeStyle = buttonStore[i].color
    ctx.strokeRect(buttonStore[i].x, buttonStore[i].y, buttonStore[i].width, buttonStore[i].height)
    ctx.font = '30px serif';
    ctx.fillStyle = `${buttonStore[i].color}`
    ctx.fillText(buttonStore[i].type, buttonStore[i].x, buttonStore[i].y + 35, 150)
  } 
  
  ctx.strokeStyle = 'black';
  
  
  
  
  
  //loop through buttons here
  
}
  

let moving = false;
let selected = null;
let resizing = false; 
let startX = 0; 
let startY = 0; 




onMount(() => {
  template = document.getElementById('canvas');
  console.log(template)
  //let context = canvas.getContext('2d');
  const parent = document.querySelector('.canvasParent');
  template.width = parent.clientWidth;
  template.height = parent.clientHeight;
  
  // const template = document.getElementById("dottemplate"); 
  ctx = template.getContext('2d'); 

//all instances of Box class are stored in this array 


// class Box {
//   constructor(x, y, width, height, type, color) {
//     this.x = x,
//     this.y = y, 
//     this.width = width,
//     this.height = height,
//     this.type = type, 
//     this.color = color
//   }
// }

// const drawLabel = (obj) => {
//   ctx.font = '20px serif'
//   ctx.fillStyle = `${obj.color}`;
//   ctx.fillText(obj.type, obj.x + 2, obj.y + 20, obj.width - 20)
//   ctx.fillStyle = 'black'; 
// }

// const drawDeleteTab = (obj) => {
//   ctx.strokeRect(obj.x + obj.width - 15, obj.y, 15, 15); 
//   ctx.fillStyle = 'red';
//   ctx.font = '10px'
//   ctx.fillText('X', obj.x + obj.width - 15, obj.y + 15); 
//   ctx.fillStyle = 'black'; 

// }
//  //Draws iputed box on the canvas
//  const drawNewRect = (obj) => {
//    ctx.strokeStyle = obj.color;
//    ctx.lineWidth = 3;
//    ctx.strokeRect(obj.x , obj.y, obj.width, obj.height);
//    drawTab(obj);
//    drawLabel(obj); 
//    drawDeleteTab(obj); 
//   }
 
//  //Takes in an array of boxes and draws them to the canvas
//  //calls drawMenu
//  //Should be called whenever box coordinates or sizes change
//  const drawAll = (arr) => {
//   for (let i = 0; i < arr.length; i++){
//     drawNewRect(arr[i]); 
//   };
//   drawMenu()
// };
  
//   //creates tab at bottom right of the box to drag and resize
// const drawTab = (obj) => {
//   ctx.fillStyle = 'black'; 
//   let x = obj.x + obj.width - 10
//   let y = obj.y + obj.height - 10
//   ctx.fillRect(x,y,10,10);
// }
  
// //erases whole template
// //should be called before updates are drawn
// const clear = () => {
//   console.log('clear triggered')
//   ctx.clearRect(0, 0, template.width, template.height);
// }
  

// let moving = false;
// let selected = null;
// let resizing = false; 
// let startX = 0; 
// let startY = 0; 


//
//EVENT LISTENERS
//
template.addEventListener('mousedown', e => { 
  let x = e.offsetX; 
  let y = e.offsetY; 
  
  console.log('mouse x position is ' + x + ' mouse y position is ' + y);
  
  //loops through the array of boxes
  for (let i = 0; i < boxArray.length; i++){
    //if the mouse is within the box boundaries, set selected to current box
    if (x > boxArray[i].x && x < (boxArray[i].x + boxArray[i].width) && y > boxArray[i].y + 6 && y <     
    (boxArray[i].y + boxArray[i].height + 6 )) {
      selected = boxArray[i]; 
      moving = true;
      //if the mouse position is within the resize tab, invoke resize 
      if (x >= selected.x + selected.width - 10 && x <= selected.x + selected.width + 10 && y >= selected.y + selected.height - 10 && selected.y + selected.height + 10 ) { 
        moving = false; 
        resizing = true; 
        resize(e, selected);  
      }
      console.log('selected box is ' + selected.type)
    }
  } 
})

//invokes move or resize on mouse movement only if a box is selected
template.addEventListener('mousemove', e => {
  if(selected != null){
    move(e, selected);
  }; 
  if(resizing === true){
    resize(e, selected); 
  }
})

//inovked when mouse is released, resets selected box, moving, and resizing variables 
template.addEventListener('mouseup', e => {
  
  //if moving or resizing, trigger conditional that will check the location of the moved/rezized box
  if (moving || resizing) {
    for (let i = 0; i < boxArray.length; i++){
      if (boxArray[i].x < selected.x && boxArray[i].y < selected.y){
        console.log('box: ' + selected.type + ' is inside ' + boxArray[i].type)
      }
    }
  }

  moving = false; 
  resizing = false;
  selected = null; 
  let x = e.offsetX; 
  let y = e.offsetY; 
  if (e.offsetX < 200){
    console.log('clicked inside menu area'); 
      for (let i = 0; i < buttonStore.length; i++){
        if (x > buttonStore[i].x && x < (buttonStore[i].x + buttonStore[i].width) && y > buttonStore[i].y + 6 && y <     
    (buttonStore[i].y + buttonStore[i].height + 6 )) {
          let temp = new Box (300, 100, 200, 100, buttonStore[i].type, buttonStore[i].color); 
          boxArray.push(temp); 
          drawAll(boxArray); 
        } 
      }
    }
});



//MOVEMENT TRACKING FUNCTIONS

const resize = (e, boxClass, startX, startY) => {
  if (resizing === true){
  clear(); 
  boxClass.width += e.movementX; 
  boxClass.height += e.movementY;
  drawAll(boxArray); 
  }
}

const move = (e, boxClass) => {
  if (moving === true){
    console.log('move triggered')
    clear();  
    boxClass.x += e.movementX; 
    boxClass.y += e.movementY; 
  }
  drawAll(boxArray);
}


//Buttons will be displayed in the menu area
//MOVED TO INDEX


//MOVED TO INDEX
// let buttonStore = []; 

// class Button {
//   constructor(x, y, width, height, type, color) {
//     this.x = x,
//     this.y = y, 
//     this.width = width,
//     this.height = height,
//     this.type = type, 
//     this.color = color
//   }
// }

// let createButton = (boxes) => {
//   buttonStore = [];
//   for (let i = 0; i < boxes.length; i++)
//   { 
//     buttonStore.push(new Button(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height, boxes[i].type, boxes[i].color))
//   }
//   return
//  }

// const h1 = new Button(20, 20, 150, 50, 'Component 1', 'green'); 
// buttonStore.push(h1); 
// const img = new Button(20, 80, 150, 50, 'Component 2', 'yellow'); 
// buttonStore.push(img);
// const paragraph = new Button(20, 140, 150, 50, 'Component 3', 'blue');
// buttonStore.push(paragraph); 
// const div = new Button(20, 200, 150, 50, 'Component 4', 'red'); 
// buttonStore.push(div); 

//createButton(boxes);


//STORES BUTTON INFO

// const drawMenu = () => {
//   ctx.strokeStyle = 'black'; 
//   ctx.moveTo(200, 0);
//   ctx.lineTo(200, 600 );
//   ctx.stroke(); 
  
//   //ctx.strokeRect(buttonStore[0].x, buttonStore[0].y, buttonStore[0].width, buttonStore[0].height)
  
//   for (let i = 0; i < buttonStore.length; i++) {
//     ctx.strokeStyle = buttonStore[i].color
//     ctx.strokeRect(buttonStore[i].x, buttonStore[i].y, buttonStore[i].width, buttonStore[i].height)
//     ctx.font = '30px serif';
//     ctx.fillStyle = `${buttonStore[i].color}`
//     ctx.fillText(buttonStore[i].type, buttonStore[i].x, buttonStore[i].y + 35, 150)
//   } 
  
//   ctx.strokeStyle = 'black';
  
  
  
  
  
//   //loop through buttons here
  
// }

drawMenu(); 


mounted = true;

});
</script>

<div class="canvasParent">
  <button on:click = { () => createButton(boxes)}>pushme</button>
  <!-- <Switch bind:checked={toggled}></Switch> -->
  <canvas id="canvas"></canvas>
</div>
<style>
div {
  width: 100%;
  height: 100%;
}
#canvas {
  display: block;
  height: 100%;
  width: 100%;
}
</style>