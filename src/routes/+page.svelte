<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { appStore } from '../stores';
	import FormHeader from '../components/FormHeader.svelte';
	import ScheduleRow from '../components/ScheduleRow.svelte';
	import { getLanguageFromKey } from '../utils';
	import { Box, Divider } from '../components';
	import VStack from '../components/layout/VStack.svelte';

	function handleKeyDown(e: KeyboardEvent) {
		const { ctrlKey, metaKey, shiftKey, key } = e;

		if (key === 'z' && (ctrlKey || metaKey)) {
			e.preventDefault();
			if (shiftKey) {
				appStore.redo();
			} else {
				appStore.undo();
			}
		} else if (key === 'y' && (ctrlKey || metaKey)) {
			e.preventDefault();
			appStore.redo();
		}
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

	$: selectedLanguage = getLanguageFromKey($appStore.schedule.languageKey);
	$: segments = $appStore.schedule.segments;
	$: startDate = $appStore.schedule.startDate;

</script>

<Box
	background="bgForm"
	borderRadius="page"
	boxShadow="page"
>
	<FormHeader />

	<Divider />

	<VStack
		padding="1rem"
		gap="1px"
		alignItems="stretch"
	>
		{#each $appStore.schedule.segments as segment, index}
			<ScheduleRow {segment} {index} {segments} {startDate} {selectedLanguage} />
		{/each}
	</VStack>
</Box>
