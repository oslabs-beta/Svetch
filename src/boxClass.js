import dotCanvas from "./lib/Canvas.svelte";
// const canvas = document.getElementById("dotCanvas"); 
// const ctx = canvas.getContext('2d'); 
// const canvas = dotCanvas; 
// const ctx = canvas.getContext('2d'); 

//all instances of Box class are sotred in this array
// const boxArray = []; 

// //must be called after every movement to prevent portions of boxes from being erased
// const drawAll = (arr) => {
//   for (let i = 0; i < arr.length; i++){
//     arr[i].drawNewRect(); 
//   }
// };


class Box {
  constructor(x, y, width, height, type, context) {
    this.x = x,
    this.y = y, 
    this.width = width,
    this.height = height,
    this.type = type, 
    this.context = context
  }


  // drawNewRect () {
  //   console.log('x: ' + this.x + ' y: ' + this.y + ' width: ' + this.width + ' height: ' + this.height + ' type: ' + this.type + ' context: ' + this.context)
  //  if (this.type === 'h1'){
  //   this.context.strokeStyle = 'green'; 
  //  }
  //  if (this.type === 'img'){
  //   this.context.strokeStyle = 'yellow'; 
  //  }
  //  if (this.type === 'paragraph'){
  //   this.context.strokeStyle = 'blue'; 
  //  }
  //  this.context.lineWidth = 1;
  //  this.context.strokeRect(this.x , this.y, this.width, this.height);
  //  this.drawTab()
  // }
  
  //creates tab at bottom right of the box to drag and resize
  drawTab () {
    let x = this.x + this.width - 10
    let y = this.y + this.height - 10
    this.context.fillRect(x,y,10,10);
  }
  
  //erased box from canvas, - 1 and +2 account for px width of the border
  // clear (){
  //   console.log('clear triggered')
  //   this.context.clearRect(this.x - 1 , this.y - 1, this.width + 6, this.height + 6); 
  // }
  
//   // x = left bound
//   // x + width = right bound 
//   // y = top bound
//   // y + height = bottom bound

// }
  





//declares new instance of Box class
// const rect1 = new Box(20, 20, 200, 150, 'paragraph')
// //draws box to canvas
// rect1.drawNewRect();
// //adds new instance of Box to array
// boxArray.push(rect1); 
// const rect2 = new Box(10, 10, 175, 200, 'h1')
// rect2.drawNewRect();
// boxArray.push(rect2); 

// let moving = false;
// let selected = null;
// let resizing = false; 


//
//EVENT LISTENERS MOVED TO CANVAS.SVELTE
//

// canvas.addEventListener('mousedown', e => { 
//   let x = e.offsetX; 
//   let y = e.offsetY; 
  
//   console.log('mouse x position is ' + x + ' mouse y position is ' + y);
  
//   //loops through the array of boxes
//   for (let i = 0; i < boxArray.length; i++){
//     //if the mouse is within the box boundaries, set selected to current box
//     if (x > boxArray[i].x && x < (boxArray[i].x + boxArray[i].width) && y > boxArray[i].y + 6 && y <     
//     (boxArray[i].y + boxArray[i].height + 6 )) {
//       selected = boxArray[i]; 
//       moving = true;
//       //if the mouse position is within the resize tab, invoke resize 
//       if (x >= selected.x + selected.width - 10 && x <= selected.x + selected.width + 10 && y >=                 selected.y + selected.height - 10 && selected.y + selected.height + 10 ) { 
//         moving = false; 
//         resizing = true; 
//         resize(e, selected); 
//         //drawAll(boxArray); 
//       }
//       console.log('selected box is ' + selected.type)
//     }
//   } 
// })

//invokes move on mouse movement only if a box is selected
// canvas.addEventListener('mousemove', e => {
//   if(selected != null){
//     move(e, selected);
//   }; 
//   if(resizing === true){
//     resize(e, selected); 
//   }
// })

//inovked when mouse is released, resets selected box, and moving variables 
// canvas.addEventListener('mouseup', e => {
//   moving = false; 
//   resizing = false; 
//   console.log('new x is ' + selected.x + ' new y is ' + selected.y)
//   selected = null; 
// });

//will highlight box when hovered over
// const hover = (e) => {
//   let x = e.offsetX; 
//   let y = e.offsetY; 
//   if ()
// }

// const resize = (e, boxClass) => {
//   if (resizing === true){
//   boxClass.clear()
//   //logic for resizing here
    
//   boxClass.width += e.movementX; 
//   boxClass.height += e.movementY;
//   drawAll(boxArray); 
//   }
// }

// const move = (e, boxClass) => {
//   if (moving === true){
//     console.log('move triggered')
//     boxClass.clear()
//     //keeps correct position reletive to mouse but has a glitch
//     // let diffX = boxClass.x - e.pageX; 
//     // let diffY = boxClass.y - e.pageY;
//     // boxClass.x = e.pageX - diffX; 
//     // boxClass.y = e.pageY - diffY; 
//     // boxClass.y = e.offsetY; 
//     // boxClass.x = e.offsetX; 
//     boxClass.x += e.movementX; 
//     boxClass.y += e.movementY; 
//   }
//   drawAll(boxArray);
 }

 export default Box;
