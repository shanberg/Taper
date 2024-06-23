import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import path from 'path'

export default defineConfig({
	plugins: [svelte(), svelteTesting()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/setupTests.js'],
		coverage: {
			reporter: ['text', 'json', 'html']
		},
		resolve: {
			alias: {
				"@styles": path.resolve(__dirname, "src/styles"),
				"@components": path.resolve(__dirname, "src/components"),
			}
		}
	},
	resolve: {
		alias: {
			"@styles": path.resolve(__dirname, "src/styles"),
			"@components": path.resolve(__dirname, "src/components"),
		}
	}
});
