<script lang="ts">
  import type { Action } from 'svelte/action';  
  import button from './button.module.css';
  export let action: Action;
  export let thisElement = null
  export let variant = 'secondary'
  export let disabled = false;
</script>

<button 
  class={[
  (variant === "primary") && button.variantPrimary,
  (variant === "text") && button.variantText,
  button.base
].filter(Boolean).join(" ")}
  use:action
  on:click
  bind:this={thisElement}
  aria-disabled={disabled ? "true" : undefined}
  {...$$restProps} 
>
  <slot />
</button>

<style>

</style>
