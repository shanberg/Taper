<script lang="ts">
  import type { Action } from 'svelte/action';
  export let action: Action
  import styles from "./forms.module.css";
  export let thisElement = null
  export let variant = 'secondary'
</script>

<button 
use:action
class={[
  (variant === "primary") && styles.buttonPrimary,
  (variant === "text") && styles.buttonText,
  styles.button
].filter(Boolean).join(" ")}
on:click
bind:this={thisElement}
{...$$restProps} 
>
  <slot />
</button>

<style>

</style>
