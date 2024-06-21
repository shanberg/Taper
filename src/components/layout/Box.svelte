<script lang="ts">
  import { box } from 'styled-system/patterns'
  import { splitCssProps } from 'styled-system/jsx'

  $: [cssProps, restProps] = splitCssProps($$restProps)

</script>

<div {...restProps} class={box(cssProps)}><slot /></div>
