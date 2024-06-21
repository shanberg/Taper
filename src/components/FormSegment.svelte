<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { isSegmentInvalid, isSegmentPlaceholder } from '../utils';
	export let segments: Segment[];
	export let segment: Segment;
	export let index: number;

	const dispatch = createEventDispatcher();
	$: isOnlyRealSegment = segments.length === 2;
	$: isPlaceholder = isSegmentPlaceholder(segment);
	$: isInvalid = !isPlaceholder && isSegmentInvalid(segment);

	function deleteSegmentAtIndex() {
		dispatch('removeSegment', index);
	}
</script>

<div class="segment" class:isInvalid class:isPlaceholder>
	<div class="dose">
		<label for="dose-{index}">
			<input
				min={1}
				id="dose-{index}"
				step={segment.dose > 5 ? 1 : 0.25}
				type="number"
				inputmode="decimal"
				pattern="[1-9]\d*"
				aria-label="dose-{index}"
				bind:value={segment.dose}
				on:change={() => dispatch('change', segment)}
			/>
		</label>
	</div>
	<div class="days">
		<label for="days-{index}">
			<input
				min={1}
				id="days-{index}"
				type="number"
				inputmode="decimal"
				pattern="[1-9]\d*"
				aria-label="days-{index}"
				bind:value={segment.daysForDose}
				on:change={() => dispatch('change', segment)}
			/>
		</label>
	</div>
	<button
		{...isOnlyRealSegment ? { disabled: true } : {}}
		title="Remove this step"
		class="remove-btn"
		on:click={deleteSegmentAtIndex}>×</button
	>
</div>

<style>

.segment {
	display: flex;
	flex: 0 0 12rem;
	gap: 1px;
}

	label {
		display: contents;
	}

	.dose, .days {
		flex: 1 1 100%;
	}

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

	.segment:focus-within .remove-btn,
	.segment:hover .remove-btn,
	.remove-btn:focus {
		outline: none;
		opacity: 1;
	}

	.segment.isPlaceholder .remove-btn,
	.segment.isInvalid .remove-btn,
	.remove-btn:hover:not(:disabled),
	.remove-btn:focus:not(:disabled) {
		opacity: 1;
		color: var(--color-fg-error);
		background: var(--color-status-error-bg-muted);
	}
</style>
