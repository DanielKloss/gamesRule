<script>
    export let players;
    export let teams;

    export let hide;

    function changeTeam(player){
        let teamPosition = teams.indexOf(player.team);
        if (teamPosition == teams.length-1){
            player.team = teams[0];
        } else {
            player.team = teams[++teamPosition];
        }
        players = players;
    }
</script>

<div class="sectionTitle" on:click={() => {hide = !hide}}>{#if hide}<h3>∨</h3>{:else}<h3>∧</h3>{/if}<h3>Players</h3></div>
{#if !hide}
    <div class="container">
        {#each players as player}
            <div class="player" on:click="{() => changeTeam(player)}">
                <div class="dot" style="--team: {player.team.colour}"></div>
                <p class="name">{player.name}</p>
            </div>
        {/each}
    </div>
{/if}

<style>
    p, h3 {
        margin: 0;
    }

    .sectionTitle {
        margin: 1rem auto 0.5rem auto;
        width: 50%;
        display: flex;
        gap: 0.5rem;
        cursor: pointer;
        background: var(--primary);
        transform: skewX(-10deg);
        padding: 0.25rem 0.5rem;
    }

    .player {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1rem auto;
        width: 50%;
    }
    .dot {
        height: 25px;
        width: 25px;
        background-color: var(--team);
        border-radius: 50%;
        flex: 0 0 25px;
    }

    .name {
        flex: 1;
        margin-left: 1rem;
    }
</style>