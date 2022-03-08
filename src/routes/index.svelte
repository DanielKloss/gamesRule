<script context="module">
	export async function load({ stuff }){
		return {
			props: {
				games: stuff.games, 
				categories: stuff.categories,
				mechanics: stuff.mechanics
			}
		};
	}
</script>
  
<script>
	import IoIosTime from 'svelte-icons/io/IoIosTime.svelte'
	import FaUsers from 'svelte-icons/fa/FaUsers.svelte'
	import Filter from '$lib/filters.svelte';

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
			if (filtercategory.categoryName == category.categoryName){
				return true;
			}
		}	 
	}

	function checkGameForMechanic(game, filterMechanic){
		for (const mechanic of game.gameMechanics.gameMechanics){
			if (filterMechanic.mechanicName == mechanic.mechanicName){
				return true;
			}
		}	 
	}

	function updateFilters(filters) {
		filteredGames = games.filter(game => game.gameName.includes(filters.searchTerm));
		filteredGames = filteredGames.filter(game => game.maxPlayTime <= filters.playTime);
		filteredGames = filteredGames.filter(game => game.minPlayers <= filters.players);
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

	for (const game of games) {
		game.features = [];

		for (const category of game.gameCategories.gameCategories){
			game.features.push(category.categoryName);
		}

		for (const category of game.gameMechanics.gameMechanics){
			game.features.push(category.mechanicName);
		}
	}

	games = games.sort(function(a, b) {
		var gameA = a.gameName.toUpperCase();
		var gameB = b.gameName.toUpperCase();
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
	<title>Games Rule</title>
</svelte:head>

<div class="pageFlex" style="{cssVarStyles}">
	<div class="filterContainer">
		<Filter {categories} {mechanics} {maxPlayTime} {maxPlayers} on:filtersChanged={(e) => updateFilters(e.detail)}/>
	</div>
	<div class="divider"/>
	<div class="gamesContainer">
		{#each filteredGames as game}
			<a class="game" href="/{game.gameId}">
				<img class="gameIcon" src="/images/gameIcons/{game.gameName}.png" alt="{game.gameName}"/>
				<p class="gameTitle">{game.gameName}</p>
				<div class="detailContainer">
					<div class="playTimeContainer">
						<div class="icon"><IoIosTime/></div>
						{#if game.minPlayTime == game.maxPlayTime}
							<p class="detailText">{game.minPlayTime}</p>
						{:else}
							<p class="detailText">{game.minPlayTime} - {game.maxPlayTime}</p>
						{/if}
					</div>
					<div class="playTimeContainer">
						<div class="icon"><FaUsers/></div>
						{#if game.minPlayers == game.maxPlayers}
							<p class="detailText">{game.minPlayers}</p>
						{:else}
							<p class="detailText">{game.minPlayers} - {game.maxPlayers}</p>
						{/if}
					</div>
				</div>
				<div class="features">
					{#each game.features as feature}
						<p class="feature">{feature}</p>
					{/each}
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.pageFlex {
		display: grid;
		grid-template-columns: auto auto 1fr;
		gap: 1rem;
	}

	.divider {
		border-right: 0.25rem solid black;
	}

	.gamesContainer {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.game {
		display: grid;
		grid-template-columns: auto 1.5fr 0.6fr 1fr;
		gap: 1rem;
		align-items: center;
		text-decoration: none;
		color: black;
		border-radius: var(--radiusLarge);
		padding: 0.5rem 1rem;
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	}

	.gameTitle {
		text-transform: uppercase;
		font-size: var(--extraLarge);
	}

	.gameIcon {
		height: calc(var(--extraLarge)*2.25);
	}

	.detailContainer {
		display: flex;
		flex-direction: column;
		justify-content: start;
	}

	.playTimeContainer {
		display: flex;
		align-items: center;
	}

	.features {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: end;
	}

	.feature {
		font-size: var(--medium);
		background-color: #F3F5F8;
		border-radius: var(--radiusSmall);
		padding: 0.5rem;
		margin: 0;
	}

	.icon {
		height: 1.5rem;
	}

	.detailText {
		margin: 0 0 0 1rem;
		font-size: var(--large);
	}
</style>