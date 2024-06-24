<script lang="ts">
	import { LANGUAGES, TEMPLATES } from '../../consts';
	import { Badge, formControlStyles, formLabelStyles, inputStyles } from '../'
	import { CopyToClipboardButton } from './';
	import { getLanguageFromKey, getFormattedListForCopyPaste, isValidSchedule } from '../../utils';
	import { appStore } from '../../stores';

	const VERIFIED_LANGUAGES: Language[] = LANGUAGES.filter((language) => language.verified);
	const UNVERIFIED_LANGUAGES: Language[] = LANGUAGES.filter((language) => !language.verified);
	
	$: schedule = $appStore.schedule;
	$: isScheduleValid = isValidSchedule(schedule);

	// Date
	$: startDateInputValue = $appStore.startDateInputValue;

	// Template
	$: selectedTemplateKey = schedule.templateKey;

	// Template
	$: selectedDisplayMode = schedule.displayMode;

	// Language
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

	const handleChangeDisplayMode = (e: Event) => {
		const target = e.target as HTMLInputElement;
		appStore.changeDisplayMode(target.value as DisplayMode);
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
		<label class={`${formControlStyles.base} course-begins`}>
			<span class={formLabelStyles.base}>Course begins</span>
			<input
				class={inputStyles}
				type="date"
				value={startDateInputValue}
				on:keydown={handleDateInputKeyDown}
				on:change={handleChangeDate}
			/>
		</label>

		<label class={`${formControlStyles.base} template`}>
			<span class={formLabelStyles.base}>Template</span>
			<select class={inputStyles} value={selectedTemplateKey} on:change={handleChangeTemplateKey}>
				{#each Object.keys(TEMPLATES) as template}
					<option value={template}>{template}</option>
				{/each}
			</select>
		</label>

		<label class={`${formControlStyles.base} language`}>
			<span class={formLabelStyles.base}>
				Language
				{#if !selectedLanguageIsVerified}
					<Badge>Unverified</Badge>
				{/if}
			</span>

			<select
				value={selectedLanguage.lang}
				class={inputStyles}
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
		border-bottom: 1px solid var(--color-separator-border);
		background: inherit;
		z-index: 2;
		padding: 1rem;
		position: sticky;
		top: 0;
	}

	label.course-begins {
		flex: 0 0 11.5rem;
	}

	label.course-begins {
		padding-right: 1rem;
	}

	.hstack {
		align-items: flex-end;
	}

	.template {
		flex: 1 1 auto;
	}

</style>
