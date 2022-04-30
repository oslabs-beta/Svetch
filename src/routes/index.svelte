<script>
  
  // @ts-ignore
import Elements from "../lib/Elements.svelte"; 
  // @ts-ignore
import Canvas from '../lib/Canvas.svelte'
  // @ts-ignore
import Tree from '../lib/Tree.svelte'
 
  let toggled = true
 
  function toggle() {
		toggled = !toggled;
   // console.log("test",checked)
	}
  $:console.log(toggled)
</script>

<main>
  <!-- <div id = "header">Svetch mock header</div> -->
  <!-- <button id = 'togBut' on:click = {toggle}> switch between canvas and tree </button> -->
  <div id = 'main' >

<Elements id = "el"/>
{#if toggled}
<Canvas bind:toggled = {toggled}/>
{:else}
<Tree bind:toggled = {toggled}/>
{/if}
</div>
</main>
<style>
	#main {
    padding-top: .5vh;
    display: flex;
    flex-direction: row;

		text-align: center;
	
		width: 100vw;
    height: 100vh;
		margin: 0 auto;
   
	}
  #togBut{
    float: right;
    margin-top: .5vh;
  }
  
  
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>