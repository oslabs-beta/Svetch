<script>
	import { onMount } from 'svelte';

	export let text;
	export let styles = '';
	export let fixedPos = null;
	let label;

	onMount(()=> {
		if (fixedPos && fixedPos.parentSelector) {
			document
				.querySelector(fixedPos.parentSelector)
				.addEventListener('scroll', (e) => {
					label.style.top = `${e.target.scrollTop}px`;
				});
		}
	});
</script>

<p class ='label' bind:this={label} style={styles}>{text}</p>

<style>
	.label {
		position: absolute;
		top: 0px;
		right: 5px;
		z-index: 1;
		padding: 0.5rem;
		color: #d7dce0;
		font-size: 0.9rem;
	}
</style>
