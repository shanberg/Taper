<script lang="ts">
  import { TaperDate } from '../../../TaperDate';
  import { getPeriodsWithDosesForStep, stepIsOrAfterPlaceholder, isStepInvalid, formatStepText, formatPeriodText, calculateScheduleSummary } from '../../../utils';
  import List from '../../dataDisplay/List/List.svelte';
  import ListItem from '../../dataDisplay/ListItem/ListItem.svelte';

  export let schedule: Schedule;
  export let index: number;
  export let selectedLanguage;

  let stepStartDate: ScheduleDate;
  let stepEndDate: ScheduleDate;

  $: scheduleStartDate = schedule.startDate;
  $: steps = schedule.steps;
  $: stepType = schedule.stepType;
  $: step = schedule.steps[index];
  $: isStepPlaceholder = step.dose === 0 && step.duration === 0;
  $: isInvalid = !isStepPlaceholder && isStepInvalid(step);
  $: isLastPlaceholderStep = index === steps.length - 1 && isStepPlaceholder;
  $: outputPeriodSize = schedule.outputPeriodSize;

  // Calculate the start and end dates
  $: {
    const taperStartDate = new TaperDate(scheduleStartDate);
    const totalDaysForStartDate =
      steps
        .slice(0, index)
        .reduce((acc: number, curr: { duration: number }) => acc + curr.duration - 1, 0) +
      index;
    taperStartDate.incrementByDays(totalDaysForStartDate);
    const taperEndDate = new TaperDate(taperStartDate.toScheduleDate());
    taperEndDate.incrementByDays(step.duration - 1);

    stepStartDate = taperStartDate.toScheduleDate();
    stepEndDate = taperEndDate.toScheduleDate();
  }

  $: periodsForDose = getPeriodsWithDosesForStep({ step, stepStartDate, outputPeriodSize });
</script>

<ListItem class="row">
  <p>{formatStepText({ step, stepStartDate, stepType, stepEndDate, index, selectedLanguage })}</p>
  <List>
    {#each periodsForDose as period, periodIndex}
      <ListItem>{formatPeriodText({ step, stepStartDate: period.date, outputPeriodSize, index: periodIndex, selectedLanguage })}</ListItem>
    {/each}
  </List>
</ListItem>

<style>
  :where(.isInvalid, .isStepPlaceholder):not(.isLastPlaceholderStep) {
    & .written-plan {
      text-decoration: underline;
      text-decoration-style: wavy;
      text-decoration-skip-ink: none;
      text-decoration-thickness: 1px;
      text-underline-offset: 4px;
    }
  }
</style>
