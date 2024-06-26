<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { isStepInvalid, isStepPlaceholder } from '../utils';
	export let steps: Step[];
	export let step: Step;
	export let index: number;

	const dispatch = createEventDispatcher();
	$: isOnlyRealStep = steps.length === 2;
	$: isPlaceholder = isStepPlaceholder(step);
	$: isInvalid = !isPlaceholder && isStepInvalid(step);
	$: isLastStep = index === steps.length - 1

	function handleClickDelete() {
		dispatch('removeStep', index);
	}
</script>

<div class="step" class:isInvalid class:isPlaceholder class:isLastStep>
	<label for="dose-{index}">
		<input
			min={1}
			id="dose-{index}"
			step={step.dose > 5 ? 1 : 0.25}
			type="number"
			inputmode="decimal"
			pattern="[1-9]\d*"
			aria-label="dose-{index}"
			bind:value={step.dose}
			on:change={() => dispatch('change', step)}
		/>
	</label>
	{#if (step.dose2 !== undefined)}
		<label for="dose2-{index}">
			<input
				min={1}
				id="dose2-{index}"
				step={step?.dose2 > 5 ? 1 : 0.25}
				type="number"
				inputmode="decimal"
				pattern="[1-9]\d*"
				aria-label="dose2-{index}"
				bind:value={step.dose2}
				on:change={() => dispatch('change', step)}
			/>
		</label>
	{/if}
	<label for="duration-{index}">
		<input
			min={1}
			id="duration-{index}"
			type="number"
			inputmode="decimal"
			pattern="[1-9]\d*"
			aria-label="duration-{index}"
			bind:value={step.duration}
			on:change={() => dispatch('change', step)}
		/>
	</label>
	<button
		{...(isLastStep || isOnlyRealStep) ? { disabled: true } : {}}
		title="Remove this step"
		class="remove-btn"
		on:click={handleClickDelete}>×</button
	>
</div>

<style>

.step {
	display: flex;
	gap: 1px;
}

	label {
		width: 5rem;
	}

	.dose, .duration {
		flex: 1 1 100%;
	}

	input {
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
	}

	.isPlaceholder {
		color: var(--color-text-muted);
		user-select: none;

		& input {
			background: transparent;
		}
	}

	.isInvalid input {
		background: var(--color-status-error-bg);
		color: var(--color-status-error);
	}

	.isInvalid:focus-within input {
		background: var(--color-status-error-background-muted);
	}

	.remove-btn {
		flex: 0 0 1.5rem;
		height: 100%;
		border: 0;
		margin-left: 1px;
		color: var(--color-text-muted);
		border-radius: var(--control-border-radius);
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
		background: var(--color-status-error-background-muted);
	}

	.isLastStep .remove-btn {
		visibility: hidden;
	}

</style>
