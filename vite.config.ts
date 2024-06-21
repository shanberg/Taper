import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.js'
	},
	server: {
		fs: {
			allow: ['styled-system'],
		},
	},
	resolve: {
		alias: {
			'styled-system': '/styled-system', // Ensure this path is correct
		},
	},
};

export default config;
