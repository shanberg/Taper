<script lang="ts">
  import type { Action } from 'svelte/action';  
  import styles from "@styles/forms.module.css";
  export let action: Action;
  export let thisElement = null
  export let variant = 'secondary'
</script>

<button 
class={[
  (variant === "primary") && styles.buttonPrimary,
  (variant === "text") && styles.buttonText,
  styles.button
].filter(Boolean).join(" ")}
use:action
on:click
bind:this={thisElement}
{...$$restProps} 
>
  <slot />
</button>

<style>

</style>
