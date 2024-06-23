import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path'

const config: UserConfig = {
	plugins: [sveltekit()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.js'
	},
	resolve: {
		alias: {
			"@styles": path.resolve(__dirname, "src/styles"),
			"@components": path.resolve(__dirname, "src/components"),
		}
	}
};

export default config;
