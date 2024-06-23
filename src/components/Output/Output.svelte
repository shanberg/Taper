<script lang="ts">
  import Heading from '../Heading.svelte';
  import SegmentControl from '../SegmentControl.svelte';
  import Steps from './components/Steps.svelte';
  import Dose from './components/Dose.svelte';
  import { derived } from 'svelte/store';

  import { appStore } from '../../stores';

  const displayModeStore = derived(appStore, ($store) => $store.schedule.displayMode);
  const updateDisplayMode = (newDisplayMode: string) => {
    appStore.changeDisplayMode(newDisplayMode as DisplayMode);
  };
  
  $: selectedOption = $appStore.schedule.displayMode;
</script>

<div class="container">
  <Heading level={2}>Schedule</Heading>
  <SegmentControl
    options={["steps", "doses", "calendar"]}
    valueStore={displayModeStore}
    updateValue={updateDisplayMode}
    name="display-mode"
  />

  <output>
    {#if selectedOption === "steps"}
      <Steps />
    {/if}
    {#if selectedOption === "doses"}
      <Dose />
    {/if}
  </output>

</div>

<style>
  .container { 
    border-top: 1px solid var(--color-separator-border);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  output {
    border: 1px solid var(--color-separator-border);
    display: block;;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
  }
</style>
