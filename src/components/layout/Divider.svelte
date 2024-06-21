<script lang="ts">
  import { divider } from 'styled-system/patterns'
  import { splitCssProps } from 'styled-system/jsx'
 
  $: [cssProps, restProps] = splitCssProps($$restProps)
</script>

<hr 
  {...restProps} 
  class={divider({ margin: 0, borderColor: "border", ...cssProps})}
>
