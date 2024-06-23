<script lang="ts">
	import { onMount } from 'svelte';
	let currentMessage: string | null = null;

	const formatNew = (feature: string): string => `<b class="badge new">NEW</b>${feature}`;

	const messages = [
		{
			endDate: '2024-06-07',
			content: formatNew('Undo and redo with <kbd>ctrl z</kbd>, <kbd>ctrl y</kbd>, etc.')
		},
		{
			endDate: '2024-06-18',
			content: formatNew('Get a schedule in Spanish, Mandarin, or Haitian Creole.')
		},
		{
			endDate: '2024-06-27',
			content: formatNew('Swahili and Arabic (both unverified!) now available.')
		},
		{
			content: "I hope you're having good day"
		}
	] as Message[];

	function getCurrentMessage() {
		const now = new Date();
		const datelessMessages = [];

		for (const message of messages) {
			const { startDate, endDate, content } = message;

			const start = startDate ? new Date(startDate) : null;
			const end = endDate ? new Date(endDate) : null;

			if ((!start || now >= start) && (!end || now <= end)) {
				return content;
			}

			if (!start && !end) {
				datelessMessages.push(content);
			}
		}

		if (datelessMessages.length > 0) {
			const randomIndex = Math.floor(Math.random() * datelessMessages.length);
			return datelessMessages[randomIndex];
		}

		return null;
	}

	onMount(() => {
		currentMessage = getCurrentMessage();
	});

	setInterval(
		() => {
			currentMessage = getCurrentMessage();
		},
		1000 * 60 * 60
	);
</script>

<p class={currentMessage ? 'message loaded' : 'message'}>{@html currentMessage}</p>

<style>
	.message {
		padding: 1rem 0;
		color: var(--color-text-muted);
		min-height: 2em;
		transition: all 3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		transition-delay: 1s;
		position: relative;
		opacity: 0;
		transform: translateY(0) scale(0.985);

		& .badge {
			font-size: 0.8em;
			margin-right: 1rem;
			padding: 0.5rem 0;
			opacity: 0.75;
		}
	}

	.message.loaded {
		opacity: 1;
		transform: translateY(0) scale(1);
	}

	.message:before {
		content: '';
		border: 1px solid var(--color-text-muted);
		position: absolute;
		opacity: 0.1;
		inset: 0.5rem -1rem;
		border-radius: 100rem;
		z-index: -1;
		pointer-events: none;
	}
</style>
