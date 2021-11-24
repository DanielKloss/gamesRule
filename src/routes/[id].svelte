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
	
		console.log(dataGame.game.shortName);

		const resultSessions = await fetch(`/api/sessions?shortName=${dataGame.game.shortName}Game`);
		const dataSessions = await resultSessions.json();

		console.log(dataSessions);

		if (resultGame.status === 200 && resultRuleSummary.status === 200 && resultRule.status === 200 && resultPlayer.status === 200 && resultSessions.status === 200) {
			return {
				props:{
					game: {name: dataGame.game.name, shortName: dataGame.game.shortName, highScoreWins: dataGame.game.highScoreWins, colour:dataGame.game.colour, ruleSummaries: [...dataRuleSummary.rulesSummaries], rules: [...dataRule.rules]},
					players: dataPlayer.players,
					sessions: dataSessions.sessions
				}
			};
		} else {
			this.error(200, "something wrong with the database");
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
	let gameComponents = { Hanabi, ROHOG, Bohnanza, Codenames };

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
            session.player = players.find(player => player.id == session.id);
            players.find(p => p.id == session.player.id).games++;
        }

        bestScore = Math.max(...sessions.map(s => s.score));
        let allBestScores = sessions.filter(session => session.score == bestScore);
		for (const score of allBestScores) {
			if (!bestScores.find(s => s.player.id == score.player.id)){
				bestScores.push(score);
			}
		}

		if (bestScore != isFinite()){
			bestScore = "No Scores";
		}

        worstScore = Math.min(...sessions.map(s => s.score));
        let allWorstScores = sessions.filter(session => session.score == worstScore);
		for (const score of allWorstScores) {
			if (!worstScores.find(s => s.player.id == score.player.id)){
				worstScores.push(score);
			}
		}

		if (worstScore != isFinite()){
			worstScore = "No Scores";
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
                players.find(p => p.id == winner.id).wins++;
            }

            for (const loser of losers) {
                players.find(p => p.id == loser.id).losses++;
            }
        }

        mostWin = Math.max(...players.map(p => p.wins));
        mostWins = players.filter(player => player.wins == mostWin);
        mostLose = Math.max(...players.map(p => p.losses));
        mostLosses = players.filter(player => player.losses == mostLose);

        for (const player of players) {
            player.winPercentage = Math.round(player.wins/player.games*100);

            let totalScore = 0;

            for (const session of sessions.filter(s => s.player.id == player.id)){
                totalScore += session.score;
            }

            player.averageScore = Math.round(totalScore / player.games);
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
		{name:"Record Game", component: game.component, props: {activeGame: game, players: players}}
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
		<a rel="prefetch" href="/"><img src="/images/home.png" alt="home" class="home"/></a>
		<h1 class="title">{game.name}</h1>
		<div class="invisibleHomeLink"><img src="/images/home.png" alt="hiddenHome" class="home"/></div>
	</div>
	
	<Tabs {tabs} {activeTab} on:tabChange={(e) => {activeTab = e.detail}}/>
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

	.home {
		color: var(--primary);
		text-align: center;
		width: 50%;
	}

	.invisibleHomeLink {
		visibility: hidden;
	}
</style>