<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let types;
    export let mechanics;

    export let maxPlayTime;
    export let maxPlayers;

    let filters = {
        isOn: false,
        timeIsOn: false,
        playersIsOn: false,
        playTime: maxPlayTime,
        players: maxPlayers,
        types: [],
        mechanics: []
    }

    function AddRemoveType(type){
        if (filters.types.includes(type)){
            let index = filters.types.indexOf(type);
            filters.types.splice(index, 1);
        } else {
            filters.types.push(type);
        }
        dispatch('filtersChanged', filters);
    }

    function AddRemoveMechanic(mechanic){
        if (filters.mechanics.includes(mechanic)){
            let index = filters.mechanics.indexOf(mechanic);
            filters.mechanics.splice(index, 1);
        } else {
            filters.mechanics.push(mechanic);
        }
        dispatch('filtersChanged', filters);
    }
</script>

<div class="modal-content">
    <div class="checkboxContainer">
        <div>
            <input type="checkbox" bind:checked="{filters.isOn}" on:change="{dispatch('filtersChanged', filters)}"/>
            <p class="checkboxLabel">Apply Filters</p>
        </div>
    </div>

    <div class="checkboxContainer">
        <div>
            <input type="checkbox" bind:checked="{filters.timeIsOn}" on:change="{dispatch('filtersChanged', filters)}"/>
            <p class="checkboxLabel">Play Time</p>
        </div>
    </div>
    <div class="sliderContainer">
        <input type="range" min="0" step="5" max={maxPlayTime} bind:value={filters.playTime} on:change="{dispatch('filtersChanged', filters)}">
        <p>{filters.playTime}</p>
    </div>
    
    <div class="checkboxContainer">
        <div>
            <input type="checkbox" bind:checked="{filters.playersIsOn}" on:change="{dispatch('filtersChanged', filters)}"/>
            <p class="checkboxLabel">Number of Players</p>
        </div>
    </div>
    <div class="sliderContainer">
        <input type="range" min="1" max={maxPlayers} bind:value={filters.players} on:change="{dispatch('filtersChanged', filters)}">
        <p>{filters.players}</p>
    </div>

    <h2>Types</h2>
    <div class="checkboxContainer">
        {#each types as type}
            <div> 
                <input type="checkbox" on:change="{AddRemoveType(type)}"/>
                <p class="checkboxLabel">{type.name}</p>
            </div>
        {/each}
    </div>
    <h2>Mechanics</h2>
    <div class="checkboxContainer">
        {#each mechanics as mechanic}
            <div>
                <input type="checkbox" on:change="{AddRemoveMechanic(mechanic)}"/>
                <p class="checkboxLabel">{mechanic.name}</p>
            </div>
        {/each}
    </div>
</div>

<style>
    .modal-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 0 auto;
    }

    .checkboxLabel {
        display: inline;
    }

    .checkboxContainer {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .sliderContainer {
        display: flex;
        gap: 1rem;
    }
</style>