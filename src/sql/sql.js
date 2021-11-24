import mysql from "mysql2/promise.js";

const connection = await mysql.createConnection({
    host: import.meta.env.VITE_DB_HOST,
    port: import.meta.env.VITE_DB_PORT,
    user: import.meta.env.VITE_DB_USER,
    password: import.meta.env.VITE_DB_PASSWORD,
    database: import.meta.env.VITE_DB_NAME
});

export async function getAllGames() {
    const rows = await connection.query("SELECT * FROM Games");
    const games = rows[0];
    return {
			body: {
                games
			}
		};
};

export async function getGame(id) {
    const rows = await connection.query("SELECT name, shortName, highScoreWins, colour FROM Games WHERE games.id = ?;", [id]);
    const game = rows[0][0];
    return {
        body: {
            game
        }
    };
}

export async function getRulesSummaries(id) {
    const rows = await connection.query('SELECT ruleSummaryText, position FROM RuleSummaries WHERE gameId = ?;', [id]);
	const rulesSummaries = rows[0];
    return {
        body: {
            rulesSummaries
        }
    };
}

export async function getRules(id) {
	const rows = await connection.query('SELECT title, ruleText, position FROM Rules WHERE gameId = ?;', [id]);
	const rules = rows[0];
	return {
		body: {
			rules
		}
	};
}

export async function getAllPlayers() {
	const rows = await connection.query('SELECT id, name, colour FROM Players;');
	const players = rows[0];
	return {
		body: {
			players
		}
	};
}

export async function getAllGameSessions(game) {
	const rows = await connection.query(`SELECT gameSessionId, sessionDate, coopWin, score, players.id FROM ` + game + ` INNER JOIN GameSessions ON gameSessionId = GameSessions.id INNER JOIN Players ON playerId = Players.id;`);
	const sessions = rows[0];
	return {
		body: {
			sessions
		}
	};
}

export async function insertPlayerSession(game, gameSessionId, playerId, score) {
	await connection.query(`INSERT INTO ` + game + ` (gameSessionId, playerId, score) VALUES (?, ?, ?);`, [gameSessionId, playerId, score]);
}

export async function insertSession(date, gameId, coopWin) {
	return await connection.query(`INSERT INTO GameSessions (sessionDate, gameId, coopWin) VALUES (?, ?, ?);`, [date, gameId, coopWin]);
}