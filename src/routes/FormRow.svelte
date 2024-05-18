<script>
  import { createEventDispatcher } from 'svelte';
  import { formatDate, isRowValid, isRowPlaceholder } from '../utils';
  export let tableData;
  export let row;
  export let index;

  const dispatch = createEventDispatcher();

  let rowStartDate
  let rowEndDate
  let rowIsPlaceholder = false

  $: rowIsOnlyRealRow = tableData.length === 2
  $: rowIsPlaceholder = isRowPlaceholder(row)
  $: invalid = !rowIsPlaceholder && isRowValid(row);

  function handleDoseChange(event) {
    dispatch('change', { ...row, dose: parseFloat(event.target.value) });
  }

  function handleDaysForDoseChange(event) {
    dispatch('change', { ...row, daysForDose: parseInt(event.target.value) });
  }

  function handleRemoveRow() {
    dispatch('removeRow', index);
  }
  
</script>

<tr class="row {rowIsPlaceholder ? 'placeholder' : ''} {invalid ? 'invalid' : ''}">
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
    <button disabled={rowIsOnlyRealRow ? "disabled" : undefined} title="Remove this step" class="remove-btn" on:click={handleRemoveRow}>×</button>
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

  .invalid td input {
    background: var(--color-bg-error);
  }

  .invalid:focus-within td input {
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
  tr:hover .remove-btn, .remove-btn:focus {
    outline: none;
    opacity: 1;
  }

  .remove-btn:hover:not(:disabled), .remove-btn:focus:not(:disabled) {
    color: var(--color-fg-error);
    background: var(--color-bg-error-muted);
  }

</style>