<script lang="ts">
  export let href: string = "";
</script>

<a {href} {...$$restProps}>
  <slot />
</a>

<style>
a {
  color: var(--color-interaction-primary);
  font-weight: var(--font-weight-interactive);
  text-decoration: none;
}
</style>