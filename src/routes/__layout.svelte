<script context="module">
	export async function load ({ fetch }){
		try {
			const gamesResult = await fetch('/api/games');
			const gamesBody = await gamesResult.json();
			const games = gamesBody.games;

			const categoriesResult = await fetch('/api/games?type=categories');
			const categoriesBody = await categoriesResult.json();
			const categories = categoriesBody.categories;

			const mechanicsResult = await fetch('/api/games?type=mechanics');
			const mechanicsBody = await mechanicsResult.json();
			const mechanics = mechanicsBody.mechanics;

			let maxPlayTime = games.reduce(function(max, game) { return game.maxPlayTime > max.maxPlayTime? game : max; }).maxPlayTime;
			let maxPlayers = games.reduce(function(max, game) { return game.maxPlayers > max.maxPlayers? game : max; }).maxPlayers;

			return {
				stuff: { games, categories, mechanics},
				props: { maxPlayTime, maxPlayers }
			};
		} catch (error) {
			console.log(error);
		}
	}
</script>

<script>
	import {filters} from '$lib/stores/filters.js';

	export let maxPlayTime;
	export let maxPlayers;

	$filters.playTime = 60;
	$filters.maxPlayTime = maxPlayTime;
    $filters.players = 4;
    $filters.maxPlayers = maxPlayers;
</script>

<main>
    <slot></slot>
</main>

<style>
    main{
		width: 80%;
		margin: 0 auto;
		margin-top: 1rem;
	}
</style>