<script>
  import ScoreTracker from "$lib/scoreComponents/scoreTracker.svelte";
  import PlayerSelector from "$lib/selectorComponents/playerSelector.svelte";

  export let game;
  export let players;

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
    <PlayerSelector bind:players={players} maxPlayers={game.maxPlayers}/>
  </div>
</div>
  <div class="scoreContainer">
    {#each players as player}
      {#if player.selected}
        <ScoreTracker name={player.playerName} bind:score={player.score} colour={player.colour} startScore=0 minScore=0 maxScore={numberOfPlayerSelected} bigScores={false}/>
      {/if}
    {/each}
  </div>
  {#if numberOfPlayerSelected >= game.minPlayers}
    <button class="submitButton" on:click="{() => {submitScores()}}">SUBMIT</button>
  {/if}

<style>
  .container {
    display: flex;
		flex-direction: column;
		gap: 1rem;
		font-size: var(--medium);
		border-radius: var(--radiusLarge);
		padding: 2rem;
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    margin-bottom: 1rem;
  }

  .scoreContainer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
  }

  .submitButton {
      padding: 0.5rem;
      border: none;
      background-color: var(--primary);
      border-radius: var(--radiusSmall);
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      font-size: var(--large);
      font-weight: bold;
      text-transform: uppercase;
  }
</style>