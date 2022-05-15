<script>
import { onMount } from 'svelte'
import { canvas } from '../store.js'
import canvasUtility from '../utils/canvasUtility'
import { components } from "../store.js"


let borderWidth = 1;
let boxArr;
// let boxArray = [];
components.subscribe((val) => boxArr = val);

let componentStore = []; 

class Rect {
  constructor(x, y, width, height, type, color) {
    this.x = x,
    this.y = y, 
    this.width = width,
    this.height = height,
    this.type = type, 
    this.color = color
  }
  contains(x, y) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y + 2 * borderWidth && 
      y < this.y + this.height + 2 * borderWidth
    );
  }
  draw(ctx) {
    ctx.strokeStyle = this.color;
    ctx.strokeRect(this.x , this.y, this.width, this.height);
  }
  drawLabel(ctx, font, x, y, maxWidth) {
    ctx.font = font;
    ctx.fillStyle = `${this.color}`;
    ctx.fillText(this.type, x, y, maxWidth)
    ctx.fillStyle = 'black'; 
  }
}

class EditableRect extends Rect {
  constructor(x, y, width, height, type, color, id) {
    super(x, y, width, height, type, color);
    this.parent = null;
    this.id = id;
  }
  containsRect(rect) {
    return (
      rect.x > this.x &&
      rect.x < this.x + this.width &&
      rect.y > this.y + 2 * borderWidth &&
      rect.y < this.y + this.height + 2 * borderWidth
    );
  }
  draw(ctx) {
    super.draw(ctx);
    super.drawLabel(ctx, '20px serif', this.x + 2, this.y + 20, this.width - 20); 
    this.drawDeleteTab(ctx);
    this.drawResizeTab(ctx);
  }
  drawDeleteTab(ctx) {
    ctx.strokeRect(this.x + this.width - 15, this.y, 15, 15); 
    ctx.fillStyle = 'red';
    ctx.font = '10px'
    ctx.fillText('X', this.x + this.width - 15, this.y + 15); 
    ctx.fillStyle = 'black'; 
  }
  drawResizeTab(ctx) {
    const x = this.x + this.width - 10;
    const y = this.y + this.height - 10;
    ctx.fillStyle = 'black'; 
    ctx.fillRect(x,y,10,10);
  }
  resizeTabContains(x,y) {
    return (
      x >= this.x + this.width - 10 && 
      x <= this.x + this.width && 
      y >= this.y + this.height - 10 && 
      y <= this.y + this.height 
    );
  }
  deleteTabContains(x,y) {
    return (
      x >= this.x + this.width - 15 && 
      x <= this.x + this.width && 
      y >= this.y && 
      y <= this.y + 15 
    );
  }
}

let mounted = false;
let createComponentStore = (boxes) => {
  componentStore = [];
  for (let i = 0; i < boxes.length; i++) { 
    componentStore.push(new Rect(...Object.values(boxes[i])))
  }
  return;
 }

$:{createComponentStore(boxArr)}
$:{ if (mounted) {clearButtons(); drawMenu(componentStore)}}

let ctx; 
let template;
 
 //Takes in an array of boxes and draws them to the canvas
 //calls drawMenu
 //Should be called whenever box coordinates or sizes change
 const drawAll = (arr) => {
  for (let i = 0; i < arr.length; i++){
    // drawBox(arr[i]); 
    const rect = arr[i];
    rect.draw(ctx);
  };
  //drawMenu()
};
  
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
   
  let lineWidth = '1px'
  for (let i = 0; i < componentStore.length; i++) {
    // const { x, y, width, height, type, color } = componentStore[i];
    const rect = new Rect(...Object.values(componentStore[i]));
    rect.draw(ctx);
    rect.drawLabel(ctx, '30px serif', rect.x, rect.y + 35, 150);
  } 
  
}
  

let moving = false;
let selected = null;
let resizing = false; 
let startX = 0; 
let startY = 0; 




onMount(() => {



  //VARIABLES FOR DRAW AND MOVE FUNCTIONS
  template = document.getElementById('dotCanvas');
  const parent = document.querySelector('.canvasParent');
  template.width = parent.clientWidth;
  template.height = parent.clientHeight;
  ctx = template.getContext('2d'); 

  const drawDots = () => {
  let r = 1,
      cw = 18,
      ch = 18;
  
  for (let x = 200; x < template.width; x+=cw) {
    for (let y = 20; y < template.height; y+=ch) {
        ctx.fillStyle = '#000000';   
        ctx.fillRect(x-r/2,y-r/2,r,r);
      }
  }
}
  drawDots();

//EVENT LISTENERS

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
    const rect = boxArray[i];
    console.log(rect.deleteTabContains(x,y));
    if (rect.contains(x,y)) { 
      selected = rect;
      moving = true;
    }
  } 
  if (selected && selected.resizeTabContains(x,y)) { 
    moving = false; 
    resizing = true; 
    resize(e, selected);  
  }
  if (selected && selected.deleteTabContains(x,y)) {
    moving = false;
    const parent = selected.parent === 'index' ? 'index' : selected.parent.id;
    canvasUtility.deleteChild(selected.id, parent);
    const boxArray = canvasUtility.parse('index', true);
    clear();
    drawDots();
    drawAll(boxArray)
  }
});

//invokes move or resize on mouse movement only if a box is selected
template.addEventListener('mousemove', e => {
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
    let newParent = 'index';
    const oldParent = selected.parent === 'index' ? 'index' : selected.parent.id;
    let children = [];
    let boxArray = canvasUtility.parse('index', true); 
    
    for (let i = 0; i < boxArray.length; i++){
      const rect = boxArray[i];
      if (rect.containsRect(selected)) newParent = rect.id;
      else if (selected.containsRect(rect)) {
        let isChild = true;
        children.forEach(child => {
          // the child contains the current rect
          if (child.containsRect(rect)) isChild = false;
        })
        if (isChild) children.push(rect);
      }
    }
    if (newParent !== oldParent) {
      canvasUtility.removeChild(selected.id, oldParent);
      canvasUtility.addChild(selected.id, newParent);
      boxArray = canvasUtility.parse('index', true);
      clear();
      drawDots();
      drawAll(boxArray)
    }
  }

  moving = false; 
  resizing = false;
  selected = null; 
  let x = e.offsetX; 
  let y = e.offsetY; 
  if (e.offsetX < 200){ 
    for (let i = 0; i < componentStore.length; i++){
      const rect = componentStore[i];
      if (rect.contains(x,y)) { 
        const id = Object.keys($canvas).length;
        const newRect = new EditableRect (300, 100, 200, 100, rect.type, rect.color, id); 
    
        let boxArray = canvasUtility.parse('index', true);
        let parent = 'index';
        for (let i = 0; i < boxArray.length; i++) {
          const rect = boxArray[i];
          if (rect.containsRect(newRect)) parent = rect;  
        }
        newRect.parent = parent;
        console.log('parent of new component:', parent);
        canvasUtility.createChild(id, newRect.type, parent.id || 'index', newRect);
        boxArray = canvasUtility.parse('index', true);
        drawAll(boxArray)
        console.log($canvas)
      } 
    }
  }
});



//MOVEMENT TRACKING FUNCTIONS

const resize = (e, rect) => {
  if (resizing === true){
  clear(); 
  drawDots();
  rect.width += e.movementX; 
  rect.height += e.movementY;
  const boxArray = canvasUtility.parse('index', true); 
  drawAll(boxArray); 
  }
}

const move = (e, rect) => {
  if (moving === true && rect.x > 204){
    clear();  
    rect.x += e.movementX; 
    rect.y += e.movementY; 
  }
  else if (rect.x <= 204) {
    clearButtons();
    drawMenu();
    rect.x = 205;
  }
  drawDots();
  const boxArray = canvasUtility.parse('index', true); 
  drawAll(boxArray);
}

mounted = true;

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