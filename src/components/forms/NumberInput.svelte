<script lang="ts">
  import { inputField } from 'styled-system/patterns'

  export let value = '';
  export let disabled = false;
  export let placeholder = '';
</script>

<input
  type="number"
  bind:value
  {placeholder}
  {disabled}
  aria-label="Date input"
  aria-disabled={disabled}
  on:change
  on:keydown
  on:blur
  on:input
  {...$$restProps}
  class={inputField($$restProps)}
/>

<style>
</style>