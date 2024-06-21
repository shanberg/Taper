<script lang="ts">
	import { appStore } from '../stores';
	import FormSegment from './FormSegment.svelte';
	import AddSegmentButton from './AddSegmentButton.svelte';
	import { getLanguageFromKey, segmentIsOrAfterPlaceholder } from '../utils';
	import ScheduleSegment from './ScheduleSegment.svelte';

	$: selectedLanguage = getLanguageFromKey($appStore.schedule.languageKey);
</script>

	{#each $appStore.schedule.segments as segment, index}
		<div class="row">
			{#if !segmentIsOrAfterPlaceholder(segment, $appStore.schedule.segments)}
					<div class="add-segment-button-td" data-insert-before={index}>
						<AddSegmentButton
							on:addSegment={() => appStore.insertPlaceholderSegmentBeforeIndex(index)}
						/>
					</div>
			{/if}
			<FormSegment
				segments={$appStore.schedule.segments}
				{segment}
				{index}
				on:removeSegment={() => appStore.deleteSegmentAtIndex(index)}
				on:change={(event) => appStore.editSegmentAtIndex(index, event.detail)}
			/>
			<ScheduleSegment
					{segment}
					segments={$appStore.schedule.segments}
					startDate={$appStore.schedule.startDate}
					{index}
					{selectedLanguage}
			/>
		</div>
	{/each}

<style>

	.row {
		display: flex;
	}
</style>
