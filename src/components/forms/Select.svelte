<script lang="ts">
  import { inputField } from 'styled-system/patterns';
  import { splitCssProps } from 'styled-system/jsx'

  $: [cssProps, restProps ] = splitCssProps($$restProps)

  export let id = '';
  export let value = '';
  export let disabled = false;
  export let placeholder: string = 'Select a...';
  export let required = false;
  export let name = '';
  export let isWarning: boolean = false;
  
  export let options;
  // export let options: SelectOption[] = [];

</script>

<select
  {id}
  bind:value
  {disabled}
  {required}
  {placeholder}
  {name}
  class:isWarning
  aria-label={name}
  aria-disabled={disabled}
  aria-required={required}
  class={inputField({
    paddingRight: "2rem",
    appearance: "none",
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20"><path d="M5,8 L10,13 L15,8" fill="none" stroke-width="2" stroke-linecap="round" stroke="black"/></svg>')`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.5rem top 47.5%",
    backgroundSize: "1.25rem",
    ...cssProps
  })}
  {...restProps}
  on:change
  on:blur
  on:input
>
  {#each options as option}
    {#if (option.divider === true)}
      <hr />
    {:else}
      <option
        disabled={option.disabled}
      value={option.value}>{option.label}</option>
    {/if}
  {/each}
</select>