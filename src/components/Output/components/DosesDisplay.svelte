<script lang="ts">
  import DoseRow from "./DoseRow.svelte";
  import List from '../../dataDisplay/List/List.svelte'
  import { appStore } from "../../../stores";
  import { getLanguageFromKey } from "../../../utils";

  $: schedule = $appStore.schedule;
  $: selectedLanguage = getLanguageFromKey(schedule.languageKey);
  $: steps = schedule.steps
</script>

<div>
  <List>
  {#each steps as _, index}
    <DoseRow {schedule} {index} {selectedLanguage} />
  {/each}
  </List>
</div>