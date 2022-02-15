<script>
    import iro from '@jaames/iro';
    import { onMount } from 'svelte';

    export let players;
    export let playerName;
    let colourPicker;

    onMount(async () => {
		colourPicker = new iro.ColorPicker('picker', {
            width: 200,
            borderWidth: 2.5,
            borderColor: "#000000",
            layout: [
                { 
                    component: iro.ui.Wheel,
                }
            ]
        });
	});

    async function createPlayer(){
        let player = { name: playerName, colour: colourPicker.color.hexString };
        let resultPlayer = await fetch(`/api/players`, {method: 'POST', body: JSON.stringify(player), headers: {'Content-Type': 'application/json'}});

		if (resultPlayer.status != 200) {
      		console.log(500, "something wrong with the database");
      		return;
    	}

        players = [...players, {playerName: playerName, colour: colourPicker.color.hexString}];
        playerName = "";
        colourPicker.color.set("#ffffff");
    }
</script>

<div class="creatorContainer">
    <picker></picker>
    <div class="otherInputs">
        <input type="text" bind:value="{playerName}" placeholder="Player Name">
        <button on:click="{() => createPlayer()}">Create</button>
    </div>
</div>
<div class="playersContainer">
    {#each players as player}
        <p class="player" style="--playerColour: {player.colour}">{player.playerName}</p>
    {/each}
</div>

<style>
    .creatorContainer {
        display: flex;
        align-items: center;
        justify-content: center;
		gap: 1rem;
		font-size: var(--medium);
		border-radius: var(--radiusLarge);
		padding: 2rem;
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        margin-bottom: 1rem;
    }

    .playersContainer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
		gap: 1rem;
		font-size: var(--medium);
		border-radius: var(--radiusLarge);
		padding: 2rem;
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        margin-bottom: 1rem;
    }

    .otherInputs {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input{
        border-radius: var(--radiusSmall);
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border: none;
        font-size: var(--large);
        padding: 0.5rem;
    }
    
    button {
        padding: 0.5rem;
        border: none;
        background-color: var(--primary);
        border-radius: var(--radiusSmall);
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        font-size: var(--large);
        font-weight: bold;
        text-transform: uppercase;
    }

    .player {
        font-size: medium;
        background-color: var(--playerColour);
        border-radius: var(--radiusSmall);
        padding: 1rem;
        margin: 0;
        text-transform: uppercase;
        font-weight: bold;
    }
</style>