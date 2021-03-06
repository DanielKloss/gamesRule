import mysql from "mysql2/promise.js";

async function getConnection() {
	return await mysql.createConnection({
		host: import.meta.env.VITE_DB_HOST,
		port: import.meta.env.VITE_DB_PORT,
		user: import.meta.env.VITE_DB_USER,
		password: import.meta.env.VITE_DB_PASSWORD,
		database: import.meta.env.VITE_DB_NAME
	});
}

export async function getAllGames() {
	const connection = await getConnection();
    const rows = await connection.query('SELECT gameId, gameName, gameTypeName, colour, startScore, minScore, maxScore, highScoreWins, oneLoser, minPlayers, maxPlayers, minPlayTime, maxPlayTime FROM games INNER JOIN gameTypes ON games.gameTypeId = gameTypes.gameTypeId');
	const games = rows[0];
	connection.end();
    return {
			body: {
                games
			}
		};
};

export async function getGame(id) {
	const connection = await getConnection();
    const rows = await connection.query(
			'SELECT gameId, gameName, gameTypeName, colour, startScore, minScore, maxScore, highScoreWins, oneLoser, minPlayers, maxPlayers, minPlayTime, maxPlayTime FROM games INNER JOIN gameTypes ON games.gameTypeId = gameTypes.gameTypeId WHERE games.gameId = ?;',
			[id]
		);
	const game = rows[0][0];
	connection.end();
    return {
        body: {
            game
        }
    };
}

export async function getGameTeams(id) {
	const connection = await getConnection();
	const rows = await connection.query(
		'SELECT gameTeamName, gameTeamColour FROM gameTeams WHERE gameId = ?;', [id]
	);
	const gameTeam = rows[0];
	connection.end();
	return {
		body: {
			gameTeam
		}
	}
}

export async function getGameCoopScores(id) {
	const connection = await getConnection();
	const rows = await connection.query(
		'SELECT gameCoopScoreName, gameCoopScoreColour FROM gameCoopScores WHERE gameId = ?;',
		[id]
	);
	const gameCoopScore = rows[0];
	connection.end();
	return {
		body: {
			gameCoopScore
		}
	};
}

export async function getCategories() {
	const connection = await getConnection();
	const rows = await connection.query("SELECT categoryName FROM categories");
	const categories = rows[0];
	connection.end();
	return {
		body: {
			categories
		}
	}
}

export async function getMechanics() {
	const connection = await getConnection();
	const rows = await connection.query('SELECT mechanicName FROM mechanics');
	const mechanics = rows[0];
	connection.end();
	return {
		body: {
			mechanics
		}
	};
}

export async function getGameCategories(gameId) {
	const connection = await getConnection();
	const rows = await connection.query("SELECT categoryName FROM games INNER JOIN gameCategories ON games.gameId = gameCategories.gameId INNER JOIN categories ON gameCategories.categoryId = categories.categoryId WHERE games.gameId = ?;", [gameId]);
	const gameCategories = rows[0];
	connection.end();
	return {
		body: {
			gameCategories
		}
	}
}

export async function getGameMechanics(gameId) {
	const connection = await getConnection();
	const rows = await connection.query("SELECT mechanicName FROM games INNER JOIN gameMechanics ON games.gameId = gameMechanics.gameId INNER JOIN mechanics ON gameMechanics.mechanicId = mechanics.mechanicId WHERE games.gameId = ?;", [gameId]);
	const gameMechanics = rows[0];
	connection.end();
	return {
		body: {
			gameMechanics
		}
	};
}

export async function getRulesSummaries(id) {
	const connection = await getConnection();
    const rows = await connection.query('SELECT ruleSummaryText, position FROM ruleSummaries WHERE gameId = ?;', [id]);
	const rulesSummaries = rows[0];
	connection.end();
    return {
        body: {
            rulesSummaries
        }
    };
}

export async function getRules(id) {
	const connection = await getConnection();
	const rows = await connection.query('SELECT title, ruleText, position FROM rules WHERE gameId = ?;', [id]);
	const rules = rows[0];
	connection.end();	
	return {
		body: {
			rules
		}
	};
}

export async function getAllPlayers() {
	const connection = await getConnection();
	const rows = await connection.query('SELECT playerId, playerName, colour FROM players;');
	const players = rows[0];
	connection.end();
	return {
		body: {
			players
		}
	};
}

export async function insertPlayer(name, colour) {
	const connection = await getConnection();
	await connection.query(`INSERT INTO players (playerName, colour) VALUES (?, ?);`, [name, colour]);
	connection.end();
}

export async function getAllGameSessions(id) {
	const connection = await getConnection();
	const rows = await connection.query(
		`SELECT playerSessions.gameSessionId, sessionDate, coopWin, score, players.playerId FROM playerSessions INNER JOIN gameSessions ON playerSessions.gameSessionId = gameSessions.gameSessionId INNER JOIN players ON playerSessions.playerId = players.playerId WHERE gameSessions.gameId = ?;`, [id]
	);
	const sessions = rows[0];
	connection.end();
	return {
		body: {
			sessions
		}
	};
}

export async function insertPlayerSession(gameSessionId, playerId, score) {
	const connection = await getConnection();
	await connection.query(`INSERT INTO playerSessions (gameSessionId, playerId, score) VALUES (?, ?, ?);`, [gameSessionId, playerId, score]);
	connection.end();
}

export async function insertSession(date, gameId, coopWin) {
	const connection = await getConnection();
	let result = await connection.query(`INSERT INTO gameSessions (sessionDate, gameId, coopWin) VALUES (?, ?, ?);`, [date, gameId, coopWin]);
	connection.end();
	return result;
}