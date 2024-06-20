<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { isSegmentInvalid, isSegmentPlaceholder } from '../utils';
	export let segments: Segment[];
	export let segment: Segment;
	export let index: number;

	const dispatch = createEventDispatcher();
	$: isOnlyRealSegment = segments.length === 2;
	$: isPlaceholder = isSegmentPlaceholder(segment);
	$: isInvalid = (!isPlaceholder && isSegmentInvalid(segment));

	function handleDoseChange(event: Event) {
		const target = event.target as HTMLInputElement;
		dispatch('change', { ...segment, dose: parseFloat(target.value) });
	}

	function handleDaysForDoseChange(event: Event) {
		const target = event.target as HTMLInputElement;
		dispatch('change', { ...segment, daysForDose: parseInt(target.value) });
	}

	function deleteSegmentAtIndex() {
		dispatch('removeSegment', index);
	}
</script>

<tr 
  class="segment"
  class:isInvalid
  class:isPlaceholder
>
	<td class="dose">
		<input
			min={1}
			step={segment.dose > 5 ? 1 : 0.25}
			type="number"
			inputmode="decimal"
			bind:value={segment.dose}
			on:change={handleDoseChange}
		/>
	</td>
	<td class="days">
		<input
			min={1}
			type="number"
			inputmode="decimal"
			bind:value={segment.daysForDose}
			on:change={handleDaysForDoseChange}
		/>
	</td>
	<td class="delete">
		<button
			{...isOnlyRealSegment ? { disabled: true } : {}}
			title="Remove this step"
			class="remove-btn"
			on:click={deleteSegmentAtIndex}>×</button
		>
	</td>
</tr>

<style>
	input {
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
	}

	.isPlaceholder {
		color: var(--color-fg-muted);
		user-select: none;

		& input {
			background: transparent;
		}
	}

	.isInvalid td input {
		background: var(--color-status-error-bg);
	}

	.isInvalid:focus-within td input {
		background: var(--color-status-error-bg-muted);
	}

	tr:last-child .remove-btn {
		display: none;
	}

	.remove-btn {
		width: 1.5rem;
		height: 100%;
		border: 0;
		margin-left: 1px;
		border-radius: var(--control-radius);
		transition: all var(--control-transition-duration) ease-in-out;
		color: inherit;
		background: transparent;
		cursor: pointer;
		opacity: 0.25;
		padding: 0;
		text-align: center;
	}

	.remove-btn:disabled {
		cursor: not-allowed;
	}

	/* hide remove button on last segment */

	tr:focus-within .remove-btn,
	tr:hover .remove-btn,
	.remove-btn:focus {
		outline: none;
		opacity: 1;
	}


	tr.isPlaceholder .remove-btn,
	tr.isInvalid .remove-btn,
	.remove-btn:hover:not(:disabled),
	.remove-btn:focus:not(:disabled) {
		opacity: 1;
		color: var(--color-fg-error);
		background: var(--color-status-error-bg-muted);
	}
</style>
