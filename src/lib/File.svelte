<script>
  import { selectedComponent } from '../store.js'
  export let name, id;
</script>
  
<p on:click="{() => $selectedComponent=id}">{name}</p>