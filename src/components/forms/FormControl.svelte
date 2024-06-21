<script lang="ts">
  import { onMount } from 'svelte';
  import { vstack } from 'styled-system/patterns'
  import { css } from 'styled-system/css'

  export let id = '';
  export let isInvalid = false;
  export let errorMessage = '';
  export let helperText = '';

  const inputId = id || `form-control-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  let inputElement: HTMLElement;

  onMount(() => {
    if (inputElement) {
      inputElement.setAttribute('aria-describedby', `${helperId} ${errorId}`);
      if (isInvalid) {
        inputElement.setAttribute('aria-invalid', 'true');
      }
    }
  });

  const formInputClass = css({
    position: 'relative',
  });

  const formHelperTextClass = css({
    marginTop: '0.25rem',
    fontSize: '0.875rem',
    color: '#6b7280',
  });

  const formErrorMessageClass = css({
    marginTop: '0.25rem',
    fontSize: '0.875rem',
    color: '#e53e3e',
  });

</script>

<label
  class={vstack({
    alignItems: "stretch",
    marginBottom: '1rem',
    padding: '1rem',
    ...$$restProps
  })}
  for={inputId}
>
  <slot name="label"></slot>
  <div class={formInputClass} bind:this={inputElement}>
    <slot></slot>
  </div>
  {#if helperText}
    <div id={helperId} class={formHelperTextClass}>{helperText}</div>
  {/if}
  {#if isInvalid && errorMessage}
    <div id={errorId} class={formErrorMessageClass}>{errorMessage}</div>
  {/if}
</label>
