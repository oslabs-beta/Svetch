<script>
  import { selectedComponent } from '../store'

  export let name, id;
</script>
  
<p on:click="{() => $selectedComponent=id}">{name}</p>

<style>
  p:hover {
    cursor: pointer;
  }
  p {
    margin-left: -0.5rem;
    padding-left: 0.5rem;
    border-left: 1px solid #836e60;
  }
</style>
