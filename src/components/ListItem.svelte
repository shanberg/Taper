<script lang="ts">
</script>

<li {...$$restProps}>
  <slot />
</li>

<style>
  li::marker {
    color: var(--color-fg-muted);
  }
</style>