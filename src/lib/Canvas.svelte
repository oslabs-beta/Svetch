
<div class="container">
    <label id = "switch">
      <Switch bind:checked={toggled}></Switch>
    </label>
  <canvas id='dotCanvas' bind:this={dotCanvas}></canvas>
</div>
<script>

export let dotCanvas; 

import  { Box } from "../boxClass.js"

import {onMount} from 'svelte'

import Switch from './Switch.svelte';

export let toggled = true; 

onMount(() =>{
  function getDocumentWidth() {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
};

function getDocumentHeight() {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
};

let canvas = document.getElementById('dotCanvas');
console.log(canvas);
let context = canvas.getContext('2d');

var vw = getDocumentWidth(),
    vh = getDocumentHeight();

//resize the canvas to fill the browser window
window.addEventListener('resize', onResize, false);
function onResize() {
  vw = getDocumentWidth();
  vh = getDocumentHeight();
  resizeCanvas();
}

function resizeCanvas() {
  canvas.width = vw;
  canvas.height = vh;
  drawDots();
}
resizeCanvas();


// grid
function drawGrid(){
  var cellW = 10,
      cellH = 10;
  
  // vertical lines
  for (var x = 0; x <= vw; x += cellW) {
      context.moveTo(x, 0); // x, y
      context.lineTo(x, vh);
  }
  
  // horizontal lines
  for (var y = 0; y <= vh; y += cellH) {
      context.moveTo(0, y); // x, y
      context.lineTo(vw, y);
  }

  context.strokeStyle = "#cccccc";
  context.stroke();
}
 drawGrid();

// dots
function drawDots() {
  var r = 2,
      cw = 30,
      ch = 30;
  
  for (var x = 20; x < vw; x+=cw) {
    for (var y = 20; y < vh; y+=ch) {
        context.fillStyle = '#000000';   
        context.fillRect(x-r/2,y-r/2,r,r);
      }
  }
}
drawDots();



// let canvas = document.getElementById("dotCanvas"); 
//BOX MOVEMENT EVENT LISTENERS

const boxArray = [];
let moving = false;
let selected = null;
let resizing = false; 
let startX = 0; 
let startY = 0; 



//must be called after every movement to prevent portions of boxes from being erased
const drawAll = (arr) => {
  for (let i = 0; i < arr.length; i++){
    drawNewRect(arr[i]); 
  }
};

canvas.addEventListener('mousedown', e => { 
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
        //drawAll(boxArray); 
      }
      console.log('selected box is ' + selected.type)
    }
  } 
})

canvas.addEventListener('mousemove', e => {
  if(selected != null){
    move(e, selected);
  }; 
  if(resizing === true){
    resize(e, selected); 
  }
}); 

canvas.addEventListener('mouseup', e => {
  moving = false; 
  resizing = false; 
  //console.log('new x is ' + selected.x + ' new y is ' + selected.y)
  selected = null; 
});

const resize = (e, boxClass) => {
  if (resizing === true){
  clear(boxClass)
  //logic for resizing here
    
  boxClass.width += e.movementX; 
  boxClass.height += e.movementY;
  drawAll(boxArray); 
  }
}

const move = (e, boxClass) => {
  if (moving === true){
    console.log('move triggered')
    clear(boxClass)
    //keeps correct position reletive to mouse but has a glitch
    // let diffX = boxClass.x - e.pageX; 
    // let diffY = boxClass.y - e.pageY;
    // boxClass.x = e.pageX - diffX; 
    // boxClass.y = e.pageY - diffY; 
    // boxClass.y = e.offsetY; 
    // boxClass.x = e.offsetX; 
    boxClass.x += e.movementX; 
    boxClass.y += e.movementY; 
  }
  drawAll(boxArray);
}

  const drawNewRect = (boxClass) => {
   if (boxClass.type === 'h1'){
    context.strokeStyle = 'green'; 
   }
   if (boxClass.type === 'img'){
    context.strokeStyle = 'yellow'; 
   }
   if (boxClass.type === 'paragraph'){
    context.strokeStyle = 'blue'; 
   }
   context.lineWidth = 1;
   context.strokeRect(boxClass.x , boxClass.y, boxClass.width, boxClass.height);
   drawTab(boxClass); 
  }

  const drawTab = (boxClass) => {
    let x = boxClass.x + boxClass.width - 10
    let y = boxClass.y + boxClass.height - 10
    context.fillRect(x,y,10,10);
  }

  const clear = (boxClass) => {
    console.log('clear triggered')
    context.clearRect(boxClass.x - 1 , boxClass.y - 1, boxClass.width + 6, boxClass.height + 6) 
  }

  const rect1 = new Box(100, 100, 1000, 500, 'h1'); 
  boxArray.push(rect1); 
  drawNewRect(rect1);


});
//END OF ONMOUNT








</script>
<style>
    .container {
        border: 2px solid black;
        /* height: 40em; */
        height: 70vh;
        width: 75vw;
        margin-left: 2%;
        border-radius: 15px;
}
#dotCanvas
    {
       
    display: block;
    height: 100%;
    width: 100%
    }
#switch
{
position: absolute;
right: 2vw;
}

</style>