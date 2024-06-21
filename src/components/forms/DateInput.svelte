<script lang="ts">
  import { inputField } from 'styled-system/patterns'
  import { splitCssProps } from 'styled-system/jsx'

  $: [cssProps, restProps] = splitCssProps($$restProps)

  export let value = '';
  export let placeholder = 'Select date';
  export let disabled = false;
</script>

<input
  type="date"
  bind:value
  placeholder={placeholder}
  disabled={disabled}
  aria-label="Date input"
  aria-disabled={disabled}
  on:change
  on:keydown
  on:blur
  on:input
  {...restProps}
  class={inputField(cssProps)}
/>

<style>
</style>