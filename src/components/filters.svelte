<script>
    import { createEventDispatcher } from "svelte";
    import RangeSlider from "svelte-range-slider-pips";
    const dispatch = createEventDispatcher();

    export let types;
    export let mechanics;

    export let maxPlayTime;
    export let maxPlayers;

    let filters = {
        playTime: [0, maxPlayTime],
        players: [1, maxPlayers],
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
    <h2>Play Time</h2>
    <div class="sliderContainer">
        <RangeSlider range float pips step={5} bind:values={filters.playTime} min={0} max={maxPlayTime} first='label' last='label' on:change="{dispatch('filtersChanged', filters)}"/>
    </div>

    <h2>Players</h2>
    <div class="sliderContainer">
        <RangeSlider range float pips step={1} bind:values={filters.players} min={1} max={maxPlayers} first='label' last='label' on:change="{dispatch('filtersChanged', filters)}"/>
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
        flex-direction: column;
        align-self: stretch;
    }
</style>