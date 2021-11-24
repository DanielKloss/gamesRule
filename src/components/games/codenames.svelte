<script>
    import {fade} from 'svelte/transition';
    import TeamSelector from "../../components/teamSelector.svelte";
    import ScoreTracker from "../../components/scoreTracker.svelte";

    export let players;
    let hidePlayers = false;

    let teams = [
        {name: "None", colour: "#bbb"},
        {name: "Red Team", colour: "#F64639", score: 0},
        {name: "Blue Team", colour: "#1560A4", score: 0}
    ];

    for (const player of players) {
        player.score = 0;
        player.team = teams[0];
    }

    $: teamsSelected = players.find(p => p.team.name == "Red Team") != undefined && players.find(p => p.team.name == "Blue Team") != undefined;

    function submitScores(){

    }
</script>

<TeamSelector bind:players={players} {teams} bind:hide={hidePlayers}/>

{#each teams as team}
    {#if team.name != "None"}
        <ScoreTracker name={team.name} bind:score={team.score} colour={team.colour} minScore=0 maxScore=100 titleVisible=true/>
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