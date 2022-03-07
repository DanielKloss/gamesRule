<script>
    import { createEventDispatcher } from "svelte";
    import IoIosArrowBack from 'svelte-icons/io/IoIosArrowBack.svelte'
    import IoIosArrowForward from 'svelte-icons/io/IoIosArrowForward.svelte'
    const dispatch = createEventDispatcher();

    export let categories;
    export let mechanics;

    export let maxPlayTime;
    export let maxPlayers;

    let filters = {
        playTime: maxPlayTime,
        players: maxPlayers,
        categories: [],
        mechanics: [],
        searchTerm: ""
    }

    let tempFiltersPlayTime;
    let tempFiltersPlayers;

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
    <input class="searchBox" placeholder="search" bind:value="{filters.searchTerm}" on:input="{() => dispatch('filtersChanged', filters)}"/>

    <div class="filterContainer">
        <p class="filterTitle">Play Time</p>
        <div class="sliderContainer">
            <button class="iconButton" class:disabled="{filters.playTime == 5}" on:click="{() => {if(filters.playTime > 5){filters.playTime-=5; dispatch('filtersChanged', filters)}}}"><IoIosArrowBack></IoIosArrowBack></button>
            <input type="number" class="textInput" bind:value={filters.playTime} on:click="{() => {tempFiltersPlayTime = filters.playTime; filters.playTime = ""}}" on:blur="{() => {if(filters.playTime == ""){filters.playTime = tempFiltersPlayTime}}}" on:change="{dispatch('filtersChanged', filters)}"/>
            <button class="iconButton" class:disabled="{filters.playTime == maxPlayTime}" on:click="{() => {if(filters.playTime < maxPlayTime){filters.playTime+=5; dispatch('filtersChanged', filters)}}}"><IoIosArrowForward></IoIosArrowForward></button>
        </div>
    </div>

    <div class="filterContainer">
        <p class="filterTitle">Players</p>
        <div class="sliderContainer">
            <button class="iconButton" class:disabled="{filters.players == 1}" on:click="{() => {if(filters.players > 1){filters.players--; dispatch('filtersChanged', filters)}}}"><IoIosArrowBack></IoIosArrowBack></button>
            <input type="number" class="textInput" bind:value={filters.players} on:click="{() => {tempFiltersPlayers = filters.players; filters.players = ""}}" on:blur="{() => {if(filters.players == ""){filters.players = tempFiltersPlayers}}}" on:change="{dispatch('filtersChanged', filters)}"/>
            <button class="iconButton" class:disabled="{filters.players == maxPlayers}" on:click="{() => {if(filters.players < maxPlayers){filters.players++; dispatch('filtersChanged', filters)}}}"><IoIosArrowForward></IoIosArrowForward></button>
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

    .searchBox {
        border-radius: var(--radiusLarge);
		padding: 1rem;
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border: none;
        font-size: var(--large);
        width: 12.5rem;
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
        justify-content: center;
        align-items: stretch;
        gap: 1rem;
    }

    .textInput {
        width: 3rem;
        text-align: center;
        border: none;
    }

    .iconButton {
        width: var(--extraLarge);
        padding: 0.5rem;
        border: none;
        border-radius: var(--radiusSmall);
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }

    .disabled {
        visibility: hidden;
    }
</style>