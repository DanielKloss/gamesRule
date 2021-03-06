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
	import { filters } from '$lib/stores/filters';

	export let games;
	export let categories;
	export let mechanics;

	function checkGameForCategory(game, filtercategory){
		for (const category of game.gameCategories.gameCategories){
			if (filtercategory == category.categoryName){
				return true;
			}
		}	 
	}

	function checkGameForMechanic(game, filterMechanic){
		for (const mechanic of game.gameMechanics.gameMechanics){
			if (filterMechanic == mechanic.mechanicName){
				return true;
			}
		}	 
	}

	function updateFilters() {
		if (!$filters.filtersOn){
			filteredGames = games;
			return;
		}

		filteredGames = games.filter(game => game.gameName.includes($filters.searchTerm.toLowerCase()));
		filteredGames = filteredGames.filter(game => game.maxPlayTime <= $filters.playTime);
		filteredGames = filteredGames.filter(game => game.minPlayers <= $filters.players && game.maxPlayers >= $filters.players);
		for (var i = filteredGames.length - 1; i >= 0; i--) {
			for (const filterCategory of $filters.categories){
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
			for (const filterMechanic of $filters.mechanics){
				if (checkGameForMechanic(filteredGames[i], filterMechanic)){
					continue;
				} else {
					let index = filteredGames.indexOf(filteredGames[i]);
					filteredGames.splice(index, 1);
					break;
				}
			}
		}

		for (const category of categories){		
			if (filteredGames.filter(g => g.features.includes(category.categoryName)).length == 0){
				category.disabled = true;
			} else {
				category.disabled = false;
			}
		}

		for (const mechanic of mechanics){		
			if (filteredGames.filter(g => g.features.includes(mechanic.mechanicName)).length == 0){
				mechanic.disabled = true;
			} else {
				mechanic.disabled = false;
			}
		}

		categories = categories;
		mechanics = mechanics;

		$filters.maxPlayTime = filteredGames.reduce(function(max, game) { return game.maxPlayTime > max.maxPlayTime? game : max; }).maxPlayTime;
		$filters.maxPlayers = filteredGames.reduce(function(max, game) { return game.maxPlayers > max.maxPlayers? game : max; }).maxPlayers;
	}

	let filteredGames = games;
	updateFilters();

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
		<button class="filterButton" class:filterButtonPressed="{$filters.filtersOn}" on:click="{() => {$filters.filtersOn = !$filters.filtersOn; updateFilters()}}">Filters</button>
		{#if $filters.filtersOn}
		<Filter {categories} {mechanics} on:filtersChanged={(e) => updateFilters()}/>
		{/if}
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

	.filterContainer {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-content: stretch;
		width: 12rem;
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

	.filterButton {
		color: black;
		border-radius: var(--radiusLarge);
		padding: 0.5rem 1rem;
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		border: none;
		font-size: var(--large);
		font-weight: bold;
		text-align: center;
	}

	.filterButtonPressed {
		box-shadow: none;
		background-color: var(--primary);
	}
</style>