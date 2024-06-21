<script lang="ts">
  import { flex } from 'styled-system/patterns'
  import { splitCssProps } from 'styled-system/jsx'

  $: [cssProps, restProps] = splitCssProps($$restProps)

</script>

<div {...restProps} class={flex(cssProps)}><slot /></div>
