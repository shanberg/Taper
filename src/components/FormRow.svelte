<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { isRowInvalid, isRowPlaceholder } from '../utils';
	export let tableData;
	export let row: Row;
	export let index: number;

	let rowStartDate: Date;
	let rowEndDate: Date;
	let rowIsPlaceholder: boolean = false;
	let rowIsOnlyRealRow: boolean;
	let invalid: boolean;

	const dispatch = createEventDispatcher();

	$: rowIsOnlyRealRow = tableData.length === 2;
	$: rowIsPlaceholder = isRowPlaceholder(row);
	$: isInvalid = !rowIsPlaceholder && isRowInvalid(row);

	function handleDoseChange(event: Event) {
		const target = event.target as HTMLInputElement;
		dispatch('change', { ...row, dose: parseFloat(target.value) });
	}

	function handleDaysForDoseChange(event: Event) {
		const target = event.target as HTMLInputElement;
		dispatch('change', { ...row, daysForDose: parseInt(target.value) });
	}

	function handleRemoveRow() {
		dispatch('removeRow', index);
	}
</script>

<tr class="row {rowIsPlaceholder ? 'placeholder' : ''} {isInvalid ? 'isInvalid' : ''}">
	<td class="dose">
		<input
			min={1}
			step={row.dose > 5 ? 1 : 0.25}
			type="number"
			inputmode="decimal"
			bind:value={row.dose}
			on:change={handleDoseChange}
		/>
	</td>
	<td class="days">
		<input
			min={1}
			type="number"
			inputmode="decimal"
			bind:value={row.daysForDose}
			on:change={handleDaysForDoseChange}
		/>
	</td>
	<td class="delete">
		<button
			disabled={rowIsOnlyRealRow}
			title="Remove this step"
			class="remove-btn"
			on:click={handleRemoveRow}>×</button
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

	.placeholder {
		color: var(--color-fg-muted);
		user-select: none;

		& input {
			background: transparent;
		}
	}

	.isInvalid td input {
		background: var(--color-bg-error);
	}

	.isInvalid:focus-within td input {
		background: var(--color-bg-error-muted);
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
		opacity: 0;
		padding: 0;
		text-align: center;
	}

	.remove-btn:disabled {
		cursor: not-allowed;
	}

	/* hide remove button on last row */

	tr:focus-within .remove-btn,
	tr:hover .remove-btn,
	.remove-btn:focus {
		outline: none;
		opacity: 1;
	}

	.remove-btn:hover:not(:disabled),
	.remove-btn:focus:not(:disabled) {
		color: var(--color-fg-error);
		background: var(--color-bg-error-muted);
	}
</style>
