<script context="module">
	export async function load ({ fetch }){
		const gamesResult = await fetch('/api/games');
		const gamesBody = await gamesResult.json();
        const games = gamesBody.games;

		const typesResult = await fetch('/api/games?type=types');
		const typesBody = await typesResult.json();
		const types = typesBody.types;

		const mechanicsResult = await fetch('/api/games?type=mechanics');
		const mechanicsBody = await mechanicsResult.json();
		const mechanics = mechanicsBody.mechanics;

		return {
			props: { games, types, mechanics }
		};
	}
</script>
  
<script>
	import Tabs from '../components/tabs.svelte';
	import PlayerCreator from '../components/playerCreator.svelte';
	import Filter from '../components/filters.svelte';
	import About from '../components/about.svelte';

	export let games;
	export let types;
	export let mechanics;

	function removeArticles(game) {
		let words = game.split(" ");
		if(words.length <= 1) 
			return game;
		if(words[0] == 'A' || words[0] == 'THE' || words[0] == 'AN')
			return words.splice(1).join(" ");
		return game;
	}

	function checkGameForType(game, filterType){
		for (const type of game.gameTypes.gameTypes){
			if (filterType.name == type.name){
				return true;
			} else {
				return false;
			}
		}	 
	}

	function checkGameForMechanic(game, filterMechanic){
		for (const mechanic of game.gameMechanics.gameMechanics){
			if (filterMechanic.name == mechanic.name){
				return true;
			} else {
				return false;
			}
		}	 
	}

	function updateFilters(filters) {
		if (filters.isOn){
			if (filters.timeIsOn){
				filteredGames = games.filter(game => game.maxPlayTime <= filters.playTime);
			}
			if (filters.playersIsOn) {
				filteredGames = filteredGames.filter(game => game.maxPlayers >= filters.players && game.minPlayers <= filters.players);
			}
			for (var i = filteredGames.length - 1; i >= 0; i--) {
				for (const filterType of filters.types){
					if (checkGameForType(filteredGames[i], filterType)){
						continue;
					} else {
						let index = filteredGames.indexOf(filteredGames[i]);
						filteredGames.splice(index, 1);
						break;
					}
				}
				for (const filterMechanic of filters.mechanics){
					if (checkGameForMechanic(filteredGames[i], filterMechanic)){
						continue;
					} else {
						let index = filteredGames.indexOf(filteredGames[i]);
						filteredGames.splice(index, 1);
						break;
					}
				}
			}
		} else {
			filteredGames = games;
		}
	}

	let maxPlayTime = games.reduce(function(max, game) { return game.maxPlayTime > max.maxPlayTime? game : max; }).maxPlayTime;
	let maxPlayers = games.reduce(function(max, game) { return game.maxPlayers > max.maxPlayers? game : max; }).maxPlayers;

	let tabs = [
		{name:"Add", component: PlayerCreator, props: {}},
		{name:"Filters", component: Filter, props: {types: types, mechanics: mechanics, maxPlayTime: maxPlayTime, maxPlayers: maxPlayers}},
		{name:"About", component: About, props:{}}
	];
	let activeTab = "Filters";

	for (const game of games) {
		game.features = game.gameTypes.gameTypes.concat(game.gameMechanics.gameMechanics);
	}

	games = games.sort(function(a, b) {
		var gameA = a.name.toUpperCase();
		var gameB = b.name.toUpperCase();
		gameA = removeArticles(gameA);
		gameB = removeArticles(gameB);
		return (gameA < gameB) ? -1 : (gameA > gameB) ? 1 : 0;
	});

	let filteredGames = games;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="pageFlex">
	<div class="tabsContainer">
		<Tabs {tabs} {activeTab} on:tabChange={(e) => activeTab = e.detail} on:filtersChanged={(e) => updateFilters(e.detail.detail)}/>
	</div>
	<div class="gamesFlex">
		{#each filteredGames as game}
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