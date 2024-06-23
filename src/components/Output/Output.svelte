<script lang="ts">
  import SegmentControl from '../SegmentControl.svelte';
  import { derived } from 'svelte/store';

  import { appStore } from '../../stores';

  
  const displayModeStore = derived(appStore, ($store) => $store.schedule.displayMode);
  const updateDisplayMode = (newDisplayMode: string) => {
    appStore.changeDisplayMode(newDisplayMode as DisplayMode);
  };
  
  $: selectedOption = $appStore.schedule.displayMode;
</script>

<div class="container">
  <SegmentControl
    options={["dose", "calendar", "segments"]}
    valueStore={displayModeStore}
    updateValue={updateDisplayMode}
    name="display-mode"
  />
</div>  

<style>
  .container { 
    border-top: 1px solid var(--color-separator-border);
    padding: 1rem;
  }
</style>
