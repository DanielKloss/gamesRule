<script context="module">
	export async function load ({ fetch }){
		const gamesResult = await fetch('/api/games');
		const gamesBody = await gamesResult.json();
        const games = gamesBody.games;

		const categoriesResult = await fetch('/api/games?type=categories');
		const categoriesBody = await categoriesResult.json();
		const categories = categoriesBody.categories;

		const mechanicsResult = await fetch('/api/games?type=mechanics');
		const mechanicsBody = await mechanicsResult.json();
		const mechanics = mechanicsBody.mechanics;

		return {
			props: { games, categories, mechanics }
		};
	}
</script>
  
<script>
	import Tabs from '../components/tabs.svelte';
	import PlayerCreator from '../components/playerCreator.svelte';
	import Filter from '../components/filters.svelte';
	import About from '../components/about.svelte';

	export let games;
	export let categories;
	export let mechanics;

	function removeArticles(game) {
		let words = game.split(" ");
		if(words.length <= 1) 
			return game;
		if(words[0] == 'A' || words[0] == 'THE' || words[0] == 'AN')
			return words.splice(1).join(" ");
		return game;
	}

	function checkGameForCategory(game, filtercategory){
		for (const category of game.gameCategories.gameCategories){
			if (filtercategory.name == category.name){
				return true;
			}
		}	 
	}

	function checkGameForMechanic(game, filterMechanic){
		for (const mechanic of game.gameMechanics.gameMechanics){
			if (filterMechanic.name == mechanic.name){
				return true;
			}
		}	 
	}

	function updateFilters(filters) {
		filteredGames = games.filter(game => game.maxPlayTime <= filters.playTime[1] && game.maxPlayTime >= filters.playTime[0]);
		filteredGames = filteredGames.filter(game => game.maxPlayers >= filters.players[0] && game.minPlayers <= filters.players[1]);
		for (var i = filteredGames.length - 1; i >= 0; i--) {
			for (const filterCategory of filters.categories){
				if (checkGameForCategory(filteredGames[i], filterCategory)){
					continue;
				} else {
					let index = filteredGames.indexOf(filteredGames[i]);
					filteredGames.splice(index, 1);
					break;
				}
			}
		}
		for (var i = filteredGames.length - 1; i >= 0; i--) {
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
	}

	let maxPlayTime = games.reduce(function(max, game) { return game.maxPlayTime > max.maxPlayTime? game : max; }).maxPlayTime;
	let maxPlayers = games.reduce(function(max, game) { return game.maxPlayers > max.maxPlayers? game : max; }).maxPlayers;

	let tabs = [
		{name:"Add", component: PlayerCreator, props: {}},
		{name:"Filters", component: Filter, props: {categories : categories, mechanics: mechanics, maxPlayTime: maxPlayTime, maxPlayers: maxPlayers}},
		{name:"About", component: About, props:{}}
	];
	let activeTab = "Filters";

	for (const game of games) {
		game.features = game.gameCategories.gameCategories.concat(game.gameMechanics.gameMechanics);
	}

	games = games.sort(function(a, b) {
		var gameA = a.name.toUpperCase();
		var gameB = b.name.toUpperCase();
		gameA = removeArticles(gameA);
		gameB = removeArticles(gameB);
		return (gameA < gameB) ? -1 : (gameA > gameB) ? 1 : 0;
	});

	let filteredGames = games;

	let styles = {
		'primary': "#BABFD1"
	};

	$: cssVarStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="pageFlex" style="{cssVarStyles}">
	<div class="tabsContainer">
		<Tabs {tabs} {activeTab} on:tabChange={(e) => activeTab = e.detail} on:filtersChanged={(e) => updateFilters(e.detail.detail)}/>
	</div>
	<div class="gamesFlex">
		{#each filteredGames as game}
			<div class="game">
				<img class="gameIcon" src="/images/gameIcons/{game.shortName}.png" alt="{game.shortName} Icon"/>
				<div>
					<a class="gameLink" href="/{game.gameId}">
						<p class="gameText">{game.name}</p>
						<div>
							<img src="/images/time.png" alt="play time" class="icon"/>
							{#if game.minPlayTime == game.maxPlayTime}
								<p class="timeText">{game.minPlayTime}</p>
							{:else}
								<p class="timeText">{game.minPlayTime} - {game.maxPlayTime}</p>
							{/if}
							<img src="/images/players.png" alt="players" class="icon"/>
							{#if game.minPlayers == game.maxPlayers}
								<p class="playerText">{game.minPlayers}</p>
							{:else}
								<p class="playerText">{game.minPlayers} - {game.maxPlayers}</p>
							{/if}
						</div>
						<div>
							{#each game.features as feature}
								<p class="feature">{feature.name}</p>
							{/each}
						</div>
					</a>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.pageFlex {
		display: flex;
	}

	.tabsContainer {
		border-right: 0.25rem solid black;
	}

	.gamesFlex {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		grid-auto-rows: max-content;
		margin-left: 1rem;
		gap: 0.5rem;
		text-align: center;
	}

	.game {
		background: var(--primary);
		border: black 2px solid;
		padding: 1rem;
		cursor: pointer;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		gap: 0.5rem;
	}

	.gameLink {
		text-decoration: none;
		color: black;
	}

	.gameText {
		text-transform: uppercase;
		font-size: 1.5rem;
		margin: 0 auto;
	}

	.gameIcon {
		height: 5rem;
	}

	.feature {
		display: inline;
		margin-right: 0.1rem;
	}

	.feature:after { content: ", "; }
	.feature:last-child:after { content: ""; }

	.icon {
		height: 1rem;
	}

	.timeText {
		display: inline;
		margin-right: 1rem;
	}

	.playerText {
		display: inline;
	}
</style>