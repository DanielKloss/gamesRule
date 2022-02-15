<script>
    export let players;
    export let maxPlayers;

    $: maxPlayersReached = players.filter(p => p.selected).length == maxPlayers;

    function togglePlayer(player){
        if (player.selected){
            player.selected = !player.selected;
        } else if (!maxPlayersReached){
            player.selected = !player.selected;
        }
        players = [...players];
    }
</script>

<div class="container">
    <div class="sectionTitle">Players</div>
    <div class="playersContainer">
        {#each players as player}
            <div class="player" style="--selectedColour: {player.colour}" on:click={() => togglePlayer(player)}
                class:playerSelected={player.selected == true} class:playersDisabled={!player.selected && maxPlayersReached}>
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

    .playerSelected {
        opacity: 1;
        background-color: var(--selectedColour);
    }

    .playersDisabled {
        opacity: 0.5;
    }
</style>