<script>
import Switch from './Switch.svelte';
export let toggled = false;


</script>
<main>
    <div id = 'tree'>
        <label id = "switch" >
            <Switch bind:checked={toggled} ></Switch>
                    <!-- <br>
                    {toggled} -->
                </label></div>
</main>
<style>
       #tree{
       border: 2px solid black;
        /* height: 40em; */
        height: 70vh;
        width: 75vw;
        margin-left: 2%;
        border-radius: 15px;
       }
       #switch
{
position: absolute;
right: 2vw;
}
</style>