<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { appStore } from '../stores';
	import { LANGUAGES, TEMPLATES } from '../consts';
	import FormSegment from '../components/FormSegment.svelte';
	import Badge from '../components/Badge.svelte';
	import ScheduleSegment from '../components/ScheduleSegment.svelte';
	import AddSegmentButton from '../components/AddSegmentButton.svelte';
	import { sumDose, sumDays, isSegmentPlaceholder } from '../utils';

	// let templateKey: string = 'Default';
	let selectedLanguageLang: string = LANGUAGES[0].lang;

	const VERIFIED_LANGUAGES: Language[] = LANGUAGES.filter((language) => language.verified);
	const UNVERIFIED_LANGUAGES: Language[] = LANGUAGES.filter((language) => !language.verified);

	// Summary
	$: totalDose = sumDose($appStore.schedule);
	$: totalDays = sumDays($appStore.schedule);
	$: formattedTotalDays = new Intl.NumberFormat().format(totalDays);

	// Language
	$: selectedLanguage =
		LANGUAGES.find((language) => language.lang === selectedLanguageLang) ?? LANGUAGES[0];
		$: selectedLanguageIsVerified = selectedLanguage.verified;

	// Date
	$: startDateInputValue = $appStore.startDateInputValue;

	// Template
	$: selectedTemplateKey = $appStore.schedule.templateKey;

	// Logic
	$: lastSegmentIsPlaceholder = isSegmentPlaceholder($appStore.schedule.segments[$appStore.schedule.segments.length - 1])

	function insertPlaceholderSegmentAtEnd() {
			appStore.insertPlaceholderSegmentBeforeIndex($appStore.schedule.segments.length)
	}

	function handleKeyDown(e: KeyboardEvent) {
		const { ctrlKey, metaKey, shiftKey, key } = e;

		if (key === 'z' && (ctrlKey || metaKey)) {
			e.preventDefault();
			if (shiftKey) {
				console.log("did a redo")
				appStore.redo();
			} else {
				console.log("did a undo")
				appStore.undo();
			}
		} else if (key === 'y' && (ctrlKey || metaKey)) {
			e.preventDefault();
			console.log("did a redo")
			appStore.redo();
		}
	}

	function handleDateInputKeyDown(event: KeyboardEvent) {
		const target = event.target as HTMLInputElement;
		if (target.value === '') {
			return;
		}
	}

	function isAfterPlaceholder(segment: Segment) {
		if (!segment) return false;
        const segments: Segment[] = $appStore.schedule.segments;
        const thisSegmentIndex: number = segments.findIndex(s => s === segment);

        if (thisSegmentIndex === -1) {
            return false;
        }

		const prevSegment =
			$appStore.schedule.segments[$appStore.schedule.segments.indexOf(segment) - 1];
		if (!prevSegment) return false;
		return isSegmentPlaceholder(prevSegment);
	}

	function segmentIsOrAfterPlaceholder(segment: Segment) {
		if (!segment) return false;

		if (isSegmentPlaceholder(segment)) {
            return true
        }
		if (isAfterPlaceholder(segment)) {
            return true;
        }
		return false;
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeyDown);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeyDown);
		}
	});

	const handleStartDateChange = (e: Event) => {
			const target = e.target as HTMLInputElement;
			appStore.changeStartDate(target.value as InputStringDate);
	}

	const handleTemplateKeyChange = (e: Event) => {
			const target = e.target as HTMLInputElement;
			appStore.switchTemplate(target.value);
	}

	$: console.log({...$appStore});

</script>

<main>
	<header class="vstack">
		<div class="hstack">
			<label class="course-begins">
				<span>Course begins</span>
				<input
					type="date"
					value={startDateInputValue}
					on:keydown={handleDateInputKeyDown}
					on:change={handleStartDateChange}
				/>
			</label>

			<label class="template">
				<span>Template</span>
				<select
					class="custom-select"
					value={selectedTemplateKey}
					on:change={handleTemplateKeyChange}
				>
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
				<select
					class="custom-select"
					bind:value={selectedLanguageLang}
					class:warn={!selectedLanguageIsVerified}
				>
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
				{#each $appStore.schedule.segments as segment, index}
					{#if !segmentIsOrAfterPlaceholder(segment)}
						<tr>
							<td class="add-segment-button-td" colspan="2" data-insert-before={index}>
								<AddSegmentButton
									on:addSegment={() => appStore.insertPlaceholderSegmentBeforeIndex(index)}
								/>
							</td>
						</tr>
					{/if}
					<FormSegment
						segments={$appStore.schedule.segments}
						{segment}
						{index}
						on:removeSegment={() => appStore.deleteSegmentAtIndex(index)}
						on:change={(event) => appStore.editSegmentAtIndex(index, event.detail)}
					/>
				{/each}
				{#if (!lastSegmentIsPlaceholder)}
						<tr>
								<td class="add-segment-button-td" colspan="2">
										<AddSegmentButton
												on:addSegment={insertPlaceholderSegmentAtEnd}
										/>
								</td>
						</tr>
				{/if}
			</tbody>
		</table>

		<div class="plan" dir={selectedLanguage.dir}>
			<h3>Plan</h3>
			<ul lang={selectedLanguage.lang}>
				{#each $appStore.schedule.segments as segment, index}
					<ScheduleSegment
						segments={$appStore.schedule.segments}
						startDate={$appStore.schedule.startDate}
						{selectedLanguage}
						{segment}
						{index}
						on:change={(event) => appStore.editSegmentAtIndex(index, event.detail)}
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
	label.course-begins {
		flex: 0 0 11.5rem;
	}

	label.course-begins {
		padding-right: 1.5rem;
	}
	
	.template, .language {
		flex: 1 0 auto;
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

	td.add-segment-button-td {
		padding: 0;
		height: 1px !important;
		font: 0 / 0 a;
	}
</style>
