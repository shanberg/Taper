<script lang="ts">
  import type { Action } from 'svelte/action';  
  import styles from "./forms.module.css";
  export let action: Action;
  export let thisElement = null
  export let variant = 'secondary'
</script>

<button 
{...$$restProps} 
class={[
(variant === "primary") && styles.buttonPrimary,
(variant === "text") && styles.buttonText,
styles.button
].filter(Boolean).join(" ")}
use:action
on:click
bind:this={thisElement}
>
  <slot />
</button>

<style>

</style>
