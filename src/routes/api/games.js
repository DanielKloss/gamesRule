import { getAllGames, getGame, getGameMechanics, getGameTypes, getTypes, getMechanics } from '../../sql/sql';

export async function get(request) {
	const id = request.query.get("id");
	console.log(id);
	const type = request.query.get('type');
	console.log(type);
	if (id != null) {
		console.log("getting game")
		return await getGame(id);
	} else if (type == "types") {
		console.log("getting types");
		return await getTypes();
	} else if (type == "mechanics") {
		console.log('getting mechanics');
		return await getMechanics();
	}
	else {
		console.log('getting all games');

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
