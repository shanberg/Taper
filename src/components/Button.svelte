<script lang="ts">
  import styles from "./forms.module.css";
  export let use: Function = () => {}
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
use:use
on:click
bind:this={thisElement}
>
  <slot />
</button>

<style>

</style>
