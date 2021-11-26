<script>
    import iro from '@jaames/iro';
    import { onMount } from 'svelte';

    export let playerName;
    let lastCreated;
    let colourPicker;

    onMount(async () => {
		colourPicker = new iro.ColorPicker('picker', {
            width: 200,
            borderWidth: 3,
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

        lastCreated = playerName;
        playerName = "";
        colourPicker.color.set("#ffffff");
    }
</script>

<div class="modal-content">
    <div class="firstRow">
        <input type="text" bind:value="{playerName}" placeholder="Player Name">
        <button on:click="{createPlayer}">Create</button>
    </div>
    <picker></picker>
    {#if lastCreated}
        <p class="creationMessage">{lastCreated} was created</p>
    {/if}
</div>


<style>
    .modal-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .firstRow {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
    }

    input{
        border: solid 0.2rem;
        font-size: 1.2rem;
        padding: 0.3rem;
        width: 50%;
    }
    
    button {
        padding: 0.5rem;
        border: 0.2rem solid black;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
    }

    .creationMessage{
        border-bottom: 0.1rem solid black;
        padding: 0.5rem;
    }
</style>