<script>
	import { inject } from '@vercel/analytics'
	import './styles.css';
</script>

<div class="app">
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
