<script lang="ts">
  import { box } from 'styled-system/patterns'  
  import { splitCssProps } from 'styled-system/jsx'

  $: [cssProps, restProps] = splitCssProps($$restProps)
</script>

<span {...restProps} class={box({fontWeight: "bold", ...cssProps})}><slot /></span>
