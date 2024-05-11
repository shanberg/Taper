<script>
  import { createEventDispatcher } from 'svelte';
  import { formatDate } from '../utils';
  export let tableData;
  export let startDate;
  export let row;
  export let index;

  let rowStartDate
  let rowEndDate

  $: rowIsPlaceholder = row.dose === 0 && row.daysForDose === 0
  $: invalid = !rowIsPlaceholder && (row.dose <= 0 || row.daysForDose <= 0);

  // Calculate the start and end dates
  $: {
    rowStartDate = new Date(startDate.getTime());
    const totalDaysForStartDate = tableData.slice(0, index).reduce((acc, curr) => acc + curr.daysForDose, 0) + index;
    rowStartDate.setDate(rowStartDate.getDate() + totalDaysForStartDate);

    rowEndDate = new Date(rowStartDate.getTime());
    rowEndDate.setDate(rowEndDate.getDate() + row.daysForDose);
  }
</script>

{#if !rowIsPlaceholder && !invalid}
  <li>{index === 0 ? "Take" : `Then take`} <b>{row.dose}mg</b> daily for <b>{row.daysForDose} {row.daysForDose === 1 ? 'day' : 'days'}</b> ({formatDate(rowStartDate)}–{formatDate(rowEndDate)})</li>
{/if}

<style>
  li { 
  }
  b {
    font-weight: unset;
  }
</style>