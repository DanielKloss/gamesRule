import { getAllGames, getGame, getGameMechanics, getGameCategories, getCategories, getMechanics, getGameTeams, getGameCoopScores } from '../../sql/sql';

export async function get(request) {
	const id = request.url.searchParams.get("id");
	const type = request.url.searchParams.get('type');

	if (id != null) {
		let game = await getGame(id);
		let gameTeams = await getGameTeams(id);
		game.body.game.teams = gameTeams.body.gameTeam;
		let gameCoopScores = await getGameCoopScores(id);
		game.body.game.coopScores = gameCoopScores.body.gameCoopScore;
		return game;
	} else if (type == "categories") {
		return await getCategories();
	} else if (type == "mechanics") {
		return await getMechanics();
	}
	else {
		let games = await getAllGames();

		for (const game of games.body.games) {
			let gameCategories = await getGameCategories(game.gameId);
			game.gameCategories = gameCategories.body;
			let gameMechanics = await getGameMechanics(game.gameId);
			game.gameMechanics = gameMechanics.body;
		}

		return games;
	}
}
