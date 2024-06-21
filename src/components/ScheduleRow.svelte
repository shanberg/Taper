<script lang="ts">
	import { appStore } from '../stores';
	import FormSegment from './FormSegment.svelte';
	import AddSegmentButton from './AddSegmentButton.svelte';
	import { TaperDate } from '../TaperDate';
	import { segmentIsOrAfterPlaceholder, isSegmentInvalid, formatSegmentText, isSegmentPlaceholder } from '../utils';
	import { Box } from './';

  export let segments;
  export let segment;
  export let startDate;
  export let index;
  export let selectedLanguage;

	let segmentStartDate: ScheduleDate;
	let segmentEndDate: ScheduleDate;
	let segmentDates: ScheduleDate[];

	$: isPlaceholder = isSegmentPlaceholder(segment);
	$: isInvalid = !isPlaceholder && isSegmentInvalid(segment);
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

	$: conditionalStyles = (isInvalid || isPlaceholder) ? {
		textDecoration: "underline",
		textDecorationStyle: "wavy",
		textDecorationSkipInk: "none"
	} : {};
</script>

<Box 
	display="flex"
	position="relative"
	gap="1rem"
	data-invalid={isInvalid}
	data-placeholder={isPlaceholder}
>
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
    <Box paddingBlock="0.25rem"
		{...conditionalStyles}
			color={isInvalid ? "status.error" : isPlaceholder ? "fgMuted" : undefined}
		>
      {formatSegmentText({ segment, segmentStartDate, segmentEndDate, index, selectedLanguage })}
    </Box>
  {/if}
</Box>
