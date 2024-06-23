<script lang="ts">
  import ScheduleRow from "./ScheduleRow.svelte";
  import { appStore } from "../../../stores";
  import { getLanguageFromKey, isStepInvalid, isStepPlaceholder } from "../../../utils";

  $: schedule = $appStore.schedule;
  $: selectedLanguage = getLanguageFromKey(schedule.languageKey);
  $: steps = $appStore.schedule.steps.filter(s => !isStepPlaceholder(s) && !isStepInvalid(s))
</script>

<div>
  {#each steps as _, index}
    <ScheduleRow {schedule} {index} {selectedLanguage} />
  {/each}
</div>