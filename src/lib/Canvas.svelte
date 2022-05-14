<script>
import {onMount} from 'svelte'
import Switch from './Switch.svelte';
import { canvas } from '../store.js'
import canvasUtility from '../utils/canvasUtility'
//import {boxArray} from '../store.js'

// export let toggled = true;

//BUTTON CLASS MUST BE DEFINED IN ADD BUTTON COMPONENT

//Box array must be defined outside of onmount
// const boxArray = []; 
  //loop through the store and add 
import {boxes} from "../store.js"


let borderWidth = 1;
let boxArr;
let boxArray = [];
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
  constructor(x, y, width, height, type, color, id) {
    this.x = x,
    this.y = y, 
    this.width = width,
    this.height = height,
    this.type = type, 
    this.color = color,
    this.parent = null;
    this.id = id;
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
$:{ if (mounted) {clearButtons(); drawMenu(buttonStore)}}

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
 const drawBox = (obj) => {
   ctx.strokeStyle = obj.color;
   //ctx.lineWidth = 3;
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
    drawBox(arr[i]); 
  };
  //drawMenu()
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
  //console.log('clear triggered')
  ctx.clearRect(200, 0, template.width, template.height);
}

const clearButtons = () => {
  //console.log('clear triggered')
  ctx.clearRect(0, 0, 200, template.height);
}

const drawMenu = () => {
  
  ctx.strokeStyle = 'black'; 
  ctx.moveTo(200, 0);
  ctx.lineTo(200, 600 );
  ctx.stroke(); 
  
  //ctx.strokeRect(buttonStore[0].x, buttonStore[0].y, buttonStore[0].width, buttonStore[0].height)
  //ctx.lineWidth = '1px'; 
  let lineWidth = '1px'
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



  //VARIABLES FOR DRAW AND MOVE FUNCTIONS
  template = document.getElementById('dotCanvas');
  //console.log(template)
  //let context = canvas.getContext('2d');
  const parent = document.querySelector('.canvasParent');
  template.width = parent.clientWidth;
  template.height = parent.clientHeight;
  ctx = template.getContext('2d'); 

  function drawDots() {
  var r = 1,
      cw = 18,
      ch = 18;
  
  for (var x = 200; x < template.width; x+=cw) {
    for (var y = 20; y < template.height; y+=ch) {
        ctx.fillStyle = '#000000';   
        ctx.fillRect(x-r/2,y-r/2,r,r);
      }
  }
}
  drawDots();
  // const template = document.getElementById("dottemplate"); 
  

//all instances of Box class are stored in this array 

//EVENT LISTENERS
//
window.addEventListener('resize', () => {
  const boxArray = canvasUtility.parse('index', true); 
  template.width = parent.clientWidth;
  template.height = parent.clientHeight;
  //console.log("width is ", template.width, " and height is ", template.height);
  drawDots(); 
  drawAll(boxArray);
  clearButtons();
  drawMenu(); 
});

template.addEventListener('mousedown', e => { 
  let x = e.offsetX; 
  let y = e.offsetY; 
  const boxArray = canvasUtility.parse('index', true); 
  //console.log('mouse x position is ' + x + ' mouse y position is ' + y);
  
  //loops through the array of boxes
  for (let i = 0; i < boxArray.length; i++){
    //if the mouse is within the box boundaries, set selected to current box
    if (
      // if mouse x cordinate is greater than the box minX coordinate
      x > boxArray[i].x && 
      // if mouse x coordinate is less than the maxX coordinate
      x < (boxArray[i].x + boxArray[i].width) &&
      // if mouse y cordinate is greater than the box minY coordinate offset by the upper and lower borderWidth
      y > boxArray[i].y + 2 * borderWidth && 
      // if mouse y coordinate is less than the maxY coordinate offset by the upper and lower borderWidth
      y < (boxArray[i].y + boxArray[i].height + 2 * borderWidth )
    ) {
      
      selected = boxArray[i]; 
      moving = true;
      //if the mouse position is within the resize tab, invoke resize 
      // if (x >= selected.x + selected.width - 10 && x <= selected.x + selected.width + 10 && y >= selected.y + selected.height - 10 && selected.y + selected.height + 10 ) { 
      //   moving = false; 
      //   resizing = true; 
      //   resize(e, selected);  
      // }
      // console.log('selected box is ' + selected.type)
    }
  } 
  if (selected != null && x >= selected.x + selected.width - 10 && x <= selected.x + selected.width + 10 && y >= selected.y + selected.height - 10 && selected.y + selected.height + 10 ) { 
    moving = false; 
    resizing = true; 
    resize(e, selected);  
  }
});

//invokes move or resize on mouse movement only if a box is selected
template.addEventListener('mousemove', e => {
  //console.log('X value is: ' + e.offsetX + ' Y value is: ' + e.offsetY);
  if(selected != null){
    // remove component from parent
    move(e, selected);

  }; 
  if(resizing === true){
    resize(e, selected); 
  }
})

//invoked when mouse is released, resets selected box, moving, and resizing variables 
template.addEventListener('mouseup', e => {
  
  //if moving or resizing, trigger conditional that will check the location of the moved/rezized box
  if (moving || resizing) {
    let parent;
    let children = [];
    for (let i = 0; i < boxArray.length; i++){
      //console.log(boxArray)
      if (
        boxArray[i].x < selected.x && 
        boxArray[i].y < selected.y && 
        boxArray[i].x + boxArray[i].width > selected.x + selected.width && 
        boxArray[i].y + boxArray[i].height > selected.y + selected.height 
      ) {
        parent = boxArray[i];
        
        // the selected is a child of the current box
        
      }
     else if (
        boxArray[i].x > selected.x && 
        boxArray[i].y > selected.y && 
        boxArray[i].x + boxArray[i].width < selected.x + selected.width && 
        boxArray[i].y + boxArray[i].height < selected.y + selected.height 
      ) {
        // the selected is a parent of the current box
        let isChild = true;
        children.forEach(child => {
          // the current box is inside of child
          if (
            boxArray[i].x > child.x && 
            boxArray[i].y > child.y && 
            boxArray[i].x + boxArray[i].width < child.x + child.width && 
            boxArray[i].y + boxArray[i].height < child.y + child.height 
          ) {
            isChild = false;
          }
    
        })
        if (isChild) children.push(boxArray[i]);
      }
    }
    if (parent) console.log('selected component: ' + selected.type + ' is a child of: ' + parent.type);
    if (children.length) console.log('selected component: ' + selected.type + ' is a parent of: ', children)
  }

  moving = false; 
  resizing = false;
  selected = null; 
  let x = e.offsetX; 
  let y = e.offsetY; 
  if (e.offsetX < 200){
    // console.log('clicked inside menu area'); 
      for (let i = 0; i < buttonStore.length; i++){
        if (x > buttonStore[i].x && 
            x < (buttonStore[i].x + buttonStore[i].width) && 
            y > buttonStore[i].y + 6 && 
            y < (buttonStore[i].y + buttonStore[i].height + 6 )) {
              //boxArray.push(temp); 
              //drawAll(boxArray); 
            const id = Object.keys($canvas).length;
            let temp = new Box (300, 100, 200, 100, buttonStore[i].type, buttonStore[i].color, id); 
      
          boxArray = canvasUtility.parse('index', true);
          let parent = 'index';
          for (let i = 0; i < boxArray.length; i++) {
            if (
            boxArray[i].x < temp.x && 
            boxArray[i].y < temp.y && 
            boxArray[i].x + boxArray[i].width > temp.x + temp.width && 
            boxArray[i].y + boxArray[i].height > temp.y + temp.height 
            ) {
              parent = boxArray[i]; 
            }
          }
          temp.parent = parent;
          console.log(temp.parent)
          canvasUtility.createChild(id, temp.type, parent.id || 'index', temp);
          boxArray = canvasUtility.parse('index', true);
          drawAll(boxArray)
          console.log(boxArray)
          console.log($canvas)
        } 
      }
    }
});



//MOVEMENT TRACKING FUNCTIONS

const resize = (e, boxClass, startX, startY) => {
  if (resizing === true){
  clear(); 
  drawDots();
  boxClass.width += e.movementX; 
  boxClass.height += e.movementY;
  drawAll(boxArray); 
  }
}

const move = (e, boxClass) => {
  if (moving === true && boxClass.x > 204){
    //console.log('move triggered')
    clear();  
    boxClass.x += e.movementX; 
    boxClass.y += e.movementY; 
  }
  else if (boxClass.x <= 204) {
    clearButtons();
    drawMenu();
    boxClass.x = 205;
  }
  drawDots();
  drawAll(boxArray);
}


//drawMenu(); 


mounted = true;



// export let toggled = true;
//     function getDocumentWidth() {
//   return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
// };

// function getDocumentHeight() {
//   return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
// };

// // let canvas = document.getElementById('dotCanvas');
// // console.log(canvas)
// // let context = canvas.getContext('2d');

// var vw = getDocumentWidth(),
//     vh = getDocumentHeight();

// //resize the canvas to fill the browser window
// window.addEventListener('resize', onResize, false);
// function onResize() {
//   vw = getDocumentWidth();
//   vh = getDocumentHeight();
//   resizeCanvas();
// }

// function resizeCanvas() {
//   template.width = 
//   template.height = vh;
//   drawDots();
// }
// resizeCanvas();


// grid
// function drawGrid(){
//   var cellW = 10,
//       cellH = 10;
  
//   // vertical lines
//   for (var x = 0; x <= vw; x += cellW) {
//       ctx.moveTo(x, 0); // x, y
//       ctx.lineTo(x, vh);
//   }
  
//   // horizontal lines
//   for (var y = 0; y <= vh; y += cellH) {
//       ctx.moveTo(0, y); // x, y
//       ctx.lineTo(vw, y);
//   }

//   ctx.strokeStyle = "#cccccc";
//   ctx.stroke();
// }
 //drawGrid();

// // dots


});


</script>

<div class="canvasParent">
  
  <!-- <Switch bind:checked={toggled}></Switch> -->
  <canvas id="dotCanvas"></canvas>
</div>
<style>
div {
  width: 100%;
  height: 100%;
}
#dotCanvas {
  display: block;
  height: 100%;
  width: 100%;
}
</style>