<script>
  import { slide } from 'svelte/transition';

  export let name;
  export let score;
  let startScore = score;
  export let colour;
  export let titleVisible;
  export let minScore;
  export let maxScore;
  let scoreToAdd = null;
  let editScore = false;

  function addScore(){ 
    score += Number(scoreToAdd);
    editScore = false;
    scoreToAdd = null;
	};
	
	const onEnter = e => {
    if (e.charCode === 13){
			addScore()
		};
  };
  </script>
  
<h1 class="playerName" transition:slide class:hidden={!titleVisible}>{name}</h1>
<div class="container" transition:slide>
  {#if editScore}
		<button class="button" on:click={()=>{editScore=false; scoreToAdd=null}}>Cancel</button>
		<input type=text bind:value={scoreToAdd} on:keypress={onEnter} autofocus/>
		<button class="button" on:click={()=>{addScore()}}>Add</button>
	{:else}
		<button class="button" class:disabled={startScore == score} on:click={() => {score = startScore}}>RESET</button>
		<button class="button" class:disabled={minScore == score} style="background-color: {colour}" on:click={()=>{ if(score > minScore) {score--}}}>-</button>
		<p class="score" on:click={() => {editScore=true}}>{score}</p>
		<button class="button" class:disabled={maxScore == score} style="background-color: {colour}" on:click={()=>{if(score < maxScore) {score++}}}>+</button>
	{/if}
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
  