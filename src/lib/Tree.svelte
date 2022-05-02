<script>
import Switch from './Switch.svelte';
export let toggled = false;


</script>
<div class='treeContainer'>
    <Switch bind:checked={toggled}></Switch>
</div>
<style>
.treeContainer {
    position: relative;
    border: 2px solid black;
    /* height: 40em; */
    height: 70vh;
    width: 75vw;
    margin-left: 2%;
    border-radius: 15px;
}
</style>