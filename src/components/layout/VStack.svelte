<script lang="ts">
  import { vstack } from 'styled-system/patterns'
  import { splitCssProps } from 'styled-system/jsx'

  $: [cssProps, restProps] = splitCssProps($$restProps)

</script>

<div {...restProps} class={vstack(cssProps)}><slot /></div>
