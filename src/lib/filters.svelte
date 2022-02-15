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

<div class="filtersContainer">
    <div class="filterContainer">
        <p class="filterTitle">Play Time</p>
        <div class="sliderContainer">
            <RangeSlider range float pips step={5} bind:values={filters.playTime} min={0} max={maxPlayTime} first='label' last='label' on:change="{dispatch('filtersChanged', filters)}"/>
        </div>
    </div>

    <div class="filterContainer">
        <p class="filterTitle">Players</p>
        <div class="sliderContainer">
            <RangeSlider range float pips step={1} bind:values={filters.players} min={1} max={maxPlayers} first='label' last='label' on:change="{dispatch('filtersChanged', filters)}"/>
        </div>
    </div>

    <div class="filterContainer">
        <p class="filterTitle">Types</p>
        <div class="checkboxContainer">
            {#each categories as cateogry}
                <div> 
                    <input type="checkbox" on:change="{AddRemoveType(cateogry)}"/>
                    <p class="checkboxLabel">{cateogry.categoryName}</p>
                </div>
            {/each}
        </div>
    </div>

    <div class="filterContainer">
        <p class="filterTitle">Mechanics</p>
        <div class="checkboxContainer">
            {#each mechanics as mechanic}
                <div>
                    <input type="checkbox" on:change="{AddRemoveMechanic(mechanic)}"/>
                    <p class="checkboxLabel">{mechanic.mechanicName}</p>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .filtersContainer {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .filterContainer{
        border-radius: var(--radiusLarge);
		padding: 1rem;
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }

    .filterTitle {
		font-size: var(--large);
        font-weight: bold;
        margin: 0 0 0.5rem 0.5rem;
    }

    .checkboxLabel {
        display: inline;
    }

    .checkboxContainer {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        margin-top: 1rem;
    }

    .sliderContainer {
        display: flex;
        flex-direction: column;
        align-self: stretch;
    }
</style>