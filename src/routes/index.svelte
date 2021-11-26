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
	import Tabs from '../components/tabs.svelte';
	import PlayerCreator from '../components/playerCreator.svelte';

	export let games;
	
	let tabs = [
		{name:"Add Player", component: PlayerCreator, props: {}},
		{name:"Filters"},
		{name:"About"}
	];
	let activeTab = "Add Player";

	function removeArticles(game) {
		let words = game.split(" ");
		if(words.length <= 1) 
			return game;
		if(words[0] == 'A' || words[0] == 'THE' || words[0] == 'AN')
			return words.splice(1).join(" ");
		return game;
	}

	for (const game of games) {
		console.log(game.gameTypes.gameTypes);
		game.features = game.gameTypes.gameTypes.concat(game.gameMechanics.gameMechanics);
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

<div class="pageFlex">
	<div class="tabsContainer">
		<Tabs {tabs} {activeTab} on:tabChange={(e) => activeTab = e.detail}/>
	</div>
	<div class="gamesFlex">
		{#each games as game}
			<div class="game">
				<!--image or logo-->
				<a class="gameText" rel="prefetch" href="/{game.id}">{game.name}</a>
				<div>
					{#each game.features as feature}
						<p class="feature">{feature.name}</p>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.pageFlex {
		display: flex;
		justify-content: space-evenly;
		align-items: flex-start;
		text-align: center;
		height: 100%;
	}

	.tabsContainer {
		border-right: 0.25rem solid black;
		height: 100%;
	}

	.gamesFlex {
		display: flex;
		flex-wrap: wrap;
		margin-left: 1rem;
		gap: 1rem;
	}

	.game {
		flex: 1 1 0px;
		background: var(--primary);
		border: black 2px solid;
		padding: 1rem;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.gameText {
		text-decoration: none;
		color: black;
		font-size: 1.5rem;
		text-transform: uppercase;
	}

	.feature {
		display: inline;
		margin-right: 0.1rem;
	}

	.feature:after { content: ", "; }
	.feature:last-child:after { content: ""; }
</style>