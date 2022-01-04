<script context="module">
	export async function load ({ fetch, page }){
		const resultGame = await fetch(`/api/games?id=${page.params.id}`);
		const dataGame = await resultGame.json();

		const resultRuleSummary = await fetch(`/api/ruleSummaries?id=${page.params.id}`);
		const dataRuleSummary = await resultRuleSummary.json();

		const resultRule = await fetch(`/api/rules?id=${page.params.id}`);
		const dataRule = await resultRule.json();

		const resultPlayer = await fetch(`/api/players`);
		const dataPlayer = await resultPlayer.json();
	
		const resultSessions = await fetch(`/api/sessions?id=${page.params.id}`);
		const dataSessions = await resultSessions.json();

		if (resultGame.status === 200 && resultRuleSummary.status === 200 && resultRule.status === 200 && resultPlayer.status === 200 && resultSessions.status === 200) {
			return {
				props:{
					game: {name: dataGame.game.name, shortName: dataGame.game.shortName, highScoreWins: dataGame.game.highScoreWins, colour:dataGame.game.colour, ruleSummaries: [...dataRuleSummary.rulesSummaries], rules: [...dataRule.rules]},
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
	import Rules from '../components/rules.svelte';
	import Stats from '../components/stats.svelte';
	import Tabs from '../components/tabs.svelte';

	import Hanabi from "../components/games/hanabi.svelte";
	import ROHOG from "../components/games/ROHOG.svelte";
	import Bohnanza from "../components/games/bohnanza.svelte";
	import Codenames from "../components/games/codenames.svelte";
	import SixNimmt from "../components/games/sixNimmt.svelte";
	import Pandemic from "../components/games/pandemic.svelte";
	import LostCities from "../components/games/lostCities.svelte";
	import Resistance from "../components/games/resistance.svelte";
	import Tokaido from "../components/games/tokaido.svelte";
	let gameComponents = { Hanabi, ROHOG, Bohnanza, Codenames, SixNimmt, Pandemic, LostCities, Resistance, Tokaido };

	export let game;
	export let players;
	export let sessions;

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

        bestScore = Math.max(...sessions.map(s => s.score));
        let allBestScores = sessions.filter(session => session.score == bestScore);
		for (const score of allBestScores) {
			if (!bestScores.find(s => s.player.playerId == score.player.playerId)){
				bestScores.push(score);
			}
		}

        worstScore = Math.min(...sessions.map(s => s.score));
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
            let losingScore;
            let winners;
            let losers;

            if (currentGame.coopWin != null){
                winners = sessions.filter(session => session.gameSessionId == sessionId && session.coopWin == true);
                losers = sessions.filter(session => session.gameSessionId == sessionId && session.coopWin == false);
            }
            else {
                if (currentGame.highScoreWins){
                    winningScore = Math.max(...sessions.filter(s => s.gameSessionId == sessionId).map(s => s.score)); 
                    losingScore = Math.min(...sessions.filter(s => s.gameSessionId == sessionId).map(s => s.score)); 
                } else if (!currentGame.highScoreWins) {
                    winningScore = Math.min(...sessions.filter(s => s.gameSessionId == sessionId).map(s => s.score));
                    losingScore = Math.max(...sessions.filter(s => s.gameSessionId == sessionId).map(s => s.score));
                }

                winners = sessions.filter(session => session.gameSessionId == sessionId && session.score == winningScore);
                losers = sessions.filter(session => session.gameSessionId == sessionId && session.score == losingScore);
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

		if (worstScore == isFinite()){
			worstScore = "No Scores";
		}

		if (bestScore == isFinite()){
			bestScore = "No Scores";
		}

		return {bestScore: bestScore, bestScores: bestScores, worstScore: worstScore, worstScores: worstScores, numberOfGames: numberOfGames, mostWins: mostWins, mostWin: mostWin, mostLosses: mostLosses, mostLose: mostLose};
    }

	if(gameComponents[game.shortName]){
		game.component = gameComponents[game.shortName];
	}

	let stats = loadStats();

	let tabs = [
		{name:"Rules", component: Rules, props: {activeGame: game}},
		{name:"Stats", component: Stats, props: {stats: stats, players: players}},
		{name:"Record Game", component: game.component, props: {players: players}}
  	];
  	let activeTab = "Record Game";

	let styles = {
		'primary': game.colour
	};

	$: cssVarStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');
</script>

<svelte:head>
	<title>{game.name}</title>
</svelte:head>

<div style="{cssVarStyles}">
	<div class="header">
		<div class="icons">
			<a href="/"><img src="/images/home.png" alt="home" class="iconButton"/></a>
		</div>
		<h1 class="title">{game.name}</h1>
		<div class="invisibleIcons icons">
			<a href="/"><img src="/images/home.png" alt="home" class="iconButton"/></a>
		</div>
	</div>

	<Tabs {tabs} {activeTab} on:tabChange={(e) => activeTab = e.detail}/>
</div>

<style>
	.header {
		display: flex;
		margin: 1rem 0;
		align-items: center;
		align-content: center;
		text-align: center;
	}

	.title {
		text-align: center;
		background: var(--primary);
		width: 50%;
		max-width: 600px;
		margin: 0 auto;
		transform: skewX(-10deg); 
		font-size: 2.5rem;
		padding: 1rem 1rem;
	}

	.icons {
		margin-left: 3rem;
	}

	.iconButton {
		color: var(--primary);
		text-align: center;
		cursor: pointer;
		height: 2rem;
	}

	.invisibleIcons {
		visibility: hidden;
	}
</style>