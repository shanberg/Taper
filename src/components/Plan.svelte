<script lang="ts">
	import { appStore } from '../stores';
	import ScheduleSegment from './ScheduleSegment.svelte';
	import { sumDose, sumDays, getLanguageFromKey } from '../utils';

	// Language
	$: selectedLanguageKey = $appStore.schedule.languageKey;
	$: selectedLanguage = getLanguageFromKey(selectedLanguageKey);

	// Summary
	$: totalDose = sumDose($appStore.schedule);
	$: totalDays = sumDays($appStore.schedule);
	$: formattedTotalDays = new Intl.NumberFormat().format(totalDays);
</script>

<!-- <div class="plan" dir={selectedLanguage.dir}>
	<h3>Plan</h3>
	<ul lang={selectedLanguage.lang}> -->
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
	<!-- </ul>

	<footer class="summary">
		<p>
			{totalDose}mg over {formattedTotalDays} days
		</p>
	</footer>
</div> -->

<style>
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
</style>
