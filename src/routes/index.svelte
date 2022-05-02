<script>
import Elements from "../lib/Elements.svelte";
import Canvas from '../lib/Canvas.svelte';
import Tree from '../lib/Tree.svelte';
import Codeblock from '../lib/Codeblock.svelte';

let toggled = true

function toggle() {
  toggled = !toggled;
 // console.log("test",checked)
}
$:console.log(toggled)
</script>

<main>
  <div class="elementsContainer">
    <Elements />
  </div>
  <div class="visualizerContainer">
    {#if toggled}
      <Canvas bind:toggled = {toggled}/>
    {:else}
      <Tree bind:toggled = {toggled}/>
    {/if}
  </div>
  <div class="codeboxContainer">
    <pre>
      <code>
        <Codeblock />
      </code>
    </pre>
  </div>
</main>

<style>
main {
  padding-top: .5vh;
  display: flex;
  flex-direction: row;
  text-align: center;
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
}
.elementsContainer {
	border: 2px solid black;
	height: 70vh;
	width: 20vw;
	border-radius: 15px;
}
.visualizerContainer {

}
.codeboxContainer {

}

@media (min-width: 640px) {
  main {
    max-width: none;
  }
}
</style>