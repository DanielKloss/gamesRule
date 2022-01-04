<script>
    import {fade} from 'svelte/transition';
    import TeamSelector from "../../components/teamSelector.svelte";
    import ScoreTracker from "../../components/scoreTracker.svelte";

    export let players;
    let hidePlayers = false;
    let minScore = 0;
    let maxScore = 1;

    let teams = [
        {name: "None", colour: "#bbb"},
        {name: "Black Team", colour: "#272727", score: 0},
        {name: "White Team", colour: "#EFEFEF", score: 0}
    ];

    for (const player of players) {
        player.score = 0;
        player.team = teams[0];
    }

    $: teamsSelected = players.find(p => p.team.name == "Black Team") != undefined && players.find(p => p.team.name == "White Team") != undefined;

    async function submitScores(){
        let session = { date: new Date().toJSON().slice(0, 10).toString(), gameId: 13};
        const resultSession = await fetch(`/api/sessions`, {method: 'POST', body: JSON.stringify(session), headers: {'Content-Type': 'application/json'}});
        const dataSession = await resultSession.json();

        if (resultSession.status != 200 ) {
            console.log(500, "something wrong with the database");
            return;
        }

        for (const player of players) {
            if (player.team != teams[0]){
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
    }
</script>

<TeamSelector bind:players={players} {teams} bind:hide={hidePlayers}/>

{#each teams as team}
    {#if team.name != "None"}
        <ScoreTracker name={team.name} bind:score={team.score} colour={team.colour} minScore={minScore} maxScore={maxScore} titleVisible=true/>
    {/if}
{/each}


{#if teamsSelected}
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