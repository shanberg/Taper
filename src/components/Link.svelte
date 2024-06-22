<script lang="ts">
  export const href: string = "";
</script>

<a {href} {...$$restProps}>
  <slot />
</a>

<style>
a {
  color: var(--color-interaction-main);
}
</style>