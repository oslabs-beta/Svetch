<script>
import { onMount } from 'svelte'
import { canvas, options, selectedComponent } from '../store.js'
import canvasUtility from '../utils/canvasUtility'

export let state;
let borderWidth = 1;
let mounted = false;
let ctx; 
let template;
let moving = false;
let selected = null;
let resizing = false;
let reset = false; 

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

export class EditableRect extends Rect {
  constructor(x, y, width, height, type, color, id) {
    super(x, y, width, height, type, color);
    this.parent = null;
    this.id = id;
  }
  containsRect(rect) {
    return (
      rect.x > this.x &&
      rect.x + rect.width < this.x + this.width &&
      rect.y > this.y + 2 * borderWidth &&
      rect.y + rect.height < this.y + this.height + 2 * borderWidth
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

$:{ 
  if (mounted) {
    clearButtons(); 
    drawMenu($options)
    drawComponents();
  }
}

$: {if ($canvas.index.children.length > 0) reset = true;}

$: {
  if ($canvas.index.children.length === 0 && mounted && reset) {
      clear(); 
      drawDots(); 
      clearButtons();
      reset = false;
      drawMenu($options);
    }
  }
 //Takes in an array of boxes and draws them to the canvas
 //calls drawMenu
 //Should be called whenever box coordinates or sizes change
 
const drawComponents = () => {
  const components = canvasUtility.parse('index', true);
  clear();
  drawDots();
  components.forEach(rect => {
    rect.draw(ctx)});
}
const buildCanvas = (obj) => {
  const updateChildren = (key, parent) => {
    if (obj[key].children.length) {
      obj[key].children.forEach(child => {
        updateChildren(child, key);
      });
    }
    const {x, y, width, height, type, color} = obj[key].component;
    obj[key].component = null;
    let newRect = new EditableRect(x, y, width, height, type, color, key);
    newRect.parent = parent === 'index' ? null : parent;
    obj[key].component = newRect;
    return;
  }
  const children = obj['index'].children;
  children.forEach(child => updateChildren(child, 'index'));
  return obj;
}
  
//erases whole template
//should be called before updates are drawn
const clear = () => {
  ctx.clearRect(200, 0, template.width, template.height);
}

const clearButtons = () => {
  ctx.clearRect(0, 0, 200, template.height);
}

const drawMenu = () => {
  ctx.strokeStyle = 'black'; 
  ctx.moveTo(200, 0);
  ctx.lineTo(200, template.height);
  ctx.stroke(); 
 
  for (let i = 0; i < $options.length; i++) {
    const rect = new Rect(...Object.values($options[i]));
    console.log('rect: ', rect);
    rect.draw(ctx);
    rect.drawLabel(ctx, '30px serif', rect.x, rect.y + 35, 150);
    let contains = false
   for (let key in $canvas)
   {
    if (rect.type === $canvas[key].scriptId) 
    {
      contains = true;
      
    }
    if (contains == true) break
   }
   if (contains == false){
    ctx.strokeRect(rect.x + rect.width - 15, rect.y, 15, 15); 
    ctx.fillStyle = 'red';
    ctx.font = '1px'
    ctx.fillText('x', rect.x + rect.width - 15, rect.y + 15); 
    ctx.fillStyle = 'black'; 
    rect.deletable = true
   }
   
  } 
  
}


const drawDots = () => {
  const r = 1,
        cw = 18,
        ch = 18;
  
  for (let x = 200; x < template.width; x+=cw) {
    for (let y = 20; y < template.height; y+=ch) {
      ctx.fillStyle = '#000000';         
      ctx.fillRect(x-r/2,y-r/2,r,r);
    }    
  }
}
  

onMount(() => {
  //VARIABLES FOR DRAW AND MOVE FUNCTIONS
  template = document.getElementById('dotCanvas');
  const parent = document.querySelector('.canvasParent');
  template.width = parent.clientWidth;
  template.height = parent.clientHeight;
  ctx = template.getContext('2d'); 
  
  if (state) {
    const previousState = JSON.parse(state);
    const previousCanvas = previousState.canvas;
    const previousOptions = previousState.options;
    // const formattedCanvas = buildCanvas(previousCanvas);
    const formattedOptions = [];
    
    for(let entry in previousCanvas) {
      const current = previousCanvas[entry];
      const { x, y, width, height, type, color } = {...current.component};
      if (entry !== 'index') current.component = new EditableRect(x, y, width, height, type, color, entry);
    }
    for(let option in previousOptions) {
      const newOption = new Rect(...Object.values(previousOptions[option]))
      formattedOptions.push(newOption);
    }
    console.log('pprev: ', previousCanvas);
    state = null;
    $canvas = previousCanvas;
    $options = formattedOptions;
    drawMenu();
  }

//EVENT LISTENERS


template.addEventListener('wheel', (e) => {
  if ($options.length){
   let outOfFrame;
   let topOfFirstButton = $options[0].y;
   let bottomOfLastButton =  $options[$options.length - 1].y + $options[$options.length - 1].height;
   let scrollMaxed = false;
   //Below satement sets outOfFrame to true if first or last button is outside of template boundaries
   bottomOfLastButton > template.height || topOfFirstButton < 0 ? outOfFrame = true : outOfFrame = false;
   if (e.offsetX < 200 && outOfFrame) {
     let j = $options.length;
   for (let i = 0; i < $options.length; i++){
       if ($options[0].y > 25){
         $options[i].y = 20 + (i * 60);
       }
       else if (bottomOfLastButton < template.height - 20) {
         console.log('menu bottomed out');
         console.log('last button y value is ' + $options[$options.length - 1].y);
         console.log('template height is ' + template.height);
         $options[i].y = template.height - 10 - ( j * 60);
         j--; 
       }
       else {
       $options[i].y -= e.deltaY * .5;
       }
       console.log('last button y is now ' + $options[$options.length -1].y)
       console.log('first button y is now ' + $options[0].y)
     };
   };
  };
});


window.addEventListener('resize', () => {
  template.width = parent.clientWidth;
  template.height = parent.clientHeight;
  drawComponents();
  clearButtons();
  drawMenu(); 
});

template.addEventListener('mousedown', e => { 
  let x = e.offsetX; 
  let y = e.offsetY; 
  console.log('mousedown triggered')
  const components = canvasUtility.parse('index', true); 
  console.log('components in canvas: ', components);
  // Check all components to see if they contain x,y coordinate of mouse event
  for (let i = 0; i < components.length; i++){
    const rect = components[i];
    if (rect.contains(x,y)) { 
      selected = rect;
      console.log('selected rect inside canvas: ', selected);
      $selectedComponent = selected.id
      moving = true;
      console.log('selected!');
    }
  } 
  if (selected && selected.resizeTabContains(x,y)) { 
    moving = false; 
    resizing = true; 
    resize(e, selected);  
  }
  else if (selected && selected.deleteTabContains(x,y)) {
    moving = false;
    canvasUtility.delete(selected);
    $selectedComponent = 'index';
    drawComponents();
    clearButtons();
    drawMenu();
  }
  else if (!selected) $selectedComponent = 'index'
});

//invokes move or resize on mouse movement only if a component is selected
template.addEventListener('mousemove', e => {
  if(selected != null) move(e, selected); 
  if(resizing === true) resize(e, selected);
})

//invoked when mouse is released, resets selected component, moving, and resizing variables 
template.addEventListener('mouseup', e => {
  console.log('mouse up triggered');
  //if moving or resizing, trigger conditional to check location of moved/rezized component
  if (moving || resizing) {
    const componentsBefore = canvasUtility.parse('index', true); 
    const oldChildren = new Set();
    const newChildren = new Set();
    let newParent;
    
    for (let i = 0; i < componentsBefore.length; i++){
      const rect = componentsBefore[i];
      // check if current rect is the parent of selected rect
      if (rect.containsRect(selected)) newParent = rect;
      // check if selected rect is the parent of current rect
      if (selected.containsRect(rect)) {
        let isChild = true;
        // determine if child is a direct descendant 
        newChildren.forEach(child => {
          // if child contains current rect, current rect is not a child
          if (child.containsRect(rect)) isChild = false;
        });
        // if current rect is a direct descendant, add the child to array
        if (isChild) newChildren.add(rect);
      }
      // if current rect has selected as parent based on old position
      if (rect.parent === selected) {
        oldChildren.add(rect);
      }
    }
    // remove new children from their old parents, add them to selected
    newChildren.forEach(newChild => {
      if (!oldChildren.has(newChild)) {
        canvasUtility.removeParent(newChild);
        newChild.parent = selected;
        canvasUtility.updateParent(newChild);
      }
    });
  
    // remove old children from selected, add them to selected rect's old parent
    oldChildren.forEach(oldChild => {
      if (!newChildren.has(oldChild)) {
        canvasUtility.removeParent(oldChild);
        oldChild.parent = selected.parent;
        canvasUtility.updateParent(oldChild);
      }
    });

    // re-add child so that it is later in array (displayed on top)
    canvasUtility.removeParent(selected);
    selected.parent = newParent;
    canvasUtility.updateParent(selected);
    
    // redraw updated canvas
    drawComponents();
  }

  moving = false; 
  resizing = false;
  selected = null; 
  let x = e.offsetX; 
  let y = e.offsetY; 
  if (e.offsetX < 200){ 
    for (let i = 0; i < $options.length; i++){
      const rect = new Rect(...Object.values($options[i]));
      //logic that sees if button has componnet on convas, contains is true if it is
      let contains = false
      for (let key in $canvas)
      {
        if (rect.type === $canvas[key].scriptId) 
        {
          contains = true;
        }
        if (contains == true) break
        }
        //logic to see if x on button is clicked
      if (contains == false && x >= rect.x + rect.width - 15 && x <= rect.x + rect.width && y >=rect.y &&  y <= rect.y + 15 )
      {
     
       $options.splice(i,1);
       $options = $options;
        for (let j = i; j < $options.length; j++)
        {
          $options[j].y -= 60;
        }
        clearButtons();
        drawMenu();
        return
        
      }
      else if (rect.contains(x,y)) {  
        const id = 'component' + $canvas.index.counter++;
        const newRect = new EditableRect(300, 100, 200, 100, rect.type, rect.color, id); 
        const components = canvasUtility.parse('index', true);
        
        for (let i = 0; i < components.length; i++) {
          const rect = components[i];
          if (rect.containsRect(newRect)) newRect.parent = rect;  
        }
        canvasUtility.create(newRect);
      } 
    }
    drawComponents();
    clearButtons();
    drawMenu();
    console.log('canvas after component added: ', $canvas);
  }
});



//MOVEMENT TRACKING FUNCTIONS

const resize = (e, rect) => {
  if (resizing === true){
    if (rect.width + e.movementX > 20) rect.width += e.movementX; 
    if (rect.height + e.movementY > 20) rect.height += e.movementY;
    const components = canvasUtility.parse('index', true); 
    //console.log(rect.width + " " + rect.height)
    drawComponents(); 
  }
}

const move = (e, rect) => {
  if (moving === true && rect.x > 204 && rect.y > 0 && rect.y + rect.height <= template.height && rect.x + rect.width <= template.width){
    
    rect.x += e.movementX; 
    rect.y += e.movementY; 
    //console.log(template.height, " ", template.width)
  }
  else if (rect.x <= 204) {
    clearButtons();
    drawMenu();
    rect.x = 205;
  }
  else if (rect.y <= 0) {
    // clearButtons();
    // drawMenu();
    rect.y = 1;
  }
  else if (rect.y + rect.height >= template.height) {
    // clearButtons();
    // drawMenu();
    rect.y = template.height - rect.height;
  }
  else if (rect.x + rect.width >= template.width) {
    // clearButtons();
    // drawMenu();
    rect.x = template.width - rect.width;
  }

  drawComponents();
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