<script lang="ts">
	import { appStore } from '../stores';
	import FormSegment from './FormSegment.svelte';
	import AddSegmentButton from './AddSegmentButton.svelte';
	import { TaperDate } from '../TaperDate';
	import { getDaysWithDosesForSegment, segmentIsOrAfterPlaceholder, isSegmentInvalid, formatSegmentText, calculateScheduleSummary } from '../utils';
	import List from './List.svelte';
	import ListItem from './ListItem.svelte';

	export let schedule: Schedule;
  export let index: number;
  export let selectedLanguage: Language;
	
	let segmentStartDate: ScheduleDate;
	let segmentEndDate: ScheduleDate;
	
	$: displayMode = schedule.displayMode;
	$: startDate = schedule.startDate;
	$: segments = schedule.segments;
	$: segment = schedule.segments[index];
	$: isSegmentPlaceholder = segment.dose === 0 && segment.daysForDose === 0;
	$: isInvalid = !isSegmentPlaceholder && isSegmentInvalid(segment);
	$: isLastPlaceholderSegment = index === segments.length - 1 && isSegmentPlaceholder;

	$: daysForDose = getDaysWithDosesForSegment(segment, startDate);

	// Calculate the start and end dates
	$: {
		const taperStartDate = new TaperDate(startDate);
		const totalDaysForStartDate =
			segments
				.slice(0, index)
				.reduce((acc: number, curr: { daysForDose: number }) => acc + curr.daysForDose - 1, 0) +
			index;
		taperStartDate.incrementByDays(totalDaysForStartDate);
		const taperEndDate = new TaperDate(taperStartDate.toScheduleDate());
		taperEndDate.incrementByDays(segment.daysForDose - 1);

		segmentStartDate = taperStartDate.toScheduleDate();
		segmentEndDate = taperEndDate.toScheduleDate();
	}

</script>

<div class="row" class:isInvalid class:isSegmentPlaceholder class:isLastPlaceholderSegment>
  {#if !segmentIsOrAfterPlaceholder(segments, index)}
    <AddSegmentButton
      on:addSegment={() => appStore.insertPlaceholderSegmentBeforeIndex(index)}
    />
  {/if}
  <FormSegment
    {segments}
    {segment}
    {index}
    on:removeSegment={() => appStore.deleteSegmentAtIndex(index)}
    on:change={(event) => appStore.editSegmentAtIndex(index, event.detail)}
  />
  {#if isLastPlaceholderSegment}
    <span class="written-plan summary">
      {calculateScheduleSummary(schedule)}
    </span>
  {:else}
    <span class="written-plan">
      {formatSegmentText({ segment, segmentStartDate, segmentEndDate, index, selectedLanguage })}
    </span>
  {/if}
</div>

{#if displayMode === "doses"}
<div class="spacer">
<List>
{#each daysForDose as day, index}
	<ListItem>Take {day.dose}mg on {new TaperDate(day.date).toYYYYMMDD()}</ListItem>	
{/each}
</List>
</div>
{/if}

<style>
	.row {
		display: flex;
    position: relative;
    gap: 0.5rem;
	}

	.spacer {
		padding-left: 13rem;
		color: var(--color-text-muted);
	}

	.written-plan {
		padding-block: 0.25rem;
	}

	.isInvalid .written-plan{
		color: var(--color-status-error);
	}
	
	.isSegmentPlaceholder .written-plan{
		color: var(--color-text-muted);
	}

	:where(.isInvalid, .isSegmentPlaceholder):not(.isLastPlaceholderSegment) {
		& .written-plan {
			text-decoration: underline;
			text-decoration-style: wavy;
			text-decoration-skip-ink: none;
			text-decoration-thickness: 1px;
			text-underline-offset: 4px;
		}
	}
</style>
