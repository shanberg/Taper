<script lang="ts">
  import { hstack } from 'styled-system/patterns'
  import { splitCssProps } from 'styled-system/jsx'

  $: [cssProps, restProps] = splitCssProps($$restProps)

</script>

<div {...restProps} class={hstack(cssProps)}><slot /></div>
