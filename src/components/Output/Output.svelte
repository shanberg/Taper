<script lang="ts">
  
  import Steps from './components/Steps.svelte';
  import DosesDisplay from './components/DosesDisplay.svelte';
  import { Heading, SegmentControl } from '../';
  import { derived } from 'svelte/store';
  import { formControlStyles, formLabelStyles, inputStyles } from '../'
  import { appStore } from '../../stores';

	const handleChangePeriodSize = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		appStore.changePeriodSize(target.value as PeriodSize);
	};

  const displayModeStore = derived(appStore, ($store) => $store.schedule.displayMode);
  const updateDisplayMode = (newDisplayMode: string) => {
    appStore.changeDisplayMode(newDisplayMode as DisplayMode);
  };
  
  $: selectedOption = $appStore.schedule.displayMode;
  $: periodSize = $appStore.schedule.periodSize;
</script>

<div class="container">
  <Heading level={2}>Schedule</Heading>
  <SegmentControl
    options={["steps", "doses", "calendar"]}
    valueStore={displayModeStore}
    updateValue={updateDisplayMode}
    name="display-mode"
  />

  <label class={`${formControlStyles.base}`}>
    <span class={formLabelStyles.base}>Period Size</span>
    <select 
      class={inputStyles}
      value={periodSize}
        on:change={handleChangePeriodSize}
      >
      <option value="half-day">Half-day</option>
      <option value="day">Days</option>
      <option value="week">Week</option>
    </select>
  </label>

  <output>
    {#if selectedOption === "steps"}
      <Steps />
    {/if}
    {#if selectedOption === "doses"}
      <DosesDisplay />
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
