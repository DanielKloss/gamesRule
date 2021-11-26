import { getAllGames, getGame, getGameMechanics, getGameTypes } from '../../sql/sql';

export async function get(request) {
	const id = request.query.get("id");
	if (id == -1) {
		let games = await getAllGames();

		for (const game of games.body.games) {
			let gameTypes = await getGameTypes(game.id);
			game.gameTypes = gameTypes.body
			let gameMechanics = await getGameMechanics(game.id);
			game.gameMechanics = gameMechanics.body;
		}

		return games;
	} else {
		return await getGame(id);
	}
}
