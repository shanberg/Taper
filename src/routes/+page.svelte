<!-- src/routes/index.svelte -->
<script>
  import { formatDate } from '../utils';
  import { TEMPLATES } from '../templates.ts';
  import Row from './Row.svelte';
  import ScheduleRow from './ScheduleRow.svelte';
  import AddRowButton from './AddRowButton.svelte';
  import { onMount } from 'svelte';

  const PLACEHOLDER_ROW = { dose: 0, daysForDose: 0 };
  let tableData = [...TEMPLATES.Default, PLACEHOLDER_ROW]
  let template = "Default"

  let startDate = new Date();

    // Helper function to format dates as 'YYYY-MM-DD'
  function yyyymmdd(date) {
    const d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  // Convert the startDate to a string in 'YYYY-MM-DD' format for the input element
  let startDateInputValue;
  onMount(() => {
    startDateInputValue = yyyymmdd(startDate)
  });

  function handleRowChange(index, newData) {
    tableData[index] = newData;

    // Automatically add a new row if the last row is filled
    const isLastRow = index === tableData.length - 1;
    const isRowFilled = newData.dose > 0 || newData.daysForDose > 0;
    if (isLastRow && isRowFilled) {
      tableData = [...tableData, { dose: 0, daysForDose: 0 }];
    }

    // Remove empty rows, except for the last one
    tableData = tableData.filter((row, i) => {
      const isRowEmpty = row.dose === 0 && row.daysForDose === 0;
      const isNotLastRow = i !== tableData.length - 1;
      return !isRowEmpty || !isNotLastRow;
    });

    tableData = tableData; // Trigger reactivity
  }

  function handleStartDateChange(event) {
    startDate = new Date(event.target.value)
    startDate.setHours(24, 0, 0, 0)
    // Optionally, update the startDateInputValue if needed elsewhere
    startDateInputValue = event.target.value;
  }

  function handleCopyTableToClipboard() {
    const newTable = document.createElement('table');
    newTable.innerHTML = tableData
      .map(row => `<tr>
        <td>${row.dose}mg</td>
        <td>${formatDate(rowStartDate)} - ${formatDate(rowEndDate)}</td>
      </tr>`)
      .join('\n');

    // copy newTable to clipboard
    navigator.clipboard.write([
      new ClipboardItem({
        [newTable.outerHTML]: newTable
      })   
    ])
  }

  function handleAddRow(index) {
    tableData = [
      ...tableData.slice(0, index + 1),
      { dose: 0, daysForDose: 0 },
      ...tableData.slice(index + 1)
    ];
  }


  // Calculate the total dosage
  $: totalDose = tableData.reduce((sum, row) => sum + row.dose, 0);

  // Calculate the total number of days
  $: totalDays = tableData.reduce((sum, row) => sum + row.daysForDose, 0) + tableData.length - 2;

  // Format the total number of days in a locale-friendly format
  $: formattedTotalDays = new Intl.NumberFormat().format(totalDays);

  // Calculate the end date
  $: endDate = new Date(startDate.getTime() + totalDays * 24 * 60 * 60 * 1000);

</script>

<main>

    <header>

      <label class="course-begins">
        <span>Course begins</span>
        <input type="date" bind:value={startDateInputValue} on:change={handleStartDateChange} />
      </label>

      <label class="template">
        <span>Template</span>
        <select
        class="custom-select"
          bind:value={template}
          on:change={() => {
            tableData = [...TEMPLATES[template], PLACEHOLDER_ROW];
          }}
        >
          {#each Object.keys(TEMPLATES) as template}
            <option value={template}>{template}</option>
          {/each}
        </select>
      </label>

    </header>

    <div class="body">

      <table class="form">
        <thead>
          <tr>
            <th class="dose">mg</th>
            <th class="days">days</th>
          </tr>
        </thead>
        <tbody>
          {#each tableData as row, index}
            <Row
              {tableData}
              {startDate}
              row={row}
              index={index}
              on:change={(event) => handleRowChange(index, event.detail)}
            />
            {#if index < tableData.length - 1}
              <tr>
                <td class="add-row-button-td" colspan="2">
                  <AddRowButton on:addRow={() => handleAddRow(index)} />
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>

      <div class="plan">

        <h3>Plan</h3>

        <ul>
          {#each tableData as row, index}
            <ScheduleRow
              {tableData}
              {startDate}
              {row}
              {index}
              on:change={(event) => handleRowChange(index, event.detail)}
            />
          {/each}
        </ul>

        <footer class="summary">
          <p>
            {totalDose}mg over {formattedTotalDays} days
          </p>
        </footer>

      </div>

  </div>

</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  header, 
  .body {
    background: var(--color-bg-form);
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: 1rem;
    border-radius: var(--control-radius);
  }

  header {
    justify-content: space-between;
  }

  .body {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    min-width: 38rem;
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;

    & span {
      font-weight: var(--font-weight-heading);
    }

    & input {
      width: 100%;
      border-radius: var(--control-radius);
    }
  }

  .form,
  label:first-child {
    width: 10rem; 
  }

  .form {
    border-collapse: collapse;
    font-feature-settings: "tnum" 1;
    flex: 0 0 auto;

    & th {
      font-weight: var(--font-weight-heading);
    }

    & td,
    & th {
      padding: 0;
      height: calc(var(--font-size-md) * 2);
      box-shadow: none;
      width: 5rem;
      text-align: start;
    }
    & td:last-child input {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    & td:first-child input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .plan {
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--color-border);
    padding-left: 1rem;
  }

  h3 {
    margin: 0;
    user-select: none;
    height: calc(var(--font-size-md) * 2);
    font-weight: var(--font-weight-heading);
    font-size: var(--font-size-md);
    line-height: calc(var(--font-size-md) * 2);
  }

  ul {
    user-select: all;
    flex: 0 0 auto;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 2px;

    & li {
      height: var(--control-height);
      line-height: var(--control-height);
    }
  }

  .summary {
    color: var(--color-fg-muted);
    height: var(--control-height);
    line-height: var(--control-height);
  }

  td.add-row-button-td {
    padding: 0;
    height: 1px !important;
    font: 0 / 0 a;
  }
</style>