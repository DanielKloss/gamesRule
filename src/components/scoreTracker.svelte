<script>
  import { slide } from 'svelte/transition';

    export let name;
    export let score;
    export let colour;
    export let titleVisible;
    export let minScore;
    export let maxScore;
  </script>
  
<h1 class="playerName" transition:slide class:hidden={!titleVisible}>{name}</h1>
<div class="container" transition:slide>
  <button class="button" class:disabled={minScore == score} style="background-color: {colour}" on:click={()=>{ if(score > minScore) {score--}}}>-</button>
  <p class="score">{score}</p>
  <button class="button" class:disabled={maxScore == score} style="background-color: {colour}" on:click={()=>{if(score < maxScore) {score++}}}>+</button>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .score {
    padding: 0 1rem;
    margin: 1rem 0;
    font-size: 1.5rem;
  }

  .button {
    padding: 0 1rem;
    border: none;
    font-size: 1.5rem;
    font-weight: bold;
    transform: skewX(-10deg);
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .button:hover {
    opacity: 1;
  }

  .playerName {
    font-size: 1.5rem;
    width: 50%;
    margin: 2rem auto 1rem auto;
    text-align: center;
  }

  .disabled{
    visibility: hidden;
  }
</style>
  