<script lang="ts">
  import { inputField } from 'styled-system/patterns'
  import { splitCssProps } from 'styled-system/jsx'

  $: [cssProps, restProps] = splitCssProps($$restProps)

  type InputType = 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'reset' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week' | 'search';

  export let id = '';
  export let type: InputType = 'text';
  export let value = '';
</script>

<input
  id={id}
  bind:value
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
  {...restProps}
  class={inputField(cssProps)}
/>

<style>
</style> 