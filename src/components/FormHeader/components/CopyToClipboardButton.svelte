<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { buttonStyles, Button } from "../../";
  export let textToCopy: string = "";
  export let disabled: boolean = false;
  let copySuccess = false;
  let buttonWidth = "auto";
  let buttonElement: HTMLButtonElement;

  // Function to copy text to the clipboard
  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      copySuccess = true;
      handleCopySuccess();
    } catch (err) {
      console.error('Failed to copy: ', err);
      copySuccess = false;
    }
  }

  function handleCopySuccess() {
    setTimeout(() => {
      copySuccess = false;
    }, 2000); // Show "Copied!" for 2 seconds
  }

  onMount(() => {
    // Measure the button's width when it mounts
    if (buttonElement) {
      buttonWidth = `${buttonElement.offsetWidth}px`;
    }
  });
</script>

<button
  class={[buttonStyles.base, buttonStyles.variantPrimary].filter(Boolean).join(" ")}
  aria-disabled={disabled}
  bind:this={buttonElement}
  on:click={() => copyToClipboard(textToCopy)}
  style="min-width: {buttonWidth};"
>
  {#if copySuccess}
    <span class="label" transition:fade={{ duration: 150 }}>Copied!</span>
  {:else}
    <span class="label" transition:fade={{ duration: 150 }}>Copy Schedule</span>
  {/if}
</button>

<style>
  button {
    display: grid;
    width: unset;
  }

  .label {
    grid-column: 1 / 1;
    grid-row: 1;
  }
</style>
