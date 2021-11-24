<script>
  import Slider from "../imageScoreSlider.svelte";
  import ScoreTracker from "../scoreTracker.svelte";
  import PlayerSelector from "../playerSelector.svelte";
  import {fade} from 'svelte/transition';

  export let players;

  let hanabiColours = [
    { name: "red", score: 0, hexColour: "#D4001C" },
    { name: "blue", score: 0, hexColour: "#0084FE" },
    { name: "white", score: 0, hexColour: "#FBFAF0" },
    { name: "yellow", score: 0, hexColour: "#FFDB42" },
    { name: "green", score: 0, hexColour: "#009337" }
  ];
  let multiColouredUsed = false;
  let multiColouredAreWild = false;
  let livesUsed = 0;

  let hidePlayers = false;
  let hideOptions = true;

  $: playersSelected = players.filter(p => p.selected).length > 1;

  function multiColour(){
    console.log("remove");
    multiColouredUsed = !multiColouredUsed
    if(multiColouredUsed){
      hanabiColours.push({name: "multi coloured", score: 0, hexColour: "#303030"})
      hanabiColours = hanabiColours;
    } else {
      hanabiColours = hanabiColours.filter(c => c.name != "multi coloured");
      multiColouredAreWild = false;
    }
  }

  async function submitScores(){
    let coopWin = true;
    let totalScore = 0

    if(livesUsed >= 3){
      coopWin = false;
      totalScore = 0
    } else {
      for (const colour of hanabiColours) {
          totalScore += colour.score;
      }
    }

    let today = new Date(Date.now());
    const resultSession = await fetch(`/api/sessions`, {method: 'POST', body: JSON.stringify({date: today.getFullYear() + "-" + today.getMonth() + "-" + today.getDay(), gameId: 6, coopWin: coopWin}), headers: {'Content-Type': 'application/json'}});
    const dataSession = await resultSession.json();

    if (resultSession.status != 200 ) {
      console.log(200, "something wrong with the database");
      return;
    }

    for (const player of players) {
      if(player.selected){
        const resultPlayerSession = await fetch(`/api/playerSessions`, {method: 'POST', body: JSON.stringify({game: "hanabiGame", gameSessionId: dataSession.insertId, playerId: player.id, score: totalScore}), headers: {'Content-Type': 'application/json'}});

        if (resultPlayerSession.status != 200 ) {
          console.log(200, "something wrong with the database");
          return;
        }

        player.selected = false;
      }
    }
    players = players;
  }
</script>

<div class="container">
  <div class="menus">
    <PlayerSelector bind:hide={hidePlayers} bind:players={players}/>
    <div class="sectionTitle" on:click={() => {hideOptions = !hideOptions}}>{#if hideOptions}<h3>∨</h3>{:else}<h3>∧</h3>{/if}<h3>Options</h3></div>
    {#if !hideOptions}
      <div class="options">
          <p class="option" style="--selectedColour: #D4AF37" on:click={() => {multiColour()}} class:selected={multiColouredUsed}>Multicoloured</p>
          {#if multiColouredUsed}
            <p class="option" style="--selectedColour: #D4AF37" on:click={() => {multiColouredAreWild = !multiColouredAreWild}} class:selected={multiColouredAreWild}>Wild</p>
          {/if}
      </div>
    {/if}
  </div>

  <div class="scores">
    <div class="sliders">
      {#each hanabiColours as colourScore}
        <Slider name={colourScore.name} colour={colourScore.hexColour} bind:score={colourScore.score} minScore=0 maxScore=5 imageRoot="images/hanabi/{colourScore.name}/"/>
      {/each}
    </div>

    <div class="lives">
      <ScoreTracker name="Lives Lost" bind:score={livesUsed} minScore=0 maxScore=3 colour="#808080"/>
    </div>

    {#if playersSelected}
      <button transition:fade class="submitButton" on:click="{() => {submitScores()}}">SUBMIT</button>
    {/if}
  </div>
</div>

<style>
  h3, p{
    margin: 0;
  }

  .container {
    display: flex;
    flex-direction: column;
  }

  .sliders {
    display: flex;
    width: 75%;
    margin: 0 auto;
  }

  .option{
    padding: 0.25rem;
    cursor: pointer;
    transition: background 0.5s;
  }

  .option:hover{
    background: #D4AF37;
    transform: skewX(-10deg);
    opacity: 0.5;
  }

  .selected {
    background: #D4AF37;
    transform: skewX(-10deg);
  }

  .options {
    display: flex;
    justify-content: space-evenly;
    margin: 0 auto;
    width: 50%;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .sectionTitle {
    margin: 1rem auto 0.5rem auto;
    width: 50%;
    display: flex;
    gap: 0.5rem;
    cursor: pointer;
    background: var(--primary);
    transform: skewX(-10deg);
    padding: 0.25rem 0.5rem;
  }

  .submitButton {
    display: block;
    width:50%;
    max-width: 300px;
    margin: 2rem auto;
    border: 2px solid var(--primary);
    background: transparent;
    transform: skewX(-10deg);
    text-align: center;
    padding: 0.5rem 0.75rem;
    font-size: 1.5rem;
  }

  @media (min-width: 650px) {
    .container {
      flex-direction: row;
      margin: 0 auto;
      width: 75%;
    }

    .scores {
      flex-basis: 65%;
    }

    .menus {
      flex-basis: 35%;
    }

    .sliders {
      margin: 0;
      width: 100%;
    }
  }
</style>