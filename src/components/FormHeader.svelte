<script lang="ts">
	import { LANGUAGES, TEMPLATES } from '../consts';
	import { getLanguageFromKey } from '../utils';
	import { appStore } from '../stores';
	import { HStack, VStack, Badge, DateInput, Select, FormControl, FormLabel } from './';

	const VERIFIED_LANGUAGES: Language[] = LANGUAGES.filter((language) => language.verified);
	const UNVERIFIED_LANGUAGES: Language[] = LANGUAGES.filter((language) => !language.verified);

	// Date
	$: startDateInputValue = $appStore.startDateInputValue;

	// Template
	$: selectedTemplateKey = $appStore.schedule.templateKey;

	// Language
	$: selectedLanguageKey = $appStore.schedule.languageKey;
	$: selectedLanguage = getLanguageFromKey(selectedLanguageKey);
	$: selectedLanguageIsVerified = selectedLanguage.verified;

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

	const languageOptions: SelectOption[] = [
		...VERIFIED_LANGUAGES.map(l => ({value: l.lang, label: l.labelEn})),
		{divider: true},
		{label: "Unverified languages", value: "Unverified languages", disabled: true}
		, ...UNVERIFIED_LANGUAGES.map(l => ({value: l.lang, label: l.labelEn}))];

</script>

<VStack alignItems="stretch">
	<HStack padding="1rem">
		<FormControl paddingRight="1.5rem" class="course-begins" id="course-begins">
			<FormLabel slot="label">Course begins</FormLabel>
			<DateInput
				id="course-begins"
				value={startDateInputValue}
				on:keydown={handleDateInputKeyDown}
				on:change={handleChangeDate}
			/>
		</FormControl>

		<FormControl flex="1 1 100%" class="template" id="template">
			<FormLabel slot="label">Template</FormLabel>
			<Select
				id="template"
				value={selectedTemplateKey} 
				on:change={handleChangeTemplateKey}
				options={Object.keys(TEMPLATES).map(key => ({label: key, value: key}))}
			/>
		</FormControl>

		<FormControl flex="1 1 100%" class="language" id="language">
			<FormLabel slot="label">
				Language
				{#if !selectedLanguageIsVerified}
					<Badge>Unverified</Badge>
				{/if}
			</FormLabel>
			<Select
				id="language"
				isWarning={!selectedLanguageIsVerified}
				value={selectedLanguage.lang}
				on:change={handleChangeLanguage}
				options={languageOptions}
			/>
		</FormControl>
	</HStack>
</VStack>
