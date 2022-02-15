<script>
    export let players;
    export let maxPlayers;
    export let teams;

    $: maxPlayersReached = players.filter(p => p.team.gameTeamName != "None").length == maxPlayers;

    function changeTeam(player){
        if (!maxPlayersReached || player.gameTeamName != "None"){
            let teamPosition = teams.indexOf(player.team);
            if (teamPosition == teams.length-1){
                player.team = teams[0];
            } else {
                player.team = teams[++teamPosition];
            }
            players = [...players];
        }
        console.log(players.filter(p => p.team.gameTeamName != "None").length, maxPlayers, maxPlayersReached);
    }
</script>

<div class="container">
    <div class="sectionTitle">Players</div>
    <div class="playersContainer">
    {#each players as player}
        <div class="player" style="background-color: {player.team.gameTeamColour}" class:playersDisabled={player.team.gameTeamName == "None" && maxPlayersReached}
            on:click="{() => changeTeam(player)}">
            {player.playerName}
        </div>
    {/each}
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .sectionTitle {
        padding: 1rem;
        background: var(--primary);
        border-radius: var(--radiusLarge);
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        font-size: var(--extraLarge);
    }

    .playersContainer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
		gap: 1rem;
		font-size: var(--medium);
    }

    .player{
        font-size: medium;
        background-color: #F3F5F8;
        border-radius: var(--radiusSmall);
        padding: 1rem;
        margin: 0;
        text-transform: uppercase;
        font-weight: bold;
    }

    .playersDisabled {
        opacity: 0.5;
    }
</style>