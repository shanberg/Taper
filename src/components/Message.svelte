<script lang="ts">
	import { onMount } from 'svelte';
	import { Box, Badge } from './'

	type Message =  {endDate?: string, startDate?: string, type?: string, content: string}

	let currentMessage: Message | null = null;

	const messages: Message[] = [
		{
			endDate: '2024-06-07',
			type: "new",
			content: 'Undo and redo with <kbd>ctrl z</kbd>, <kbd>ctrl y</kbd>, etc.'
		},
		{
			endDate: '2024-06-18',
			type: "new",
			content: 'Get a schedule in Spanish, Mandarin, or Haitian Creole.'
		},
		{
			endDate: '2024-06-27',
			type: "new",
			content: 'Swahili and Arabic (both unverified!) now available.'
		},
		{
			content: "I hope you're having good day"
		}
	];

	function getCurrentMessage() {
		const now = new Date();
		const datelessMessages = [];

		for (const message of messages) {
			const { startDate, endDate } = message;

			const start = startDate ? new Date(startDate) : null;
			const end = endDate ? new Date(endDate) : null;

			if ((!start || now >= start) && (!end || now <= end)) {
				return message;
			}

			if (!start && !end) {
				datelessMessages.push(message);
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

	$: conditionalStyles = (currentMessage) ? {
		opacity: 1,
		transform: "translateY(0) scale(1)" 
	} : {};

	const baseStyles = {
	padding: "1rem 0",
	color: "fgMuted",
	minHeight: "2em",
	transition: "all 3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
	transitionDelay: "1s",
	position: "relative",
	display: "flex",
	alignItems: "baseline",
	gap: "0.5em",
	opacity: "0",
	marginBottom: "1rem",
	transform: "translateY(0) scale(0.96)",
	_before: {
		content: "''",
		background: "fgMuted",
		position: "absolute",
		opacity: 0.1,
		inset: "0.5rem -1rem",
		borderRadius: "100rem",
		zindex: -1,
		pointerEvents: "none"
	},
}
	
</script>

<Box 
	{...baseStyles}
	{...conditionalStyles}
	class="message"
>
{#if (currentMessage?.type) === "new"}
	<Badge marginTop="-1em">New</Badge>
{/if}
	{@html currentMessage?.content}
</Box>

