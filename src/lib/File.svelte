<script>
  import { selectedComponent } from '../store'

  export let name, id;
</script>
  
<p on:click="{() => $selectedComponent=id}">{name}</p>
