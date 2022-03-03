<script>
    import {fade} from 'svelte/transition';
    import TeamSelector from "$lib/selectorComponents/teamSelector.svelte";
    import ScoreTracker from "$lib/scoreComponents/scoreTracker.svelte";

    export let game;
    export let players;
    let hidePlayers = false;

    let newTeamName;

    let noneTeam = {gameTeamName:"None", gameTeamColour:"#bbb"};
    game.teams.push(noneTeam);

    for (const player of players) {
        player.team = noneTeam;
    }

    $: noTeamsSelected = players.filter(p => p.team.gameTeamName != "None");

    function addTeam(){
        game.teams = [...game.teams, {gameTeamName: newTeamName, gameTeamColour: "red"}];
    }

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

<div class="container">
    <TeamSelector bind:players={players} teams={game.teams} maxPlayers={game.maxPlayers} bind:hide={hidePlayers}/>
</div>
    {#if game.teams[0].gameTeamName == "unlimited"}
        <button on:click="{() => addTeam()}">Add Team</button>
        <input type="text" bind:value="{newTeamName}" placeholder="New Team Name"/>
    {/if}

    <div class="scoreContainer">
    {#each game.teams as team}
        {#if team.gameTeamName != "unlimited" && team.gameTeamName != "None"}
            <ScoreTracker name={team.gameTeamName} bind:score={team.score} colour={team.gameTeamColour} startScore={game.startScore} minScore={game.minScore} maxScore={game.maxScore} titleVisible=true/>
        {/if}
    {/each}
    </div>

    {#if noTeamsSelected.length >= game.minPlayers}
        <button transition:fade class="submitButton" on:click="{() => {submitScores()}}">SUBMIT</button>
    {/if}

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