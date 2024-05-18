<script>
	import { inject } from '@vercel/analytics'
  	import Message from './Message.svelte';
	import './styles.css';

  	const dev = process.env.NODE_ENV === 'development';
  	inject({ mode: dev ? 'development' : 'production' });
</script>

<div class="app">
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
