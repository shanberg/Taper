<script lang="ts">
	import { LANGUAGES, TEMPLATES } from '../consts';
	import Badge from './Badge.svelte';
	import CopyToClipboardButton from './CopyToClipboardButton.svelte';
	import { getLanguageFromKey, getFormattedListForCopyPaste, isValidSchedule } from '../utils';
	import forms from './forms.module.css'
	import { appStore } from '../stores';

	const VERIFIED_LANGUAGES: Language[] = LANGUAGES.filter((language) => language.verified);
	const UNVERIFIED_LANGUAGES: Language[] = LANGUAGES.filter((language) => !language.verified);
	
	$: schedule = $appStore.schedule;
	$: isScheduleValid = isValidSchedule(schedule);

	// Date
	$: startDateInputValue = $appStore.startDateInputValue;

	// Template
	$: selectedTemplateKey = schedule.templateKey;

	// Language
	// $: selectedLanguageKey = $appStore.schedule.languageKey;
	$: selectedLanguageKey = schedule.languageKey;
	$: selectedLanguage = getLanguageFromKey(selectedLanguageKey);
	$: selectedLanguageIsVerified = selectedLanguage.verified;
	$: copyableText = getFormattedListForCopyPaste(schedule);


	// event handlers
	const handleChangeDate = (e: Event) => {
		const target = e.target as HTMLInputElement;
		appStore.changeStartDate(target.value as InputStringDate);
	};

	const handleChangeTemplateKey = (e: Event) => {
		const target = e.target as HTMLInputElement;
		appStore.switchTemplate(target.value);
	};

	const handleDateInputKeyDown = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;
		if (target.value === '') {
			return;
		}
	};

	const handleChangeLanguage = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		appStore.changeLanguageKey(target.value);
	};
</script>

<header class="vstack">
	<div class="hstack">
		<label class="course-begins">
			<span>Course begins</span>
			<input
				type="date"
				value={startDateInputValue}
				on:keydown={handleDateInputKeyDown}
				on:change={handleChangeDate}
			/>
		</label>

		<label class="template">
			<span>Template</span>
			<select class={forms.input} value={selectedTemplateKey} on:change={handleChangeTemplateKey}>
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
				value={selectedLanguage.lang}
				class:warn={!selectedLanguageIsVerified}
				on:change={handleChangeLanguage}
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

		<CopyToClipboardButton 
			disabled={!isScheduleValid}
		textToCopy={copyableText} />
	</div>
</header>

<style>
	header {
		border-bottom: 1px solid var(--color-border);
		padding: 1rem;
	}

	label.course-begins {
		flex: 0 0 11.5rem;
	}

	label.course-begins {
		padding-right: 1.5rem;
	}

	.hstack {
		align-items: flex-end;
	}

	.template,
	.language {
		flex: 1 0 auto;
	}
</style>
