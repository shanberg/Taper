<script lang="ts">
	import { appStore } from '../stores';
	import FormSegment from './FormSegment.svelte';
	import AddSegmentButton from './AddSegmentButton.svelte';
	import { TaperDate } from '../TaperDate';
	import { segmentIsOrAfterPlaceholder, isSegmentInvalid, formatSegmentText, cachedFormatDate } from '../utils';

  export let segments;
  export let segment;
  export let startDate;
  export let index;
  export let selectedLanguage;

	let segmentStartDate: ScheduleDate;
	let segmentEndDate: ScheduleDate;
	let segmentDates: ScheduleDate[];

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

    // Generate the array of dates for the checkboxes
    segmentDates = [];
    let currentDate = new TaperDate(segmentStartDate);
    for (let i = 0; i < segment.daysForDose; i++) {
        segmentDates.push(currentDate.toScheduleDate());
        currentDate.incrementByDays(1);
    }
	}

</script>

<div class="row" class:isInvalid class:isSegmentPlaceholder>
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
    <span class="written-plan">
      {formatSegmentText({ segment, segmentStartDate, segmentEndDate, index, selectedLanguage })}
    </span>
		<ul class="date-checkboxes">
		{#each segmentDates as date}
			<li>
				<label>
					<input type="checkbox" />
					{segment.dose}mg on {cachedFormatDate(date, selectedLanguage.lang)}
				</label>
			</li>
		{/each}
	</ul>

  {/if}
</div>

<style>
	.row {
		display: flex;
    position: relative;
    gap: 1rem;
	}

	.date-checkboxes {
		list-style: none;
		display: block;
		padding: 0;
		margin: 0;
	}

	.date-checkboxes li {
		display: block;
	}

	label { 
		display: contents;
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

	.isInvalid .written-plan,
	.isSegmentPlaceholder .written-plan{
		text-decoration: underline;
		text-decoration-style: wavy;
		text-decoration-skip-ink: none;
	}
</style>
