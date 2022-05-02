import { canvas } from '../store.js';
let canvasStore;
export default {
  print: () => {
    const unsubscribe = canvas.subscribe((val) => canvasStore = val);
    unsubscribe();
    console.log(canvasStore);
  }
}