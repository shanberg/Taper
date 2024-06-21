<!-- +layout.svelte-->
<script>
	import { inject } from '@vercel/analytics';
	import Message from '../components/Message.svelte';
	import { css } from 'styled-system/css'
  import '../index.css'

	const dev = process.env.NODE_ENV === 'development';
	inject({ mode: dev ? 'development' : 'production' });

	const appClass = css({
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center"
	})
</script>

<svelte:head>
	<title>Taper</title>
</svelte:head>

<div class={appClass}>
	<Message />
	<slot />
</div>
