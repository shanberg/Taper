<script lang="ts">
  import { createRadioGroup, melt, createSync } from '@melt-ui/svelte';
  import { buttonStyles, hStackStyles } from '../../';
  import { derived } from 'svelte/store';

  export let options;
  export let defaultValue: string | undefined = undefined;
  export let name = 'segment-control';
  export let valueStore; // Custom store for the current value
  export let updateValue; // Function to update the value

  const derivedValue = derived(valueStore, ($store) => $store);

  const {
    elements: { root, item, hiddenInput },
    helpers: { isChecked },
    states: { value: internalValue }
  } = createRadioGroup({
    defaultValue
  });

  // Sync function to synchronize the internal state with the custom store
  const sync = createSync({ value: internalValue });
  $: sync.value($derivedValue as string, (v) => updateValue(v));
</script>

<div>
  <div use:melt={$root} class="group">
    {#each options as option}
      <button
        use:melt={$item(option)}
        id={option}
        class={[hStackStyles.base, $isChecked(option) && buttonStyles.isActive, buttonStyles.base, "option"].filter(Boolean).join(" ")}
        aria-labelledby="{option}-label"
      >
        <label for={option} id="{option}-label">{option}</label>
      </button>
    {/each}
    <input name={name} use:melt={$hiddenInput} />
  </div>
</div>

<style>
  @layer component {
    .group {
      display: grid;
      grid-auto-columns: 1fr;
      grid-auto-flow: column;
      padding: 1px;
      gap: 1px;
    }

    .option {
      max-width: auto;
      width: auto;
      display: flex;
      place-content: center;
    }
  }
</style>