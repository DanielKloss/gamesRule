<script>
    import iro from '@jaames/iro';
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let playerName;
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
        dispatch('createPlayer', player)
    }

    function closeModal(){
        dispatch('closeCreatePlayerModal');
    }
</script>

<div class="modal" on:click|stopPropagation|self="{closeModal}">
  <div class="modal-content">
    <div class="modalOptions playerOptions">
        <input type="text" bind:value="{playerName}" placeholder="Player Name">
        <picker></picker>
    </div>
    <div class="modalOptions">
        <button on:click="{createPlayer}">Create</button>
        <button on:click="{closeModal}">Cancel</button>
    </div>
  </div>
</div>


<style>
    .modal {
        position: fixed; 
        z-index: 1; 
        left: 0;
        top: 0;
        width: 100%; 
        height: 100%; 
        overflow: auto; 
        background-color: rgb(0,0,0); 
        background-color: rgba(0,0,0,0.4); 
    }

    .modal-content {
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        border-radius: 5px;
    }

    .modalOptions {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    input{
        transform: skewX(-10deg);
        border: solid 0.2rem;
        font-size: 1.5rem;
        padding: 0.3rem;
    }
    
    button {
        padding: 0.5rem;
        border: none;
        font-size: 1.5rem;
        font-weight: bold;
        transform: skewX(-10deg);
        cursor: pointer;
  }

  @media (max-width: 750px) {
    .playerOptions {
        flex-direction: column;
    }
  }
</style>