<script lang="ts">

</script>

<span>
    <slot />
</span>

<style>
  span {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-transform: capitalize;
    font-size: 12px;
    font-weight: 500;
    color: var(--color-status-warning-contrast);
    background: var(--color-status-warning);
    border-radius: 2px;
    padding: 2px 4px;
  }
</style>
