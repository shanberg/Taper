<script lang="ts">
	import { appStore } from '../stores';
	import FormSegment from './FormSegment.svelte';
	import AddSegmentButton from './AddSegmentButton.svelte';
	import { TaperDate } from '../TaperDate';
	import { segmentIsOrAfterPlaceholder, isSegmentInvalid, formatSegmentText } from '../utils';

  export let segments;
  export let segment;
  export let startDate;
  export let index;
  export let selectedLanguage;

	let segmentStartDate: ScheduleDate;
	let segmentEndDate: ScheduleDate;

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

<div class="row">
  {#if !segmentIsOrAfterPlaceholder(segment, segments)}
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
  {#if !isLastPlaceholderSegment}
    <span class:isInvalid class:isSegmentPlaceholder>
      {formatSegmentText({ segment, segmentStartDate, segmentEndDate, index, selectedLanguage })}
    </span>
  {/if}
</div>

<style>
	.row {
		display: flex;
    position: relative;
    gap: 1rem;
	}

	.isInvalid {
		color: var(--color-fg-error);
	}
	.isSegmentPlaceholder {
		color: var(--color-fg-muted);
	}
	.isInvalid,
	.isSegmentPlaceholder {
		text-decoration: underline;
		text-decoration-style: wavy;
		text-decoration-skip-ink: none;
	}
</style>
