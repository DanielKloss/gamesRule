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
    const rows = await connection.query("SELECT gameId, name, shortName, colour, highScoreWins, minPlayers, maxPlayers, minPlayTime, maxPlayTime FROM Games");
    const games = rows[0];
    return {
			body: {
                games
			}
		};
};

export async function getGame(id) {
	const connection = await getConnection();
    const rows = await connection.query("SELECT name, shortName, highScoreWins, colour FROM Games WHERE games.gameId = ?;", [id]);
    const game = rows[0][0];
    return {
        body: {
            game
        }
    };
}

export async function getCategories() {
	const connection = await getConnection();
	const rows = await connection.query("SELECT name FROM Categories");
	const categories = rows[0];
	return {
		body: {
			categories
		}
	}
}

export async function getMechanics() {
	const connection = await getConnection();
	const rows = await connection.query('SELECT name FROM Mechanics');
	const mechanics = rows[0];
	return {
		body: {
			mechanics
		}
	};
}

export async function getGameCategories(gameId) {
	const connection = await getConnection();
	const rows = await connection.query("SELECT Categories.name FROM Games INNER JOIN GameCategories ON Games.gameId = GameCategories.GameId INNER JOIN Categories ON GameCategories.CategoryId = Categories.CategoryId WHERE Games.gameId = ?;", [gameId]);
	const gameCategories = rows[0];
	return {
		body: {
			gameCategories
		}
	}
}

export async function getGameMechanics(gameId) {
	const connection = await getConnection();
	const rows = await connection.query("SELECT Mechanics.name FROM Games INNER JOIN GameMechanics ON Games.gameId = GameMechanics.GameId INNER JOIN Mechanics ON GameMechanics.MechanicId = Mechanics.mechanicId WHERE Games.gameId = ?;", [gameId]);
	const gameMechanics = rows[0];
	return {
		body: {
			gameMechanics
		}
	};
}

export async function getRulesSummaries(id) {
	const connection = await getConnection();
    const rows = await connection.query('SELECT ruleSummaryText, position FROM RuleSummaries WHERE gameId = ?;', [id]);
	const rulesSummaries = rows[0];
    return {
        body: {
            rulesSummaries
        }
    };
}

export async function getRules(id) {
	const connection = await getConnection();
	const rows = await connection.query('SELECT title, ruleText, position FROM Rules WHERE gameId = ?;', [id]);
	const rules = rows[0];
	return {
		body: {
			rules
		}
	};
}

export async function getAllPlayers() {
	const connection = await getConnection();
	const rows = await connection.query('SELECT playerId, name, colour FROM Players;');
	const players = rows[0];
	return {
		body: {
			players
		}
	};
}

export async function insertPlayer(name, colour) {
	const connection = await getConnection();
	await connection.query(`INSERT INTO players (name, colour) VALUES (?, ?);`, [name, colour]);
}

export async function getAllGameSessions(id) {
	const connection = await getConnection();
	const rows = await connection.query(
		`SELECT playerSessions.gameSessionId, sessionDate, coopWin, score, players.playerId FROM playerSessions INNER JOIN GameSessions ON playerSessions.gameSessionId = GameSessions.gameSessionId INNER JOIN Players ON playerSessions.playerId = Players.playerId WHERE gameSessions.gameId = ?;`, [id]
	);
	const sessions = rows[0];
	return {
		body: {
			sessions
		}
	};
}

export async function insertPlayerSession(gameSessionId, playerId, score) {
	const connection = await getConnection();
	await connection.query(`INSERT INTO playerSessions (gameSessionId, playerId, score) VALUES (?, ?, ?);`, [gameSessionId, playerId, score]);
}

export async function insertSession(date, gameId, coopWin) {
	const connection = await getConnection();
	return await connection.query(`INSERT INTO GameSessions (sessionDate, gameId, coopWin) VALUES (?, ?, ?);`, [date, gameId, coopWin]);
}