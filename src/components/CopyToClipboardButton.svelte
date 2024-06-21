<script lang="ts">
  import styles from "./forms.module.css";
  export let textToCopy: string = "";
  let copySuccess = false;

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

  // Callback function to handle the copy event
  function handleCopySuccess() {
    // Perform any actions you want to take after the text is copied
    console.log("Text copied to clipboard successfully!");
    // You can add more actions here, like showing a notification
  }
</script>

<div>
  <button 
    class={styles.button}
    on:click={() => copyToClipboard(textToCopy)}
  >
  Copy Schedule
</button>
</div>
