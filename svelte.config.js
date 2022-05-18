import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			optimizeDeps: {
				include: ["highlight.js", "highlight.js/lib/core"],
			},
			server: {
				fs: {
				// Allow serving files from one level up to the project root
					allow: ['..'],
				},
			},
		}
	}
};

export default config;
