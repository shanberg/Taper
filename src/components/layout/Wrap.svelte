<script lang="ts">
  import { wrap } from 'styled-system/patterns'
  import { splitCssProps } from 'styled-system/jsx'

  $: [cssProps, restProps] = splitCssProps($$restProps)

</script>

<div {...restProps} class={wrap(cssProps)}><slot /></div>
