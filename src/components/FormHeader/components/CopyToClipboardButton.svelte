<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import styles from "@styles/forms.module.css";
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
  class={styles.button}
  {disabled}
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
    padding-right: 2rem;
    text-align: start;
    width: unset;
    display: grid;
    background-size: 1.25rem;
    background-position: right 0.5rem top 40%;
    background-repeat: no-repeat;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="%23000" fill-rule="evenodd" d="M8.25 5A2.75 2.75 0 0 1 11 2.25h2A2.75 2.75 0 0 1 15.75 5v2a.75.75 0 0 1-.75.75H9A.75.75 0 0 1 8.25 7V5ZM11 3.75c-.69 0-1.25.56-1.25 1.25v1.25h4.5V5c0-.69-.56-1.25-1.25-1.25h-2Z" clip-rule="evenodd"/><path fill="%23000" fill-rule="evenodd" d="M6.487 4.929c.126-.06.267.036.266.176L6.75 7A2.25 2.25 0 0 0 9 9.25h6A2.25 2.25 0 0 0 17.25 7V5.104c0-.14.14-.236.267-.175A3.498 3.498 0 0 1 19.5 8.085v10.49a3.39 3.39 0 0 1-2.972 3.365 36.639 36.639 0 0 1-9.056 0A3.391 3.391 0 0 1 4.5 18.575V8.085a3.5 3.5 0 0 1 1.987-3.156ZM15 12a.75.75 0 0 1 0 1.5H9A.75.75 0 0 1 9 12h6Zm-1 3a.75.75 0 0 1 0 1.5H9A.75.75 0 0 1 9 15h5Z" clip-rule="evenodd"/></svg>')
  }

  :disabled {
    opacity: 0.5;
  }

  .label {
    grid-column: 1 / 1;
    grid-row: 1;
  }
</style>
