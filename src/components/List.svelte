<script lang="ts">
</script>

<ul {...$$restProps}>
  <slot />
</ul>

<style>
  ul {
    padding: 0;
    padding-inline-start: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0;
  }
</style>