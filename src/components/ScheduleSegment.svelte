<script lang="ts">
	import { formatSegmentText, isSegmentInvalid } from '../utils';
	import { TaperDate } from '../TaperDate';
	export let segments;
	export let startDate;
	export let selectedLanguage;
	export let segment;
	export let index;

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

{#if !isLastPlaceholderSegment}
	<li class:isInvalid class:isSegmentPlaceholder>
		{formatSegmentText({ segment, segmentStartDate, segmentEndDate, index, selectedLanguage })}
	</li>
{/if}

<style>
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
