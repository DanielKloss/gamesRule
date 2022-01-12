import { getAllGames, getGame, getGameMechanics, getGameCategories, getCategories, getMechanics, getGameTeams } from '../../sql/sql';

export async function get(request) {
	const id = request.query.get("id");
	const type = request.query.get('type');

	if (id != null) {
		let game = await getGame(id);
		let gameTeams = await getGameTeams(id);
		game.body.game.teams = gameTeams.body.gameTeam;
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
