<script>
	import { inject } from '@vercel/analytics';
	import Message from '../components/Message.svelte';
	import AboutAppButton from '../components/AboutAppButton.svelte';
	import './styles.css';

	const dev = process.env.NODE_ENV === 'development';
	inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<title>Taper</title>
</svelte:head>

<div class="app">
	<AboutAppButton />
	<Message />
	<slot />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
