<script lang="ts">
	import { isRowPlaceholder, yyyymmdd, createInitialState,
    sumDose,
    sumDays,
    calculateEndDate, } from '../utils';
	import { TEMPLATES, LANGUAGES, PLACEHOLDER_ROW } from '../consts';
	import FormRow from '../components/FormRow.svelte';
	import Badge from '../components/Badge.svelte';
	import ScheduleRow from '../components/ScheduleRow.svelte';
	import AddRowButton from '../components/AddRowButton.svelte';
	import { onMount, onDestroy } from 'svelte';

	let data: UIStateData = createInitialState();
	let template = 'Default';
	let selectedLanguageLang = LANGUAGES[0].lang;
	let undoStack: UIStateData[] = [];
	let redoStack: UIStateData[] = [];
	let startDateInputValue = '';

	function saveStateForUndo() {
		undoStack = [...undoStack, JSON.parse(JSON.stringify(data))];
		redoStack = [];
	}

	function handleRowChange(index: number, newData: Row) {
		saveStateForUndo();
		data.tableData[index] = newData;

		// Automatically add a new row if the last row is filled
		const isLastRow = index === data.tableData.length - 1;
		const isRowFilled = newData.dose > 0 || newData.daysForDose > 0;
		if (isLastRow && isRowFilled) {
			data.tableData = [...data.tableData, { dose: 0, daysForDose: 0 }];
		}

		// Remove empty rows, except for the last one
		const lastRowIndex = data.tableData.length - 1;
		data.tableData = data.tableData.filter((row, i) => {
			const isRowEmpty = row.dose === 0 && row.daysForDose === 0;
			return !(isRowEmpty && i !== lastRowIndex);
		});

		data.tableData = [...data.tableData];
	}

	function handleStartDateChange(event: Event) {
		saveStateForUndo();
		const target = event.target as HTMLInputElement;
		const newDate = new Date(target.value);

		if (target.value === '') {
			// Assume we're skipping forward
			const increment = 1;
			const incrementedDate = new Date(data.startDate.getTime() + increment * 24 * 60 * 60 * 1000);
			data.startDate = incrementedDate;
			startDateInputValue = yyyymmdd(incrementedDate);
		} else if (!isNaN(newDate.getTime())) {
			newDate.setHours(24, 0, 0, 0);
			data.startDate = newDate;
			startDateInputValue = target.value;
		} else {
			console.error('Invalid date input');
		}
	}

	function handleDateInputKeyDown(event: KeyboardEvent) {
		const target = event.target as HTMLInputElement;
		if (target.value === '') {
			return;
		}
	}

	function handleAddRow(index: number) {
		saveStateForUndo();
		removeEmptyRows();

		data.tableData = [
			...data.tableData.slice(0, index + 1),
			{ dose: 0, daysForDose: 0 },
			...data.tableData.slice(index + 1)
		];
	}

	function handleTemplateChange() {
		saveStateForUndo();
		data = {
			tableData: [...TEMPLATES[template], PLACEHOLDER_ROW],
			startDate: new Date()
		};
		startDateInputValue = yyyymmdd(data.startDate);
	}

	function removeEmptyRows() {
		const lastRowIndex = data.tableData.length - 1;
		data.tableData = data.tableData.filter((row, i) => {
			const isRowEmpty = row.dose === 0 && row.daysForDose === 0;
			return !(isRowEmpty && i !== lastRowIndex);
		});
	}

	function handleRemoveRow(index: number) {
		saveStateForUndo();
		data.tableData = [...data.tableData.slice(0, index), ...data.tableData.slice(index + 1)];
	}

	function undo() {
		if (undoStack.length > 0) {
			redoStack = [...redoStack, JSON.parse(JSON.stringify(data))];
			data = undoStack.pop() || data;
			data.startDate = new Date(data.startDate);
			startDateInputValue = yyyymmdd(data.startDate);
		}
	}

	function redo() {
		if (redoStack.length > 0) {
			undoStack = [...undoStack, JSON.parse(JSON.stringify(data))];
			data = redoStack.pop() || data;
			data.startDate = new Date(data.startDate); // Ensure startDate is a Date object
			startDateInputValue = yyyymmdd(data.startDate);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		const { ctrlKey, metaKey, shiftKey, key } = e;

		if (key === 'z') {
			if (ctrlKey || metaKey) {
				if (shiftKey) {
					e.preventDefault();
					redo();
				} else {
					e.preventDefault();
					undo();
				}
			}
		} else if (key === 'y') {
			if (ctrlKey || metaKey) {
				e.preventDefault();
				redo();
			}
		}
	}

	onMount(() => {
		startDateInputValue = yyyymmdd(data.startDate);
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeyDown);
		}
	});

	onDestroy(() => {
		undoStack = [];
		redoStack = [];
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeyDown);
		}
	});

	const VERIFIED_LANGUAGES = LANGUAGES.filter(language => language.verified);
	const UNVERIFIED_LANGUAGES = LANGUAGES.filter(language => !language.verified);

	// Calculate the total dosage
	$: totalDose = sumDose(data);

	// Calculate the total number of days
	$: totalDays = sumDays(data);
		
	// Format the total number of days in a locale-friendly format
	$: formattedTotalDays = new Intl.NumberFormat().format(totalDays);

	// Calculate the end date
	$: endDate = calculateEndDate(data);

	$: isFirstRowAPlaceholder = isRowPlaceholder(data.tableData[0]);

	$: selectedLanguage = LANGUAGES.find(language => language.lang === selectedLanguageLang) ?? LANGUAGES[0];
	$: selectedLanguageIsVerified = selectedLanguage.verified;
</script>

<main>
	<header class="vstack">
	<div class="hstack">
		<label class="course-begins">
			<span>Course begins</span>
			<input
				type="date"
				bind:value={startDateInputValue}
				on:keydown={handleDateInputKeyDown}
				on:change={handleStartDateChange}
			/>
		</label>

		<label class="template">
			<span>Template</span>
			<select class="custom-select" bind:value={template} on:change={handleTemplateChange}>
				{#each Object.keys(TEMPLATES) as template}
					<option value={template}>{template}</option>
				{/each}
			</select>
		</label>

		<label class="language">
			<span>
			Language 
			{#if !selectedLanguageIsVerified}
				<Badge>Unverified</Badge>
			{/if}
			</span>
			<select class="custom-select" bind:value={selectedLanguageLang} class:warn={!selectedLanguageIsVerified}>
				{#each VERIFIED_LANGUAGES as language}
					<option value={language.lang}>{language.labelEn}</option>
				{/each}
				{#if UNVERIFIED_LANGUAGES.length > 0}
					<hr />
          			<option disabled value="unverified">Unverified Languages</option>
					{#each UNVERIFIED_LANGUAGES as language}
						<option value={language.lang}>{language.labelEn}</option>
					{/each}
				{/if}
			</select>
		</label>
		</div>
	</header>

	<div class="body">
		<table class="form">
			<thead>
				<tr>
					<th class="dose">mg</th>
					<th class="days">days</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#if !isFirstRowAPlaceholder}
					<tr>
						<td class="add-row-button-td" colspan="2">
							<AddRowButton on:addRow={() => handleAddRow(-1)} />
						</td>
					</tr>
				{/if}
				{#each data.tableData as row, index}
					<FormRow
						tableData={data.tableData}
						{row}
						{index}
						on:removeRow={() => handleRemoveRow(index)}
						on:change={(event) => handleRowChange(index, event.detail)}
					/>
					{#if index < data.tableData.length - 2}
						<tr>
							<td class="add-row-button-td" colspan="2">
								<AddRowButton on:addRow={() => handleAddRow(index)} />
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>

		<div class="plan" dir={selectedLanguage.dir}>
			<h3>Plan</h3>
			<ul lang={selectedLanguage.lang}>
				{#each data.tableData as row, index}
					<ScheduleRow
						tableData={data.tableData}
						startDate={data.startDate}
						{selectedLanguage}
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
		border-radius: calc(2 * var(--control-radius));
		overflow: clip;
		background: var(--color-bg-form);
		box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.025);
		width: 720px;
	}

	.body {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		padding: 1rem;
	}

	header {
		border-bottom: 1px solid var(--color-border);
		padding: 1rem;
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
		width: 12rem;
	}
	label:first-child {
		padding-right: 1.5rem;
	}

	.form {
		border-collapse: collapse;
		font-feature-settings: 'tnum' 1;
		flex: 0 0 auto;

		& th {
			font-weight: var(--font-weight-heading);
		}

		& td,
		& th {
			padding: 0;
			height: calc(var(--font-size-md) * 2);
			box-shadow: none;
			text-align: start;
		}

		& td.dose {
			width: 5rem;

			& input {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}
		}

		& td.days {
			width: 5rem;

			& input {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}
		}

		& td.delete {
			width: 1em;
		}
	}

	.plan {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
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
		display: flex;
		align-items: center;
	}

	td.add-row-button-td {
		padding: 0;
		height: 1px !important;
		font: 0 / 0 a;
	}
</style>
