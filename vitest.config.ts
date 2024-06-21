import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import path from 'path';

export default defineConfig({
	plugins: [svelte(), svelteTesting()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/setupTests.js'],
		coverage: {
			reporter: ['text', 'json', 'html']
		},
		alias: {
			'styled-system': path.resolve(__dirname, 'styled-system'),
			'styled-system/patterns': path.resolve(__dirname, 'styled-system/patterns'),
		},
	},
});
