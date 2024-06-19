<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { LANGUAGES } from '../consts';
	import { formatSegmentText, isSegmentInvalid } from '../utils';
	export let segments;
	export let startDate;
	export let selectedLanguage;
	export let segment;
	export let index;

	let segmentStartDate: Date;
	let segmentEndDate: Date;

	$: isSegmentPlaceholder = segment.dose === 0 && segment.daysForDose === 0;
	$: isInvalid = !isSegmentPlaceholder && isSegmentInvalid(segment);
	$: isLastPlaceholderSegment = index === segments.length - 1 && isSegmentPlaceholder;

	// Calculate the start and end dates
	$: {
		segmentStartDate = new Date(startDate.getTime());
		const totalDaysForStartDate =
			segments
				.slice(0, index)
				.reduce((acc: number, curr: { daysForDose: number }) => acc + curr.daysForDose - 1, 0) +
			index;
		segmentStartDate.setDate(segmentStartDate.getDate() + totalDaysForStartDate);

		segmentEndDate = new Date(segmentStartDate.getTime());
		segmentEndDate.setDate(segmentEndDate.getDate() + segment.daysForDose - 1);
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
