<script>
  export let stats;
  export let players;
</script>

<div class="container">
    <div class="statsContainer">
        <div class="statContainer"><span class="statTitle">Number of Games: </span><span class="stat">{stats.numberOfGames}</span></div>

        <div class="statContainer"><span class="statTitle">Best Score: </span><span class="stat">{stats.bestScore} </span>({#each stats.bestScores as score}<span class="statInfo">{score.player.playerName}</span>{/each})</div>

        <div class="statContainer"><span class="statTitle">Worst Score: </span><span class="stat">{stats.worstScore} </span>({#each stats.worstScores as score}<span class="statInfo">{score.player.playerName}</span>{/each})</div>

        <div class="statContainer"><span class="statTitle">Most Wins: </span><span class="stat">{stats.mostWin} </span>({#each stats.mostWins as player}<span class="statInfo">{player.playerName}</span>{/each})</div>

        <div class="statContainer"><span class="statTitle">Most Loses: </span><span class="stat">{stats.mostLose} </span>({#each stats.mostLosses as player}<span class="statInfo">{player.playerName}</span>{/each})</div>
    </div>
    <div class="playersContainer">
        <div class="tableTitle">
            <p>Name</p>
            <p>Played</p>
            <p>Won</p>
            <p>Lost</p>
            <p>Win %</p>
            <p>Average</p>
        </div>
        {#each players as player}
        <div class="player">
            <p>{player.playerName}</p>
            <p class="tableStat">{player.games}</p>
            <p class="tableStat">{player.wins}</p>
            <p class="tableStat">{player.losses}</p>
            <p class="tableStat">{player.winPercentage}%</p>
            <p class="tableStat">{player.averageScore}</p>
        </div>
        {/each}
    </div>
</div>

<style>
    .container {
        display: flex;
		flex-direction: column;
		gap: 2rem;
		font-size: var(--medium);
		border-radius: var(--radiusLarge);
		padding: 2rem;
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }

    .statsContainer {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }

    .statContainer {
        background: var(--primary);
        border-radius: var(--radiusLarge);
		padding: 1rem;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }

    .statInfo {
        font-style: italic;
    }

    .statInfo:not(:last-child)::after{
        content: ", ";
    }

    .stat {
        font-weight: bold;
    }

    .tableTitle {
        display: grid;
		grid-template-columns: repeat(6, 1fr);
		justify-items: center;
		align-items: stretch;
		font-size: 0.7rem;
		border-radius: var(--radiusLarge);
		margin-bottom: 0.5rem;
        background-color: var(--primary);
        font-size: var(--medium);
    }

    .player {
        display: grid;
		grid-template-columns: repeat(6, 1fr);
		justify-items: center;
		align-items: stretch;
		font-size: 0.7rem;
		border-radius: var(--radiusLarge);
		margin-bottom: 0.5rem;
        font-size: var(--medium);
    }

</style>
