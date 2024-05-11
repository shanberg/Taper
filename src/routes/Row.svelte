<script>
  import { createEventDispatcher } from 'svelte';
  import { formatDate } from '../utils';
  export let tableData;
  export let startDate;
  export let row;
  export let index;

  const dispatch = createEventDispatcher();

  let rowStartDate
  let rowEndDate
  let rowIsPlaceholder = false

  $: rowIsPlaceholder = row.dose === 0 && row.daysForDose === 0
  $: invalid = !rowIsPlaceholder && (row.dose <= 0 || row.daysForDose <= 0);

  // Calculate the start and end dates
  $: {
    rowStartDate = new Date(startDate.getTime());
    const totalDaysForStartDate = tableData.slice(0, index).reduce((acc, curr) => acc + curr.daysForDose, 0);
    rowStartDate.setDate(rowStartDate.getDate() + totalDaysForStartDate);

    rowEndDate = new Date(rowStartDate.getTime());
    rowEndDate.setDate(rowEndDate.getDate() + row.daysForDose);
  }

  function handleDoseChange(event) {
    dispatch('change', { ...row, dose: parseFloat(event.target.value) });
  }

  function handleDaysForDoseChange(event) {
    dispatch('change', { ...row, daysForDose: parseInt(event.target.value) });
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

</style>