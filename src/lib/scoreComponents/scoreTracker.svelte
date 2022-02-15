<script>
  export let name;
  export let score;
  export let startScore;
  export let colour;
  export let minScore;
  export let maxScore;
  let scoreToAdd = null;
  let editScore = false;
  score = startScore;

  function addScore(){ 
    score += Number(scoreToAdd);
    editScore = false;
    scoreToAdd = null;
	};

  function minusScore(){ 
    score -= Number(scoreToAdd);
    editScore = false;
    scoreToAdd = null;
	};
  </script>
  
<div class="container">
  <p class="playerName">{name}</p>
  <div class="scoreContainer">
    {#if editScore}
      <button class="button" on:click={()=>{minusScore()}}>-</button>
      <!-- svelte-ignore a11y-autofocus -->
      <input class="scoreInput" type=number bind:value={scoreToAdd} autofocus/>
      <button class="button" on:click={()=>{addScore()}}>+</button>
    {:else}
      <button class="button" class:disabled={minScore == score} style="background-color: {colour}" on:click={()=>{if(score > minScore) {score--}}}>-</button>
      <p class="score" on:click={() => {editScore=true}}>{score}</p>
      <button class="button" class:disabled={maxScore == score} style="background-color: {colour}" on:click={()=>{if(score < maxScore) {score++}}}>+</button>
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    border-radius: var(--radiusLarge);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		padding: 1rem;
  }

  .scoreContainer {
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 100%;
  }

  .score {
    font-size: var(--large);
    text-align: center;
    margin: 0;
  }

  .button {
    padding: 0.5rem;
    border: none;
    border-radius: var(--radiusSmall);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    font-size: var(--large);
    width: calc(var(--large)*2);
    font-weight: bold;
    text-transform: uppercase;
  }

  .playerName {
    font-size: var(--large);
    text-align: center;
    margin: 0;
  }

  .disabled{
    visibility: hidden;
  }

  .scoreInput {
    width: calc(var(--large)*3);
    height: 100%;
    border-radius: var(--radiusSmall);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border: none;
    font-size: var(--large);
    padding: 0.5rem;
  }
</style>
  