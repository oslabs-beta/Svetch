<script>
import {onMount} from 'svelte'
import Switch from './Switch.svelte';

// export let toggled = true;

onMount(() => {
  let canvas = document.getElementById('canvas');
  console.log(canvas)
  let context = canvas.getContext('2d');
  const parent = document.querySelector('.canvasParent');
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;
});
</script>

<div class="canvasParent">
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