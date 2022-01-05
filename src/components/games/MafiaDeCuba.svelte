<script>
  import {fade} from 'svelte/transition';
  import ScoreTracker from "../../components/scoreTracker.svelte";
  import PlayerSelector from "../../components/playerSelector.svelte";

  export let players;
  
  for (const player of players) {
    player.score = 0;
  }

  let hidePlayers = false;
  $: playersSelected = players.filter(p => p.selected).length > 1;

  async function submitScores(){
    let session = { date: new Date().toJSON().slice(0, 10).toString(), gameId: 15};
    const resultSession = await fetch(`/api/sessions`, {method: 'POST', body: JSON.stringify(session), headers: {'Content-Type': 'application/json'}});
    const dataSession = await resultSession.json();

    if (resultSession.status != 200 ) {
      console.log(500, "something wrong with the database");
      return;
    }

    for (const player of players) {
      if(player.selected){
        let playerSession = { gameSessionId: dataSession.gameSessionId.insertId, playerId: player.id, score: player.score};
        const resultPlayerSession = await fetch(`/api/playerSessions`, {method: 'POST', body: JSON.stringify(playerSession), headers: {'Content-Type': 'application/json'}});

        if (resultPlayerSession.status != 200 ) {
          console.log(500, "something wrong with the database");
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
  </div>

  <div class="scores">
      <div class="sliders">
        {#each players as player}
          {#if player.selected}
            <ScoreTracker name={player.name} bind:score={player.score} colour={player.colour} minScore=0 maxScore=100 titleVisible=true/>
          {/if}
        {/each}

        {#if playersSelected}
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