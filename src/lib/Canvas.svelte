<main> 
    <div class="container">
        <label id = "switch">
        <Switch bind:checked={toggled}></Switch>
                <!-- <br>
                {toggled} -->
            </label>
        <canvas id='dotCanvas'>
            
        </canvas>
    </div>
</main>
<script>
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
console.log(canvas)
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

// // dots
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
});
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