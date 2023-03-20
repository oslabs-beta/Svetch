<script context="module" >
	export async function load({ session }) {
		return {
			props: {
				user: session.user,
				state: session.state
			}
		}
	}
</script>

<script>
	import Header from '../lib/Header.svelte';

	export let user;
</script>

<header>
	<Header user={user}/>
</header>

<slot />

<style>
	header {
		display:flex;
		justify-content: space-between;
		grid-column: 1 / 5;
	}
</style>
