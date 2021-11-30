import { getAllGames, getGame, getGameMechanics, getGameTypes, getTypes, getMechanics } from '../../sql/sql';

export async function get(request) {
	const id = request.query.get("id");
	const type = request.query.get('type');
	if (id != null) {
		return await getGame(id);
	} else if (type == "types") {
		return await getTypes();
	} else if (type == "mechanics") {
		return await getMechanics();
	}
	else {
		let games = await getAllGames();

		for (const game of games.body.games) {
			let gameTypes = await getGameTypes(game.id);
			game.gameTypes = gameTypes.body;
			let gameMechanics = await getGameMechanics(game.id);
			game.gameMechanics = gameMechanics.body;
		}

		return games;
	}
}
