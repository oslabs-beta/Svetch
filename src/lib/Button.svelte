<script>
  export let iconAfter = false;
  export let rightAlign = false;
</script>

{#if $$slots.text && $$slots.icon}
  <button class:iconAfter class='icon-button' on:click>
    <slot name='icon'></slot>
    <slot name='text'></slot>
  </button>
{:else if $$slots.text}
  <button class='no-gap' class:rightAlign on:click>
    <slot name='text'></slot>
</button>
{/if}

<style>
  button {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    border-radius: 9999px;
    padding: 0.6rem 1.2rem;
    margin: unset;
    border: 1px solid #001829;
    background-color: #282b2e;
    color: #d7dce0;
  }
  button.iconAfter {
    flex-direction: row-reverse;
  }
  button.no-gap {
    gap: none;
  }
  button.rightAlign {
    margin-left: auto;
  }
  button:hover {
    background-color: #001829;
    border: 1px solid #836e60;
    color: #d7dce0;
	}
  :global(button.icon-button svg) {
    fill: white;
  }
  :global(.icon-button:hover svg){
    fill: #836e60;
  }
</style>