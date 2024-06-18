<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { LANGUAGES } from '../consts';
	import { formatRowText, isRowInvalid } from '../utils';
	export let tableData;
	export let startDate;
	export let selectedLanguage;
	export let row;
	export let index;

	let rowStartDate: Date;
	let rowEndDate: Date;

	$: isRowPlaceholder = row.dose === 0 && row.daysForDose === 0;
	$: isInvalid = !isRowPlaceholder && isRowInvalid(row);
	$: isLastPlaceholderRow = index === tableData.length - 1 && isRowPlaceholder;

	// Calculate the start and end dates
	$: {
		rowStartDate = new Date(startDate.getTime());
		const totalDaysForStartDate =
			tableData
				.slice(0, index)
				.reduce((acc: number, curr: { daysForDose: number }) => acc + curr.daysForDose - 1, 0) +
			index;
		rowStartDate.setDate(rowStartDate.getDate() + totalDaysForStartDate);

		rowEndDate = new Date(rowStartDate.getTime());
		rowEndDate.setDate(rowEndDate.getDate() + row.daysForDose - 1);
	}
</script>

{#if !isLastPlaceholderRow}
	<li class:isInvalid class:isRowPlaceholder>
		{formatRowText({ row, rowStartDate, rowEndDate, index, selectedLanguage })}
	</li>
{/if}

<style>
	.isInvalid {
		color: var(--color-fg-error);
	}
	.isRowPlaceholder {
		color: var(--color-fg-muted);
	}
	.isInvalid,
	.isRowPlaceholder {
		text-decoration: underline;
		text-decoration-style: wavy;
		text-decoration-skip-ink: none;
	}
</style>
