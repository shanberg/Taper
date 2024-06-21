<script lang="ts">
  import { inputField } from 'styled-system/patterns'

  type InputType = 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'reset' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week' | 'search';

  export let id = '';
  export let type: InputType = 'text';
  export let value = '';
  export let placeholder = '';
  export let disabled = false;
  export let required = false;
  export let readonly = false;
  export let name = '';
  export let autocomplete = 'off';
</script>

<input
  id={id}
  bind:value
  {placeholder}
  {disabled}
  {required}
  {readonly}
  {name}
  {autocomplete}
  aria-label={placeholder}
  aria-disabled={disabled}
  aria-required={required}
  aria-readonly={readonly}
  on:blur
  on:change
  on:click
  on:contextmenu
  on:focus
  on:keydown
  on:keypress
  on:keyup
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:paste
  on:input
  {...{ type }}
  {...$$restProps}
/>

<style>
</style> 