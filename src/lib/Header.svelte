<script>
	export let user;
</script>

<div id='header'>
	<div style="flex:1;">
		<button>
		New Project
		</button>	
       <a href='/login?exportProject=true'><button>
				Import
		</button></a>
        <button>
            Export
        </button>
	</div>
	<div style="flex:1;">
		<h1 style="text-align:center">Svetch</h1>
	</div>
	<div style="display: flex; justify-content: flex-end; gap: 0.5rem; flex: 1;">
	{#if user}
		<a href="/logout">
			<button>Sign out</button>
		</a>
	{:else}
		<a href="/login">
			<button>Sign In with GitHub</button>
		</a>
	{/if}
	</div>
</div>

<style>
	#header {
		display:flex;
		align-items:center;
	}
</style>