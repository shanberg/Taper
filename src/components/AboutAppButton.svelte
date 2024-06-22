<script lang="ts">
  import Dialog from './Dialog.svelte';
</script>

<Dialog>
  <div slot="title">About Taper</div>
  <div slot="description">
    <p>Taper is a simple tool for healthcare professionals to calculate tapering schedules, and translate them for use by patients.</p>
    <ul>
      <li>It is free and <a href="https://github.com/shanberg/Taper">open source</a>.</li>
      <li>It doesn't store any data, and will never request personally identifying information.</li>
      <li>It is made for healthcare professionals, not for patients or other individuals.</li>
    </ul>
  </div>
</Dialog>

<style>
  a {
    color: var(--color-interaction-main);
  }
</style>
