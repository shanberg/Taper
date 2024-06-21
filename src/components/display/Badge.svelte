<script lang="ts">
  import { box } from 'styled-system/patterns'

  const styles = {
    display: "inline-block",
    verticalAlign: "middle",
    lineHeight: "normal",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    textTransform: "uppercase",
    fontSize: "12px",
    fontWeight: "bold",
    color: "status.warningContrast",
    background: "status.warning",
    borderRadius: "2px",
    padding: "0 4px"
  };
</script>

<div {...$$restProps} class={box({...styles, ...$$restProps})}><slot /></div>
