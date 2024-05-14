<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('addRow');
  }
</script>

<button title="Click to add a row" on:click={handleClick}></button>

<style>
  button {
    height: 100%;
    width: 100%;
    background-color: transparent;
    cursor: cell;
    border: 0;
    height: 4px;
    margin: -1px 0;
    z-index: 10;
    border-radius: 10px;
    position: relative;
    transition: background-color 0.05s;
  }

  button:hover, button:focus {
    outline: none;  
    background-color: var(--color-fg);
  }
</style>