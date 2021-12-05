import { getAllGames, getGame, getGameMechanics, getGameCategories, getCategories, getMechanics } from '../../sql/sql';

export async function get(request) {
	const id = request.query.get("id");
	const type = request.query.get('type');
	if (id != null) {
		return await getGame(id);
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
