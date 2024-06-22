<script lang="ts">
	import { appStore } from '../stores';
	import FormSegment from './FormSegment.svelte';
	import AddSegmentButton from './AddSegmentButton.svelte';
	import { TaperDate } from '../TaperDate';
	import { segmentIsOrAfterPlaceholder, isSegmentInvalid, formatSegmentText, calculateScheduleSummary } from '../utils';

	export let schedule: Schedule;
  export let index: number;
  export let selectedLanguage: Language;
	
	let segmentStartDate: ScheduleDate;
	let segmentEndDate: ScheduleDate;
	
	$: startDate = schedule.startDate;
	$: segments = schedule.segments;
	$: segment = schedule.segments[index];
	$: isSegmentPlaceholder = segment.dose === 0 && segment.daysForDose === 0;
	$: isInvalid = !isSegmentPlaceholder && isSegmentInvalid(segment);
	$: isLastPlaceholderSegment = index === segments.length - 1 && isSegmentPlaceholder;

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

<style>
	.row {
		display: flex;
    position: relative;
    gap: 0.5rem;
	}

	.written-plan {
		padding-block: 0.25rem;
	}

	.isInvalid .written-plan{
		color: var(--color-fg-error);
	}
	
	.isSegmentPlaceholder .written-plan{
		color: var(--color-fg-muted);
	}

	.written-plan:not(.isLastPlaceholderSegment):where(.isInvalid, .isSegmentPlaceholder) {
		text-decoration: underline;
		text-decoration-style: wavy;
		text-decoration-skip-ink: none;
	}
</style>
