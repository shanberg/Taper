<script>
  import { createEventDispatcher } from 'svelte';
  import { formatDate, isRowValid } from '../utils';
  export let tableData;
  export let startDate;
  export let row;
  export let index;

  let rowStartDate
  let rowEndDate

  $: isRowPlaceholder = row.dose === 0 && row.daysForDose === 0
  $: isInvalid = !isRowPlaceholder && isRowValid(row);
  $: isLastPlaceholderRow = index === tableData.length - 1 && isRowPlaceholder

  // Calculate the start and end dates
  $: {
    rowStartDate = new Date(startDate.getTime());
    const totalDaysForStartDate = tableData
      .slice(0, index)
      .reduce((acc, curr) => acc + curr.daysForDose - 1, 0) + index;
    rowStartDate.setDate(rowStartDate.getDate() + totalDaysForStartDate);

    rowEndDate = new Date(rowStartDate.getTime());
    rowEndDate.setDate(rowEndDate.getDate() + row.daysForDose - 1);
  }
</script>

{#if !isLastPlaceholderRow}
  <li
    class:isInvalid
    class:isRowPlaceholder
  >
    {index === 0 ? "Take" : `Then take`} <b>{row.dose}mg</b> daily for <b>{row.daysForDose} {row.daysForDose === 1 ? 'day' : 'days'}</b> ({formatDate(rowStartDate)}–{formatDate(rowEndDate)})
  </li>
{/if}

<style>
  li {
  }
  .isInvalid {
    color: var(--color-fg-error);
  }
  .isRowPlaceholder {
    color: var(--color-fg-muted);
  }
  .isInvalid, .isRowPlaceholder {
    text-decoration: underline;
    text-decoration-style: wavy;
    text-decoration-skip-ink: none;
  }

  b {
    font-weight: unset;
  }
</style>