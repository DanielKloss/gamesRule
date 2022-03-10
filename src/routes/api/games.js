import { getAllGames, getGame, getGameMechanics, getGameCategories, getCategories, getMechanics, getGameTeams, getGameCoopScores } from '../../sql/sql';

function removeArticles(game) {
	let words = game.split(' ');
	if (words.length <= 1) return game;
	if (words[0] == 'A' || words[0] == 'THE' || words[0] == 'AN') return words.splice(1).join(' ');
	return game;
}

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

		for (const game of games.body.games) {
			game.features = [];

			for (const category of game.gameCategories.gameCategories) {
				game.features.push(category.categoryName);
			}

			for (const category of game.gameMechanics.gameMechanics) {
				game.features.push(category.mechanicName);
			}
		}

		games.body.games = games.body.games.sort(function (a, b) {
			var gameA = a.gameName.toUpperCase();
			var gameB = b.gameName.toUpperCase();
			gameA = removeArticles(gameA);
			gameB = removeArticles(gameB);
			return gameA < gameB ? -1 : gameA > gameB ? 1 : 0;
		});

		return games;
	}
}
