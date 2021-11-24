<script>
    export let hide;
    export let players;
</script>

<div class="sectionTitle" on:click={() => {hide = !hide}}>{#if hide}<h3>∨</h3>{:else}<h3>∧</h3>{/if}<h3>Players</h3></div>
{#if !hide}
    <div class="players">
    {#each players as player}
        <div class="player" style="--selectedColour: {player.colour}" on:click={() => {player.selected = !player.selected}} class:playerSelected={player.selected === true}>
            <div class="dot"></div>
            <p>{player.name}</p>
        </div>
    {/each}
    </div>
{/if}

<style>
    h3, p{
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

    .players {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin: 0 auto;
        width: 50%;
        gap: 0.25rem;
    }

    .player{
        padding: 0.25rem 0.1rem;
        cursor: pointer;
        opacity: 0.4;
        transition: opacity 0.2s;
    }

    .player:hover{
        opacity: 0.7;
    }

    .dot {
        height: 25px;
        width: 25px;
        background-color: #bbb;
        border-radius: 50%;
        display: block;
        margin: 0 auto;
    }

    .playerSelected {
        opacity: 1;
    }

    .playerSelected > div {
        background-color: var(--selectedColour);
    }
</style>