<script>
    import {fade} from 'svelte/transition';
    import PlayerSelector from "$lib/selectorComponents/playerSelector.svelte";
    import ScoreTracker from "$lib/scoreComponents/scoreTracker.svelte";

    export let game;
    export let players;
    let hidePlayers = false;

    $: playersSelected = players.filter(p => p.selected).length >= game.minPlayers;

    async function submitScores(){
        let totalScore = game.startScore;
        let coopWin = true;

        for (const score of game.coopScores) {
            if (score.score != game.maxScore){
                coopWin = false;
            }
            totalScore += score.score;
        }

        let session = { date: new Date().toJSON().slice(0, 10).toString(), gameId: game.gameId, coopWin: coopWin};
        const resultSession = await fetch(`/api/sessions`, {method: 'POST', body: JSON.stringify(session), headers: {'Content-Type': 'application/json'}});
        const dataSession = await resultSession.json();

        if (resultSession.status != 200 ) {
            console.log(500, "something wrong with the database");
            return;
        }

        for (const player of players) {
            if (player.selected){
                let playerSession = { gameSessionId: dataSession.gameSessionId.insertId, playerId: player.playerId, score: totalScore};
                const resultPlayerSession = await fetch(`/api/playerSessions`, {method: 'POST', body: JSON.stringify(playerSession), headers: {'Content-Type': 'application/json'}});

                if (resultPlayerSession.status != 200 ) {
                    console.log(500, "something wrong with the database");
                    return;
                }

                player.selected = false;
            }
        }

        players = players;
        location.reload();
    }
</script>

<div class="container">
    <PlayerSelector bind:hide={hidePlayers} bind:players={players} maxPlayers={game.maxPlayers}/>

    <div class="scoreContainer">
    {#each game.coopScores as coopScore}
        <ScoreTracker name={coopScore.gameCoopScoreName} bind:score={coopScore.score} colour={coopScore.gameCoopScoreColour} startScore={game.startScore} minScore={game.minScore} maxScore={game.maxScore} titleVisible=true/>
    {/each}
    </div>

    {#if playersSelected}
        <button transition:fade class="submitButton" on:click="{() => {submitScores()}}">SUBMIT</button>
    {/if}
</div>

<style>
    .container {
        display: flex;
		flex-direction: column;
		gap: 1rem;
		font-size: var(--medium);
		border-radius: var(--radiusLarge);
		padding: 2rem;
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        margin-bottom: 1rem;
    }

    .scoreContainer {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .submitButton {
        padding: 0.5rem;
        border: none;
        background-color: var(--primary);
        border-radius: var(--radiusSmall);
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        font-size: var(--large);
        font-weight: bold;
        text-transform: uppercase;
    }
</style>