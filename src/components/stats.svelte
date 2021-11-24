<script>
  export let stats;
  export let players;
</script>

<div class="container">
    <div class="statContainer"><span class="statTitle">Number of Games: </span><span class="stat">{stats.numberOfGames}</span></div>

    <div class="statContainer"><span class="statTitle">Best Score: </span><span class="stat">{stats.bestScore} </span>({#each stats.bestScores as score}<span class="statInfo">{score.player.name}</span>{/each})</div>

    <div class="statContainer"><span class="statTitle">Worst Score: </span><span class="stat">{stats.worstScore} </span>({#each stats.worstScores as score}<span class="statInfo">{score.player.name}</span>{/each})</div>

    <div class="statContainer"><span class="statTitle">Most Wins: </span><span class="stat">{stats.mostWin} </span>({#each stats.mostWins as player}<span class="statInfo">{player.name}</span>{/each})</div>

    <div class="statContainer"><span class="statTitle">Most Loses: </span><span class="stat">{stats.mostLose} </span>({#each stats.mostLosses as player}<span class="statInfo">{player.name}</span>{/each})</div>
</div>

<div class="playersContainer">
    <h2 class="playersTitle">Players</h2>
    <p class="player"></p>
    <p class="tableStat played"></p>
    <p class="tableStat won"></p>
    <p class="tableStat lost"></p>
    <p class="tableStat winP"></p>
    <p class="tableStat average"></p>
    {#each players as player}
        <p>{player.name}</p>
        <p class="tableStat">{player.games}</p>
        <p class="tableStat">{player.wins}</p>
        <p class="tableStat">{player.losses}</p>
        <p class="tableStat">{player.winPercentage}%</p>
        <p class="tableStat">{player.averageScore}</p>
    {/each}
</div>

<style>
    .container {
        margin: 0 auto;
        width: 50%;
        max-width: 600px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 2rem;
    }

    .statContainer {
        background: var(--primary);
		padding: 0.5rem 1rem;
		transform: skewX(-10deg); 
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

    .playersContainer{
        display: grid;
        grid-template-columns: repeat(6, 1fr);

        margin: 2rem auto;
        width: 50%;
        /* gap: 1rem; */
    }

    .playersContainer>p:nth-child(2),
    .playersContainer>p:nth-child(3),
    .playersContainer>p:nth-child(4),
    .playersContainer>p:nth-child(5),
    .playersContainer>p:nth-child(6),
    .playersContainer>p:nth-child(7) {
        background: var(--primary);
        padding: 0.5rem 0rem 0.5rem 1rem;
		transform: skewX(-10deg);
    }

    .player:before{
        content: "Player";
    }

    .played:before{
        content: "Played";
    }

    .won:before{
        content: "Won";
    }

    .lost:before{
        content: "Lost";
    }

    .winP:before{
        content: "Win %";
    }

    .average:before{
        content: "Average";
    }

    .playersTitle{
        grid-column: 1/ span 6;
        margin: 0;
    }

    .tableStat{
        text-align: right;
    }

    @media only screen and (max-width: 500px) {
        .playersContainer{
            width: 100%;
            padding: 0 2rem;
        }
    }

    @media only screen and (max-width: 450px) {
        .playersContainer{
            width: 100%;
            padding: 0 2rem;
        }

        .player:before{
            content: "Name";
        }

        .played:before{
            content: "P";
        }

        .won:before{
            content: "W";
        }

        .lost:before{
            content: "L";
        }

        .winP:before{
            content: "%";
        }

        .average:before{
            content: "Av";
        }
    }
</style>
