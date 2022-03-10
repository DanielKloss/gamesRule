<script>
    import { createEventDispatcher } from "svelte";
    import {filters} from '$lib/stores/filters.js';
    import IoIosArrowBack from 'svelte-icons/io/IoIosArrowBack.svelte'
    import IoIosArrowForward from 'svelte-icons/io/IoIosArrowForward.svelte'
    import IoIosClose from 'svelte-icons/io/IoIosClose.svelte'
    const dispatch = createEventDispatcher();

    export let categories;
    export let mechanics;

    let tempFiltersPlayTime;
    let tempFiltersPlayers;
</script>

<div class="filtersContainer">
    <div class="filterContainer searchContainer">
        <input class="searchBox" placeholder="search" bind:value="{$filters.searchTerm}" on:input="{() => dispatch('filtersChanged')}"/>
        <div class="icon" class:disabled="{$filters.searchTerm == ""}" on:click="{() => {$filters.searchTerm = ""; dispatch('filtersChanged')}}"><IoIosClose></IoIosClose></div>
    </div>

    <div class="filterContainer">
        <p class="filterTitle">Play Time</p>
        <div class="sliderContainer">
            <button class="iconButton" class:disabled="{$filters.playTime == 5}" on:click="{() => {if($filters.playTime > 5){$filters.playTime-=5; dispatch('filtersChanged')}}}"><IoIosArrowBack></IoIosArrowBack></button>
            <input type="number" class="textInput" bind:value={$filters.playTime} on:click="{() => {tempFiltersPlayTime = $filters.playTime; $filters.playTime = ""}}" on:blur="{() => {if($filters.playTime == ""){$filters.playTime = tempFiltersPlayTime}}}" on:change="{dispatch('filtersChanged')}"/>
            <button class="iconButton" class:disabled="{$filters.playTime == $filters.maxPlayTime}" on:click="{() => {if($filters.playTime < $filters.maxPlayTime){$filters.playTime+=5; dispatch('filtersChanged')}}}"><IoIosArrowForward></IoIosArrowForward></button>
        </div>
    </div>

    <div class="filterContainer">
        <p class="filterTitle">Players</p>
        <div class="sliderContainer">
            <button class="iconButton" class:disabled="{$filters.players == 1}" on:click="{() => {if($filters.players > 1){$filters.players--; dispatch('filtersChanged')}}}"><IoIosArrowBack></IoIosArrowBack></button>
            <input type="number" class="textInput" bind:value={$filters.players} on:click="{() => {tempFiltersPlayers = $filters.players; $filters.players = ""}}" on:blur="{() => {if($filters.players == ""){$filters.players = tempFiltersPlayers}}}" on:change="{dispatch('filtersChanged')}"/>
            <button class="iconButton" class:disabled="{$filters.players == $filters.maxPlayers}" on:click="{() => {if($filters.players < $filters.maxPlayers){$filters.players++; dispatch('filtersChanged')}}}"><IoIosArrowForward></IoIosArrowForward></button>
        </div>
    </div>

    <div class="filterContainer">
        <p class="filterTitle">Types</p>
        <div class="checkboxContainer">
            {#each categories as category}
                <div class:hidden="{category.disabled == true}"> 
                    <label class="checkboxLabel"><input type="checkbox" bind:group="{$filters.categories}" name="categories" value="{category.categoryName}" on:change="{() => dispatch('filtersChanged')}"/>{category.categoryName}</label>
                </div>
            {/each}
        </div>
    </div>

    <div class="filterContainer">
        <p class="filterTitle">Mechanics</p>
        <div class="checkboxContainer">
            {#each mechanics as mechanic}
                <div class:hidden="{mechanic.disabled == true}"> 
                    <label class="checkboxLabel"><input type="checkbox" bind:group="{$filters.mechanics}" name="mechanics" value="{mechanic.mechanicName}" on:change="{() => dispatch('filtersChanged')}"/>{mechanic.mechanicName}</label>
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

    .searchContainer {
        display: flex;
        align-items: center;
    }

    .searchBox {
        border: none;
        font-size: var(--large);
        width: 8rem;
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

    .icon {
        width: var(--extraLarge);
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

    .hidden {
        display: none;
    }
</style>