<script>
    import {fade} from 'svelte/transition';
    import TeamSelector from "$lib/selectorComponents/teamSelector.svelte";
    import ScoreTracker from "$lib/scoreComponents/scoreTracker.svelte";

    export let game;
    export let players;
    let hidePlayers = false;

    let noneTeam = {gameTeamName:"None", gameTeamColour:"#bbb"};
    game.teams.push(noneTeam);

    for (const player of players) {
        player.team = noneTeam;
    }

    $: noTeamsSelected = players.filter(p => p.team.gameTeamName != "None");

    async function submitScores(){
        let session = { date: new Date().toJSON().slice(0, 10).toString(), gameId: game.gameId};
        const resultSession = await fetch(`/api/sessions`, {method: 'POST', body: JSON.stringify(session), headers: {'Content-Type': 'application/json'}});
        const dataSession = await resultSession.json();

        if (resultSession.status != 200 ) {
            console.log(500, "something wrong with the database");
            return;
        }

        for (const player of players) {
            if (player.team.gameTeamName != "unlimited" && player.team.gameTeamName != "None"){
                let playerSession = { gameSessionId: dataSession.gameSessionId.insertId, playerId: player.playerId, score: player.team.score};
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

<TeamSelector bind:players={players} teams={game.teams} bind:hide={hidePlayers}/>

{#if game.teams[0].gameTeamName == "unlimited"}
    <button>Add Team</button>
{/if}

{#each game.teams as team}
    {#if team.gameTeamName != "unlimited" && team.gameTeamName != "None"}
        <ScoreTracker name={team.gameTeamName} bind:score={team.score} colour={team.gameTeamColour} startScore={game.startScore} minScore={game.minScore} maxScore={game.maxScore} titleVisible=true/>
    {/if}
{/each}

{#if noTeamsSelected.length >= game.minPlayers}
    <button transition:fade class="submitButton" on:click="{() => {submitScores()}}">SUBMIT</button>
{/if}

<style>
    .submitButton {
        display: block;
        width:50%;
        max-width: 300px;
        margin: 2rem auto;
        border: 2px solid var(--primary);
        background: transparent;
        transform: skewX(-10deg);
        text-align: center;
        padding: 0.5rem 0.75rem;
        font-size: 1.5rem;
    }
</style>