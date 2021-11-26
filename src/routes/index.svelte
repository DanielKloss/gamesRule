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
	<Tabs {tabs} {activeTab} on:tabChange={(e) => activeTab = e.detail}/>
	<!-- <div on:click="{() => {createPlayerOpen = true}}"><img src="/images/addUser.png" alt="add user" class="iconButton"/></div> -->
	<div class="gamesFlex">
		{#each games as game}
			<div class="game">
				<!--image or logo-->
				<a class="gameText" rel="prefetch" href="/{game.id}">{game.name}</a>
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
		margin-top: 1rem;
	}

	.gamesFlex {
		display: flex;
		flex-wrap: wrap;
		margin: 0 1rem;
		gap: 1rem;
	}

	.game {
		flex: 1 1 0px;
		background: var(--primary);
		border: black 2px solid;
		padding: 1rem;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.gameText {
		text-decoration: none;
		color: black;
		font-size: 1.5rem;
		text-transform: uppercase;
	}
</style>