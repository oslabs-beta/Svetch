<script>
	import Header from '../lib/Header.svelte';

	export let data
</script>

<header>
	<Header user={data.user}/>
</header>

<slot />

<style>
	header {
		display:flex;
		justify-content: space-between;
		grid-column: 1 / 5;
	}
</style>
