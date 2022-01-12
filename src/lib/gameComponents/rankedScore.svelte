<script>
  import {fade} from 'svelte/transition';
  import ScoreTracker from "$lib/scoreComponents/scoreTracker.svelte";
  import PlayerSelector from "$lib/selectorComponents/playerSelector.svelte";

  export let game;
  export let players;

  let hidePlayers = false;
  $: numberOfPlayerSelected = players.filter(p => p.selected).length;

  async function submitScores(){
    let scores = [];
    for (const player of players){
        if (player.selected){
            if (scores.includes(player.score)){
                //error message
                return;
            } else if (player.score == 0) {
                //error message
                return;
            } else {
                scores.push(player.score);
            }
        }
    }

    let session = { date: new Date().toJSON().slice(0, 10).toString(), gameId: game.gameId};
    const resultSession = await fetch(`/api/sessions`, {method: 'POST', body: JSON.stringify(session), headers: {'Content-Type': 'application/json'}});
    const dataSession = await resultSession.json();

    if (resultSession.status != 200 ) {
      console.log(500, "something wrong with the database");
      return;
    }

    for (const player of players) {
      if(player.selected){
        let playerSession = { gameSessionId: dataSession.gameSessionId.insertId, playerId: player.playerId, score: player.score};
        const resultPlayerSession = await fetch(`/api/playerSessions`, {method: 'POST', body: JSON.stringify(playerSession), headers: {'Content-Type': 'application/json'}});

        if (resultPlayerSession.status != 200 ) {
          console.log(500, "something wrong with the database");
          return;
        }

        player.selected = false;
      }
    }
    players = players;
    location.reload();
  }
</script>

<div class="container">
  <div class="menus">
    <PlayerSelector bind:hide={hidePlayers} bind:players={players}/>
  </div>

  <div class="scores">
      <div class="sliders">
        {#each players as player}
          {#if player.selected}
            <ScoreTracker name={player.playerName} bind:score={player.score} colour={player.colour} minScore=0 maxScore={numberOfPlayerSelected} titleVisible=true/>
          {/if}
        {/each}

        {#if numberOfPlayerSelected > game.minPlayers}
          <button transition:fade class="submitButton" on:click="{() => {submitScores()}}">SUBMIT</button>
        {/if}
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
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
      justify-content: center;
      margin: 0 auto;
      width: 75%;
    }

    .scores {
      flex-basis: 50%;
    }

    .menus {
      flex-basis: 50%;
    }

    .sliders {
      margin: 0;
      width: 100%;
    }
  }
</style>