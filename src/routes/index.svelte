<script context="module">
	export async function load ({ fetch }){
		const result = await fetch('/api/games?id=-1');
        
        if (result.ok) {
			const body = await result.json();
            const games = body.games;

			return {
				props: { games }
			};
		}

		const { message } = await result.json();

		return {
			error: new Error(message)
		};
	}
</script>
  
<script>
	export let games;

	function removeArticles(game) {
		let words = game.split(" ");
		if(words.length <= 1) 
			return game;
		if(words[0] == 'A' || words[0] == 'THE' || words[0] == 'AN')
			return words.splice(1).join(" ");
		return game;
	}

	games = games.sort(function(a, b) {
		var gameA = a.name.toUpperCase();
		var gameB = b.name.toUpperCase();
		gameA = removeArticles(gameA);
		gameB = removeArticles(gameB);
		return (gameA < gameB) ? -1 : (gameA > gameB) ? 1 : 0;
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="flex">
	{#each games as game}
		<div class="game">
			<!--image or logo-->
			<a class="gameText" rel="prefetch" href="/{game.id}">{game.name}</a>
		</div>
	{/each}
</div>

<style>
	.flex {
		display: flex;
		flex-wrap: wrap;
		width: 60%;
		max-width: 500px;
		margin: 0 auto 1rem auto;
		justify-content: space-evenly;
		gap: 1rem;
		margin-top: 1rem;
	}

	.game {
		background: var(--primary);
		border: black 2px solid;
		padding: 1rem;
		width: 100%;
		text-align: center;
		cursor: pointer;
	}

	.gameText {
		text-decoration: none;
		color: black;
		font-size: 1.5rem;
		text-transform: uppercase;
	}
</style>