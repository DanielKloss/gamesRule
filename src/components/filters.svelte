<script>
    import { createEventDispatcher } from "svelte";
    import RangeSlider from "svelte-range-slider-pips";
    const dispatch = createEventDispatcher();

    export let categories;
    export let mechanics;

    export let maxPlayTime;
    export let maxPlayers;

    let filters = {
        playTime: [0, maxPlayTime],
        players: [1, maxPlayers],
        categories: [],
        mechanics: []
    }

    function AddRemoveType(category){
        if (filters.categories.includes(category)){
            let index = filters.categories.indexOf(category);
            filters.categories.splice(index, 1);
        } else {
            filters.categories.push(category);
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
        {#each categories as cateogry}
            <div> 
                <input type="checkbox" on:change="{AddRemoveType(cateogry)}"/>
                <p class="checkboxLabel">{cateogry.name}</p>
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