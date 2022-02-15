<script context="module">
	export async function load ({ fetch, params }){
		const resultGame = await fetch(`/api/games?id=${params.id}`);
		const dataGame = await resultGame.json();

		const resultRuleSummary = await fetch(`/api/ruleSummaries?id=${params.id}`);
		const dataRuleSummary = await resultRuleSummary.json();

		const resultRule = await fetch(`/api/rules?id=${params.id}`);
		const dataRule = await resultRule.json();

		const resultPlayer = await fetch(`/api/players`);
		const dataPlayer = await resultPlayer.json();
	
		const resultSessions = await fetch(`/api/sessions?id=${params.id}`);
		const dataSessions = await resultSessions.json();

		if (resultGame.status === 200 && resultRuleSummary.status === 200 && resultRule.status === 200 && resultPlayer.status === 200 && resultSessions.status === 200) {
			return {
				props:{
					game: {gameId: params.id, gameName: dataGame.game.gameName, gameType: dataGame.game.gameTypeName, startScore: dataGame.game.startScore, highScoreWins: dataGame.game.highScoreWins, colour: dataGame.game.colour, highScoreWins: dataGame.game.highScoreWins, oneLoser: dataGame.game.oneLoser, minPlayers: dataGame.game.minPlayers, maxPlayers: dataGame.game.maxPlayers, minPlayTime: dataGame.game.minPlayTime, maxPlayTime: dataGame.game.maxPlayTime, minScore: dataGame.game.minScore, maxScore: dataGame.game.maxScore, teams: dataGame.game.teams, coopScores: dataGame.game.coopScores, ruleSummaries: dataRuleSummary.rulesSummaries, rules: dataRule.rules},
					players: dataPlayer.players,
					sessions: dataSessions.sessions
				}
			};
		} else {
			console.log("something wrong with the database");
		}
	}
</script>

<script>
	import TiHome from 'svelte-icons/ti/TiHome.svelte';
	import IoMdDocument from 'svelte-icons/io/IoMdDocument.svelte';
	import IoMdStats from 'svelte-icons/io/IoMdStats.svelte';
	import MdEdit from 'svelte-icons/md/MdEdit.svelte'
	import FaUserPlus from 'svelte-icons/fa/FaUserPlus.svelte'

	import Rules from '$lib/rules.svelte';
	import Stats from '$lib/stats.svelte';
	import PlayerCreator from '$lib/playerCreator.svelte';

	import IndividualScore from "$lib/gameComponents/individualScore.svelte";
	import RankedScore from "$lib/gameComponents/rankedScore.svelte";
	import TeamScore from "$lib/gameComponents/teamScore.svelte";
	import CoopScore from "$lib/gameComponents/coopScore.svelte";
	let gameComponents = {IndividualScore, RankedScore, TeamScore, CoopScore};

	export let game;
	export let players;
	export let sessions;

	for (const player of players){
		player.score = game.startScore;
	}

	for (const team of game.teams){
		team.score = game.startScore;
	}

	for (const coopScore of game.coopScores){
		coopScore.score = game.startScore;
	}

	function loadStats(){
		let bestScore;
		let bestScores = [];
		let worstScore;
		let worstScores = [];
		let numberOfGames;
		let mostWins;
		let mostWin;
		let mostLosses;
		let mostLose;

        for (const player of players) {
            player.wins = 0;
            player.losses = 0;
            player.games = 0;
        }

        for (const session of sessions) {
            session.player = players.find(player => player.playerId == session.playerId);
            players.find(p => p.playerId == session.player.playerId).games++;
        }

		if (game.highScoreWins) {
        	bestScore = Math.max(...sessions.map(s => s.score));
        	worstScore = Math.min(...sessions.map(s => s.score));
		} else {
			bestScore = Math.min(...sessions.map(s => s.score));
        	worstScore = Math.max(...sessions.map(s => s.score));
		}

        let allBestScores = sessions.filter(session => session.score == bestScore);
		for (const score of allBestScores) {
			if (!bestScores.find(s => s.player.playerId == score.player.playerId)){
				bestScores.push(score);
			}
		}

        let allWorstScores = sessions.filter(session => session.score == worstScore);
		for (const score of allWorstScores) {
			if (!worstScores.find(s => s.player.playerId == score.player.playerId)){
				worstScores.push(score);
			}
		}

        let sessionIds = [...new Set(sessions.map(session => session.gameSessionId))];
        numberOfGames = sessionIds.length;

        for (const sessionId of sessionIds) {
			let currentGame = sessions.find(s => s.gameSessionId == sessionId);
			currentGame.highScoreWins = game.highScoreWins;

            let winningScore;
            let winners;
            let losers;

            if (currentGame.coopWin != null){
                winners = sessions.filter(session => session.gameSessionId == sessionId && session.coopWin == true);
                losers = sessions.filter(session => session.gameSessionId == sessionId && session.coopWin == false);
            }
            else {
                if (currentGame.highScoreWins){
                    winningScore = Math.max(...sessions.filter(s => s.gameSessionId == sessionId).map(s => s.score)); 
                } else if (!currentGame.highScoreWins) {
                    winningScore = Math.min(...sessions.filter(s => s.gameSessionId == sessionId).map(s => s.score));
                }

                winners = sessions.filter(session => session.gameSessionId == sessionId && session.score == winningScore);
				losers = sessions.filter(session => session.gameSessionId == sessionId && session.score != winningScore);
            }
            
            for (const winner of winners) {
                players.find(p => p.playerId == winner.playerId).wins++;
            }

            for (const loser of losers) {
                players.find(p => p.playerId == loser.playerId).losses++;
            }
        }

        mostWin = Math.max(...players.map(p => p.wins));
        mostWins = players.filter(player => player.wins == mostWin);
        mostLose = Math.max(...players.map(p => p.losses));
        mostLosses = players.filter(player => player.losses == mostLose);

        for (const player of players) {
            player.winPercentage = Math.round(player.wins/player.games*100);

			if (isNaN(player.winPercentage)){
				player.winPercentage = 0;
			}

            let totalScore = 0;

            for (const session of sessions.filter(s => s.player.playerId == player.playerId)){
                totalScore += session.score;
            }

            player.averageScore = Math.round(totalScore / player.games);

			if (isNaN(player.averageScore)){
				player.averageScore = 0;
			}
        }

		if (!isFinite(worstScore)){
			worstScore = "No Scores";
		}

		if (!isFinite(bestScore)){
			bestScore = "No Scores";
		}

		return {bestScore: bestScore, bestScores: bestScores, worstScore: worstScore, worstScores: worstScores, numberOfGames: numberOfGames, mostWins: mostWins, mostWin: mostWin, mostLosses: mostLosses, mostLose: mostLose};
    }

	let stats = loadStats();

	let menuSelection = "rules";

	let tabs = [
		{name:"Rules", component: Rules, props: {activeGame: game}},
		{name:"Stats", component: Stats, props: {stats: stats, players: players}},
		{name:"Record Game", component: gameComponents[game.gameType], props: {players: players, game: game}}
  	];

	let styles = {
		'primary': game.colour
	};

	$: cssVarStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');
</script>

<svelte:head>
	<title>{game.gameName}</title>
</svelte:head>

<div class="pageContainer" style="{cssVarStyles}">
	<div class="sidebarContainer">
		<a class="homeButton" href="/">
			<div class="icon">
				<TiHome/>
			</div>
			Home
		</a>
		<div class="menu">
			<div class="header">
				<img class="gameIcon" src="/images/gameIcons/{game.gameName}.png" alt="{game.gameName}"/>
				<p>{game.gameName}</p>
			</div>
			<button class="menuItem" on:click="{() => menuSelection = 'rules'}" class:selectedMenuItem={menuSelection == 'rules'}>
				<div class="icon" class:selectedIcon={menuSelection == 'rules'}>
					<IoMdDocument/>
				</div>
				Rules
			</button>
			<button class="menuItem" on:click="{() => menuSelection = 'stats'}" class:selectedMenuItem={menuSelection == 'stats'}>
				<div class="icon" class:selectedIcon={menuSelection == 'stats'}>
					<IoMdStats/>
				</div>
				Stats
			</button>
			<button class="menuItem" on:click="{() => menuSelection = 'record'}" class:selectedMenuItem={menuSelection == 'record'}>
				<div class="icon" class:selectedIcon={menuSelection == 'record'}>
					<MdEdit/>
				</div>
				Record Game
			</button>
			<button class="menuItem" on:click="{() => menuSelection = 'add'}" class:selectedMenuItem={menuSelection == 'add'}>
				<div class="icon" class:selectedIcon={menuSelection == 'add'}>
					<FaUserPlus/>
				</div>
				Add Player
			</button>
		</div>
	</div>
	<div>
		{#if menuSelection=="rules"}
			<Rules {game}/>
		{:else if menuSelection=="stats"}
			<Stats {stats} {players}/>
		{:else if menuSelection=="record"}
			<svelte:component this={gameComponents[game.gameType]} {game} {players} />
		{:else if menuSelection=="add"}
			<PlayerCreator {players}/>
		{/if}
	</div>
</div>

<style>
	.pageContainer {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: start;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.sidebarContainer {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.menu {
		display: flex;
		flex-direction: column;
		align-content: flex-start;
		gap: 1rem;
		border-radius: var(--radiusLarge);
		padding: 2rem 2rem 5rem 2rem;
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	}

	.header {
		display: flex;
		gap: 1rem;
		align-items: center;
		font-size: var(--extraLarge);
	}

	.menuItem {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		border: none;
		background-color: transparent;
		color: black;
		font-size: var(--large);
		padding: 0.5rem;
	}

	.homeButton {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		font-size: var(--large);
		text-decoration: none;
		color: black;
		border-radius: var(--radiusLarge);
		padding: 1rem;
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	}

	.selectedMenuItem {
		background-color: var(--primary);
		border-radius: var(--radiusSmall);
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	}

	.gameIcon {
		height: calc(var(--extraLarge)*2);
	}

	.icon {
		color: var(--primary);
		width: var(--extraLarge);
	}

	.selectedIcon {
		color: black;
	}
</style>