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
	$: isLastSegment = index === segments.length - 1

	function handleClickDelete() {
		dispatch('removeSegment', index);
	}
</script>

<div class="segment" class:isInvalid class:isPlaceholder class:isLastSegment>
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
		{...(isLastSegment || isOnlyRealSegment) ? { disabled: true } : {}}
		title="Remove this step"
		class="remove-btn"
		on:click={handleClickDelete}>×</button
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
		flex: 0 0 1.5rem;
		height: 100%;
		border: 0;
		margin-left: 1px;
		color: var(--color-fg-muted);
		border-radius: var(--control-radius);
		transition: all var(--control-transition-duration) ease-in-out;
		background: transparent;
		cursor: pointer;
		opacity: 0.25;
		padding: 0;
		text-align: center;
	}

	.remove-btn:disabled {
		cursor: not-allowed;
	}

	.remove-btn:not(:disabled):where(:hover, :active) {
		opacity: 1;
		background: var(--color-status-error-bg-muted);
	}

	.isLastSegment .remove-btn {
		visibility: hidden;
	}

</style>
